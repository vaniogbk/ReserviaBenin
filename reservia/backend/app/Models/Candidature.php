<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidature extends Model
{
    protected $fillable = [
        'nom_etablissement',
        'prenom_responsable',
        'nom_responsable',
        'email',
        'telephone',
        'ville',
        'type_activite',
        'message',
        'statut',
        'notes_admin',
    ];
}
