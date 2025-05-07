<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{

    public function index()
    {
        return response()->json(Ticket::with('user')->orderBy('created_at', 'desc')->get());
    }


    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high',
            'department_id' => 'required|exists:departments,id',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
        ]);

        $ticket = Ticket::create([
            'title' => $request->title,
            'description' => $request->description,
            'priority' => $request->priority,
            'department_id' => $request->department_id,
            'user_id' => Auth::id(),
            'assigned_to' => $request->assigned_to ?? null,
            'due_date' => $request->due_date ?? null,
        ]);

        return response()->json(['message' => 'Ticket created successfully', 'ticket' => $ticket], 201);
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
