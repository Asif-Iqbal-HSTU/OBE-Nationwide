<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FacultyController extends Controller
{
    public function index()
    {
        $faculties = Faculty::where('user_id', Auth::id())
            ->latest()
            ->get();

        return inertia('Faculty/index', [
            'faculties' => $faculties,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'short_name' => 'required|string|max:50',
        ]);

        Faculty::create([
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'short_name' => $validated['short_name'],
        ]);

        return redirect()->back()->with('success', 'Faculty created successfully');
    }

    public function update(Request $request, Faculty $faculty): RedirectResponse
    {
        if ($faculty->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'short_name' => 'required|string|max:50',
        ]);

        $faculty->update($validated);

        return redirect()->back()->with('success', 'Faculty updated successfully');
    }

    public function destroy(Faculty $faculty): RedirectResponse
    {
        if ($faculty->user_id !== Auth::id()) {
            abort(403);
        }

        $faculty->delete();

        return redirect()->back()->with('success', 'Faculty deleted successfully');
    }
}
