<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    protected $fillable = [
        'eleve_id',
        'repetiteur_id',
        'matiere',
        'date_session',
        'duree_heures',
        'montant',
        'statut',
        'notes',
    ];

    // Relation avec l'élève
    public function eleve()
    {
        return $this->belongsTo(User::class, 'eleve_id');
    }

    // Relation avec le répétiteur
    public function repetiteur()
    {
        return $this->belongsTo(User::class, 'repetiteur_id');
    }
}