<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Teacher;
use App\Models\User;
use App\Models\Department;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        // For API (used in modals)
        if ($request->wantsJson()) {
            $query = Teacher::with('department');
            if ($request->has('department_id')) {
                $query->where('department_id', $request->department_id);
            }
            return response()->json($query->get());
        }

        // For Teacher Management Page
        $teachers = Teacher::with(['department.faculty', 'user'])
            ->whereHas('department.faculty', function ($q) use ($user) {
                if (!$user->isAdmin()) {
                    $q->where('user_id', $user->id);
                }
            })
            ->get();

        $departments = Department::whereHas('faculty', function ($q) use ($user) {
            if (!$user->isAdmin()) {
                $q->where('user_id', $user->id);
            }
        })->get();

        return inertia('Teacher/index', [
            'teachers' => $teachers,
            'departments' => $departments,
            'faculties' => \App\Models\Faculty::all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'designation' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'teacher',
        ]);

        Teacher::create([
            'user_id' => $user->id,
            'name' => $validated['name'],
            'designation' => $validated['designation'],
            'department_id' => $validated['department_id'],
        ]);

        return redirect()->back()->with('success', 'Teacher registered successfully');
    }

    public function update(Request $request, Teacher $teacher): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $teacher->user_id,
            'designation' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'password' => 'nullable|string|min:8',
        ]);

        $teacher->update([
            'name' => $validated['name'],
            'designation' => $validated['designation'],
            'department_id' => $validated['department_id'],
        ]);

        $user = $teacher->user;
        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        if (!empty($validated['password'])) {
            $userData['password'] = Hash::make($validated['password']);
        }

        $user->update($userData);

        return redirect()->back()->with('success', 'Teacher updated successfully');
    }

    public function destroy(Teacher $teacher): RedirectResponse
    {
        $user = $teacher->user;
        $teacher->delete();
        if ($user) {
            $user->delete();
        }

        return redirect()->back()->with('success', 'Teacher deleted successfully');
    }
}
