<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $hosts = [
            ['email' => 'admin@reservia.bj',       'nom' => 'Dossou',     'prenom' => 'Jean',    'role' => 'admin', 'password' => 'Admin@2024Secure', 'telephone' => '+22990000001', 'adresse' => '315 Avenue Clozel',   'ville' => 'Cotonou',    'code_postal' => '01', 'bio' => 'Administrateur de la plateforme Reservia'],
            ['email' => 'maurice@hebergements.bj',  'nom' => 'Agbon',      'prenom' => 'Maurice', 'role' => 'host',  'password' => 'Host@2024Secure',  'telephone' => '+22990000002', 'adresse' => '215 Rue Instat-Nord', 'ville' => 'Cotonou',    'code_postal' => '01', 'bio' => 'Propriétaire d\'appartements de luxe à Cotonou'],
            ['email' => 'yvette@events.bj',         'nom' => 'Hounagnon',  'prenom' => 'Yvette',  'role' => 'host',  'password' => 'Host@2024Secure',  'telephone' => '+22990000003', 'adresse' => '10 Rue de Commerce',  'ville' => 'Porto-Novo', 'code_postal' => '02', 'bio' => 'Organisatrice d\'événements culturels et festifs'],
            ['email' => 'paul@events.bj',           'nom' => 'Koudandé',   'prenom' => 'Paul',    'role' => 'host',  'password' => 'Host@2024Secure',  'telephone' => '+22990000004', 'adresse' => 'Avenue Steinmetz',    'ville' => 'Cotonou',    'code_postal' => '01', 'bio' => 'Organisateur de conférences et séminaires'],
        ];

        foreach ($hosts as $data) {
            User::updateOrCreate(
                ['email' => $data['email']],
                array_merge($data, [
                    'password'           => Hash::make($data['password']),
                    'statut'             => 'actif',
                    'accepte_conditions' => true,
                    'email_verified_at'  => now(),
                ])
            );
        }

        $villes = ['Cotonou', 'Porto-Novo', 'Abomey', 'Ouidah', 'Parakou'];
        for ($i = 1; $i <= 10; $i++) {
            User::updateOrCreate(
                ['email' => "client{$i}@reservia.bj"],
                [
                    'nom'                => 'Client' . $i,
                    'prenom'             => 'Touriste',
                    'email'              => "client{$i}@reservia.bj",
                    'password'           => Hash::make('Client@2024'),
                    'telephone'          => '+2299' . str_pad($i, 7, '0', STR_PAD_LEFT),
                    'adresse'            => "Rue {$i}, {$villes[$i % 5]}",
                    'ville'              => $villes[$i % 5],
                    'code_postal'        => '0' . ($i % 5 + 1),
                    'role'               => 'client',
                    'statut'             => 'actif',
                    'accepte_conditions' => true,
                    'email_verified_at'  => now(),
                ]
            );
        }
    }
}
