<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    protected $fillable = [
        'nom',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',  // le mot de passe ne sera jamais renvoyé dans les réponses JSON
    ];
}