<?php

namespace App\Http\Controllers;

use App\Models\Content;
use App\Models\Course;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class ContentController extends Controller
{
    public function store(Request $request, Program $program, Course $course): RedirectResponse
    {
        $validated = $request->validate([
            'content_no' => 'required|integer',
            'content' => 'required|string',
            'teaching_strategy' => 'required|string',
            'assessment_strategy' => 'required|string',
            'clo_ids' => 'required|array',
        ]);

        $content = $course->contents()->create([
            'content_no' => $validated['content_no'],
            'content' => $validated['content'],
            'teaching_strategy' => $validated['teaching_strategy'],
            'assessment_strategy' => $validated['assessment_strategy'],
        ]);

        $content->clos()->sync($validated['clo_ids']);

        return redirect()->back()->with('success', 'Content added successfully');
    }

    public function update(Request $request, Program $program, Course $course, Content $content): RedirectResponse
    {
        $validated = $request->validate([
            'content_no' => 'required|integer',
            'content' => 'required|string',
            'teaching_strategy' => 'required|string',
            'assessment_strategy' => 'required|string',
            'clo_ids' => 'required|array',
        ]);

        $content->update($validated);
        $content->clos()->sync($validated['clo_ids']);

        return redirect()->back()->with('success', 'Content updated successfully');
    }

    public function destroy(Program $program, Course $course, Content $content): RedirectResponse
    {
        $content->delete();
        return redirect()->back()->with('success', 'Content deleted successfully');
    }
}
