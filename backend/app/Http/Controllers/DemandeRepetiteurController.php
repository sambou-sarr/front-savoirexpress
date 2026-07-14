<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DemandeRepetiteur;

class DemandeRepetiteurController extends Controller
{
    // GET /api/demandes-repetiteur — lister toutes les demandes
    public function index()
    {
        return response()->json(DemandeRepetiteur::all());
    }

    // POST /api/demandes-repetiteur — créer une demande
    public function store(Request $request)
    {
        $request->validate([
            'prenom'      => 'required|string',
            'nom'         => 'required|string',
            'email'       => 'required|email|unique:demande_repetiteurs',
            'region'      => 'required|string',
            'motivations' => 'required|string',
        ]);

        $demande = DemandeRepetiteur::create($request->all());

        return response()->json([
            'message' => 'Demande enregistrée avec succès !',
            'data'    => $demande,
        ], 201);
    }

    // PUT /api/demandes-repetiteur/{id}/confirmer
    public function confirmer($id)
{
    $demande = DemandeRepetiteur::findOrFail($id);
    $demande->update(['statut' => 'confirme']);

    // Vérifier si un compte existe déjà avec cet email
    $existingUser = \App\Models\User::where('email', $demande->email)->first();

    if (!$existingUser) {
        // Créer automatiquement le compte répétiteur
        \App\Models\User::create([
            'prenom'    => $demande->prenom,
            'nom'       => $demande->nom,
            'email'     => $demande->email,
            'telephone' => $demande->telephone,
            'password'  => \Illuminate\Support\Facades\Hash::make('savoirexpress123'),
            'role'      => 'repetiteur',
            'actif'     => true,
        ]);
    }

    return response()->json([
        'message' => 'Demande confirmée et compte créé',
        'data'    => $demande
    ]);
}

    // PUT /api/demandes-repetiteur/{id}/refuser
    public function refuser($id)
    {
        $demande = DemandeRepetiteur::findOrFail($id);
        $demande->update(['statut' => 'refuse']);
        return response()->json(['message' => 'Refusé', 'data' => $demande]);
    }

    // DELETE /api/demandes-repetiteur/{id}
    public function destroy($id)
    {
        $demande = DemandeRepetiteur::findOrFail($id);
        $demande->delete();
        return response()->json(['message' => 'Supprimé']);
    }
}