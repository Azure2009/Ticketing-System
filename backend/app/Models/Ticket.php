<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['title', 'description', 'user_id', 'assigned_to', 'status', 'priority'])]

class Ticket extends Model
{   

    use HasFactory, SoftDeletes;
    
    protected function casts(): array {

        return [

            'deleted_at' => 'datetime'

        ];
    }

    public function creator() {

        return $this->belongsTo(User::class, 'user_id');

    }

    public function assignee() {

        return $this->belongsTo(User::class, 'assigned_to');

    }

}
