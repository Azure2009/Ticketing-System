<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TicketController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {

    return $request->user();

})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::post('/create-ticket', [TicketController::class, 'store'])->middleware('auth:sanctum');
Route::get('/tickets', [TicketController::class, 'index'])->middleware('auth:sanctum'); // list of tickets
Route::get('/tickets/{ticket}', [TicketController::class, 'show'])->middleware('auth:sanctum');// show detail of specific ticket
Route::patch('/tickets/{ticket}/update', [TicketController::class, 'update'])->middleware('auth:sanctum');// update particular ticket