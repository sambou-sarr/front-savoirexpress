<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Repetiteur;

class RepetiteurController extends Controller
{
    // Afficher toutes les demandes
    public function index()
    {
        return response()->json(Repetiteur::all());
    }

    // Enregistrer une demande
    public function store(Request $request)
{
    $request->validate([
        'prenom' => 'required|string',
        'nom' => 'required|string',
        'email' => 'required|email|unique:repetiteurs,email',
        'telephone' => 'required|string',
        'region' => 'required|string',
        'motivations' => 'required|string',
    ]);

    $repetiteur = Repetiteur::create([
        'prenom' => $request->prenom,
        'nom' => $request->nom,
        'date_naissance' => $request->date_naissance,
        'email' => $request->email,
        'telephone' => $request->telephone,
        'region' => $request->region,
        'motivations' => $request->motivations,
        'cv_url' => $request->cv_url,
        'statut' => $request->statut ?? 'confirme',
    ]);

    return response()->json([
        'message' => 'Répétiteur créé avec succès.',
        'data' => $repetiteur
    ], 201);
}

    // Confirmer une demande
    public function confirmer($id)
    {
        $demande = Repetiteur::findOrFail($id);

        $demande->update([
            'statut' => 'confirme',
        ]);

        return response()->json([
            'message' => 'Confirmé',
            'data' => $demande,
        ]);
    }

    // Refuser une demande
    public function refuser($id)
    {
        $demande = Repetiteur::findOrFail($id);

        $demande->update([
            'statut' => 'refuse',
        ]);

        return response()->json([
            'message' => 'Refusé',
            'data' => $demande,
        ]);
    }

    // Supprimer une demande
    public function destroy($id)
    {
        $demande = Repetiteur::findOrFail($id);

        $demande->delete();

        return response()->json([
            'message' => 'Supprimé',
        ]);
    }
}