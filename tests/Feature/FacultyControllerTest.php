<?php

use App\Models\Faculty;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

test('authenticated user can view their faculties', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);

    actingAs($user)
        ->get(route('faculties.index'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Faculty/index')
            ->has('faculties', 1)
        );
});

test('authenticated user can create a faculty', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->post(route('faculties.store'), [
            'name' => 'Faculty of Engineering',
            'short_name' => 'FOE',
        ])
        ->assertRedirect()
        ->assertSessionHas('success', 'Faculty created successfully');

    assertDatabaseHas('faculties', [
        'user_id' => $user->id,
        'name' => 'Faculty of Engineering',
        'short_name' => 'FOE',
    ]);
});

test('faculty name is required', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->post(route('faculties.store'), [
            'name' => '',
            'short_name' => 'FOE',
        ])
        ->assertSessionHasErrors('name');
});

test('faculty short name is required', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->post(route('faculties.store'), [
            'name' => 'Faculty of Engineering',
            'short_name' => '',
        ])
        ->assertSessionHasErrors('short_name');
});

test('authenticated user can update their own faculty', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);

    actingAs($user)
        ->put(route('faculties.update', $faculty), [
            'name' => 'Updated Faculty Name',
            'short_name' => 'UFN',
        ])
        ->assertRedirect()
        ->assertSessionHas('success', 'Faculty updated successfully');

    assertDatabaseHas('faculties', [
        'id' => $faculty->id,
        'name' => 'Updated Faculty Name',
        'short_name' => 'UFN',
    ]);
});

test('user cannot update another users faculty', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user1->id]);

    actingAs($user2)
        ->put(route('faculties.update', $faculty), [
            'name' => 'Hacked Name',
            'short_name' => 'HCK',
        ])
        ->assertForbidden();

    assertDatabaseHas('faculties', [
        'id' => $faculty->id,
        'name' => $faculty->name,
    ]);
});

test('authenticated user can delete their own faculty', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);

    actingAs($user)
        ->delete(route('faculties.destroy', $faculty))
        ->assertRedirect()
        ->assertSessionHas('success', 'Faculty deleted successfully');

    assertDatabaseMissing('faculties', ['id' => $faculty->id]);
});

test('faculty is actually removed from database after deletion', function () {
    $user = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user->id]);

    assertDatabaseHas('faculties', ['id' => $faculty->id]);

    actingAs($user)
        ->delete(route('faculties.destroy', $faculty))
        ->assertRedirect();

    assertDatabaseMissing('faculties', ['id' => $faculty->id]);
    expect(Faculty::find($faculty->id))->toBeNull();
});

test('unauthenticated user cannot delete faculty', function () {
    $faculty = Faculty::factory()->create();

    $this->delete(route('faculties.destroy', $faculty))
        ->assertRedirect(route('login'));

    assertDatabaseHas('faculties', ['id' => $faculty->id]);
});

test('user cannot delete another users faculty', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $faculty = Faculty::factory()->create(['user_id' => $user1->id]);

    actingAs($user2)
        ->delete(route('faculties.destroy', $faculty))
        ->assertForbidden();

    assertDatabaseHas('faculties', ['id' => $faculty->id]);
});

test('unauthenticated user cannot create faculty', function () {
    $this->post(route('faculties.store'), [
        'name' => 'Test Faculty',
        'short_name' => 'TF',
    ])
        ->assertRedirect(route('login'));

    assertDatabaseMissing('faculties', ['name' => 'Test Faculty']);
});
