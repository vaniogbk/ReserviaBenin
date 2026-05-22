<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chambre extends Model
{
    protected $fillable = [
        'hebergement_id',
        'nom',
        'description',
        'prix_par_nuit',
        'capacite',
        'surface_m2',
        'images',
        'amenagements',
        'actif',
    ];

    protected $casts = [
        'images'       => 'array',
        'amenagements' => 'array',
        'actif'        => 'boolean',
    ];

    public function hebergement()
    {
        return $this->belongsTo(Hebergement::class);
    }
}
