<?php

namespace App\Http\Controllers;

use App\Models\ModerationCommittee;
use App\Models\ModerationCommitteeMember;
use App\Models\Teacher;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ModerationCommitteeController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if (!$user->isChairman() && !$user->isAdmin()) {
            abort(403);
        }

        $teacher = $user->teacher;

        $committees = ModerationCommittee::with(['department', 'chairman', 'members.teacher'])
            ->when(!$user->isAdmin(), function ($query) use ($teacher) {
                return $query->where('department_id', $teacher->department_id);
            })
            ->get();

        $teachers = Teacher::when(!$user->isAdmin(), function ($query) use ($teacher) {
            return $query->where('department_id', $teacher->department_id);
        })
            ->get();

        $departments = Department::when(!$user->isAdmin(), function ($query) use ($teacher) {
            return $query->where('id', $teacher->department_id);
        })
            ->get();

        return inertia('Moderation/Committees', [
            'committees' => $committees,
            'teachers' => $teachers,
            'departments' => $departments,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'session' => 'required|string',
            'semester' => 'required|string',
            'member_ids' => 'required|array|min:1',
            'member_ids.*' => 'exists:teachers,id',
        ]);

        $committee = ModerationCommittee::create([
            'department_id' => $validated['department_id'],
            'session' => $validated['session'],
            'semester' => $validated['semester'],
            'chairman_id' => Auth::user()->teacher->id,
        ]);

        foreach ($validated['member_ids'] as $memberId) {
            ModerationCommitteeMember::create([
                'moderation_committee_id' => $committee->id,
                'teacher_id' => $memberId,
            ]);
        }

        return redirect()->back()->with('success', 'Moderation Committee formed successfully.');
    }

    public function update(Request $request, ModerationCommittee $committee)
    {
        $validated = $request->validate([
            'session' => 'required|string',
            'semester' => 'required|string',
            'member_ids' => 'required|array|min:1',
            'member_ids.*' => 'exists:teachers,id',
        ]);

        $committee->update([
            'session' => $validated['session'],
            'semester' => $validated['semester'],
        ]);

        // Refresh members
        $committee->members()->delete();
        foreach ($validated['member_ids'] as $memberId) {
            ModerationCommitteeMember::create([
                'moderation_committee_id' => $committee->id,
                'teacher_id' => $memberId,
            ]);
        }

        return redirect()->back()->with('success', 'Moderation Committee updated successfully.');
    }

    public function destroy(ModerationCommittee $committee)
    {
        $committee->delete();
        return redirect()->back()->with('success', 'Moderation Committee deleted successfully.');
    }
}
