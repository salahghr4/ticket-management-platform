<?php

namespace App\Http\Controllers;

use App\Models\TicketComment;
use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
class TicketCommentController extends Controller
{
    public function index(Ticket $ticket)
    {
        // Get all comments for the ticket, including replies ordered by created_at only for the top level comments
        $comments = $ticket->comments()->with(['user:id,name'])->whereNull('parent_id')->latest()->withCount('replies')->get();
        return response()->json($comments);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Ticket $ticket, Request $request)
    {
        Gate::authorize('create', $ticket);

        $validated = $request->validate([
            'content' => 'required|string',
            'parent_id' => 'nullable|exists:ticket_comments,id',
        ]);
        $validated['ticket_id'] = $ticket->id;
        $validated['user_id'] = Auth::user()->id;
        $comment = TicketComment::create($validated);
        return response()->json(['message' => 'Comment created successfully', 'comment' => $comment, 'success' => true]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket, TicketComment $comment)
    {
        Gate::authorize('update', $comment);

        $validated = $request->validate([
            'content' => 'required|string',
            'parent_id' => 'nullable|exists:ticket_comments,id',
        ]);
        $comment->update($validated);
        return response()->json(['message' => 'Comment updated successfully', 'comment' => $comment, 'success' => true]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket, TicketComment $comment)
    {
        Gate::authorize('delete', $comment);

        $comment->delete();
        return response()->json(['message' => 'Comment deleted successfully', 'success' => true]);
    }
}
