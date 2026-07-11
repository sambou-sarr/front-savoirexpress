<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $fillable = [
        'nom', 'prenom', 'email', 'password',
        'telephone', 'region', 'role', 'actif', 'photo_url',
        'matieres', 'tarif_horaire', 'bio',
    ];

    protected $hidden = [
        'password',
    ];
}