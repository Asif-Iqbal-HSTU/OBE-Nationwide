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
        if (!$this->canAccessProgram($program)) {
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
        if (!$this->canAccessProgram($program) || $peo->program_id !== $program->id) {
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
        if (!$this->canAccessProgram($program) || $peo->program_id !== $program->id) {
            abort(403);
        }

        $peo->delete();

        return redirect()->back()->with('success', 'PEO deleted successfully');
    }
}
