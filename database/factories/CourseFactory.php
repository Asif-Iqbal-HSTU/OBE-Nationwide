<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'program_id' => \App\Models\Program::factory(),
            'name' => fake()->sentence(3),
            'code' => strtoupper(fake()->lexify('???')).' '.fake()->numberBetween(100, 499),
            'credit_hours' => fake()->randomElement([1, 1.5, 2, 3, 4]),
            'level' => (string) fake()->numberBetween(1, 4),
            'semester' => fake()->randomElement(['I', 'II']),
            'session' => fake()->year().'-'.(fake()->year() + 1),
            'type_theory_sessional' => fake()->randomElement(['Theory', 'Sessional']),
            'type_core_optional' => fake()->randomElement(['Core', 'Optional']),
            'prerequisite' => fake()->word(),
            'summary' => fake()->paragraph(),
        ];
    }
}
