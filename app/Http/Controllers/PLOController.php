<?php

namespace App\Http\Controllers;

use App\Models\PLO;
use App\Models\Program;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PLOController extends Controller
{
    public function index(Program $program)
    {
        if ($program->faculty->user_id !== Auth::id()) {
            abort(403);
        }

        $plos = PLO::where('program_id', $program->id)
            ->orderBy('plo_no')
            ->get();

        return inertia('PLO/index', [
            'program' => $program->load(['faculty', 'department']),
            'plos' => $plos,
        ]);
    }

    public function store(Request $request, Program $program): RedirectResponse
    {
        if ($program->faculty->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'plo_no' => 'required|integer',
            'plo_desc' => 'required|string',
        ]);

        PLO::create([
            'program_id' => $program->id,
            'plo_no' => $validated['plo_no'],
            'plo_desc' => $validated['plo_desc'],
        ]);

        return redirect()->back()->with('success', 'PLO created successfully');
    }

    public function update(Request $request, Program $program, PLO $plo): RedirectResponse
    {
        if ($program->faculty->user_id !== Auth::id() || $plo->program_id !== $program->id) {
            abort(403);
        }

        $validated = $request->validate([
            'plo_no' => 'required|integer',
            'plo_desc' => 'required|string',
        ]);

        $plo->update($validated);

        return redirect()->back()->with('success', 'PLO updated successfully');
    }

    public function destroy(Program $program, PLO $plo): RedirectResponse
    {
        if ($program->faculty->user_id !== Auth::id() || $plo->program_id !== $program->id) {
            abort(403);
        }

        $plo->delete();

        return redirect()->back()->with('success', 'PLO deleted successfully');
    }
}
