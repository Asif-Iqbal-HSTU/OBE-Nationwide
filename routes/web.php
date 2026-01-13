<?php

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

});

require __DIR__.'/settings.php';
