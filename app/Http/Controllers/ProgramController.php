<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Faculty;
use App\Models\Program;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProgramController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $teacher = $user->teacher;

        $faculties = Faculty::where('user_id', $user->id)
            ->when($teacher, function ($q) use ($teacher) {
                $q->orWhere('dean_id', $teacher->id);
            })->get();

        $departments = Department::whereHas('faculty', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->when($teacher, function ($q) use ($teacher) {
                $q->orWhere('chairman_id', $teacher->id);
            })->get();

        $programs = Program::where(function ($q) use ($user, $teacher) {
            $q->whereHas('faculty', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            });

            if ($teacher) {
                $q->orWhereIn('department_id', Department::where('chairman_id', $teacher->id)->pluck('id'))
                    ->orWhereIn('faculty_id', Faculty::where('dean_id', $teacher->id)->pluck('id'));
            }
        })
            ->with(['faculty', 'department'])
            ->withCount(['peos', 'plos', 'courses'])
            ->latest()
            ->get();

        return inertia('Program/index', [
            'programs' => $programs,
            'faculties' => $faculties,
            'departments' => $departments,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'short_name' => 'nullable|string|max:100',
            'faculty_id' => [
                'required',
                'exists:faculties,id',
                Rule::exists('faculties', 'id')->where('user_id', Auth::id()),
            ],
            'department_id' => [
                'required',
                'exists:departments,id',
                Rule::exists('departments', 'id')->where(function ($query) {
                    $query->whereIn('faculty_id', function ($sq) {
                        $sq->select('id')
                            ->from('faculties')
                            ->where('user_id', Auth::id());
                    });
                }),
            ],
            'vision' => 'nullable|string',
            'mission' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        Program::create($validated);

        return redirect()->back()->with('success', 'Program created successfully');
    }

    public function update(Request $request, Program $program): RedirectResponse
    {
        if ($program->faculty->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'short_name' => 'nullable|string|max:100',
            'faculty_id' => [
                'required',
                'exists:faculties,id',
                Rule::exists('faculties', 'id')->where('user_id', Auth::id()),
            ],
            'department_id' => [
                'required',
                'exists:departments,id',
                Rule::exists('departments', 'id')->where(function ($query) {
                    $query->whereIn('faculty_id', function ($sq) {
                        $sq->select('id')
                            ->from('faculties')
                            ->where('user_id', Auth::id());
                    });
                }),
            ],
            'vision' => 'nullable|string',
            'mission' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $program->update($validated);

        return redirect()->back()->with('success', 'Program updated successfully');
    }

    public function destroy(Program $program): RedirectResponse
    {
        if ($program->faculty->user_id !== Auth::id()) {
            abort(403);
        }

        $program->delete();

        return redirect()->back()->with('success', 'Program deleted successfully');
    }
}
