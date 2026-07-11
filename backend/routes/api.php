<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DemandeRepetiteurController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SessionController;

// ── Demandes répétiteurs ──
Route::get('/demandes-repetiteur',                [DemandeRepetiteurController::class, 'index']);
Route::post('/demandes-repetiteur',               [DemandeRepetiteurController::class, 'store']);
Route::put('/demandes-repetiteur/{id}/confirmer', [DemandeRepetiteurController::class, 'confirmer']);
Route::put('/demandes-repetiteur/{id}/refuser',   [DemandeRepetiteurController::class, 'refuser']);
Route::delete('/demandes-repetiteur/{id}',        [DemandeRepetiteurController::class, 'destroy']);

// ── Admin ──
Route::post('/admin/login', [AdminController::class, 'login']);

// ── Utilisateurs ──
Route::post('/users/login',      [UserController::class, 'login']);
Route::get('/users',             [UserController::class, 'index']);
Route::get('/users/repetiteurs', [UserController::class, 'repetiteurs']);
Route::post('/users',            [UserController::class, 'store']);
Route::put('/users/{id}',        [UserController::class, 'update']);
Route::put('/users/{id}/toggle', [UserController::class, 'toggle']);
Route::delete('/users/{id}',     [UserController::class, 'destroy']);

// ── Sessions ──
Route::get('/sessions',                      [SessionController::class, 'index']);
Route::post('/sessions',                     [SessionController::class, 'store']);
Route::get('/sessions/eleve/{id}',           [SessionController::class, 'byEleve']);
Route::get('/sessions/repetiteur/{id}',      [SessionController::class, 'byRepetiteur']);
Route::put('/sessions/{id}/statut',          [SessionController::class, 'updateStatut']);
Route::delete('/sessions/{id}',              [SessionController::class, 'destroy']);