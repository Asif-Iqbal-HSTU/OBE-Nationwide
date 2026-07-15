<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Models\ClassRoutine;
use App\Models\Course;
use App\Models\CourseAssignment;
use App\Models\Program;
use App\Models\TimeSlot;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassRoutineController extends Controller
{
    public function index(Request $request)
    {
        // 1. Setup Verification
        $classroomCount = Classroom::count();
        $timeSlotCount = TimeSlot::where('type', 'class')->count();

        $needsSetup = ($classroomCount === 0 || $timeSlotCount === 0);

        $programs = Program::with('department')->orderBy('name')->get();

        $programId = $request->input('program_id');
        $level = $request->input('level');
        $semester = $request->input('semester');
        $session = $request->input('session', date('Y'));

        $routines = [];
        $assignedCourses = [];
        $activeFilters = false;

        if ($programId && $level && $semester && $session) {
            $activeFilters = true;
            // Get routines
            $routines = ClassRoutine::with(['course', 'teacher', 'classroom', 'timeSlot'])
                ->where('program_id', $programId)
                ->where('level', $level)
                ->where('semester', $semester)
                ->where('session', $session)
                ->get();

            // Get assigned courses for this program/level/semester
            $assignedCourses = CourseAssignment::with(['course', 'teacher'])
                ->whereHas('course', function ($query) use ($programId, $level, $semester) {
                    $query->where('program_id', $programId)
                          ->where('level', $level)
                          ->where('semester', $semester);
                })
                ->where('session', $session)
                ->get();
        }

        return Inertia::render('Routines/ClassRoutine', [
            'programs' => $programs,
            'needsSetup' => $needsSetup,
            'classroomCount' => $classroomCount,
            'timeSlotCount' => $timeSlotCount,
            'routines' => $routines,
            'assignedCourses' => $assignedCourses,
            'filters' => [
                'program_id' => $programId,
                'level' => $level,
                'semester' => $semester,
                'session' => $session,
            ],
            'activeFilters' => $activeFilters,
            'classrooms' => Classroom::orderBy('room_number')->get(),
            'timeSlots' => TimeSlot::where('type', 'class')->orderBy('day')->orderBy('start_time')->get(),
        ]);
    }

    public function generate(Request $request)
    {
        $validated = $request->validate([
            'program_id' => 'required|exists:programs,id',
            'level' => 'required|string',
            'semester' => 'required|string',
            'session' => 'required|string',
        ]);

        $programId = $validated['program_id'];
        $level = $validated['level'];
        $semester = $validated['semester'];
        $session = $validated['session'];

        // 1. Get assigned courses for this semester batch
        $assignments = CourseAssignment::with(['course', 'teacher'])
            ->whereHas('course', function ($query) use ($programId, $level, $semester) {
                $query->where('program_id', $programId)
                      ->where('level', $level)
                      ->where('semester', $semester);
            })
            ->where('session', $session)
            ->get();

        if ($assignments->isEmpty()) {
            return redirect()->back()->with('error', 'No courses are assigned to teachers for this semester and session yet. Please assign courses first.');
        }

        // 2. Load all classrooms and time slots
        $classrooms = Classroom::all();
        $timeSlots = TimeSlot::where('type', 'class')->get();

        if ($classrooms->isEmpty() || $timeSlots->isEmpty()) {
            return redirect()->back()->with('error', 'Please configure classrooms and time slots in the setup first.');
        }

        // 3. Clear existing routines for this specific batch
        ClassRoutine::where('program_id', $programId)
            ->where('level', $level)
            ->where('semester', $semester)
            ->where('session', $session)
            ->delete();

        // Heuristics solver
        $unscheduled = [];
        $scheduledCount = 0;

        foreach ($assignments as $assignment) {
            $course = $assignment->course;
            $teacher = $assignment->teacher;

            // Theory courses meet 2 times a week, lab/sessional meet 1 time
            $sessionsNeeded = ($course->type_theory_sessional === 'theory') ? 2 : 1;
            $requiredRoomType = ($course->type_theory_sessional === 'theory') ? 'theory' : 'lab';

            for ($s = 1; $s <= $sessionsNeeded; $s++) {
                $scheduled = false;

                // Try to find a free slot and classroom
                foreach ($timeSlots as $slot) {
                    // Rule 1: No teacher overlap
                    $teacherBusy = ClassRoutine::where('session', $session)
                        ->where('time_slot_id', $slot->id)
                        ->where('teacher_id', $teacher->id)
                        ->exists();

                    if ($teacherBusy) continue;

                    // Rule 2: No batch (student group) overlap
                    $batchBusy = ClassRoutine::where('session', $session)
                        ->where('time_slot_id', $slot->id)
                        ->where('program_id', $programId)
                        ->where('level', $level)
                        ->where('semester', $semester)
                        ->exists();

                    if ($batchBusy) continue;

                    // Rule 3: Avoid double scheduling the same course on the same time slot
                    $courseBusy = ClassRoutine::where('session', $session)
                        ->where('time_slot_id', $slot->id)
                        ->where('course_id', $course->id)
                        ->exists();

                    if ($courseBusy) continue;

                    // Try to find a matching classroom that is free in this slot
                    foreach ($classrooms as $room) {
                        if ($room->type !== $requiredRoomType) continue;

                        $roomBusy = ClassRoutine::where('session', $session)
                            ->where('time_slot_id', $slot->id)
                            ->where('classroom_id', $room->id)
                            ->exists();

                        if ($roomBusy) continue;

                        // Found a valid schedule!
                        ClassRoutine::create([
                            'program_id' => $programId,
                            'level' => $level,
                            'semester' => $semester,
                            'session' => $session,
                            'course_id' => $course->id,
                            'teacher_id' => $teacher->id,
                            'classroom_id' => $room->id,
                            'time_slot_id' => $slot->id,
                        ]);

                        $scheduled = true;
                        $scheduledCount++;
                        break;
                    }

                    if ($scheduled) break;
                }

                if (!$scheduled) {
                    $unscheduled[] = "{$course->code} ({$course->name}) slot {$s}";
                }
            }
        }

        if (count($unscheduled) > 0) {
            $msg = "Generated routine. Scheduled {$scheduledCount} classes. The following could not be scheduled due to room/time conflicts: " . implode(', ', $unscheduled) . ". Please add more classrooms or time slots.";
            return redirect()->back()->with('warning', $msg);
        }

        return redirect()->back()->with('success', "Routine generated successfully! Scheduled {$scheduledCount} classes.");
    }

    public function clear(Request $request)
    {
        $validated = $request->validate([
            'program_id' => 'required',
            'level' => 'required',
            'semester' => 'required',
            'session' => 'required',
        ]);

        ClassRoutine::where('program_id', $validated['program_id'])
            ->where('level', $validated['level'])
            ->where('semester', $validated['semester'])
            ->where('session', $validated['session'])
            ->delete();

        return redirect()->back()->with('success', 'Routine cleared successfully.');
    }
}
