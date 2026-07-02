<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\DemandeRepetiteur;

// Route de test
Route::get('/bonjour', function () {
    return response()->json([
        'message' => 'Bonjour depuis SavoirExpress API !',
    ]);
});

// Route POST — recevoir et enregistrer une demande répétiteur
Route::post('/demandes-repetiteur', function (Request $request) {

    // 1. Valider les données reçues
    $request->validate([
        'prenom'      => 'required|string',
        'nom'         => 'required|string',
        'email'       => 'required|email|unique:demande_repetiteurs',
        'region'      => 'required|string',
        'motivations' => 'required|string',
    ]);

    // 2. Enregistrer en base de données
    $demande = DemandeRepetiteur::create($request->all());

    // 3. Répondre à React
    return response()->json([
        'message' => 'Demande enregistrée avec succès !',
        'data'    => $demande,
    ], 201);
});

Route::get('/demandes-repetiteur', function () {
    return response()->json(\App\Models\DemandeRepetiteur::all());
});

// Confirmer
Route::put('/demandes-repetiteur/{id}/confirmer', function ($id) {
    $demande = \App\Models\DemandeRepetiteur::findOrFail($id);
    $demande->update(['statut' => 'confirme']);
    return response()->json(['message' => 'Confirmé', 'data' => $demande]);
});

// Refuser
Route::put('/demandes-repetiteur/{id}/refuser', function ($id) {
    $demande = \App\Models\DemandeRepetiteur::findOrFail($id);
    $demande->update(['statut' => 'refuse']);
    return response()->json(['message' => 'Refusé', 'data' => $demande]);
});

// Supprimer
Route::delete('/demandes-repetiteur/{id}', function ($id) {
    $demande = \App\Models\DemandeRepetiteur::findOrFail($id);
    $demande->delete();
    return response()->json(['message' => 'Supprimé']);
});