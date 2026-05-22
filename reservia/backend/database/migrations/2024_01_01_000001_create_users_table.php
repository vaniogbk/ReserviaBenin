<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nom')->nullable();
            $table->string('prenom')->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('telephone')->nullable();
            $table->string('adresse')->nullable();
            $table->string('ville')->nullable();
            $table->string('code_postal')->nullable();
            $table->enum('role', ['client', 'host', 'admin'])->default('client');
            $table->enum('statut', ['actif', 'inactif', 'suspendu'])->default('actif');
            $table->text('bio')->nullable();
            $table->string('photo_profil')->nullable();
            $table->decimal('note_moyenne', 3, 2)->default(5.00);
            $table->integer('nombre_avis')->default(0);
            $table->boolean('accepte_conditions')->default(false);
            $table->timestamp('date_dernier_login')->nullable();
            $table->rememberToken();
            $table->timestamps();

            $table->index('email');
            $table->index('role');
            $table->index('statut');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
