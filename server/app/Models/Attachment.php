<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'file_url',
        'file_type',
        'file_name',
        'file_size',
        'public_id'
    ];

    protected $hidden = [
        'public_id',
    ];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }
}
