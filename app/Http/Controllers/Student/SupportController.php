<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SupportController extends Controller
{
    public function store(Request $request, Course $course)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'is_public' => 'boolean',
        ]);

        $student = Auth::user()->student;

        $course->supports()->create([
            'student_id' => $student->id,
            'question' => $validated['question'],
            'is_public' => $validated['is_public'] ?? false,
        ]);

        return back()->with('success', 'Question submitted.');
    }
}
