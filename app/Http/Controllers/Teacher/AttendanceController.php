<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    public function store(Request $request, Course $course)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:students,id',
            'attendances.*.status' => 'required|in:present,absent,late,excuse',
        ]);

        $teacher = Auth::user()->teacher;

        foreach ($validated['attendances'] as $data) {
            Attendance::updateOrCreate(
                [
                    'course_id' => $course->id,
                    'student_id' => $data['student_id'],
                    'date' => $validated['date'],
                ],
                [
                    'status' => $data['status'],
                    'recorded_by' => $teacher->id,
                ]
            );
        }

        return back()->with('success', 'Attendance recorded.');
    }
}
