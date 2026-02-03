<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\LessonPlan;
use App\Models\Program;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LessonPlanController extends Controller
{
    public function store(Request $request, Program $program, Course $course): RedirectResponse
    {
        $validated = $request->validate([
            'week' => 'required|string',
            'topics' => 'required|string',
            'outcomes' => 'required|string',
            'teaching_strategies' => 'required|string',
            'teaching_aids' => 'required|string',
            'assessment_technique' => 'required|string',
            'clo_ids' => 'required|array',
            'clo_ids.*' => 'exists:c_l_o_s,id',
        ]);

        $lessonPlan = $course->lessonPlans()->create([
            'week' => $validated['week'],
            'topics' => $validated['topics'],
            'outcomes' => $validated['outcomes'],
            'teaching_strategies' => $validated['teaching_strategies'],
            'teaching_aids' => $validated['teaching_aids'],
            'assessment_technique' => $validated['assessment_technique'],
        ]);

        $lessonPlan->clos()->sync($validated['clo_ids']);

        return redirect()->back()->with('success', 'Lesson Plan added successfully');
    }

    public function update(Request $request, Program $program, Course $course, LessonPlan $lessonPlan): RedirectResponse
    {
        $validated = $request->validate([
            'week' => 'required|string',
            'topics' => 'required|string',
            'outcomes' => 'required|string',
            'teaching_strategies' => 'required|string',
            'teaching_aids' => 'required|string',
            'assessment_technique' => 'required|string',
            'clo_ids' => 'required|array',
            'clo_ids.*' => 'exists:c_l_o_s,id',
        ]);

        $lessonPlan->update([
            'week' => $validated['week'],
            'topics' => $validated['topics'],
            'outcomes' => $validated['outcomes'],
            'teaching_strategies' => $validated['teaching_strategies'],
            'teaching_aids' => $validated['teaching_aids'],
            'assessment_technique' => $validated['assessment_technique'],
        ]);

        $lessonPlan->clos()->sync($validated['clo_ids']);

        return redirect()->back()->with('success', 'Lesson Plan updated successfully');
    }

    public function destroy(Program $program, Course $course, LessonPlan $lessonPlan): RedirectResponse
    {
        $lessonPlan->delete();
        return redirect()->back()->with('success', 'Lesson Plan deleted successfully');
    }
}
