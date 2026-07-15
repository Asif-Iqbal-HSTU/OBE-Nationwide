<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Models\TimeSlot;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoutineSetupController extends Controller
{
    public function index()
    {
        return Inertia::render('Routines/Setup', [
            'classrooms' => Classroom::orderBy('room_number')->get(),
            'timeSlots' => TimeSlot::orderBy('day')->orderBy('start_time')->get(),
        ]);
    }

    public function storeClassroom(Request $request)
    {
        $validated = $request->validate([
            'room_number' => 'required|string|unique:classrooms,room_number',
            'capacity' => 'required|integer|min:1',
            'type' => 'required|string|in:theory,lab',
        ]);

        Classroom::create($validated);

        return redirect()->back()->with('success', 'Classroom added successfully.');
    }

    public function updateClassroom(Request $request, Classroom $classroom)
    {
        $validated = $request->validate([
            'room_number' => 'required|string|unique:classrooms,room_number,' . $classroom->id,
            'capacity' => 'required|integer|min:1',
            'type' => 'required|string|in:theory,lab',
        ]);

        $classroom->update($validated);

        return redirect()->back()->with('success', 'Classroom updated successfully.');
    }

    public function destroyClassroom(Classroom $classroom)
    {
        $classroom->delete();
        return redirect()->back()->with('success', 'Classroom deleted successfully.');
    }

    public function storeTimeSlot(Request $request)
    {
        $validated = $request->validate([
            'day' => 'required|string',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
            'type' => 'required|string|in:class,exam',
        ]);

        TimeSlot::create($validated);

        return redirect()->back()->with('success', 'Time Slot added successfully.');
    }

    public function updateTimeSlot(Request $request, TimeSlot $timeSlot)
    {
        $validated = $request->validate([
            'day' => 'required|string',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
            'type' => 'required|string|in:class,exam',
        ]);

        $timeSlot->update($validated);

        return redirect()->back()->with('success', 'Time Slot updated successfully.');
    }

    public function destroyTimeSlot(TimeSlot $timeSlot)
    {
        $timeSlot->delete();
        return redirect()->back()->with('success', 'Time Slot deleted successfully.');
    }
}
