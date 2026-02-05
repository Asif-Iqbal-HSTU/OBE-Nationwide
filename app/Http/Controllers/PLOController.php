<?php

namespace App\Http\Controllers;

use App\Models\PEO;
use App\Models\PLO;
use App\Models\Program;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PLOController extends Controller
{
    /**
     * Check if the current user can access a program.
     * Allows: Faculty admin (user_id), Dean, Department Chairman
     */
    private function canAccessProgram(Program $program): bool
    {
        $user = Auth::user();
        $teacher = $user->teacher;

        // Faculty admin (owns the faculty)
        if ($program->faculty->user_id === $user->id) {
            return true;
        }

        // Teacher checks
        if ($teacher) {
            // Dean of the faculty
            if ($program->faculty->dean_id === $teacher->id) {
                return true;
            }

            // Chairman of the program's department
            if ($program->department && $program->department->chairman_id === $teacher->id) {
                return true;
            }
        }

        return false;
    }

    public function index(Program $program)
    {
        if (!$this->canAccessProgram($program)) {
            abort(403);
        }

        $plos = PLO::where('program_id', $program->id)
            ->with('peos')
            ->orderBy('plo_no')
            ->get();

        $peos = PEO::where('program_id', $program->id)->orderBy('peo_no')->get();

        return inertia('PLO/index', [
            'program' => $program->load(['faculty', 'department']),
            'plos' => $plos,
            'peos' => $peos,
        ]);
    }

    public function store(Request $request, Program $program): RedirectResponse
    {
        if (!$this->canAccessProgram($program)) {
            abort(403);
        }

        $validated = $request->validate([
            'plo_no' => 'required|integer',
            'plo_desc' => 'required|string',
            'peo_ids' => 'nullable|array',
            'peo_ids.*' => 'exists:p_e_o_s,id',
        ]);

        $plo = PLO::create([
            'program_id' => $program->id,
            'plo_no' => $validated['plo_no'],
            'plo_desc' => $validated['plo_desc'],
        ]);

        if (isset($validated['peo_ids'])) {
            $plo->peos()->sync($validated['peo_ids']);
        }

        return redirect()->back()->with('success', 'PLO created successfully');
    }

    public function update(Request $request, Program $program, PLO $plo): RedirectResponse
    {
        if (!$this->canAccessProgram($program) || $plo->program_id !== $program->id) {
            abort(403);
        }

        $validated = $request->validate([
            'plo_no' => 'required|integer',
            'plo_desc' => 'required|string',
            'peo_ids' => 'nullable|array',
            'peo_ids.*' => 'exists:p_e_o_s,id',
        ]);

        $plo->update([
            'plo_no' => $validated['plo_no'],
            'plo_desc' => $validated['plo_desc'],
        ]);

        if (isset($validated['peo_ids'])) {
            $plo->peos()->sync($validated['peo_ids']);
        }

        return redirect()->back()->with('success', 'PLO updated successfully');
    }

    public function destroy(Program $program, PLO $plo): RedirectResponse
    {
        if (!$this->canAccessProgram($program) || $plo->program_id !== $program->id) {
            abort(403);
        }

        $plo->delete();

        return redirect()->back()->with('success', 'PLO deleted successfully');
    }
}
