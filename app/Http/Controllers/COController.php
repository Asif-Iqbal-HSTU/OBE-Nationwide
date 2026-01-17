<?php

namespace App\Http\Controllers;

use App\Models\CO;
use App\Models\Course;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class COController extends Controller
{
    public function store(Request $request, Program $program, Course $course): RedirectResponse
    {
        $validated = $request->validate([
            'co_no' => 'required|integer', // Changed 'number' to 'integer'
            'co_desc' => 'required|string',
        ]);

        $course->cos()->create($validated);

        return redirect()->back()->with('success', 'CO created successfully');
    }

    public function update(Request $request, Program $program, Course $course, CO $co): RedirectResponse
    {
        $validated = $request->validate([
            'co_no' => 'required|integer',
            'co_desc' => 'required|string',
        ]);

        $co->update($validated);
        return redirect()->back()->with('success', 'CO updated successfully');
    }

    public function destroy(Program $program, Course $course, CO $co): RedirectResponse
    {
        $co->delete();
        return redirect()->back()->with('success', 'CO deleted successfully');
    }
}
