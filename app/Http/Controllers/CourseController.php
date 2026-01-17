<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class CourseController extends Controller
{
    public function index(Program $program)
    {
        if ($program->faculty->user_id !== Auth::id()) {
            abort(403);
        }

        return inertia('Courses/index', [
            'program' => $program->load(['faculty', 'department', 'plos']),
            'courses' => Course::where('program_id', $program->id)->with(['cos', 'clos.plos', 'contents.clos'])->get(),
        ]);
    }

    public function store(Request $request, Program $program): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'code' => 'required|string',
            'credit_hours' => 'required|numeric',
            'level' => 'required|string',
            'semester' => 'required|string',
            'session' => 'required|string',
            'type_theory_sessional' => 'required|string',
            'type_core_optional' => 'required|string',
            'prerequisite' => 'nullable|string', // Validated as nullable for the form
            'summary' => 'nullable|string',
        ]);

        // Manually ensure non-nullable fields have at least an empty string
        $validated['prerequisite'] = $validated['prerequisite'] ?? '';
        $validated['summary'] = $validated['summary'] ?? '';

        $program->courses()->create($validated);

        return redirect()->back()->with('success', 'Course created successfully');
    }

    public function update(Request $request, Program $program, Course $course): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'code' => 'required|string',
            'credit_hours' => 'required|numeric',
            'level' => 'required|string',
            'semester' => 'required|string',
            'session' => 'required|string',
            'type_theory_sessional' => 'required|string',
            'type_core_optional' => 'required|string',
            'prerequisite' => 'nullable|string',
            'summary' => 'nullable|string',
        ]);

        $course->update($validated);
        return redirect()->back()->with('success', 'Course updated successfully');
    }

    public function destroy(Program $program, Course $course): RedirectResponse
    {
        $course->delete();
        return redirect()->back()->with('success', 'Course deleted successfully');
    }
}
