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
        $status = $request->query('status'); // retrieve ng value sa query parameter kung meron man
        
        $user = $request->user(); // identify kung sino yung user na gumagawa ng request

        $query = Ticket::query()->with('creator', 'assignee'); // Gawa tayo ng request sa ticket table pero wag muna i-run. Tsaka make sure na isama na yung mga records sa user table (creator and assignee) na related sa i ququery natin, kesa hiwalay pa na query.

        if ($user->role === 'requester') { // Kung requester siya, mag chain tayo ng where clause condition sa query object natin. Magiging "query->with->where" na siya

            $query->where('user_id', $user->id);

        }

        if ($status) {

            $query->where('status', $status);

        } // Kung may query parameter na sinend, chain ulit ng panibagong condition sa query object.

            

        $tickets = $query->get(); // run na yung query. Since nag chaining tayo, Depende sa mga previous na nangyare kung ano i rereturn ng query object na ito.

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

        $this->authorize('update', $ticket); //since my policy tayo para sa ticket, dapat icheck palagi muna kung authorize ba tong user na to gawin tong bagay na ito.

        $validated = $request->validate([

            'status' => ['nullable', Rule::in(['open', 'in_progress', 'resolved', 'closed'])],
            'priority' => ['nullable', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'assignee_id' => ['nullable', Rule::exists('users', 'id')]

        ]);

        $ticket->update([

            'status' => $validated['status'] ?? $ticket->status, // make sure previous value sila babalik (hindi default value) sa mga input fields na hindi inedit ng user.
            'priority' => $validated['priority'] ?? $ticket->priority,
            'assigned_to' => $validated['assignee_id'] ?? $ticket->assigned_to

        ]);

        return response()->json($ticket->load('creator', 'assignee')); // Note: Ang na-update lang ay yung status, priority, at assigned_to column ng tickets table, hindi kasama yung connected na assignee na nasa users table
        //so kailangan gumamit ng load function(eager loading ata tawag) para ma refetch yung bagong naka assign para sa ticket na yun. Dinagdag ko na rin yung creator for safety

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {

        $this->authorize('delete', $ticket); // wag kalimutan i-check kung authorize ba mag delete yung user na ito.

        $ticket->delete(); // delete yung ticket

        return response()->json(['message' => 'Ticket successfully deleted.']); // Let the user know na deleted na yung ticket

    }
}
