<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Ticket;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class CommentController extends Controller
{

    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Ticket $ticket)
    {
        
        $this->authorize('view', $ticket); // Kung pwede niya ma view yung specific ticket na yun, then pwede niya rin ma view yung comments.

        $query = Comment::query()->with('creator', 'ticket');

        $query->where('ticket_id', $ticket->id);

        $comments = $query->get();

        return response()->json($comments);

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
    public function store(Request $request, Ticket $ticket)
    {
        $this->authorize('view', $ticket); // Kung pwede ma view yung ticket, pwedeng mag post ng comment

        $validated = $request->validate([

            'body' => 'required|string'

        ]);

        $comment = Comment::create([

            'user_id' => $request->user()->id,
            'ticket_id' => $ticket->id,
            'body' => $validated['body']

        ]);

        return response()->json($comment, 201);

    }

    /**
     * Display the specified resource.
     */
    public function show(Comment $comment)
    {
        return response()->json($comment->load('creator', 'ticket'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Comment $comment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Comment $comment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        //
    }
}
