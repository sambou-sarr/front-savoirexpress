<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Session;

class SessionController extends Controller
{
    // GET /api/sessions — toutes les sessions (admin)
    public function index()
    {
        $sessions = Session::with(['eleve', 'repetiteur'])->latest()->get();
        return response()->json($sessions);
    }

    // GET /api/sessions/eleve/{id} — sessions d'un élève
    public function byEleve($id)
    {
        $sessions = Session::with(['repetiteur'])
            ->where('eleve_id', $id)
            ->latest()
            ->get();
        return response()->json($sessions);
    }

    // GET /api/sessions/repetiteur/{id} — sessions d'un répétiteur
    public function byRepetiteur($id)
    {
        $sessions = Session::with(['eleve'])
            ->where('repetiteur_id', $id)
            ->latest()
            ->get();
        return response()->json($sessions);
    }

    // POST /api/sessions — créer une réservation
    public function store(Request $request)
    {
        $request->validate([
            'eleve_id'      => 'required|exists:users,id',
            'repetiteur_id' => 'required|exists:users,id',
            'matiere'       => 'required|string',
            'date_session'  => 'required|date',
            'duree_heures'  => 'required|integer|min:1',
            'montant'       => 'required|numeric',
        ]);

        $session = Session::create($request->all());
        $session->load(['eleve', 'repetiteur']);

        return response()->json([
            'message' => 'Réservation créée avec succès',
            'data'    => $session,
        ], 201);
    }

    // PUT /api/sessions/{id}/statut — changer le statut
    public function updateStatut(Request $request, $id)
    {
        $session = Session::findOrFail($id);
        $request->validate([
            'statut' => 'required|in:en_attente,accepte,refuse,termine'
        ]);
        $session->update(['statut' => $request->statut]);
        return response()->json(['message' => 'Statut mis à jour', 'data' => $session]);
    }

    // DELETE /api/sessions/{id} — supprimer
    public function destroy($id)
    {
        Session::findOrFail($id)->delete();
        return response()->json(['message' => 'Session supprimée']);
    }
}