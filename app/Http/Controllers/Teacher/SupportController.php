<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Support;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SupportController extends Controller
{
    public function update(Request $request, Support $support)
    {
        $validated = $request->validate([
            'answer' => 'required|string',
        ]);

        $teacher = Auth::user()->teacher;

        $support->update([
            'answer' => $validated['answer'],
            'answered_by' => $teacher->id,
        ]);

        return back()->with('success', 'Question answered.');
    }
}
