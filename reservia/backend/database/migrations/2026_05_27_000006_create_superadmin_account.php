<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * Crée (ou met à jour) le compte superadmin propriétaire de la plateforme.
 * Ce compte est indépendant de l'inscription publique.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::table('users')->updateOrInsert(
            ['email' => 'admin@reservia-benin.com'],
            [
                'prenom'             => 'Super',
                'nom'                => 'Admin',
                'email'              => 'admin@reservia-benin.com',
                'password'           => Hash::make('Reservia@Admin2026!'),
                'role'               => 'admin',
                'statut'             => 'actif',
                'email_verified_at'  => now(),
                'created_at'         => now(),
                'updated_at'         => now(),
            ]
        );
    }

    public function down(): void
    {
        DB::table('users')->where('email', 'admin@reservia-benin.com')->delete();
    }
};
