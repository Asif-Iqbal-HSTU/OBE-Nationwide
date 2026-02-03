<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Course;
use App\Models\Program;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function store(Request $request, Program $program, Course $course): RedirectResponse
    {
        $validated = $request->validate([
            'book_no' => 'required|integer',
            'book_name' => 'required|string',
        ]);

        $course->books()->create($validated);

        return redirect()->back()->with('success', 'Book added successfully');
    }

    public function update(Request $request, Program $program, Course $course, Book $book): RedirectResponse
    {
        $validated = $request->validate([
            'book_no' => 'required|integer',
            'book_name' => 'required|string',
        ]);

        $book->update($validated);

        return redirect()->back()->with('success', 'Book updated successfully');
    }

    public function destroy(Program $program, Course $course, Book $book): RedirectResponse
    {
        $book->delete();

        return redirect()->back()->with('success', 'Book deleted successfully');
    }
}
