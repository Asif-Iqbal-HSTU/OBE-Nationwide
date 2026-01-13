<?php

namespace App\Http\Controllers;

use App\Models\Umission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UmissionController extends Controller
{
    public function index()
    {
        $umissions = Umission::where('user_id', Auth::id())
            ->latest()
            ->get();

        return inertia('Umission/Index', [
            'umissions' => $umissions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'umission_no'   => 'required|numeric',
            'umission_name' => 'required|string|max:1000',
        ]);

        Umission::create([
            'user_id'       => Auth::id(),
            'umission_no'   => $validated['umission_no'],
            'umission_name' => $validated['umission_name'],
        ]);

        return redirect()->back()->with('success', 'Umission created successfully');
    }

    public function update(Request $request, Umission $umission)
    {
        $validated = $request->validate([
            'umission_no'   => 'required|numeric',
            'umission_name' => 'required|string|max:1000',
        ]);

        $umission->update($validated);

        return redirect()->back()->with('success', 'Umission updated successfully');
    }
}
