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
        $department = Department::inRandomOrder()->first() ?? Department::factory();
        $assigned_to = User::inRandomOrder()->where('department_id', $department->id)->first() ?? User::factory()->create(['department_id' => $department->id]);
        $user = User::inRandomOrder()->where('department_id', $department->id)->first() ?? User::factory()->create(['department_id' => $department->id]);
        return [
            'title' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['open', 'in progress', 'resolved', 'closed', 'rejected']),
            'priority' => $this->faker->randomElement(['low', 'medium', 'high']),
            'user_id' => $user->id,
            'department_id' => $department->id,
            'assigned_to' => $assigned_to->id,
            'due_date' => $this->faker->dateTimeBetween('now', '+1 month'),
            'created_at' => $this->faker->dateTimeBetween('-2 months', 'now'),
        ];
    }
}
