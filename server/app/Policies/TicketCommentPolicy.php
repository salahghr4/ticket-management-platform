<?php

namespace App\Policies;

use Illuminate\Auth\Access\Response;
use App\Models\TicketComment;
use App\Models\Ticket;
use App\Models\User;

class TicketCommentPolicy
{

    public function before(User $user, $ability)
    {
        if ($user->isAdmin()) {
            return true;
        }
        return null;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Ticket $ticket): Response
    {
        return ($user->department_id === $ticket->department_id)
            ? Response::allow()
            : Response::deny('You are not allowed to create comments for this ticket');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, TicketComment $ticketComment): Response
    {
        return ($user->id === $ticketComment->user_id)
            ? Response::allow()
            : Response::deny('You are not allowed to update this comment');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, TicketComment $ticketComment): Response
    {
        return ($user->id === $ticketComment->user_id)
            ? Response::allow()
            : Response::deny('You are not allowed to delete this comment');
    }

}
