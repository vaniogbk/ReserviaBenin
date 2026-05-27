<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('users')
            ->where('email', 'vaniogbk@gmail.com')
            ->update([
                'password'           => Hash::make('Reservia@2026!'),
                'role'               => 'admin',
                'email_verified_at'  => now(),
                'statut'             => 'actif',
            ]);
    }

    public function down(): void {}
};
