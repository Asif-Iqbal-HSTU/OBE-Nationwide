<?php

namespace App\Http\Controllers;

use App\Models\GenericSkill;
use App\Models\Program;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GenericSkillController extends Controller
{
    public function index(Program $program)
    {
        if ($program->faculty->user_id !== Auth::id()) {
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
        if ($program->faculty->user_id !== Auth::id()) {
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
        if ($program->faculty->user_id !== Auth::id() || $genericSkill->program_id !== $program->id) {
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
        if ($program->faculty->user_id !== Auth::id() || $genericSkill->program_id !== $program->id) {
            abort(403);
        }

        $genericSkill->delete();

        return redirect()->back()->with('success', 'Generic Skill deleted successfully');
    }
}
