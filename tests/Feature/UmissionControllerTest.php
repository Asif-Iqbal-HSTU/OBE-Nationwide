<?php

use App\Models\Umission;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

test('authenticated user can delete their own umission', function () {
    $user = User::factory()->create();
    $umission = Umission::factory()->create(['user_id' => $user->id]);

    actingAs($user)
        ->delete(route('umissions.destroy', $umission))
        ->assertRedirect()
        ->assertSessionHas('success', 'Umission deleted successfully');

    assertDatabaseMissing('umissions', ['id' => $umission->id]);
});

test('umission is actually removed from database after deletion', function () {
    $user = User::factory()->create();
    $umission = Umission::factory()->create(['user_id' => $user->id]);

    assertDatabaseHas('umissions', ['id' => $umission->id]);

    actingAs($user)
        ->delete(route('umissions.destroy', $umission))
        ->assertRedirect();

    assertDatabaseMissing('umissions', ['id' => $umission->id]);
    expect(Umission::find($umission->id))->toBeNull();
});

test('unauthenticated user cannot delete umission', function () {
    $umission = Umission::factory()->create();

    $this->delete(route('umissions.destroy', $umission))
        ->assertRedirect(route('login'));

    assertDatabaseHas('umissions', ['id' => $umission->id]);
});

test('user cannot delete another users umission', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $umission = Umission::factory()->create(['user_id' => $user1->id]);

    actingAs($user2)
        ->delete(route('umissions.destroy', $umission))
        ->assertForbidden();

    assertDatabaseHas('umissions', ['id' => $umission->id]);
});
