<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Program;
use App\Models\CourseAssignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class CourseController extends Controller
{
    public function index(Program $program)
    {
        $user = Auth::user();
        $teacher = $user->teacher;

        // Dynamic checks
        $isChairman = $teacher && \App\Models\Department::where('id', $program->department_id)->where('chairman_id', $teacher->id)->exists();
        $isDean = $teacher && \App\Models\Faculty::where('id', $program->faculty_id)->where('dean_id', $teacher->id)->exists();
        $isAdmin = $user->isAdmin();

        // Authorization check
        $canAccess = false;
        if ($isAdmin) {
            $canAccess = true;
        } elseif ($isDean) {
            $canAccess = true;
        } elseif ($isChairman) {
            $canAccess = true;
        } elseif ($user->isTeacher() && $teacher) {
            // Teachers can see the program if they have any assigned course in it
            $hasAssignment = CourseAssignment::where('teacher_id', $teacher->id)
                ->whereIn('course_id', $program->courses->pluck('id'))
                ->exists();
            if ($hasAssignment) {
                $canAccess = true;
            }
        }

        if (!$canAccess) {
            abort(403, 'You do not have permission to view this program curriculum.');
        }

        // Get teachers for the department to allow assignment
        $teachers = \App\Models\Teacher::where('department_id', $program->department_id)
            ->select('id', 'name', 'designation')
            ->get();

        return inertia('Courses/index', [
            'program' => $program->load(['faculty', 'department', 'plos']),
            'courses' => Course::where('program_id', $program->id)
                ->with(['cos', 'clos.plos', 'contents.clos', 'books', 'lessonPlans.clos', 'assignments', 'teachers'])
                ->get(),
            'teachers' => $teachers,
            'auth_teacher_id' => $teacher ? $teacher->id : null,
            'is_admin' => $isAdmin,
            'is_chairman' => $isChairman || $isDean, // Both roles can assign
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
        $user = Auth::user();
        $teacher = $user->teacher;

        $isChairman = $teacher && \App\Models\Department::where('id', $program->department_id)->where('chairman_id', $teacher->id)->exists();
        $isDean = $teacher && \App\Models\Faculty::where('id', $program->faculty_id)->where('dean_id', $teacher->id)->exists();

        $canEdit = false;
        if ($user->isAdmin()) {
            $canEdit = true;
        } elseif ($isChairman || $isDean) {
            $canEdit = true;
        } elseif ($user->isTeacher() && $teacher) {
            // Check if this teacher is assigned to this course
            $isAssigned = CourseAssignment::where('course_id', $course->id)
                ->where('teacher_id', $teacher->id)
                ->exists();
            if ($isAssigned) {
                $canEdit = true;
            }
        }

        if (!$canEdit) {
            abort(403, 'You are not authorized to edit this course.');
        }

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
