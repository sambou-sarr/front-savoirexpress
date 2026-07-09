<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Repetiteur extends Model
{
    // Les colonnes que Laravel a le droit de remplir
    protected $fillable = [
        'prenom',
        'nom',
        'date_naissance',
        'email',
        'telephone',
        'region',
        'motivations',
        'cv_url',
        'statut',   
    ];
}