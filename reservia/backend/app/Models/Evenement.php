<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Evenement extends Model
{
    use HasFactory;

    protected $appends = ['image_principale_url', 'autres_images_urls'];

    protected $fillable = [
        'user_id',
        'titre',
        'description',
        'categorie',
        'type',
        'date_debut',
        'date_fin',
        'lieu',
        'ville',
        'code_postal',
        'latitude',
        'longitude',
        'nombre_places_total',
        'nombre_places_disponibles',
        'prix_entree',
        'prix_max',
        'statut',
        'image_principale',
        'autres_images',
        'programme',
        'lien_virtuel',
        'note_moyenne',
        'nombre_avis',
        'nombre_reservations',
    ];

    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin' => 'datetime',
        'autres_images' => 'array',
        'programme' => 'array',
    ];

    // ------------------------------------------------------------------
    //  Accesseurs images
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
            ->map(fn($chemin) => str_starts_with($chemin, 'http')
                ? $chemin
                : Storage::disk('public')->url($chemin))
            ->values()
            ->all();
    }

    public function toutesLesImages(): array
    {
        $toutes = [];
        if ($url = $this->image_principale_url) $toutes[] = $url;
        return array_merge($toutes, $this->autres_images_urls);
    }

    // ------------------------------------------------------------------

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

    public function scopePublie($query)
    {
        return $query->where('statut', 'publié');
    }

    public function scopeParVille($query, $ville)
    {
        return $query->where('ville', $ville);
    }

    public function scopeAVenir($query)
    {
        return $query->where('date_debut', '>', now());
    }

    public function scopeEnCours($query)
    {
        return $query->where('date_debut', '<=', now())
            ->where('date_fin', '>=', now());
    }

    public function scopePrixEntre($query, $min, $max)
    {
        return $query->whereBetween('prix_entree', [$min, $max]);
    }

    public function getPlacesDisponiblesAttribute()
    {
        return $this->nombre_places_disponibles;
    }

    public function estComplet()
    {
        return $this->nombre_places_disponibles <= 0;
    }
}
