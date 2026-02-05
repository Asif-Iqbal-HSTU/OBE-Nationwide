<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function show(Course $course)
    {
        $student = Auth::user()->student;

        // Authorization: Ensure student belongs to the course's program/semester
        if ($course->program_id !== $student->program_id || $course->semester !== $student->current_semester || $course->session !== $student->session) {
            abort(403, 'You are not enrolled in this course.');
        }

        // Load assignments with student's submissions
        $assignments = $course->classAssignments()
            ->with([
                'submissions' => function ($q) use ($student) {
                    $q->where('student_id', $student->id);
                }
            ])
            ->latest()
            ->get();

        // Load attendances
        $attendances = $course->attendances()
            ->where('student_id', $student->id)
            ->orderBy('date', 'desc')
            ->get();

        // Load exam marks
        $examMarks = $course->examMarks()
            ->where('student_id', $student->id)
            ->get();

        // Load support questions (Public ones + My private ones)
        // Public ones
        $publicQuestions = $course->supports()
            ->where('is_public', true)
            ->with(['student', 'answeredBy']) // show who asked and who answered
            ->latest()
            ->get();

        // My questions (all)
        $myQuestions = $course->supports()
            ->where('student_id', $student->id)
            ->with(['answeredBy'])
            ->latest()
            ->get();

        return Inertia::render('Student/Course/Show', [
            'course' => $course,
            'assignments' => $assignments,
            'attendances' => $attendances,
            'examMarks' => $examMarks,
            'publicQuestions' => $publicQuestions,
            'myQuestions' => $myQuestions,
        ]);
    }
}
