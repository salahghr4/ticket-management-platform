<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TicketPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine whether the user can update the ticket.
     */
    public function update(User $user, Ticket $ticket): Response
    {
        return ($user->isAdmin() || $user->department_id === $ticket->department_id)
            ? Response::allow()
            : Response::deny('you are not allowed to update this ticket');
    }

    /**
     * Determine whether the user can delete the ticket.
     */
    public function delete(User $user, Ticket $ticket): Response
    {
        return ($user->isAdmin() || $user->department_id === $ticket->department_id)
            ? Response::allow()
            : Response::deny('you are not allowed to delete this ticket');
    }
}
