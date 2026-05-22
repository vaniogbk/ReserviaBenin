<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'hebergement_id',
        'evenement_id',
        'numero_reservation',
        'type',
        'statut',
        'date_debut',
        'date_fin',
        'nombre_nuits',
        'nombre_guests',
        'nombre_places',
        'date_evenement',
        'prix_unitaire',
        'prix_total',
        'montant_reduction',
        'pourcentage_reduction',
        'statut_paiement',
        'notes_particulieres',
        'motif_annulation',
        'politique_annulation',
        'remboursement_possible',
        'taux_remboursement',
        'date_demande_annulation',
        'date_annulation',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        'date_evenement' => 'datetime',
        'date_demande_annulation' => 'datetime',
        'date_annulation' => 'datetime',
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

    public function paiement()
    {
        return $this->hasOne(Paiement::class);
    }

    public function avis()
    {
        return $this->hasOne(Avis::class);
    }

    public function scopeConfirmee($query)
    {
        return $query->where('statut', 'confirmée');
    }

    public function scopePayee($query)
    {
        return $query->where('statut_paiement', 'payé');
    }

    public function scopeEnAttente($query)
    {
        return $query->where('statut', 'en_attente');
    }

    public function scopeAnnulee($query)
    {
        return $query->where('statut', 'annulée');
    }

    public function scopeParUtilisateur($query, $user_id)
    {
        return $query->where('user_id', $user_id);
    }

    public function peutEtreAnnulee()
    {
        return $this->statut !== 'annulée' && $this->statut !== 'remboursée';
    }

    public function calculRemboursement()
    {
        return $this->prix_total * $this->taux_remboursement;
    }

    public function genererNumeroReservation()
    {
        return 'RES-' . date('Ymd') . '-' . uniqid();
    }
}
