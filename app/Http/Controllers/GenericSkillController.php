<?php

namespace App\Http\Controllers;

use App\Models\GenericSkill;
use App\Models\Program;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GenericSkillController extends Controller
{
    /**
     * Check if the current user can access a program.
     * Allows: Faculty admin (user_id), Dean, Department Chairman
     */
    private function canAccessProgram(Program $program): bool
    {
        $user = Auth::user();
        $teacher = $user->teacher;

        // Faculty admin (owns the faculty)
        if ($program->faculty->user_id === $user->id) {
            return true;
        }

        // Teacher checks
        if ($teacher) {
            // Dean of the faculty
            if ($program->faculty->dean_id === $teacher->id) {
                return true;
            }

            // Chairman of the program's department
            if ($program->department && $program->department->chairman_id === $teacher->id) {
                return true;
            }
        }

        return false;
    }

    public function index(Program $program)
    {
        if (!$this->canAccessProgram($program)) {
            abort(403);
        }

        $genericSkills = GenericSkill::where('program_id', $program->id)
            ->orderBy('skill_no')
            ->get();

        return inertia('GenericSkill/index', [
            'program' => $program->load(['faculty', 'department']),
            'genericSkills' => $genericSkills,
        ]);
    }

    public function store(Request $request, Program $program): RedirectResponse
    {
        if (!$this->canAccessProgram($program)) {
            abort(403);
        }

        $validated = $request->validate([
            'skill_no' => 'required|integer',
            'skill_name' => 'required|string',
        ]);

        GenericSkill::create([
            'program_id' => $program->id,
            'skill_no' => $validated['skill_no'],
            'skill_name' => $validated['skill_name'],
        ]);

        return redirect()->back()->with('success', 'Generic Skill created successfully');
    }

    public function update(Request $request, Program $program, GenericSkill $genericSkill): RedirectResponse
    {
        if (!$this->canAccessProgram($program) || $genericSkill->program_id !== $program->id) {
            abort(403);
        }

        $validated = $request->validate([
            'skill_no' => 'required|integer',
            'skill_name' => 'required|string',
        ]);

        $genericSkill->update($validated);

        return redirect()->back()->with('success', 'Generic Skill updated successfully');
    }

    public function destroy(Program $program, GenericSkill $genericSkill): RedirectResponse
    {
        if (!$this->canAccessProgram($program) || $genericSkill->program_id !== $program->id) {
            abort(403);
        }

        $genericSkill->delete();

        return redirect()->back()->with('success', 'Generic Skill deleted successfully');
    }
}
