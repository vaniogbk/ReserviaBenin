<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'nom' => 'Dossou',
            'prenom' => 'Jean',
            'email' => 'admin@reservia.bj',
            'password' => Hash::make('Admin@2024Secure'),
            'telephone' => '+22990000001',
            'adresse' => '315 Avenue Clozel',
            'ville' => 'Cotonou',
            'code_postal' => '01',
            'role' => 'admin',
            'statut' => 'actif',
            'bio' => 'Administrateur de la plateforme Reservia',
            'accepte_conditions' => true,
        ]);

        // Propriétaires (Hosts)
        User::create([
            'nom' => 'Agbon',
            'prenom' => 'Maurice',
            'email' => 'maurice@hebergements.bj',
            'password' => Hash::make('Host@2024Secure'),
            'telephone' => '+22990000002',
            'adresse' => '215 Rue Instat-Nord',
            'ville' => 'Cotonou',
            'code_postal' => '01',
            'role' => 'host',
            'statut' => 'actif',
            'bio' => 'Propriétaire d\'appartements de luxe à Cotonou',
            'accepte_conditions' => true,
        ]);

        User::create([
            'nom' => 'Hounagnon',
            'prenom' => 'Yvette',
            'email' => 'yvette@events.bj',
            'password' => Hash::make('Host@2024Secure'),
            'telephone' => '+22990000003',
            'adresse' => '10 Rue de Commerce',
            'ville' => 'Porto-Novo',
            'code_postal' => '02',
            'role' => 'host',
            'statut' => 'actif',
            'bio' => 'Organisatrice d\'événements culturels et festifs',
            'accepte_conditions' => true,
        ]);

        User::create([
            'nom' => 'Koudandé',
            'prenom' => 'Paul',
            'email' => 'paul@events.bj',
            'password' => Hash::make('Host@2024Secure'),
            'telephone' => '+22990000004',
            'adresse' => 'Avenue Steinmetz',
            'ville' => 'Cotonou',
            'code_postal' => '01',
            'role' => 'host',
            'statut' => 'actif',
            'bio' => 'Organisateur de conférences et séminaires',
            'accepte_conditions' => true,
        ]);

        // Clients
        for ($i = 1; $i <= 10; $i++) {
            $villes = ['Cotonou', 'Porto-Novo', 'Abomey', 'Ouidah', 'Parakou'];
            User::create([
                'nom' => 'Client' . $i,
                'prenom' => 'Touriste',
                'email' => "client{$i}@reservia.bj",
                'password' => Hash::make('Client@2024'),
                'telephone' => '+2299' . str_pad($i, 7, '0', STR_PAD_LEFT),
                'adresse' => "Rue {$i}, {$villes[$i % 5]}",
                'ville' => $villes[$i % 5],
                'code_postal' => '0' . ($i % 5 + 1),
                'role' => 'client',
                'statut' => 'actif',
                'accepte_conditions' => true,
            ]);
        }
    }
}
