<?php

use App\Models\Department;
use App\Models\Faculty;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

test('authenticated user can view their departments', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);

    actingAs($user)
        ->get(route('departments.index'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Department/index')
            ->has('departments', 1)
            ->has('faculties', 1)
        );
});

test('authenticated user can create a department with their faculty', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);

    actingAs($user)
        ->post(route('departments.store'), [
            'name' => 'Department of Computer Science',
            'short_name' => 'CS',
            'faculty_id' => $faculty->id,
        ])
        ->assertRedirect()
        ->assertSessionHas('success', 'Department created successfully');

    assertDatabaseHas('departments', [
        'faculty_id' => $faculty->id,
        'name' => 'Department of Computer Science',
        'short_name' => 'CS',
    ]);
});

test('user cannot create department with another users faculty', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user1->id]);

    actingAs($user2)
        ->post(route('departments.store'), [
            'name' => 'Hacked Department',
            'short_name' => 'HD',
            'faculty_id' => $faculty->id,
        ])
        ->assertSessionHasErrors('faculty_id');

    assertDatabaseMissing('departments', ['name' => 'Hacked Department']);
});

test('department name is required', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);

    actingAs($user)
        ->post(route('departments.store'), [
            'name' => '',
            'short_name' => 'CS',
            'faculty_id' => $faculty->id,
        ])
        ->assertSessionHasErrors('name');
});

test('department short name is required', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);

    actingAs($user)
        ->post(route('departments.store'), [
            'name' => 'Computer Science',
            'short_name' => '',
            'faculty_id' => $faculty->id,
        ])
        ->assertSessionHasErrors('short_name');
});

test('faculty_id is required', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->post(route('departments.store'), [
            'name' => 'Computer Science',
            'short_name' => 'CS',
            'faculty_id' => '',
        ])
        ->assertSessionHasErrors('faculty_id');
});

test('authenticated user can update their own department', function () {
    $user = User::factory()->create();
    $faculty1 = Faculty::factory()->create(['user_id' => $user->id]);
    $faculty2 = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty1->id]);

    actingAs($user)
        ->put(route('departments.update', $department), [
            'name' => 'Updated Department Name',
            'short_name' => 'UDN',
            'faculty_id' => $faculty2->id,
        ])
        ->assertRedirect()
        ->assertSessionHas('success', 'Department updated successfully');

    assertDatabaseHas('departments', [
        'id' => $department->id,
        'name' => 'Updated Department Name',
        'short_name' => 'UDN',
        'faculty_id' => $faculty2->id,
    ]);
});

test('user cannot update department from another users faculty', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user1->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);

    actingAs($user2)
        ->put(route('departments.update', $department), [
            'name' => 'Hacked Name',
            'short_name' => 'HCK',
            'faculty_id' => $faculty->id,
        ])
        ->assertForbidden();

    assertDatabaseHas('departments', [
        'id' => $department->id,
        'name' => $department->name,
    ]);
});

test('user cannot move department to another users faculty', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $faculty1 = Faculty::factory()->create(['user_id' => $user1->id]);
    $faculty2 = Faculty::factory()->create(['user_id' => $user2->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty1->id]);

    actingAs($user1)
        ->put(route('departments.update', $department), [
            'name' => 'Updated Name',
            'short_name' => 'UN',
            'faculty_id' => $faculty2->id,
        ])
        ->assertSessionHasErrors('faculty_id');
});

test('authenticated user can delete their own department', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);

    actingAs($user)
        ->delete(route('departments.destroy', $department))
        ->assertRedirect()
        ->assertSessionHas('success', 'Department deleted successfully');

    assertDatabaseMissing('departments', ['id' => $department->id]);
});

test('department is actually removed from database after deletion', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);

    assertDatabaseHas('departments', ['id' => $department->id]);

    actingAs($user)
        ->delete(route('departments.destroy', $department))
        ->assertRedirect();

    assertDatabaseMissing('departments', ['id' => $department->id]);
    expect(Department::find($department->id))->toBeNull();
});

test('unauthenticated user cannot delete department', function () {
    $faculty = Faculty::factory()->create();
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);

    $this->delete(route('departments.destroy', $department))
        ->assertRedirect(route('login'));

    assertDatabaseHas('departments', ['id' => $department->id]);
});

test('user cannot delete department from another users faculty', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user1->id]);
    $department = Department::factory()->create(['faculty_id' => $faculty->id]);

    actingAs($user2)
        ->delete(route('departments.destroy', $department))
        ->assertForbidden();

    assertDatabaseHas('departments', ['id' => $department->id]);
});

test('unauthenticated user cannot create department', function () {
    $faculty = Faculty::factory()->create();

    $this->post(route('departments.store'), [
        'name' => 'Test Department',
        'short_name' => 'TD',
        'faculty_id' => $faculty->id,
    ])
        ->assertRedirect(route('login'));

    assertDatabaseMissing('departments', ['name' => 'Test Department']);
});

test('only departments from users faculties are shown', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $faculty1 = Faculty::factory()->create(['user_id' => $user1->id]);
    $faculty2 = Faculty::factory()->create(['user_id' => $user2->id]);

    $department1 = Department::factory()->create(['faculty_id' => $faculty1->id]);
    $department2 = Department::factory()->create(['faculty_id' => $faculty2->id]);

    actingAs($user1)
        ->get(route('departments.index'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Department/index')
            ->has('departments', 1)
            ->where('departments.0.id', $department1->id)
        );
});
