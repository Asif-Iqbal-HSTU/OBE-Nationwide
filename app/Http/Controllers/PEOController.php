<?php

namespace App\Http\Controllers;

use App\Models\PEO;
use App\Models\Program;
use App\Models\Umission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PEOController extends Controller
{
    public function index(Program $program)
    {
        if ($program->faculty->user_id !== Auth::id()) {
            abort(403);
        }

        $peos = PEO::where('program_id', $program->id)
            ->with('umissions')
            ->orderBy('peo_no')
            ->get();

        $umissions = Umission::where('user_id', Auth::id())->orderBy('umission_no')->get();

        return inertia('PEO/index', [
            'program' => $program->load(['faculty', 'department']),
            'peos' => $peos,
            'umissions' => $umissions,
        ]);
    }

    public function store(Request $request, Program $program): RedirectResponse
    {
        if ($program->faculty->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'peo_no' => 'required|integer',
            'peo_name' => 'required|string',
            'umission_ids' => 'nullable|array',
            'umission_ids.*' => 'exists:umissions,id',
        ]);

        $peo = PEO::create([
            'program_id' => $program->id,
            'peo_no' => $validated['peo_no'],
            'peo_name' => $validated['peo_name'],
        ]);

        if (isset($validated['umission_ids'])) {
            $peo->umissions()->sync($validated['umission_ids']);
        }

        return redirect()->back()->with('success', 'PEO created successfully');
    }

    public function update(Request $request, Program $program, PEO $peo): RedirectResponse
    {
        if ($program->faculty->user_id !== Auth::id() || $peo->program_id !== $program->id) {
            abort(403);
        }

        $validated = $request->validate([
            'peo_no' => 'required|integer',
            'peo_name' => 'required|string',
            'umission_ids' => 'nullable|array',
            'umission_ids.*' => 'exists:umissions,id',
        ]);

        $peo->update([
            'peo_no' => $validated['peo_no'],
            'peo_name' => $validated['peo_name'],
        ]);

        if (isset($validated['umission_ids'])) {
            $peo->umissions()->sync($validated['umission_ids']);
        }

        return redirect()->back()->with('success', 'PEO updated successfully');
    }

    public function destroy(Program $program, PEO $peo): RedirectResponse
    {
        if ($program->faculty->user_id !== Auth::id() || $peo->program_id !== $program->id) {
            abort(403);
        }

        $peo->delete();

        return redirect()->back()->with('success', 'PEO deleted successfully');
    }
}
