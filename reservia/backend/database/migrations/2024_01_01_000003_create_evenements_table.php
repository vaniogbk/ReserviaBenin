<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evenements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('titre');
            $table->text('description')->nullable();
            $table->string('categorie')->nullable(); // concert, conférence, etc.
            $table->string('type')->nullable(); // virtuel, physique, hybride
            $table->datetime('date_debut');
            $table->datetime('date_fin');
            $table->string('lieu')->nullable();
            $table->string('ville');
            $table->string('code_postal')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->integer('nombre_places_total')->default(100);
            $table->integer('nombre_places_disponibles')->default(100);
            $table->decimal('prix_entree', 10, 2)->default(0);
            $table->decimal('prix_max', 10, 2)->default(1000000); // Max 1M FCFA
            $table->enum('statut', ['brouillon', 'publié', 'annulé', 'terminé'])->default('brouillon');
            $table->string('image_principale')->nullable();
            $table->json('autres_images')->nullable();
            $table->json('programme')->nullable();
            $table->string('lien_virtuel')->nullable();
            $table->decimal('note_moyenne', 3, 2)->default(5.00);
            $table->integer('nombre_avis')->default(0);
            $table->integer('nombre_reservations')->default(0);
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('ville');
            $table->index('statut');
            $table->index(['date_debut', 'date_fin']);
            $table->index('prix_entree');
            $table->index('created_at');
            $table->fullText(['titre', 'description']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evenements');
    }
};
