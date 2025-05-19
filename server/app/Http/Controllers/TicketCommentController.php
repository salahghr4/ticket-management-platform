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
        $comments = $ticket->comments()
            ->with(['user:id,name'])
            ->whereNull('parent_id')
            ->latest()
            ->withCount('replies')
            ->get();
        return response()->json($comments);
    }

    public function getReplies(Ticket $ticket, TicketComment $comment)
    {
        // Get all replies for a specific comment
        $replies = $comment->replies()
            ->with(['user:id,name'])
            ->get();
        return response()->json($replies);
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

        // Ensure parent_id belongs to the same ticket
        if ($validated['parent_id']) {
            $parentComment = TicketComment::findOrFail($validated['parent_id']);
            if ($parentComment->ticket_id !== $ticket->id) {
                return response()->json([
                    'message' => 'Parent comment does not belong to this ticket',
                    'success' => false
                ], 422);
            }
        }

        $validated['ticket_id'] = $ticket->id;
        $validated['user_id'] = Auth::user()->id;
        $comment = TicketComment::create($validated);

        // Load the user relationship for the response
        $comment->load('user:id,name');

        return response()->json([
            'message' => 'Comment created successfully',
            'comment' => $comment,
            'success' => true
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket, TicketComment $comment)
    {
        Gate::authorize('update', $comment);

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $comment->update($validated);
        $comment->load('user:id,name');

        return response()->json([
            'message' => 'Comment updated successfully',
            'comment' => $comment,
            'success' => true
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket, TicketComment $comment)
    {
        Gate::authorize('delete', $comment);

        // // If it's a parent comment, delete all replies first
        // if ($comment->replies()->exists()) {
        //     $comment->replies()->delete();
        // }

        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted successfully',
            'success' => true
        ]);
    }
}
