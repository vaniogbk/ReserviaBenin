<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Hebergement extends Model
{
    use HasFactory;

    // Expose automatiquement les URLs dans les réponses JSON
    protected $appends = ['image_principale_url', 'autres_images_urls'];

    protected $fillable = [
        'user_id',
        'titre',
        'description',
        'type',
        'categorie',
        'nombre_pieces',
        'nombre_lits',
        'nombre_salles_bain',
        'capacite_max',
        'prix_par_nuit',
        'prix_max',
        'adresse',
        'ville',
        'code_postal',
        'latitude',
        'longitude',
        'statut',
        'image_principale',
        'autres_images',
        'amenagements',
        'regles_maison',
        'note_moyenne',
        'nombre_avis',
        'nombre_reservations',
        'date_verification',
    ];

    protected $casts = [
        'autres_images' => 'array',
        'amenagements' => 'array',
        'regles_maison' => 'array',
        'date_verification' => 'datetime',
    ];

    // ------------------------------------------------------------------
    //  Accesseurs images : retournent toujours des URLs publiques
    // ------------------------------------------------------------------

    public function getImagePrincipaleUrlAttribute(): ?string
    {
        $chemin = $this->image_principale;
        if (!$chemin) return null;
        if (str_starts_with($chemin, 'http')) return $chemin;
        return Storage::disk('public')->url($chemin);
    }

    public function getAutresImagesUrlsAttribute(): array
    {
        return collect($this->autres_images ?? [])
            ->map(function ($chemin) {
                if (str_starts_with($chemin, 'http')) return $chemin;
                return Storage::disk('public')->url($chemin);
            })
            ->values()
            ->all();
    }

    // Toutes les images (principale + autres) dans un seul tableau d'URLs
    public function toutesLesImages(): array
    {
        $toutes = [];
        if ($url = $this->image_principale_url) $toutes[] = $url;
        return array_merge($toutes, $this->autres_images_urls);
    }

    // ------------------------------------------------------------------

    public function chambres()
    {
        return $this->hasMany(Chambre::class)->where('actif', true)->orderBy('prix_par_nuit');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function avis()
    {
        return $this->hasMany(Avis::class);
    }

    public function scopeActif($query)
    {
        return $query->where('statut', 'actif');
    }

    public function scopeParVille($query, $ville)
    {
        return $query->where('ville', $ville);
    }

    public function scopePrixEntre($query, $min, $max)
    {
        return $query->whereBetween('prix_par_nuit', [$min, $max]);
    }

    public function scopeReserve($query, $date_debut, $date_fin)
    {
        return $query->where(function($q) use ($date_debut, $date_fin) {
            $q->whereHas('reservations', function($subquery) use ($date_debut, $date_fin) {
                $subquery->where('statut', '!=', 'annulée')
                    ->where('date_debut', '<', $date_fin)
                    ->where('date_fin', '>', $date_debut);
            });
        });
    }
}
