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
            'department_id' => 'required|exists:departments,id'
        ]);

        $ticket = Ticket::create([
            'title' => $request->title,
            'description' => $request->description,
            'priority' => $request->priority,
            'department_id' => $request->department_id,
            'user_id' => Auth::id(),
        ]);

        return response()->json(['message' => 'Ticket created successfully', 'ticket' => $ticket], 201);
    }
}
