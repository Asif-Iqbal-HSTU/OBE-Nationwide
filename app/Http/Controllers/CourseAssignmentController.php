<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseAssignment;
use App\Models\Teacher;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CourseAssignmentController extends Controller
{
    public function store(Request $request, Program $program, Course $course)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'session' => 'required|string',
            'semester' => 'required|string',
        ]);

        // Check if the user is the chairman of the department this course belongs to
        $user = Auth::user();
        $teacher = $user->teacher; // Assuming teachers.user_id link exists

        if (!$user->isAdmin()) {
            $isChairman = $teacher && \App\Models\Department::where('id', $course->program->department_id)->where('chairman_id', $teacher->id)->exists();
            if (!$isChairman) {
                abort(403, 'Only the department chairman can assign courses.');
            }
        }

        $assignment = CourseAssignment::updateOrCreate(
            [
                'course_id' => $course->id,
                'session' => $validated['session'],
                'semester' => $validated['semester'],
            ],
            [
                'teacher_id' => $validated['teacher_id'],
                'assigned_by' => $teacher ? $teacher->id : null,
            ]
        );

        return redirect()->back()->with('success', 'Course assigned successfully.');
    }

    public function destroy(CourseAssignment $assignment)
    {
        $user = Auth::user();
        $teacher = $user->teacher;

        if (!$user->isAdmin()) {
            $isChairman = $teacher && \App\Models\Department::where('id', $assignment->course->program->department_id)->where('chairman_id', $teacher->id)->exists();
            if (!$isChairman) {
                abort(403);
            }
        }

        $assignment->delete();
        return redirect()->back()->with('success', 'Assignment removed.');
    }
}
