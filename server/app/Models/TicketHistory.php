<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TicketHistory extends Model
{
    use HasFactory;

    protected $table = 'ticket_history';

    protected $fillable = [
        'ticket_id',
        'user_id',
        'action_type',
        'field_name',
        'old_value',
        'new_value',
        'description'
    ];

    protected $appends = [
        'formatted_old_value',
        'formatted_new_value'
    ];

    /**
     * Get the ticket that owns the history.
     */
    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    /**
     * Get the user that made the change.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the formatted old value based on field type
     */
    public function getFormattedOldValueAttribute()
    {
        return $this->formatValue($this->old_value);
    }

    /**
     * Get the formatted new value based on field type
     */
    public function getFormattedNewValueAttribute()
    {
        return $this->formatValue($this->new_value);
    }

    /**
     * Format the value based on field type
     */
    protected function formatValue($value)
    {
        if ($value === null) {
            return 'None';
        }

        switch ($this->field_name) {
            case 'status':
                return ucfirst($value);
            case 'priority':
                return ucfirst($value);
            case 'assigned_to':
                if ($value) {
                    $user = User::find($value);
                    return $user ? $user->name : 'Unknown User';
                }
                return 'Unassigned';
            case 'department_id':
                if ($value) {
                    $department = Department::find($value);
                    return $department ? $department->name : 'Unknown Department';
                }
                return 'No Department';
            case 'due_date':
                return $value ? date('M d, Y', strtotime($value)) : 'No due date';
            default:
                return $value;
        }
    }
}
