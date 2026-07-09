<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        // Vérifie si utilisateur connecté
        if (!$request->user()) {
            return response()->json([
                'message' => 'Non authentifié'
            ], 401);
        }

        // Vérifie si admin
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Accès refusé : admin seulement'
            ], 403);
        }

        return $next($request);
    }
}