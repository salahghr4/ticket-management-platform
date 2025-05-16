<?php

namespace Database\Seeders;

use App\Models\TicketComment;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TicketCommentReplySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $comments = TicketComment::all();
        foreach ($comments as $comment) {
            if ($comment->parent_id === null) {
                TicketComment::factory()->create([
                    'parent_id' => $comment->id,
                    'ticket_id' => $comment->ticket_id,
                    'user_id' => User::where('department_id', $comment->ticket->department_id)->inRandomOrder()->first()->id,
                    'content' => fake()->sentence(5),
                ]);
            }
        }
    }
}
