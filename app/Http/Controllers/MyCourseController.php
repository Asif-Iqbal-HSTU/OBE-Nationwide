<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseAssignment;
use App\Models\CLO;
use App\Models\ExamQuestion;
use App\Models\ExamQuestionItem;
use App\Models\ModerationCommittee;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MyCourseController extends Controller
{
    /**
     * Display list of courses assigned to the authenticated teacher
     */
    public function index()
    {
        $user = Auth::user();
        $teacher = $user->teacher;

        if (!$teacher) {
            abort(403, 'Only teachers can access this page.');
        }

        $assignments = CourseAssignment::with([
            'course' => function ($query) {
                $query->withCount(['clos', 'contents', 'books', 'lessonPlans']);
            },
            'course.program.department',
        ])
            ->where('teacher_id', $teacher->id)
            ->get();

        return Inertia::render('MyCourse/Index', [
            'courses' => $assignments,
        ]);
    }

    /**
     * Display a specific course with all its details
     */
    public function show(CourseAssignment $assignment)
    {
        $user = Auth::user();
        $teacher = $user->teacher;

        if (!$teacher || $assignment->teacher_id !== $teacher->id) {
            abort(403, 'You are not assigned to this course.');
        }

        $course = Course::with([
            'cos',
            'clos.plos',
            'contents.clos',
            'books',
            'lessonPlans.clos',
            'program.department',
            'program.plos',
            'classAssignments.submissions',
            'attendances.student',
            'examMarks.student',
            'supports.student',
        ])->findOrFail($assignment->course_id);

        // Get exam questions for this course by this teacher
        $examQuestions = ExamQuestion::with(['moderationCommittee', 'items'])
            ->where('course_id', $course->id)
            ->where('course_teacher_id', $teacher->id)
            ->orderBy('created_at', 'desc')
            ->get();

        // Fetch Students enrolled in this program and semester
        // Note: Assuming 'semester' in Course matches 'current_semester' in Student, or we use the assignment's semester if applicable.
        // For now, let's assume students are mapped by Program ID and maybe Session/Semester.
        // If CourseAssignment has 'semester' and 'session', we should use those.

        $studentsQuery = \App\Models\Student::with('user')
            ->where('program_id', $course->program_id);

        // If assignment has specific semester/session, filter by it.
        if ($assignment->semester) {
            $studentsQuery->where('current_semester', $assignment->semester);
        }

        $students = $studentsQuery->get()->map(function ($student) use ($course) {
            // Check attendance stats
            $totalClasses = $course->attendances->where('student_id', $student->student_id)->count(); // This logic might be flawed if multiple dates.
            // Better: Get unique dates of attendance for this course
            $totalCourseClasses = \App\Models\Attendance::where('course_id', $course->id)->distinct('date')->count('date');

            $presentCount = $course->attendances
                ->where('student_id', $student->student_id)
                ->where('status', 'present')
                ->count();

            $attendancePercentage = $totalCourseClasses > 0 ? ($presentCount / $totalCourseClasses) * 100 : 0;

            // Average Marks
            $totalMarksObtained = $course->examMarks->where('student_id', $student->student_id)->sum('marks');
            $totalExamMarks = $course->examMarks->where('student_id', $student->student_id)->sum('total_marks');
            $marksPercentage = $totalExamMarks > 0 ? ($totalMarksObtained / $totalExamMarks) * 100 : 0;

            return [
                'id' => $student->id,
                'student_id' => $student->student_id,
                'name' => $student->user->name,
                'email' => $student->user->email,
                'attendance_percentage' => round($attendancePercentage, 1),
                'current_marks_percentage' => round($marksPercentage, 1),
            ];
        });

        return Inertia::render('MyCourse/Show', [
            'course' => $course,
            'program' => $course->program,
            'plos' => $course->program->plos,
            'examQuestions' => $examQuestions,
            'assignment' => $assignment,
            'students' => $students,
        ]);
    }

    /**
     * Show form to create exam question for a specific course
     */
    public function createExamQuestion(CourseAssignment $assignment)
    {
        $user = Auth::user();
        $teacher = $user->teacher;

        if (!$teacher || $assignment->teacher_id !== $teacher->id) {
            abort(403, 'You are not assigned to this course.');
        }

        $course = Course::with(['clos', 'program.department'])->findOrFail($assignment->course_id);

        // Get moderation committees for the department
        $committees = ModerationCommittee::where('department_id', $course->program->department_id)
            ->orderBy('session', 'desc')
            ->get();

        return Inertia::render('MyCourse/CreateExamQuestion', [
            'assignment' => $assignment,
            'course' => $course,
            'clos' => $course->clos,
            'committees' => $committees,
        ]);
    }

    /**
     * Store exam question for a specific course
     */
    public function storeExamQuestion(Request $request, CourseAssignment $assignment)
    {
        $user = Auth::user();
        $teacher = $user->teacher;

        if (!$teacher || $assignment->teacher_id !== $teacher->id) {
            abort(403, 'You are not assigned to this course.');
        }

        $validated = $request->validate([
            'session' => 'required|string',
            'semester' => 'required|string',
            'total_marks' => 'required|integer',
            'duration' => 'required|string',
            'moderation_committee_id' => 'nullable|exists:moderation_committees,id',
            'items' => 'required|array|min:1',
            'items.*.question_label' => 'required|string',
            'items.*.question_text' => 'required|string',
            'items.*.marks' => 'required|numeric|min:0',
            'items.*.clo_id' => 'required|exists:c_l_o_s,id',
            'items.*.blooms_taxonomy_level' => 'required|string',
        ]);

        DB::transaction(function () use ($validated, $assignment, $teacher) {
            $examQuestion = ExamQuestion::create([
                'course_id' => $assignment->course_id,
                'course_teacher_id' => $teacher->id,
                'session' => $validated['session'],
                'semester' => $validated['semester'],
                'total_marks' => $validated['total_marks'],
                'duration' => $validated['duration'],
                'status' => 'Draft',
                'moderation_committee_id' => $validated['moderation_committee_id'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                ExamQuestionItem::create([
                    'exam_question_id' => $examQuestion->id,
                    'question_label' => $item['question_label'],
                    'question_text' => $item['question_text'],
                    'marks' => $item['marks'],
                    'clo_id' => $item['clo_id'],
                    'blooms_taxonomy_level' => $item['blooms_taxonomy_level'],
                ]);
            }
        });

        return redirect()->route('my-courses.show', $assignment->id)
            ->with('success', 'Exam question paper created successfully.');
    }
}
