<?php

use App\Models\CLO;
use App\Models\Course;
use App\Models\Department;
use App\Models\Faculty;
use App\Models\PLO;
use App\Models\Program;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

test('authenticated user can view courses page with clos', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);
    $course = Course::factory()->create(['program_id' => $program->id]);
    CLO::factory()->count(2)->create(['course_id' => $course->id]);

    actingAs($user)
        ->get("/programs/{$program->id}/courses")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Courses/index')
            ->has('courses', 1)
            ->where('program.id', $program->id)
        );
});

test('authenticated user can create a clo', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);
    $plo = PLO::factory()->create(['program_id' => $program->id]);
    $course = Course::factory()->create(['program_id' => $program->id]);

    actingAs($user)
        ->post("/programs/{$program->id}/courses/{$course->id}/clos", [
            'clo_no' => 1,
            'clo_desc' => 'Understand fundamental concepts',
            'plo_ids' => [$plo->id],
        ])
        ->assertRedirect();

    assertDatabaseHas('c_l_o_s', [
        'course_id' => $course->id,
        'clo_no' => 1,
        'clo_desc' => 'Understand fundamental concepts',
    ]);
});

test('authenticated user can update a clo', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);
    $plo = PLO::factory()->create(['program_id' => $program->id]);
    $course = Course::factory()->create(['program_id' => $program->id]);
    $clo = CLO::factory()->create(['course_id' => $course->id]);

    actingAs($user)
        ->put("/programs/{$program->id}/courses/{$course->id}/clos/{$clo->id}", [
            'clo_no' => 2,
            'clo_desc' => 'Updated CLO description',
            'plo_ids' => [$plo->id],
        ])
        ->assertRedirect();

    assertDatabaseHas('c_l_o_s', [
        'id' => $clo->id,
        'clo_no' => 2,
        'clo_desc' => 'Updated CLO description',
    ]);
});

test('authenticated user can create a clo after updating another clo', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);
    $plo = PLO::factory()->create(['program_id' => $program->id]);
    $course = Course::factory()->create(['program_id' => $program->id]);
    $existingClo = CLO::factory()->create([
        'course_id' => $course->id,
        'clo_no' => 1,
        'clo_desc' => 'Original CLO',
    ]);

    // First, update the existing CLO
    actingAs($user)
        ->put("/programs/{$program->id}/courses/{$course->id}/clos/{$existingClo->id}", [
            'clo_no' => 1,
            'clo_desc' => 'Updated existing CLO',
            'plo_ids' => [$plo->id],
        ])
        ->assertRedirect();

    assertDatabaseHas('c_l_o_s', [
        'id' => $existingClo->id,
        'clo_desc' => 'Updated existing CLO',
    ]);

    // Then, create a new CLO (this should work without issues)
    actingAs($user)
        ->post("/programs/{$program->id}/courses/{$course->id}/clos", [
            'clo_no' => 2,
            'clo_desc' => 'Brand new CLO',
            'plo_ids' => [$plo->id],
        ])
        ->assertRedirect();

    assertDatabaseHas('c_l_o_s', [
        'course_id' => $course->id,
        'clo_no' => 2,
        'clo_desc' => 'Brand new CLO',
    ]);

    // Verify both CLOs exist
    expect(CLO::where('course_id', $course->id)->count())->toBe(2);
});

test('clo can be mapped to multiple plos', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);
    $plos = PLO::factory()->count(3)->create(['program_id' => $program->id]);
    $course = Course::factory()->create(['program_id' => $program->id]);

    actingAs($user)
        ->post("/programs/{$program->id}/courses/{$course->id}/clos", [
            'clo_no' => 1,
            'clo_desc' => 'CLO with PLO mappings',
            'plo_ids' => $plos->pluck('id')->toArray(),
        ])
        ->assertRedirect();

    $clo = CLO::where('course_id', $course->id)->first();
    expect($clo->plos()->count())->toBe(3);
});

test('authenticated user can delete a clo', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);
    $course = Course::factory()->create(['program_id' => $program->id]);
    $clo = CLO::factory()->create(['course_id' => $course->id]);

    actingAs($user)
        ->delete("/programs/{$program->id}/courses/{$course->id}/clos/{$clo->id}")
        ->assertRedirect();

    assertDatabaseMissing('c_l_o_s', ['id' => $clo->id]);
});
