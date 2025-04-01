<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ticket>
 */
class TicketFactory extends Factory
{
    protected $model = Ticket::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['pending', 'in_progress', 'resolved', 'rejected']),
            'priority' => $this->faker->randomElement(['low', 'medium', 'high']),
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'department_id' => Department::inRandomOrder()->first()->id ?? Department::factory(),
            'assigned_to' => User::inRandomOrder()->first()->id ?? User::factory(),
            'due_date' => $this->faker->dateTimeBetween('now', '+1 month'),
        ];
    }
}
