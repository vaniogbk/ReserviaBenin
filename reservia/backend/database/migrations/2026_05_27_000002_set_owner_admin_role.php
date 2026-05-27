<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Promouvoir le compte propriétaire en admin
        DB::table('users')
            ->where('email', 'vaniogbk@gmail.com')
            ->update([
                'role'               => 'admin',
                'email_verified_at'  => now(),
                'statut'             => 'actif',
            ]);

        // Activer tous les comptes non vérifiés (comptes seedés)
        DB::table('users')
            ->whereNull('email_verified_at')
            ->update(['email_verified_at' => now()]);
    }

    public function down(): void {}
};
