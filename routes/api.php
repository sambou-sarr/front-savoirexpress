<?php

use App\Http\Controllers\Admin\AdminController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RepetiteurController;
use App\Http\Controllers\AuthController as ControllersAuthController;

// =======================
// TEST API
// =======================
Route::get('/bonjour', function () {
    return response()->json([
        'message' => 'Bonjour depuis SavoirExpress API !',
    ]);
});


// =======================
// AUTH
// =======================
Route::post('/register', [ControllersAuthController::class, 'register']);

Route::post('/login', [ControllersAuthController::class, 'login']);

// =======================
// USER - DEMANDES RÉPÉTITEUR (PUBLIC)
// =======================

// créer une demande
Route::post('/demandes-repetiteur', [RepetiteurController::class, 'store']);

// lire toutes les demandes (si besoin public)
Route::get('/demandes-repetiteur', [RepetiteurController::class, 'index']);

Route::get('/demandes-repetiteur/{id}', [RepetiteurController::class, 'show']);


// =======================
// ADMIN (PROTÉGÉ SANCTUM + ROLE ADMIN)Route::middleware(['auth:sanctum', 'is_admin'])
   // ->prefix('admin')
   // ->group(function () {
// =======================

Route::post('/repetiteurs', [AdminController::class, 'store']);
        Route::get('/repetiteurs', [AdminController::class, 'index']);
        Route::get('/repetiteurs/{id}', [AdminController::class, 'show']);

        Route::put('/repetiteurs/{id}', [AdminController::class, 'update']);

        Route::delete('/repetiteurs/{id}', [AdminController::class, 'destroy']);

        // actions métier
        Route::put('/repetiteurs/{id}/confirmer', [AdminController::class, 'confirmer']);
        Route::put('/repetiteurs/{id}/refuser', [AdminController::class, 'refuser']);