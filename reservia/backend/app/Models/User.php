<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'telephone',
        'adresse',
        'ville',
        'code_postal',
        'role',
        'statut',
        'bio',
        'photo_profil',
        'note_moyenne',
        'nombre_avis',
        'accepte_conditions',
        'date_dernier_login',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'date_dernier_login' => 'datetime',
    ];

    public function hebergements()
    {
        return $this->hasMany(Hebergement::class);
    }

    public function evenements()
    {
        return $this->hasMany(Evenement::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }

    public function avis()
    {
        return $this->hasMany(Avis::class);
    }

    public function getNomCompletAttribute()
    {
        return trim("{$this->prenom} {$this->nom}");
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isHost()
    {
        return $this->role === 'host';
    }

    public function isClient()
    {
        return $this->role === 'client';
    }
}
