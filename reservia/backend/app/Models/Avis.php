<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Avis extends Model
{
    use HasFactory;

    protected $table = 'avis';

    protected $fillable = [
        'user_id',
        'hebergement_id',
        'evenement_id',
        'reservation_id',
        'note',
        'titre',
        'commentaire',
        'criteres',
        'recommande',
        'photos',
        'nombre_aideral',
        'statut',
    ];

    protected $casts = [
        'criteres' => 'array',
        'photos' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function hebergement()
    {
        return $this->belongsTo(Hebergement::class);
    }

    public function evenement()
    {
        return $this->belongsTo(Evenement::class);
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function scopeApprouve($query)
    {
        return $query->where('statut', 'approuvé');
    }

    public function scopeEnAttente($query)
    {
        return $query->where('statut', 'en_attente');
    }

    public function scopeRejeté($query)
    {
        return $query->where('statut', 'rejeté');
    }

    public function scopeNote($query, $note)
    {
        return $query->where('note', $note);
    }

    public function scopeRecommande($query)
    {
        return $query->where('recommande', true);
    }

    public function scopeHebergement($query, $hebergement_id)
    {
        return $query->where('hebergement_id', $hebergement_id);
    }

    public function scopeEvenement($query, $evenement_id)
    {
        return $query->where('evenement_id', $evenement_id);
    }

    public function getNoteEnTexte()
    {
        return match($this->note) {
            1 => 'Très mauvais',
            2 => 'Mauvais',
            3 => 'Moyen',
            4 => 'Bon',
            5 => 'Excellent',
            default => 'Non noté',
        };
    }
}
