<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Repetiteur;


class AdminController extends Controller
{
 public function index()
    {
        return response()->json(Repetiteur::all());
    }

    public function show($id)
    {
        return response()->json(Repetiteur::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $repetiteur = Repetiteur::findOrFail($id);
        $repetiteur->update($request->all());

        return response()->json([
            'message' => 'Mis à jour avec succès',
            'data' => $repetiteur
        ]);
    }

    public function destroy($id)
    {
        $repetiteur = Repetiteur::findOrFail($id);
        $repetiteur->delete();

        return response()->json([
            'message' => 'Supprimé avec succès'
        ]);
    }
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

}
