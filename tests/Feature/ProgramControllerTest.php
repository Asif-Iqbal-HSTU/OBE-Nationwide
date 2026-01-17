<?php

use App\Models\Department;
use App\Models\Faculty;
use App\Models\Program;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

test('authenticated user can view their programs', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);

    actingAs($user)
        ->get(route('programs.index'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Program/index')
            ->has('programs', 1)
            ->has('faculties', 1)
            ->has('departments', 1)
        );
});

test('authenticated user can create a program', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);

    actingAs($user)
        ->post(route('programs.store'), [
            'name' => 'Bachelor of Science in Computer Science',
            'short_name' => 'BSc in CS',
            'faculty_id' => $faculty->id,
            'department_id' => $department->id,
            'vision' => 'To be a leading program in computing education.',
            'mission' => 'To provide quality education in computer science.',
            'description' => 'A comprehensive program covering all aspects of computing.',
        ])
        ->assertRedirect()
        ->assertSessionHas('success', 'Program created successfully');

    assertDatabaseHas('programs', [
        'name' => 'Bachelor of Science in Computer Science',
        'short_name' => 'BSc in CS',
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
        'vision' => 'To be a leading program in computing education.',
        'mission' => 'To provide quality education in computer science.',
        'description' => 'A comprehensive program covering all aspects of computing.',
    ]);
});

test('program can be created without optional fields', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);

    actingAs($user)
        ->post(route('programs.store'), [
            'name' => 'Bachelor of Arts',
            'faculty_id' => $faculty->id,
            'department_id' => $department->id,
        ])
        ->assertRedirect()
        ->assertSessionHas('success', 'Program created successfully');

    assertDatabaseHas('programs', [
        'name' => 'Bachelor of Arts',
    ]);
});

test('user cannot create program with another users faculty', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user1->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);

    actingAs($user2)
        ->post(route('programs.store'), [
            'name' => 'Hacked Program',
            'faculty_id' => $faculty->id,
            'department_id' => $department->id,
        ])
        ->assertSessionHasErrors('faculty_id');

    assertDatabaseMissing('programs', ['name' => 'Hacked Program']);
});

test('user cannot create program with another users department', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $faculty1 = Faculty::factory()->create(['user_id' => $user1->id]);
    $faculty2 = Faculty::factory()->create(['user_id' => $user2->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty1->id]);

    actingAs($user2)
        ->post(route('programs.store'), [
            'name' => 'Hacked Program',
            'faculty_id' => $faculty2->id,
            'department_id' => $department->id,
        ])
        ->assertSessionHasErrors('department_id');

    assertDatabaseMissing('programs', ['name' => 'Hacked Program']);
});

test('program name is required', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);

    actingAs($user)
        ->post(route('programs.store'), [
            'name' => '',
            'faculty_id' => $faculty->id,
            'department_id' => $department->id,
        ])
        ->assertSessionHasErrors('name');
});

test('faculty_id is required', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);

    actingAs($user)
        ->post(route('programs.store'), [
            'name' => 'Test Program',
            'faculty_id' => '',
            'department_id' => $department->id,
        ])
        ->assertSessionHasErrors('faculty_id');
});

test('department_id is required', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);

    actingAs($user)
        ->post(route('programs.store'), [
            'name' => 'Test Program',
            'faculty_id' => $faculty->id,
            'department_id' => '',
        ])
        ->assertSessionHasErrors('department_id');
});

test('authenticated user can update their own program', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department1 = Department::factory()->create(['faculty_id' => $faculty->id]);
    $department2 = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department1->id,
    ]);

    actingAs($user)
        ->put(route('programs.update', $program), [
            'name' => 'Updated Program Name',
            'faculty_id' => $faculty->id,
            'department_id' => $department2->id,
            'vision' => 'Updated vision',
            'mission' => 'Updated mission',
            'description' => 'Updated description',
        ])
        ->assertRedirect()
        ->assertSessionHas('success', 'Program updated successfully');

    assertDatabaseHas('programs', [
        'id' => $program->id,
        'name' => 'Updated Program Name',
        'department_id' => $department2->id,
        'vision' => 'Updated vision',
    ]);
});

test('user cannot update program from another users faculty', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user1->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);

    actingAs($user2)
        ->put(route('programs.update', $program), [
            'name' => 'Hacked Name',
            'faculty_id' => $faculty->id,
            'department_id' => $department->id,
        ])
        ->assertForbidden();

    assertDatabaseHas('programs', [
        'id' => $program->id,
        'name' => $program->name,
    ]);
});

test('authenticated user can delete their own program', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);

    actingAs($user)
        ->delete(route('programs.destroy', $program))
        ->assertRedirect()
        ->assertSessionHas('success', 'Program deleted successfully');

    assertDatabaseMissing('programs', ['id' => $program->id]);
});

test('program is actually removed from database after deletion', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);

    assertDatabaseHas('programs', ['id' => $program->id]);

    actingAs($user)
        ->delete(route('programs.destroy', $program))
        ->assertRedirect();

    assertDatabaseMissing('programs', ['id' => $program->id]);
    expect(Program::find($program->id))->toBeNull();
});

test('unauthenticated user cannot delete program', function () {
    $program = Program::factory()->create();

    $this->delete(route('programs.destroy', $program))
        ->assertRedirect(route('login'));

    assertDatabaseHas('programs', ['id' => $program->id]);
});

test('user cannot delete program from another users faculty', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user1->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);

    actingAs($user2)
        ->delete(route('programs.destroy', $program))
        ->assertForbidden();

    assertDatabaseHas('programs', ['id' => $program->id]);
});

test('unauthenticated user cannot create program', function () {
    $faculty = Faculty::factory()->create();
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);

    $this->post(route('programs.store'), [
        'name' => 'Test Program',
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ])
        ->assertRedirect(route('login'));

    assertDatabaseMissing('programs', ['name' => 'Test Program']);
});

test('only programs from users faculties are shown', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $faculty1 = Faculty::factory()->create(['user_id' => $user1->id]);
    $faculty2 = Faculty::factory()->create(['user_id' => $user2->id]);

    $department1 = Department::factory()->create(['faculty_id' => $faculty1->id]);
    $department2 = Department::factory()->create(['faculty_id' => $faculty2->id]);

    $program1 = Program::factory()->create([
        'faculty_id' => $faculty1->id,
        'department_id' => $department1->id,
    ]);
    $program2 = Program::factory()->create([
        'faculty_id' => $faculty2->id,
        'department_id' => $department2->id,
    ]);

    actingAs($user1)
        ->get(route('programs.index'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Program/index')
            ->has('programs', 1)
            ->where('programs.0.id', $program1->id)
        );
});
