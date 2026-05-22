<?php

namespace Database\Seeders;

use App\Models\Hebergement;
use App\Models\User;
use Illuminate\Database\Seeder;

class HebergementSeeder extends Seeder
{
    public function run(): void
    {
        $host = User::where('role', 'host')->where('email', 'maurice@hebergements.bj')->first();

        if (!$host) {
            return;
        }

        $hebergements = [
            [
                'titre' => 'Villa Luxe Vue Océan',
                'description' => 'Magnifique villa avec piscine privée et vue panoramique sur l\'océan Atlantique. Idéale pour les familles.',
                'type' => 'villa',
                'categorie' => 'luxe',
                'nombre_pieces' => 5,
                'nombre_lits' => 8,
                'nombre_salles_bain' => 4,
                'capacite_max' => 10,
                'prix_par_nuit' => 250000,
                'adresse' => '123 Boulevard de la Mer',
                'ville' => 'Cotonou',
                'code_postal' => '01',
                'latitude' => 6.4969,
                'longitude' => 2.4277,
                'statut' => 'actif',
                'amenagements' => json_encode(['wifi', 'climatisation', 'piscine', 'cuisine', 'parking', 'jardin']),
                'regles_maison' => json_encode(['pas de fumée', 'animaux non autorisés', 'pas de bruit après 22h']),
            ],
            [
                'titre' => 'Appartement Studio Centre-Ville',
                'description' => 'Studio confortable au cœur du centre-ville de Cotonou, à proximité de tous les commerces.',
                'type' => 'appartement',
                'categorie' => 'confort',
                'nombre_pieces' => 1,
                'nombre_lits' => 2,
                'nombre_salles_bain' => 1,
                'capacite_max' => 2,
                'prix_par_nuit' => 45000,
                'adresse' => '456 Rue Instat Sud',
                'ville' => 'Cotonou',
                'code_postal' => '01',
                'latitude' => 6.4969,
                'longitude' => 2.4280,
                'statut' => 'actif',
                'amenagements' => json_encode(['wifi', 'climatisation', 'cuisine']),
                'regles_maison' => json_encode(['pas de fumée']),
            ],
            [
                'titre' => 'Maison Villageoise Ouidah',
                'description' => 'Authentique maison traditionnelle au cœur de la ville historique d\'Ouidah.',
                'type' => 'maison',
                'categorie' => 'budget',
                'nombre_pieces' => 3,
                'nombre_lits' => 4,
                'nombre_salles_bain' => 1,
                'capacite_max' => 6,
                'prix_par_nuit' => 30000,
                'adresse' => '789 Rue Principale',
                'ville' => 'Ouidah',
                'code_postal' => '03',
                'latitude' => 6.6214,
                'longitude' => 2.0855,
                'statut' => 'actif',
                'amenagements' => json_encode(['wifi', 'cour', 'cuisine']),
                'regles_maison' => json_encode(['pas d\'animaux']),
            ],
            [
                'titre' => 'Penthouse Porto-Novo',
                'description' => 'Élégant penthouse avec escalier privé, terrasse panoramique et services premium.',
                'type' => 'appartement',
                'categorie' => 'luxe',
                'nombre_pieces' => 4,
                'nombre_lits' => 6,
                'nombre_salles_bain' => 3,
                'capacite_max' => 8,
                'prix_par_nuit' => 180000,
                'adresse' => '321 Avenue Nationale',
                'ville' => 'Porto-Novo',
                'code_postal' => '02',
                'latitude' => 6.4947,
                'longitude' => 2.6289,
                'statut' => 'actif',
                'amenagements' => json_encode(['wifi', 'climatisation', 'ascenseur', 'parking', 'gym', 'cuisine']),
                'regles_maison' => json_encode(['pas de fumée', 'pas d\'animaux']),
            ],
            [
                'titre' => 'Chalet Abomey Calme',
                'description' => 'Petit chalet au calme en retrait de la route, idéal pour les couples romantiques.',
                'type' => 'maison',
                'categorie' => 'confort',
                'nombre_pieces' => 2,
                'nombre_lits' => 2,
                'nombre_salles_bain' => 1,
                'capacite_max' => 3,
                'prix_par_nuit' => 55000,
                'adresse' => '555 Route de Savè',
                'ville' => 'Abomey',
                'code_postal' => '04',
                'latitude' => 7.1965,
                'longitude' => 1.9934,
                'statut' => 'actif',
                'amenagements' => json_encode(['wifi', 'climatisation', 'jardin', 'parking']),
                'regles_maison' => json_encode(['pas de fumée']),
            ],
        ];

        foreach ($hebergements as $data) {
            $data['user_id'] = $host->id;
            $data['date_verification'] = now();
            $data['nombre_avis'] = 0;
            Hebergement::create($data);
        }
    }
}
