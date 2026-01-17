<?php

use App\Models\Department;
use App\Models\Faculty;
use App\Models\PEO;
use App\Models\Program;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

test('authenticated user can view peos for their program', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);

    PEO::factory()->count(3)->create(['program_id' => $program->id]);

    actingAs($user)
        ->get("/programs/{$program->id}/peos")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('PEO/index')
            ->has('peos', 3)
            ->where('program.id', $program->id)
        );
});

test('authenticated user can create a peo', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);

    actingAs($user)
        ->post("/programs/{$program->id}/peos", [
            'peo_no' => 1,
            'peo_name' => 'Graduates will be prepared for successful careers',
        ])
        ->assertRedirect();

    assertDatabaseHas('p_e_o_s', [
        'program_id' => $program->id,
        'peo_no' => 1,
        'peo_name' => 'Graduates will be prepared for successful careers',
    ]);
});

test('peo_no is required', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);

    actingAs($user)
        ->post("/programs/{$program->id}/peos", [
            'peo_no' => '',
            'peo_name' => 'Test PEO',
        ])
        ->assertSessionHasErrors('peo_no');
});

test('peo_name is required', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);

    actingAs($user)
        ->post("/programs/{$program->id}/peos", [
            'peo_no' => 1,
            'peo_name' => '',
        ])
        ->assertSessionHasErrors('peo_name');
});

test('authenticated user can update their own peo', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);
    $peo = PEO::factory()->create(['program_id' => $program->id]);

    actingAs($user)
        ->put("/programs/{$program->id}/peos/{$peo->id}", [
            'peo_no' => 2,
            'peo_name' => 'Updated PEO name',
        ])
        ->assertRedirect();

    assertDatabaseHas('p_e_o_s', [
        'id' => $peo->id,
        'peo_no' => 2,
        'peo_name' => 'Updated PEO name',
    ]);
});

test('user cannot update peo from another users program', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user1->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);
    $peo = PEO::factory()->create(['program_id' => $program->id]);

    actingAs($user2)
        ->put("/programs/{$program->id}/peos/{$peo->id}", [
            'peo_no' => 3,
            'peo_name' => 'Hacked PEO',
        ])
        ->assertForbidden();

    assertDatabaseHas('p_e_o_s', [
        'id' => $peo->id,
        'peo_name' => $peo->peo_name,
    ]);
});

test('authenticated user can delete their own peo', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);
    $peo = PEO::factory()->create(['program_id' => $program->id]);

    actingAs($user)
        ->delete("/programs/{$program->id}/peos/{$peo->id}")
        ->assertRedirect();

    assertDatabaseMissing('p_e_o_s', ['id' => $peo->id]);
});

test('user cannot delete peo from another users program', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user1->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);
    $peo = PEO::factory()->create(['program_id' => $program->id]);

    actingAs($user2)
        ->delete("/programs/{$program->id}/peos/{$peo->id}")
        ->assertForbidden();

    assertDatabaseHas('p_e_o_s', ['id' => $peo->id]);
});

test('unauthenticated user cannot access peo index', function () {
    $program = Program::factory()->create();

    $this->get("/programs/{$program->id}/peos")
        ->assertRedirect(route('login'));
});

test('unauthenticated user cannot create peo', function () {
    $program = Program::factory()->create();

    $this->post("/programs/{$program->id}/peos", [
        'peo_no' => 1,
        'peo_name' => 'Test',
    ])
        ->assertRedirect(route('login'));

    assertDatabaseMissing('p_e_o_s', ['peo_name' => 'Test']);
});
