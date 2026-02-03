<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Faculty;
use App\Models\Teacher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class DepartmentController extends Controller
{
    public function index()
    {
        $faculties = Faculty::where('user_id', Auth::id())->get();

        $departments = Department::whereHas('faculty', function ($query) {
            $query->where('user_id', Auth::id());
        })
            ->with(['faculty', 'chairman'])
            ->latest()
            ->get();

        $teachers = Teacher::whereHas('department.faculty', function ($q) {
            $q->where('user_id', Auth::id());
        })->get();

        return inertia('Department/index', [
            'departments' => $departments,
            'faculties' => $faculties,
            'teachers' => $teachers,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'short_name' => 'required|string|max:50',
            'faculty_id' => [
                'required',
                'exists:faculties,id',
                Rule::exists('faculties', 'id')->where('user_id', Auth::id()),
            ],
        ]);

        Department::create($validated);

        return redirect()->back()->with('success', 'Department created successfully');
    }

    public function update(Request $request, Department $department): RedirectResponse
    {
        if ($department->faculty->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'short_name' => 'required|string|max:50',
            'faculty_id' => [
                'required',
                'exists:faculties,id',
                Rule::exists('faculties', 'id')->where('user_id', Auth::id()),
            ],
            'chairman_id' => 'nullable|exists:teachers,id',
        ]);

        $department->update($validated);

        return redirect()->back()->with('success', 'Department updated successfully');
    }

    public function destroy(Department $department): RedirectResponse
    {
        if ($department->faculty->user_id !== Auth::id()) {
            abort(403);
        }

        $department->delete();

        return redirect()->back()->with('success', 'Department deleted successfully');
    }
}
