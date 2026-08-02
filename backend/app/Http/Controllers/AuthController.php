<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Psy\Readline\Hoa\Console;

class AuthController extends Controller
{
    public function register(Request $request) {

        $request -> validate([

            'name' => 'required|string|max:255',
            'email' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed'

        ]);

        $user = User::create([

            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password

        ]);

        Auth::login($user);

        return response()->json($user);
        
    }

    public function login(Request $request) {

        $request->validate([

            'email' => 'required|email',
            'password' => 'required|string'

        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user|| !Hash::check($request->password, $user->password)) {

            throw ValidationException::withMessages([

                'email' => ['The provided credential is incorrect.']

            ]);

        }

        Auth::login($user);

        $request->session()->regenerate();
        return response()->json($user);

    }

    public function logout(Request $request) {

        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->json(['message' =>'Successfully logged out.']);

    } 

}
