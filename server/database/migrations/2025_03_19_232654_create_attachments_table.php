<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained()->onDelete('cascade');
            $table->string('file_url');
            $table->string('file_type');
            $table->string('file_name');
            $table->unsignedBigInteger('file_size');
            $table->string('public_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attachments');
    }
};
