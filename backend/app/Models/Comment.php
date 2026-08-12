<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;


#[Fillable(['user_id', 'ticket_id', 'body'])]

class Comment extends Model
{
    use HasFactory;

    public function creator() {

        return $this->belongsTo(User::class, 'user_id');

    }

    public function ticket() {

        return $this->belongsTo(Ticket::class, 'ticket_id');

    }


}
