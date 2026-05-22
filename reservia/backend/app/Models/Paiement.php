<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'user_id',
        'reference_paiement',
        'provider',
        'transaction_id',
        'statut',
        'methode',
        'montant',
        'devise',
        'fedapay_response',
        'fedapay_charge_id',
        'date_webhook',
        'signature_webhook',
        'description',
        'motif_echec',
        'date_tentative',
        'date_succes',
        'date_remboursement',
        'metadata',
    ];

    protected $casts = [
        'fedapay_response' => 'array',
        'metadata' => 'array',
        'date_webhook' => 'datetime',
        'date_tentative' => 'datetime',
        'date_succes' => 'datetime',
        'date_remboursement' => 'datetime',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeSucces($query)
    {
        return $query->where('statut', 'succes');
    }

    public function scopeEchec($query)
    {
        return $query->where('statut', 'echec');
    }

    public function scopeEnAttente($query)
    {
        return $query->where('statut', 'en_attente');
    }

    public function scopeRemboursee($query)
    {
        return $query->where('statut', 'remboursé');
    }

    public function scopeParProvider($query, $provider)
    {
        return $query->where('provider', $provider);
    }

    public function scopeParUtilisateur($query, $user_id)
    {
        return $query->where('user_id', $user_id);
    }

    public function estSuccessful()
    {
        return $this->statut === 'succes';
    }

    public function estEchouee()
    {
        return $this->statut === 'echec';
    }

    public function estRemboursee()
    {
        return $this->statut === 'remboursé';
    }
}
