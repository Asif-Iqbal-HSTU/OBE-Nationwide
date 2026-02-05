<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use Illuminate\Http\Request;

class SubmissionController extends Controller
{
    public function update(Request $request, Submission $submission)
    {
        $validated = $request->validate([
            'obtained_marks' => 'required|numeric|min:0',
            'feedback' => 'nullable|string',
        ]);

        $submission->update($validated);

        return back()->with('success', 'Submission graded.');
    }
}
