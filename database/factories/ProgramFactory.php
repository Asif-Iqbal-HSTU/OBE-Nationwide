<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Program>
 */
class ProgramFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $faculty = \App\Models\Faculty::factory()->create();
        $department = \App\Models\Department::factory()->create(['faculty_id' => $faculty->id]);

        return [
            'name' => fake()->words(4, true),
            'short_name' => fake()->words(2, true),
            'faculty_id' => $faculty->id,
            'department_id' => $department->id,
            'vision' => fake()->paragraphs(2, true),
            'mission' => fake()->paragraphs(3, true),
            'description' => fake()->paragraphs(4, true),
        ];
    }
}
