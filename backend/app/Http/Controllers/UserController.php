<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // GET /api/users — lister tous les utilisateurs
    public function index()
    {
        return response()->json(User::all());
    }

    // POST /api/users — créer un utilisateur
    public function store(Request $request)
    {
        $request->validate([
            'nom'       => 'required|string',
            'prenom'    => 'required|string',
            'email'     => 'required|email|unique:users',
            'password'  => 'required|string|min:6',
            'role'      => 'required|in:eleve,repetiteur',
        ]);

        $user = User::create([
            'nom'       => $request->nom,
            'prenom'    => $request->prenom,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'telephone' => $request->telephone,
            'region'    => $request->region,
            'role'      => $request->role,
        ]);

        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'data'    => $user,
        ], 201);
    }

    // PUT /api/users/{id} — modifier un utilisateur
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->except('password'));
        return response()->json(['message' => 'Modifié', 'data' => $user]);
    }

    // PUT /api/users/{id}/toggle — activer/désactiver
    public function toggle($id)
    {
        $user = User::findOrFail($id);
        $user->update(['actif' => !$user->actif]);
        return response()->json(['message' => 'Statut modifié', 'data' => $user]);
    }

    // DELETE /api/users/{id} — supprimer
    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'Supprimé']);
    }

    // POST /api/users/login
public function login(Request $request)
{
    $request->validate([
        'email'    => 'required|email',
        'password' => 'required|string',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Email ou mot de passe incorrect.'
        ], 401);
    }

    if (!$user->actif) {
        return response()->json([
            'message' => 'Votre compte est désactivé. Contactez l\'administrateur.'
        ], 403);
    }

    return response()->json([
        'message' => 'Connexion réussie',
        'user'    => [
            'id'       => $user->id,
            'nom'      => $user->nom,
            'prenom'   => $user->prenom,
            'email'    => $user->email,
            'role'     => $user->role,
            'region'   => $user->region,
            'telephone'=> $user->telephone,
            'photo_url'=> $user->photo_url,
        ]
    ]);
}

// GET /api/users/repetiteurs — liste des répétiteurs actifs
public function repetiteurs()
{
    $repetiteurs = User::where('role', 'repetiteur')
        ->where('actif', true)
        ->get();
    return response()->json($repetiteurs);
}
}