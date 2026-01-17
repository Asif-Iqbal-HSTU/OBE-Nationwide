<?php

use App\Models\Department;
use App\Models\Faculty;
use App\Models\PLO;
use App\Models\Program;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

test('authenticated user can view plos for their program', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);

    PLO::factory()->count(3)->create(['program_id' => $program->id]);

    actingAs($user)
        ->get("/programs/{$program->id}/plos")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('PLO/index')
            ->has('plos', 3)
            ->where('program.id', $program->id)
        );
});

test('authenticated user can create a plo', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);

    actingAs($user)
        ->post("/programs/{$program->id}/plos", [
            'plo_no' => 1,
            'plo_desc' => 'Apply knowledge of computing fundamentals',
        ])
        ->assertRedirect();

    assertDatabaseHas('p_l_o_s', [
        'program_id' => $program->id,
        'plo_no' => 1,
        'plo_desc' => 'Apply knowledge of computing fundamentals',
    ]);
});

test('plo_no is required', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);

    actingAs($user)
        ->post("/programs/{$program->id}/plos", [
            'plo_no' => '',
            'plo_desc' => 'Test description',
        ])
        ->assertSessionHasErrors('plo_no');
});

test('plo_desc is required', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);

    actingAs($user)
        ->post("/programs/{$program->id}/plos", [
            'plo_no' => 1,
            'plo_desc' => '',
        ])
        ->assertSessionHasErrors('plo_desc');
});

test('authenticated user can update their own plo', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);
    $plo = PLO::factory()->create(['program_id' => $program->id]);

    actingAs($user)
        ->put("/programs/{$program->id}/plos/{$plo->id}", [
            'plo_no' => 2,
            'plo_desc' => 'Updated PLO description',
        ])
        ->assertRedirect();

    assertDatabaseHas('p_l_o_s', [
        'id' => $plo->id,
        'plo_no' => 2,
        'plo_desc' => 'Updated PLO description',
    ]);
});

test('user cannot update plo from another users program', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user1->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);
    $plo = PLO::factory()->create(['program_id' => $program->id]);

    actingAs($user2)
        ->put("/programs/{$program->id}/plos/{$plo->id}", [
            'plo_no' => 3,
            'plo_desc' => 'Hacked description',
        ])
        ->assertForbidden();

    assertDatabaseHas('p_l_o_s', [
        'id' => $plo->id,
        'plo_desc' => $plo->plo_desc,
    ]);
});

test('authenticated user can delete their own plo', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);
    $plo = PLO::factory()->create(['program_id' => $program->id]);

    actingAs($user)
        ->delete("/programs/{$program->id}/plos/{$plo->id}")
        ->assertRedirect();

    assertDatabaseMissing('p_l_o_s', ['id' => $plo->id]);
});

test('user cannot delete plo from another users program', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user1->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);
    $plo = PLO::factory()->create(['program_id' => $program->id]);

    actingAs($user2)
        ->delete("/programs/{$program->id}/plos/{$plo->id}")
        ->assertForbidden();

    assertDatabaseHas('p_l_o_s', ['id' => $plo->id]);
});

test('unauthenticated user cannot access plo index', function () {
    $program = Program::factory()->create();

    $this->get("/programs/{$program->id}/plos")
        ->assertRedirect(route('login'));
});

test('unauthenticated user cannot create plo', function () {
    $program = Program::factory()->create();

    $this->post("/programs/{$program->id}/plos", [
        'plo_no' => 1,
        'plo_desc' => 'Test',
    ])
        ->assertRedirect(route('login'));

    assertDatabaseMissing('p_l_o_s', ['plo_desc' => 'Test']);
});
