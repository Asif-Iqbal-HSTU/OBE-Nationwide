<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PEO>
 */
class PEOFactory extends Factory
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
            'peo_no' => $this->faker->unique()->numberBetween(1, 10),
            'peo_name' => $this->faker->sentence(),
        ];
    }
}
