<?php

namespace App\Http\Controllers;

use App\Models\ExamQuestion;
use App\Models\ExamQuestionItem;
use App\Models\ModerationCommitteeMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ModerationController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $teacher = $user->teacher;

        if (!$teacher) {
            abort(403, 'User is not a teacher.');
        }

        // Get committees where the teacher is a member
        $committeeIds = ModerationCommitteeMember::where('teacher_id', $teacher->id)
            ->pluck('moderation_committee_id');

        // Get questions assigned to these committees
        $questions = ExamQuestion::with(['course', 'teacher', 'moderationCommittee'])
            ->whereIn('moderation_committee_id', $committeeIds)
            ->whereIn('status', ['Submitted', 'Moderating', 'Approved', 'RevisionNeeded'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Moderation/Index', [
            'questions' => $questions
        ]);
    }

    public function show(ExamQuestion $examQuestion)
    {
        $user = Auth::user();
        $teacher = $user->teacher;

        // Check if teacher is part of the committee
        $isMember = ModerationCommitteeMember::where('moderation_committee_id', $examQuestion->moderation_committee_id)
            ->where('teacher_id', $teacher->id)
            ->exists();

        if (!$isMember && !$user->isAdmin()) {
            abort(403, 'You are not a member of the moderation committee for this question.');
        }

        $examQuestion->load(['items.clo', 'course', 'teacher']);

        return Inertia::render('Moderation/Show', [
            'examQuestion' => $examQuestion
        ]);
    }

    public function update(Request $request, ExamQuestion $examQuestion)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:exam_question_items,id',
            'items.*.is_satisfactory' => 'required|in:Yes,No,N/A',
            'items.*.moderator_comment' => 'nullable|string',
            'status' => 'required|in:Approved,RevisionNeeded'
        ]);

        DB::transaction(function () use ($validated, $examQuestion) {
            foreach ($validated['items'] as $itemData) {
                ExamQuestionItem::where('id', $itemData['id'])->update([
                    'is_satisfactory' => $itemData['is_satisfactory'],
                    'moderator_comment' => $itemData['moderator_comment']
                ]);
            }

            $examQuestion->update([
                'status' => $validated['status'],
                // 'moderator_feedback' => $request->input('general_feedback') // Optional general feedback
            ]);
        });

        return redirect()->route('moderation.index')->with('success', 'Moderation submitted successfully.');
    }
}