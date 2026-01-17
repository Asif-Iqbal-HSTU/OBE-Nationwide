<?php

use App\Http\Controllers\CLOController;
use App\Http\Controllers\COController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\GenericSkillController;
use App\Http\Controllers\PEOController;
use App\Http\Controllers\PLOController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\UmissionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/umissions', [UmissionController::class, 'index'])->name('umissions.index');
    Route::post('/umissions', [UmissionController::class, 'store'])->name('umissions.store');
    Route::put('/umissions/{umission}', [UmissionController::class, 'update'])->name('umissions.update');
    Route::delete('/umissions/{umission}', [UmissionController::class, 'destroy'])->name('umissions.destroy');

    Route::get('/faculties', [FacultyController::class, 'index'])->name('faculties.index');
    Route::post('/faculties', [FacultyController::class, 'store'])->name('faculties.store');
    Route::put('/faculties/{faculty}', [FacultyController::class, 'update'])->name('faculties.update');
    Route::delete('/faculties/{faculty}', [FacultyController::class, 'destroy'])->name('faculties.destroy');

    Route::get('/departments', [DepartmentController::class, 'index'])->name('departments.index');
    Route::post('/departments', [DepartmentController::class, 'store'])->name('departments.store');
    Route::put('/departments/{department}', [DepartmentController::class, 'update'])->name('departments.update');
    Route::delete('/departments/{department}', [DepartmentController::class, 'destroy'])->name('departments.destroy');

    Route::get('/programs', [ProgramController::class, 'index'])->name('programs.index');
    Route::post('/programs', [ProgramController::class, 'store'])->name('programs.store');
    Route::put('/programs/{program}', [ProgramController::class, 'update'])->name('programs.update');
    Route::delete('/programs/{program}', [ProgramController::class, 'destroy'])->name('programs.destroy');

    // Nested routes for Program Educational Objectives, Program Learning Outcomes, and Generic Skills
    Route::prefix('programs/{program}')->group(function () {
        // PEO routes
        Route::get('/peos', [PEOController::class, 'index'])->name('programs.peos.index');
        Route::post('/peos', [PEOController::class, 'store'])->name('programs.peos.store');
        Route::put('/peos/{peo}', [PEOController::class, 'update'])->name('programs.peos.update');
        Route::delete('/peos/{peo}', [PEOController::class, 'destroy'])->name('programs.peos.destroy');

        // PLO routes
        Route::get('/plos', [PLOController::class, 'index'])->name('programs.plos.index');
        Route::post('/plos', [PLOController::class, 'store'])->name('programs.plos.store');
        Route::put('/plos/{plo}', [PLOController::class, 'update'])->name('programs.plos.update');
        Route::delete('/plos/{plo}', [PLOController::class, 'destroy'])->name('programs.plos.destroy');

        // Generic Skills routes
        Route::get('/generic-skills', [GenericSkillController::class, 'index'])->name('programs.generic-skills.index');
        Route::post('/generic-skills', [GenericSkillController::class, 'store'])->name('programs.generic-skills.store');
        Route::put('/generic-skills/{genericSkill}', [GenericSkillController::class, 'update'])->name('programs.generic-skills.update');
        Route::delete('/generic-skills/{genericSkill}', [GenericSkillController::class, 'destroy'])->name('programs.generic-skills.destroy');

// Inside Route::prefix('programs/{program}')->group(function () { ...

// Courses routes
        Route::get('/courses', [CourseController::class, 'index'])->name('programs.courses.index');
        Route::post('/courses', [CourseController::class, 'store'])->name('programs.courses.store');
        Route::put('/courses/{course}', [CourseController::class, 'update'])->name('programs.courses.update');
        Route::delete('/courses/{course}', [CourseController::class, 'destroy'])->name('programs.courses.destroy');

        Route::prefix('courses/{course}')->group(function () {
            Route::post('/cos', [COController::class, 'store'])->name('programs.courses.cos.store');
            Route::put('/cos/{co}', [COController::class, 'update'])->name('programs.courses.cos.update');
            Route::delete('/cos/{co}', [COController::class, 'destroy'])->name('programs.courses.cos.destroy');

            Route::post('/clos', [CLOController::class, 'store'])->name('programs.courses.clos.store');
            Route::put('/clos/{clo}', [CLOController::class, 'update'])->name('programs.courses.clos.update');
            Route::delete('/clos/{clo}', [CLOController::class, 'destroy'])->name('programs.courses.clos.destroy');

            Route::post('/contents', [ContentController::class, 'store'])->name('programs.courses.contents.store');
            Route::put('/contents/{content}', [ContentController::class, 'update'])->name('programs.courses.contents.update');
            Route::delete('/contents/{content}', [ContentController::class, 'destroy'])->name('programs.courses.contents.destroy');
        });
    });
});

require __DIR__.'/settings.php';

