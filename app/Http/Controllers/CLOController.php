<?php

namespace App\Http\Controllers;

use App\Models\CLO;
use App\Models\Course;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class CLOController extends Controller
{
    public function store(Request $request, Program $program, Course $course): RedirectResponse
    {
        $validated = $request->validate([
            'clo_no' => 'required|integer',
            'clo_desc' => 'required|string',
            'plo_ids' => 'required|array', // Expecting an array of IDs
        ]);

        $clo = $course->clos()->create([
            'clo_no' => $validated['clo_no'],
            'clo_desc' => $validated['clo_desc'],
        ]);

        $clo->plos()->sync($validated['plo_ids']); // Sync the multiple PLOs

        return redirect()->back();
    }

    public function update(Request $request, Program $program, Course $course, CLO $clo): RedirectResponse
    {
        $validated = $request->validate([
            'clo_no' => 'required|integer',
            'clo_desc' => 'required|string',
            'plo_ids' => 'required|array', // Changed from p_l_o_id
        ]);

        $clo->update([
            'clo_no' => $validated['clo_no'],
            'clo_desc' => $validated['clo_desc'],
        ]);

        $clo->plos()->sync($validated['plo_ids']); // Sync the pivot table

        return redirect()->back()->with('success', 'CLO updated successfully');
    }

    public function destroy(Program $program, Course $course, CLO $clo): RedirectResponse
    {
        $clo->delete();
        return redirect()->back()->with('success', 'CLO deleted successfully');
    }
}
