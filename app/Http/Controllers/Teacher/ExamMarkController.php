<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\ExamMark;
use Illuminate\Http\Request;

class ExamMarkController extends Controller
{
    public function store(Request $request, Course $course)
    {
        $validated = $request->validate([
            'exam_type' => 'required|string',
            'total_marks' => 'required|numeric|min:0',
            'marks' => 'required|array',
            'marks.*.student_id' => 'required|exists:students,id',
            'marks.*.obtained_marks' => 'required|numeric|min:0',
        ]);

        foreach ($validated['marks'] as $data) {
            ExamMark::updateOrCreate(
                [
                    'course_id' => $course->id,
                    'student_id' => $data['student_id'],
                    'exam_type' => $validated['exam_type'],
                ],
                [
                    'marks' => $data['obtained_marks'],
                    'total_marks' => $validated['total_marks'],
                ]
            );
        }

        return back()->with('success', 'Marks recorded.');
    }
}
