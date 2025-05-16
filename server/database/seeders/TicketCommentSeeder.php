<?php

namespace Database\Seeders;

use App\Models\TicketComment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TicketCommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TicketComment::factory()->count(100)->create();
    }
}
