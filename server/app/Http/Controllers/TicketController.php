<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\Attachment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Gate;

class TicketController extends Controller
{

    public function index()
    {
        return response()->json([
            'success' => true,
            'tickets' => Ticket::with('user:id,name,email', 'assignee:id,name,email', 'department:id,name')
                ->orderBy('created_at', 'desc')
                ->get()
        ]);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high',
            'department_id' => 'required|exists:departments,id',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
            'status' => 'nullable|in:open,in progress,resolved,rejected,closed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create ticket',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();
        $validated['user_id'] = $request->user()->id;

        $ticket = Ticket::create($validated);
        return response()->json([
            'success' => true,
            'message' => 'Ticket created successfully',
            'ticket' => $ticket->load(['user:id,name,email', 'assignee:id,name,email', 'department:id,name'])
        ]);
    }

    public function update(Request $request, string $id)
    {
        $ticket = Ticket::find($id);

        if (!$ticket) {
            return response()->json([
                'success' => false,
                'message' => 'Ticket not found'
            ], 404);
        }

        Gate::authorize('update', $ticket);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high',
            'department_id' => 'required|exists:departments,id',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
            'status' => 'required|in:open,in progress,resolved,rejected,closed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update ticket',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        $data['updated_by'] = $request->user()->id;

        $ticket->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Ticket updated successfully',
            'ticket' => $ticket->load(['user:id,name,email', 'assignee:id,name,email', 'department:id,name'])
        ]);
    }

    public function destroy(string $id)
    {
        $ticket = Ticket::find($id);

        Gate::authorize('delete', $ticket);

        if (!$ticket) {
            return response()->json([
                'success' => false,
                'message' => 'Ticket not found'
            ], 404);
        }

        $ticket->delete();

        return response()->json(['success' => true, 'message' => 'Ticket deleted successfully']);
    }

    public function show(string $id)
    {
        $ticket = Ticket::find($id);

        if (!$ticket) {
            return response()->json([
                'success' => false,
                'message' => 'Ticket not found'
            ], 404);
        }

        $ticket->load([
            'user:id,name,email',
            'assignee:id,name,email',
            'department:id,name',
            'history' => function ($query) {
                $query->with(['user:id,name,email'])
                    ->orderBy('id', 'desc');
            }
        ]);

        return response()->json(['success' => true, 'ticket' => $ticket]);
    }

    public function assigned()
    {
        $userId = Auth::user()->id;

        $tickets = Ticket::where('assigned_to', $userId)
            ->with(['user:id,name,email', 'assignee:id,name,email', 'department:id,name'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'tickets' => $tickets
        ]);
    }

    public function created()
    {
        $userId = Auth::user()->id;

        $tickets = Ticket::where('user_id', $userId)
            ->with(['user:id,name,email', 'assignee:id,name,email', 'department:id,name'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'tickets' => $tickets
        ]);
    }

    public function stats()
    {
        $openTickets = Ticket::where('status', 'open')->count();
        $inProgressTickets = Ticket::where('status', 'in progress')->count();
        $resolvedTickets = Ticket::where('status', 'resolved')->count();
        $rejectedTickets = Ticket::where('status', 'rejected')->count();
        $closedTickets = Ticket::where('status', 'closed')->count();

        // get the how many ticket created every day for the last 3 months
        $ticketCounts = Ticket::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', now()->subMonths(3))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return response()->json([
            'totalTickets' => Ticket::count(),
            'openTickets' => $openTickets,
            'inProgressTickets' => $inProgressTickets,
            'resolvedTickets' => $resolvedTickets,
            'rejectedTickets' => $rejectedTickets,
            'closedTickets' => $closedTickets,
            'ticketCounts' => $ticketCounts,
            'highestPriority' => Ticket::where('priority', 'high')->count(),
            'mediumPriority' => Ticket::where('priority', 'medium')->count(),
            'lowPriority' => Ticket::where('priority', 'low')->count(),
            'tickets' => Ticket::with(['user:id,name,email', 'assignee:id,name,email', 'department:id,name'])->latest()->limit(8)->get()
        ]);
    }
}
