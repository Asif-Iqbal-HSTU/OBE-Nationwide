<?php

namespace App\Http\Controllers;

use App\Models\ExamQuestion;
use App\Models\ExamQuestionItem;
use App\Models\Course;
use App\Models\CourseAssignment;
use App\Models\ModerationCommittee;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ExamQuestionController extends Controller
{
    /**
     * Display question papers for the logged-in teacher
     */
    public function index()
    {
        $user = Auth::user();
        $teacher = $user->teacher;

        if (!$teacher) {
            abort(403, 'Only teachers can access this page.');
        }

        // Get courses assigned to this teacher
        $assignedCourseIds = CourseAssignment::where('teacher_id', $teacher->id)
            ->pluck('course_id');

        $examQuestions = ExamQuestion::with([
            'course.program.department',
            'teacher',
            'items.clo',
            'moderationCommittee.members.teacher'
        ])
            ->where('course_teacher_id', $teacher->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $courses = Course::with(['program.department', 'clos'])
            ->whereIn('id', $assignedCourseIds)
            ->get();

        // Get available moderation committees for the teacher's department
        $committees = ModerationCommittee::with(['chairman', 'members.teacher'])
            ->where('department_id', $teacher->department_id)
            ->get();

        return Inertia::render('ExamQuestions/Index', [
            'examQuestions' => $examQuestions,
            'courses' => $courses,
            'committees' => $committees,
            'teacher' => $teacher,
        ]);
    }

    /**
     * Store a new exam question paper
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'session' => 'required|string',
            'semester' => 'required|string',
            'total_marks' => 'required|integer|min:1',
            'duration' => 'required|string',
            'moderation_committee_id' => 'nullable|exists:moderation_committees,id',
            'items' => 'required|array|min:1',
            'items.*.question_label' => 'required|string',
            'items.*.question_text' => 'required|string',
            'items.*.marks' => 'required|numeric|min:0',
            'items.*.clo_id' => 'required|exists:c_l_o_s,id',
            'items.*.blooms_taxonomy_level' => 'required|in:Remember,Understand,Apply,Analyze,Evaluate,Create',
        ]);

        $teacher = Auth::user()->teacher;

        DB::transaction(function () use ($validated, $teacher) {
            $examQuestion = ExamQuestion::create([
                'course_id' => $validated['course_id'],
                'course_teacher_id' => $teacher->id,
                'session' => $validated['session'],
                'semester' => $validated['semester'],
                'total_marks' => $validated['total_marks'],
                'duration' => $validated['duration'],
                'status' => 'Draft',
                'moderation_committee_id' => $validated['moderation_committee_id'] ?? null,
            ]);

            foreach ($validated['items'] as $index => $item) {
                ExamQuestionItem::create([
                    'exam_question_id' => $examQuestion->id,
                    'question_label' => $item['question_label'],
                    'question_text' => $item['question_text'],
                    'marks' => $item['marks'],
                    'clo_id' => $item['clo_id'],
                    'blooms_taxonomy_level' => $item['blooms_taxonomy_level'],
                    'position' => $index,
                ]);
            }
        });

        return redirect()->back()->with('success', 'Question paper created successfully.');
    }

    /**
     * Update an existing exam question paper
     */
    public function update(Request $request, ExamQuestion $examQuestion)
    {
        $teacher = Auth::user()->teacher;

        if ($examQuestion->course_teacher_id !== $teacher->id) {
            abort(403, 'You can only edit your own question papers.');
        }

        if (!in_array($examQuestion->status, ['Draft', 'RevisionNeeded'])) {
            abort(403, 'Cannot edit question paper in current status.');
        }

        $validated = $request->validate([
            'session' => 'required|string',
            'semester' => 'required|string',
            'total_marks' => 'required|integer|min:1',
            'duration' => 'required|string',
            'moderation_committee_id' => 'nullable|exists:moderation_committees,id',
            'items' => 'required|array|min:1',
            'items.*.id' => 'nullable|exists:exam_question_items,id',
            'items.*.question_label' => 'required|string',
            'items.*.question_text' => 'required|string',
            'items.*.marks' => 'required|numeric|min:0',
            'items.*.clo_id' => 'required|exists:c_l_o_s,id',
            'items.*.blooms_taxonomy_level' => 'required|in:Remember,Understand,Apply,Analyze,Evaluate,Create',
        ]);

        DB::transaction(function () use ($validated, $examQuestion) {
            $examQuestion->update([
                'session' => $validated['session'],
                'semester' => $validated['semester'],
                'total_marks' => $validated['total_marks'],
                'duration' => $validated['duration'],
                'moderation_committee_id' => $validated['moderation_committee_id'] ?? null,
                'status' => 'Draft', // Reset to draft after edit
                'moderator_feedback' => null,
            ]);

            // Delete old items and create new ones
            $examQuestion->items()->delete();

            foreach ($validated['items'] as $index => $item) {
                ExamQuestionItem::create([
                    'exam_question_id' => $examQuestion->id,
                    'question_label' => $item['question_label'],
                    'question_text' => $item['question_text'],
                    'marks' => $item['marks'],
                    'clo_id' => $item['clo_id'],
                    'blooms_taxonomy_level' => $item['blooms_taxonomy_level'],
                    'position' => $index,
                ]);
            }
        });

        return redirect()->back()->with('success', 'Question paper updated successfully.');
    }

    /**
     * Submit question paper for moderation
     */
    public function submit(ExamQuestion $examQuestion)
    {
        $teacher = Auth::user()->teacher;

        if ($examQuestion->course_teacher_id !== $teacher->id) {
            abort(403, 'You can only submit your own question papers.');
        }

        if (!in_array($examQuestion->status, ['Draft', 'RevisionNeeded'])) {
            abort(403, 'Cannot submit question paper in current status.');
        }

        if (!$examQuestion->moderation_committee_id) {
            return redirect()->back()->with('error', 'Please select a moderation committee before submitting.');
        }

        $examQuestion->update([
            'status' => 'Submitted',
            'moderator_feedback' => null,
        ]);

        return redirect()->back()->with('success', 'Question paper submitted for moderation.');
    }

    /**
     * Delete a question paper
     */
    public function destroy(ExamQuestion $examQuestion)
    {
        $teacher = Auth::user()->teacher;

        if ($examQuestion->course_teacher_id !== $teacher->id) {
            abort(403, 'You can only delete your own question papers.');
        }

        if (!in_array($examQuestion->status, ['Draft', 'RevisionNeeded'])) {
            abort(403, 'Cannot delete question paper in current status.');
        }

        $examQuestion->delete();

        return redirect()->back()->with('success', 'Question paper deleted successfully.');
    }

    /**
     * Moderation page for committee members
     */
    public function moderation()
    {
        $user = Auth::user();
        $teacher = $user->teacher;

        if (!$teacher) {
            abort(403, 'Only teachers can access this page.');
        }

        // Get committees where this teacher is a member or chairman
        $committeeIds = \App\Models\ModerationCommitteeMember::where('teacher_id', $teacher->id)
            ->pluck('moderation_committee_id');

        // Also include committees where teacher is chairman
        $chairmanCommitteeIds = ModerationCommittee::where('chairman_id', $teacher->id)
            ->pluck('id');

        $allCommitteeIds = $committeeIds->merge($chairmanCommitteeIds)->unique();

        $questions = ExamQuestion::with([
            'course.program.department',
            'course.clos',
            'teacher',
            'items.clo',
            'moderationCommittee.chairman',
            'moderationCommittee.members.teacher'
        ])
            ->whereIn('moderation_committee_id', $allCommitteeIds)
            ->whereIn('status', ['Submitted', 'Moderating'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Moderation/Index', [
            'questions' => $questions,
            'teacher' => $teacher,
        ]);
    }

    /**
     * Show a specific question paper for moderation review
     */
    public function showModeration(ExamQuestion $examQuestion)
    {
        $user = Auth::user();
        $teacher = $user->teacher;

        if (!$teacher) {
            abort(403, 'Only teachers can access this page.');
        }

        // Check if teacher is member or chairman of the committee
        $isMember = \App\Models\ModerationCommitteeMember::where('moderation_committee_id', $examQuestion->moderation_committee_id)
            ->where('teacher_id', $teacher->id)
            ->exists();

        $isChairman = $examQuestion->moderationCommittee && $examQuestion->moderationCommittee->chairman_id === $teacher->id;

        if (!$isMember && !$isChairman) {
            abort(403, 'You are not a member of this moderation committee.');
        }

        $examQuestion->load([
            'course.program.department.faculty',
            'course.clos',
            'teacher',
            'items.clo',
            'moderationCommittee.chairman',
            'moderationCommittee.members.teacher'
        ]);

        return Inertia::render('Moderation/Show', [
            'examQuestion' => $examQuestion,
        ]);
    }

    /**
     * Show create page for exam questions
     */
    public function create()
    {
        $user = Auth::user();
        $teacher = $user->teacher;

        if (!$teacher) {
            abort(403, 'Only teachers can access this page.');
        }

        // Get course assignments for this teacher
        $assignments = CourseAssignment::with(['course.clos', 'course.program'])
            ->where('teacher_id', $teacher->id)
            ->get();

        // Get all CLOs from assigned courses
        $clos = [];
        foreach ($assignments as $assignment) {
            foreach ($assignment->course->clos as $clo) {
                $clos[] = [
                    'id' => $clo->id,
                    'course_id' => $clo->course_id,
                    'code' => 'CLO ' . $clo->clo_no,
                    'clo_no' => $clo->clo_no,
                    'clo_desc' => $clo->clo_desc,
                ];
            }
        }

        // Get available moderation committees for the teacher's department
        $committees = ModerationCommittee::with(['chairman', 'members.teacher'])
            ->where('department_id', $teacher->department_id)
            ->get();

        return Inertia::render('ExamQuestions/Create', [
            'assignments' => $assignments,
            'clos' => $clos,
            'committees' => $committees,
        ]);
    }

    /**
     * Show edit page for exam questions
     */
    public function edit(ExamQuestion $examQuestion)
    {
        $user = Auth::user();
        $teacher = $user->teacher;

        if ($examQuestion->course_teacher_id !== $teacher->id) {
            abort(403, 'You can only edit your own question papers.');
        }

        if (!in_array($examQuestion->status, ['Draft', 'RevisionNeeded'])) {
            abort(403, 'Cannot edit question paper in current status.');
        }

        $examQuestion->load(['course.clos', 'items.clo']);

        // Get course assignments for this teacher
        $assignments = CourseAssignment::with(['course.clos', 'course.program'])
            ->where('teacher_id', $teacher->id)
            ->get();

        // Get all CLOs from assigned courses
        $clos = [];
        foreach ($assignments as $assignment) {
            foreach ($assignment->course->clos as $clo) {
                $clos[] = [
                    'id' => $clo->id,
                    'course_id' => $clo->course_id,
                    'code' => 'CLO ' . $clo->clo_no,
                    'clo_no' => $clo->clo_no,
                    'clo_desc' => $clo->clo_desc,
                ];
            }
        }

        // Get available moderation committees for the teacher's department
        $committees = ModerationCommittee::with(['chairman', 'members.teacher'])
            ->where('department_id', $teacher->department_id)
            ->get();

        return Inertia::render('ExamQuestions/Edit', [
            'examQuestion' => $examQuestion,
            'assignments' => $assignments,
            'clos' => $clos,
            'committees' => $committees,
        ]);
    }

    /**
     * Approve a question paper
     */
    public function approve(ExamQuestion $examQuestion)
    {
        $user = Auth::user();
        $teacher = $user->teacher;

        // Check if teacher is member or chairman of the committee
        $isMember = \App\Models\ModerationCommitteeMember::where('moderation_committee_id', $examQuestion->moderation_committee_id)
            ->where('teacher_id', $teacher->id)
            ->exists();

        $isChairman = $examQuestion->moderationCommittee->chairman_id === $teacher->id;

        if (!$isMember && !$isChairman) {
            abort(403, 'You are not a member of this moderation committee.');
        }

        $examQuestion->update([
            'status' => 'Approved',
            'moderator_feedback' => 'Approved by ' . $teacher->name . ' on ' . now()->format('Y-m-d H:i'),
        ]);

        return redirect()->back()->with('success', 'Question paper approved successfully.');
    }

    /**
     * Request revision for a question paper
     */
    public function requestRevision(Request $request, ExamQuestion $examQuestion)
    {
        $user = Auth::user();
        $teacher = $user->teacher;

        // Check if teacher is member or chairman of the committee
        $isMember = \App\Models\ModerationCommitteeMember::where('moderation_committee_id', $examQuestion->moderation_committee_id)
            ->where('teacher_id', $teacher->id)
            ->exists();

        $isChairman = $examQuestion->moderationCommittee->chairman_id === $teacher->id;

        if (!$isMember && !$isChairman) {
            abort(403, 'You are not a member of this moderation committee.');
        }

        $validated = $request->validate([
            'feedback' => 'required|string|min:10',
        ]);

        $examQuestion->update([
            'status' => 'RevisionNeeded',
            'moderator_feedback' => $validated['feedback'] . "\n\n— " . $teacher->name . ' (' . now()->format('Y-m-d H:i') . ')',
        ]);

        return redirect()->back()->with('success', 'Revision requested. The course teacher will be notified.');
    }

    /**
     * Print question paper
     */
    public function print(ExamQuestion $examQuestion)
    {
        $user = Auth::user();
        $teacher = $user->teacher;

        // Only approved papers can be printed
        if ($examQuestion->status !== 'Approved') {
            abort(403, 'Only approved question papers can be printed.');
        }

        // Only the course teacher can print
        if ($examQuestion->course_teacher_id !== $teacher->id && !$user->isAdmin()) {
            abort(403, 'Only the course teacher can print this question paper.');
        }

        $examQuestion->load([
            'course.program.department.faculty',
            'course.clos',
            'teacher',
            'items.clo',
        ]);

        return Inertia::render('ExamQuestions/Print', [
            'examQuestion' => $examQuestion,
        ]);
    }
}