<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('candidatures', function (Blueprint $table) {
            $table->id();
            $table->string('nom_etablissement');
            $table->string('prenom_responsable');
            $table->string('nom_responsable');
            $table->string('email');
            $table->string('telephone');
            $table->string('ville');
            $table->string('type_activite'); // hebergement, evenement, restaurant, autre
            $table->text('message')->nullable();
            $table->enum('statut', ['en_attente', 'approuvée', 'rejetée'])->default('en_attente');
            $table->text('notes_admin')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidatures');
    }
};
