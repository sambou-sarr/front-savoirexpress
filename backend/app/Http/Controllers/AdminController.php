<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function login(Request $request)
    {
        // 1. Valider les données reçues
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // 2. Chercher l'admin par email
        $admin = Admin::where('email', $request->email)->first();

        // 3. Vérifier si l'admin existe et si le mot de passe est correct
        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect.'
            ], 401);
        }

        // 4. Répondre avec les infos de l'admin
        return response()->json([
            'message' => 'Connexion réussie',
            'admin'   => [
                'id'    => $admin->id,
                'nom'   => $admin->nom,
                'email' => $admin->email,
            ]
        ]);
    }
}