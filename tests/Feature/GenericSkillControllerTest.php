<?php

use App\Models\Department;
use App\Models\Faculty;
use App\Models\GenericSkill;
use App\Models\Program;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

test('authenticated user can view generic skills for their program', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);

    GenericSkill::factory()->count(3)->create(['program_id' => $program->id]);

    actingAs($user)
        ->get("/programs/{$program->id}/generic-skills")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('GenericSkill/index')
            ->has('genericSkills', 3)
            ->where('program.id', $program->id)
        );
});

test('authenticated user can create a generic skill', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);

    actingAs($user)
        ->post("/programs/{$program->id}/generic-skills", [
            'skill_no' => 1,
            'skill_name' => 'Critical thinking and problem solving',
        ])
        ->assertRedirect();

    assertDatabaseHas('generic_skills', [
        'program_id' => $program->id,
        'skill_no' => 1,
        'skill_name' => 'Critical thinking and problem solving',
    ]);
});

test('skill_no is required', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);

    actingAs($user)
        ->post("/programs/{$program->id}/generic-skills", [
            'skill_no' => '',
            'skill_name' => 'Test skill',
        ])
        ->assertSessionHasErrors('skill_no');
});

test('skill_name is required', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);

    actingAs($user)
        ->post("/programs/{$program->id}/generic-skills", [
            'skill_no' => 1,
            'skill_name' => '',
        ])
        ->assertSessionHasErrors('skill_name');
});

test('authenticated user can update their own generic skill', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);
    $skill = GenericSkill::factory()->create(['program_id' => $program->id]);

    actingAs($user)
        ->put("/programs/{$program->id}/generic-skills/{$skill->id}", [
            'skill_no' => 2,
            'skill_name' => 'Updated skill name',
        ])
        ->assertRedirect();

    assertDatabaseHas('generic_skills', [
        'id' => $skill->id,
        'skill_no' => 2,
        'skill_name' => 'Updated skill name',
    ]);
});

test('user cannot update generic skill from another users program', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user1->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);
    $skill = GenericSkill::factory()->create(['program_id' => $program->id]);

    actingAs($user2)
        ->put("/programs/{$program->id}/generic-skills/{$skill->id}", [
            'skill_no' => 3,
            'skill_name' => 'Hacked skill',
        ])
        ->assertForbidden();

    assertDatabaseHas('generic_skills', [
        'id' => $skill->id,
        'skill_name' => $skill->skill_name,
    ]);
});

test('authenticated user can delete their own generic skill', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);
    $skill = GenericSkill::factory()->create(['program_id' => $program->id]);

    actingAs($user)
        ->delete("/programs/{$program->id}/generic-skills/{$skill->id}")
        ->assertRedirect();

    assertDatabaseMissing('generic_skills', ['id' => $skill->id]);
});

test('user cannot delete generic skill from another users program', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user1->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);
    $program = Program::factory()->create([
        'faculty_id' => $faculty->id,
        'department_id' => $department->id,
    ]);
    $skill = GenericSkill::factory()->create(['program_id' => $program->id]);

    actingAs($user2)
        ->delete("/programs/{$program->id}/generic-skills/{$skill->id}")
        ->assertForbidden();

    assertDatabaseHas('generic_skills', ['id' => $skill->id]);
});

test('unauthenticated user cannot access generic skills index', function () {
    $program = Program::factory()->create();

    $this->get("/programs/{$program->id}/generic-skills")
        ->assertRedirect(route('login'));
});

test('unauthenticated user cannot create generic skill', function () {
    $program = Program::factory()->create();

    $this->post("/programs/{$program->id}/generic-skills", [
        'skill_no' => 1,
        'skill_name' => 'Test',
    ])
        ->assertRedirect(route('login'));

    assertDatabaseMissing('generic_skills', ['skill_name' => 'Test']);
});
