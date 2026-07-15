<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Models\ExamRoutine;
use App\Models\Course;
use App\Models\Program;
use App\Models\TimeSlot;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ExamRoutineController extends Controller
{
    public function index(Request $request)
    {
        $classroomCount = Classroom::count();
        $timeSlotCount = TimeSlot::where('type', 'exam')->count();

        $needsSetup = ($classroomCount === 0 || $timeSlotCount === 0);

        $programs = Program::with('department')->orderBy('name')->get();

        $programId = $request->input('program_id');
        $level = $request->input('level');
        $semester = $request->input('semester');
        $session = $request->input('session', date('Y'));

        $routines = [];
        $courses = [];
        $activeFilters = false;

        if ($programId && $level && $semester && $session) {
            $activeFilters = true;
            $routines = ExamRoutine::with(['course', 'classroom', 'timeSlot', 'invigilator'])
                ->where('program_id', $programId)
                ->where('level', $level)
                ->where('semester', $semester)
                ->where('session', $session)
                ->get();

            $courses = Course::where('program_id', $programId)
                ->where('level', $level)
                ->where('semester', $semester)
                ->get();
        }

        return Inertia::render('Routines/ExamRoutine', [
            'programs' => $programs,
            'needsSetup' => $needsSetup,
            'classroomCount' => $classroomCount,
            'timeSlotCount' => $timeSlotCount,
            'routines' => $routines,
            'courses' => $courses,
            'filters' => [
                'program_id' => $programId,
                'level' => $level,
                'semester' => $semester,
                'session' => $session,
            ],
            'activeFilters' => $activeFilters,
            'classrooms' => Classroom::orderBy('room_number')->get(),
            'timeSlots' => TimeSlot::where('type', 'exam')->orderBy('start_time')->get(),
            'teachers' => Teacher::orderBy('name')->get(),
        ]);
    }

    public function generate(Request $request)
    {
        $validated = $request->validate([
            'program_id' => 'required|exists:programs,id',
            'level' => 'required|string',
            'semester' => 'required|string',
            'session' => 'required|string',
            'start_date' => 'required|date',
            'gap_days' => 'required|integer|min:0|max:10',
        ]);

        $programId = $validated['program_id'];
        $level = $validated['level'];
        $semester = $validated['semester'];
        $session = $validated['session'];
        $startDate = Carbon::parse($validated['start_date']);
        $gapDays = (int) $validated['gap_days'];

        // 1. Get all courses for this batch
        $courses = Course::where('program_id', $programId)
            ->where('level', $level)
            ->where('semester', $semester)
            ->get();

        if ($courses->isEmpty()) {
            return redirect()->back()->with('error', 'No courses found in the system for this program, level, and semester. Cannot generate exam routine.');
        }

        // 2. Load classrooms, exam slots, and teachers
        $classrooms = Classroom::orderBy('capacity', 'desc')->get();
        $examSlots = TimeSlot::where('type', 'exam')->get();
        $teachers = Teacher::all();

        if ($classrooms->isEmpty() || $examSlots->isEmpty()) {
            return redirect()->back()->with('error', 'Please configure classrooms and exam time slots in setup first.');
        }

        if ($teachers->isEmpty()) {
            return redirect()->back()->with('error', 'No teachers found in the system to assign as invigilators.');
        }

        // 3. Clear existing exam routines for this batch
        ExamRoutine::where('program_id', $programId)
            ->where('level', $level)
            ->where('semester', $semester)
            ->where('session', $session)
            ->delete();

        $currentDate = $startDate->copy();
        $scheduledCount = 0;
        $unscheduled = [];

        foreach ($courses as $index => $course) {
            // Space exams out by gapDays
            if ($index > 0) {
                $currentDate->addDays($gapDays + 1);
            }

            // Exclude Fridays/Saturdays if desired, let's keep it simple: skip Friday
            if ($currentDate->isFriday()) {
                $currentDate->addDay(); // Move to Saturday or Sunday
            }

            $scheduled = false;

            // Try to schedule the exam
            foreach ($examSlots as $slot) {
                // Find a free classroom in this slot on this date
                foreach ($classrooms as $room) {
                    $roomBusy = ExamRoutine::where('exam_date', $currentDate->format('Y-m-d'))
                        ->where('time_slot_id', $slot->id)
                        ->where('classroom_id', $room->id)
                        ->exists();

                    if ($roomBusy) continue;

                    // Find an available invigilator (teacher)
                    $assignedInvigilator = null;
                    foreach ($teachers as $teacher) {
                        $teacherBusy = ExamRoutine::where('exam_date', $currentDate->format('Y-m-d'))
                            ->where('time_slot_id', $slot->id)
                            ->where('invigilator_id', $teacher->id)
                            ->exists();

                        if (!$teacherBusy) {
                            $assignedInvigilator = $teacher;
                            break;
                        }
                    }

                    if (!$assignedInvigilator) {
                        // Fallback: if all teachers busy (rare), use the first teacher
                        $assignedInvigilator = $teachers->first();
                    }

                    // Create the exam routine entry
                    ExamRoutine::create([
                        'program_id' => $programId,
                        'level' => $level,
                        'semester' => $semester,
                        'session' => $session,
                        'course_id' => $course->id,
                        'classroom_id' => $room->id,
                        'time_slot_id' => $slot->id,
                        'exam_date' => $currentDate->format('Y-m-d'),
                        'invigilator_id' => $assignedInvigilator->id,
                    ]);

                    $scheduled = true;
                    $scheduledCount++;
                    break;
                }

                if ($scheduled) break;
            }

            if (!$scheduled) {
                $unscheduled[] = $course->code;
            }
        }

        if (count($unscheduled) > 0) {
            $msg = "Generated exam routine. Scheduled {$scheduledCount} exams. The following could not be scheduled: " . implode(', ', $unscheduled) . ". Please add more classrooms or exam slots.";
            return redirect()->back()->with('warning', $msg);
        }

        return redirect()->back()->with('success', "Exam routine generated successfully! Scheduled {$scheduledCount} exams.");
    }

    public function clear(Request $request)
    {
        $validated = $request->validate([
            'program_id' => 'required',
            'level' => 'required',
            'semester' => 'required',
            'session' => 'required',
        ]);

        ExamRoutine::where('program_id', $validated['program_id'])
            ->where('level', $validated['level'])
            ->where('semester', $validated['semester'])
            ->where('session', $validated['session'])
            ->delete();

        return redirect()->back()->with('success', 'Exam routine cleared successfully.');
    }
}
