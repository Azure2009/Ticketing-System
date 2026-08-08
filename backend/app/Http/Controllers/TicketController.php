<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TicketController extends Controller
{

    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        
        $user = $request->user();

        $query = Ticket::query()->with('creator', 'assignee');

        if ($user->role === 'requester') {

            $query->where('users_id', $user->id);

        }

        $tickets = $query->get();

        return response()->json($tickets);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([

            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => ['nullable', Rule::in(['low', 'medium', 'high', 'urgent'])],

        ]);

        $ticket = Ticket::create([

            'title' => $validated['title'],
            'description' => $validated['description'],
            'priority' => $validated['priority'] ?? 'medium',
            'user_id' => $request->user()->id,
            'assigned_to' => null,
            'status' => 'open'

        ]);

        return response()->json($ticket, 201);

    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket)
    {   

        $this->authorize('view', $ticket); 

        return response()->json($ticket->load('creator', 'assignee'));
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ticket $ticket)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        //
    }
}
