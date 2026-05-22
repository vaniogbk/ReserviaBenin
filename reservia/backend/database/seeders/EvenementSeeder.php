<?php

namespace Database\Seeders;

use App\Models\Evenement;
use App\Models\User;
use Illuminate\Database\Seeder;

class EvenementSeeder extends Seeder
{
    public function run(): void
    {
        $host = User::where('role', 'host')->where('email', 'yvette@events.bj')->first();
        $host2 = User::where('role', 'host')->where('email', 'paul@events.bj')->first();

        if (!$host || !$host2) {
            return;
        }

        $evenements = [
            // ── Événements existants ──────────────────────────────────────
            [
                'user_id' => $host->id,
                'titre' => 'Festival Culturel Benin 2026',
                'description' => 'Célébration annuelle de la richesse musicale et culturelle béninoise avec artistes internationaux.',
                'categorie' => 'festival',
                'type' => 'physique',
                'date_debut' => '2026-10-15 18:00:00',
                'date_fin' => '2026-10-18 23:00:00',
                'lieu' => 'Stade de l\'Amitié',
                'ville' => 'Cotonou',
                'code_postal' => '01',
                'latitude' => 6.4969,
                'longitude' => 2.4277,
                'nombre_places_total' => 5000,
                'nombre_places_disponibles' => 5000,
                'prix_entree' => 15000,
                'statut' => 'publié',
                'image_principale' => 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80',
                'programme' => json_encode([
                    'jour1' => ['Ouverture officielle', 'Concerts live', 'Exposition'],
                    'jour2' => ['Danse traditionnelle', 'Défilé', 'Feu d\'artifice'],
                    'jour3' => ['Cérémonie de clôture'],
                ]),
            ],
            [
                'user_id' => $host->id,
                'titre' => 'Carnaval Ouidah 2026',
                'description' => 'Le plus grand carnaval du Bénin avec défilés, musiques et costumes colorés.',
                'categorie' => 'carnival',
                'type' => 'physique',
                'date_debut' => '2026-11-05 09:00:00',
                'date_fin' => '2026-11-07 22:00:00',
                'lieu' => 'Centre-Ville',
                'ville' => 'Ouidah',
                'code_postal' => '03',
                'latitude' => 6.6214,
                'longitude' => 2.0855,
                'nombre_places_total' => 10000,
                'nombre_places_disponibles' => 10000,
                'prix_entree' => 5000,
                'statut' => 'publié',
                'image_principale' => 'https://carnavalouidah.org/wp-content/uploads/2026/03/parade-scaled.webp',
            ],
            [
                'user_id' => $host2->id,
                'titre' => 'Conférence Entrepreneuriat Africain',
                'description' => 'Séminaire sur les opportunités d\'entrepreneuriat en Afrique de l\'Ouest avec experts internationaux.',
                'categorie' => 'conférence',
                'type' => 'hybride',
                'date_debut' => '2026-09-10 08:00:00',
                'date_fin' => '2026-09-11 18:00:00',
                'lieu' => 'Centre de Conférences Cotonou',
                'ville' => 'Cotonou',
                'code_postal' => '01',
                'latitude' => 6.4969,
                'longitude' => 2.4280,
                'nombre_places_total' => 500,
                'nombre_places_disponibles' => 500,
                'prix_entree' => 50000,
                'statut' => 'publié',
                'lien_virtuel' => 'https://meet.reservia.bj/entreprendre2026',
                'image_principale' => 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80',
                'programme' => json_encode([
                    'matin' => ['Accueil', 'Session d\'ouverture', 'Présentation startups'],
                    'apres_midi' => ['Panel discussion', 'Networking'],
                    'soir' => ['Dîner de gala'],
                ]),
            ],
            [
                'user_id' => $host2->id,
                'titre' => 'Marché Artisanal Cotonou',
                'description' => 'Vente et exposition d\'artisanat local: tissus, sculptures, peintres, bijoux.',
                'categorie' => 'marché',
                'type' => 'physique',
                'date_debut' => '2026-12-05 09:00:00',
                'date_fin' => '2026-12-07 20:00:00',
                'lieu' => 'Parc de Récréation',
                'ville' => 'Cotonou',
                'code_postal' => '01',
                'latitude' => 6.4969,
                'longitude' => 2.4277,
                'nombre_places_total' => 2000,
                'nombre_places_disponibles' => 2000,
                'prix_entree' => 2000,
                'statut' => 'publié',
                'image_principale' => 'https://fda.bj/images/snab-M.jpg',
            ],
            [
                'user_id' => $host->id,
                'titre' => 'Nuit Blanche Abomey',
                'description' => 'Événement annuel de découverte culturelle: musées, galeries et spectacles ouverts la nuit.',
                'categorie' => 'culture',
                'type' => 'physique',
                'date_debut' => '2026-08-20 20:00:00',
                'date_fin' => '2026-08-21 05:00:00',
                'lieu' => 'Toute la ville',
                'ville' => 'Abomey',
                'code_postal' => '04',
                'latitude' => 7.1965,
                'longitude' => 1.9934,
                'nombre_places_total' => 8000,
                'nombre_places_disponibles' => 8000,
                'prix_entree' => 0,
                'statut' => 'publié',
                'image_principale' => 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80',
            ],

            // ── NOUVEAUX ÉVÉNEMENTS ───────────────────────────────────────

            // FestiChill Favelas 6
            [
                'user_id' => $host->id,
                'titre' => 'FestiChill Favelas 6',
                'description' => 'La 6ème édition du festival FestiChill Favelas revient à Canal Olympia Wologuèdè Cotonou ! Deux soirées de concerts, artistes béninois et internationaux, ambiance unique dans le quartier Favelas. Organisé par Bénin Digital, c\'est l\'événement musical incontournable de l\'été 2026 au Bénin.',
                'categorie' => 'festival',
                'type' => 'physique',
                'date_debut' => '2026-07-18 19:00:00',
                'date_fin' => '2026-07-19 03:00:00',
                'lieu' => 'Canal Olympia Wologuèdè',
                'ville' => 'Cotonou',
                'code_postal' => '01',
                'latitude' => 6.3657,
                'longitude' => 2.4198,
                'nombre_places_total' => 3000,
                'nombre_places_disponibles' => 3000,
                'prix_entree' => 10000,
                'statut' => 'publié',
                'image_principale' => 'https://cdn-az.allevents.in/events2/banners/98cc632cc7a5ec2f6f89b568fa23d361cc1ea4df078f65c11f81e7ca8ae5baac-rimg-w1080-h720-dcd3c3be-gmir?v=1752501672',
                'programme' => json_encode([
                    'jour1' => ['18h : Ouverture des portes', '20h : Artistes béninois en live', '22h : Tête d\'affiche internationale', '01h : DJ set clôture'],
                    'jour2' => ['19h : Ouverture des portes', '21h : Concert acoustique', '23h : Headliner FestiChill', '02h : After party'],
                ]),
            ],

            // Eat & Drink Cotonou 2027
            [
                'user_id' => $host2->id,
                'titre' => 'Eat & Drink Festival Cotonou 2027',
                'description' => 'Le festival gastronomique et culinaire de Cotonou revient pour une nouvelle édition au Majestic Cinema Bénin ! Restaurants, chefs étoilés, food trucks, dégustations de vins et cocktails, ateliers culinaires. 6 jours pour célébrer la gastronomie béninoise et internationale.',
                'categorie' => 'gastronomie',
                'type' => 'physique',
                'date_debut' => '2027-01-27 11:00:00',
                'date_fin' => '2027-02-01 22:00:00',
                'lieu' => 'Majestic Cinema Bénin',
                'ville' => 'Cotonou',
                'code_postal' => '01',
                'latitude' => 6.3682,
                'longitude' => 2.4191,
                'nombre_places_total' => 5000,
                'nombre_places_disponibles' => 5000,
                'prix_entree' => 5000,
                'statut' => 'publié',
                'image_principale' => 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
                'programme' => json_encode([
                    'tous_les_jours' => ['11h–14h : Déjeuners des chefs', '15h–17h : Ateliers culinaires', '18h–22h : Dîners gastronomiques & dégustations'],
                ]),
            ],

            // Fête de l'Indépendance
            [
                'user_id' => $host->id,
                'titre' => 'Fête de l\'Indépendance du Bénin 2026',
                'description' => 'Le 1er août 2026, le Bénin célèbre le 66ème anniversaire de son indépendance ! Défilé militaire et civil au Stade de l\'Amitié, feux d\'artifice sur la lagune, concerts gratuits et village culturel à l\'esplanade du Palais de la République. Entrée entièrement gratuite. Suivez la cérémonie en direct sur nos écrans géants et en live stream.',
                'categorie' => 'national',
                'type' => 'hybride',
                'date_debut' => '2026-08-01 08:00:00',
                'date_fin' => '2026-08-01 23:59:00',
                'lieu' => 'Stade de l\'Amitié / Palais de la République',
                'ville' => 'Cotonou',
                'code_postal' => '01',
                'latitude' => 6.3682,
                'longitude' => 2.4277,
                'nombre_places_total' => 50000,
                'nombre_places_disponibles' => 50000,
                'prix_entree' => 0,
                'statut' => 'publié',
                'lien_virtuel' => 'https://live.gouv.bj/independance2026',
                'image_principale' => 'https://live.staticflickr.com/65535/54692540827_a3ce4c1875_h.jpg',
                'programme' => json_encode([
                    'matin' => ['08h : Lever du drapeau', '09h : Défilé militaire', '11h : Défilé civil des régions'],
                    'après_midi' => ['14h : Village culturel ouvert', '15h : Spectacles folkloriques', '17h : Concerts gratuits'],
                    'soiree' => ['20h : Gala officiel', '22h : Feux d\'artifice sur la lagune'],
                ]),
            ],
        ];

        foreach ($evenements as $data) {
            Evenement::create($data);
        }
    }
}
