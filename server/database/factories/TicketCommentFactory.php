<?php

namespace Database\Factories;

use App\Models\Ticket;
use App\Models\TicketComment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TicketComment>
 */
class TicketCommentFactory extends Factory
{
    protected $model = TicketComment::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $ticket = Ticket::inRandomOrder()->first() ?? Ticket::factory();
        $user = User::inRandomOrder()->where('department_id', $ticket->department_id)->first() ?? User::factory()->create(['department_id' => $ticket->department_id]);

        // Get existing comments for this ticket
        $existingComments = $ticket->comments()->get();

        // Randomly decide if this should be a reply (70% chance of being a top-level comment)
        $parentId = $existingComments->isNotEmpty() && fake()->boolean(80)
            ? $existingComments->toArray()[fake()->numberBetween(0, $existingComments->count() - 1)]['id']
            : null;

        return [
            'content' => fake()->sentence(5),
            'user_id' => $user->id,
            'ticket_id' => $ticket->id,
            'parent_id' => $parentId,
            'created_at' => fake()->dateTimeBetween($ticket->created_at, 'now'),
        ];
    }
}
