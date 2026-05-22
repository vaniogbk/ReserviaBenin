<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hebergements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('titre');
            $table->text('description')->nullable();
            $table->string('type')->nullable(); // maison, appartement, villa, etc.
            $table->string('categorie')->nullable(); // budget, confort, luxe
            $table->integer('nombre_pieces')->default(1);
            $table->integer('nombre_lits')->default(1);
            $table->integer('nombre_salles_bain')->default(1);
            $table->integer('capacite_max')->default(1);
            $table->decimal('prix_par_nuit', 10, 2);
            $table->decimal('prix_max', 10, 2)->default(500000); // Max 500k FCFA
            $table->string('adresse');
            $table->string('ville');
            $table->string('code_postal')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->enum('statut', ['actif', 'inactif', 'verouille'])->default('inactif');
            $table->string('image_principale')->nullable();
            $table->json('autres_images')->nullable();
            $table->json('amenagements')->nullable(); // wifi, climatisation, etc.
            $table->json('regles_maison')->nullable();
            $table->decimal('note_moyenne', 3, 2)->default(5.00);
            $table->integer('nombre_avis')->default(0);
            $table->integer('nombre_reservations')->default(0);
            $table->timestamp('date_verification')->nullable();
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('ville');
            $table->index('statut');
            $table->index('prix_par_nuit');
            $table->index('created_at');
            $table->fullText(['titre', 'description']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hebergements');
    }
};
