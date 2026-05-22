<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('avis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('hebergement_id')->nullable()->constrained('hebergements')->onDelete('cascade');
            $table->foreignId('evenement_id')->nullable()->constrained('evenements')->onDelete('cascade');
            $table->foreignId('reservation_id')->nullable()->constrained('reservations')->onDelete('set null');
            
            $table->integer('note')->default(5); // 1 à 5 étoiles
            $table->string('titre')->nullable();
            $table->text('commentaire')->nullable();
            $table->json('criteres')->nullable(); // propreté, accueil, etc & leurs notes
            
            $table->boolean('recommande')->default(true);
            $table->json('photos')->nullable();
            
            $table->integer('nombre_aideral')->default(0);
            $table->enum('statut', ['en_attente', 'approuvé', 'rejeté'])->default('en_attente');
            
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('hebergement_id');
            $table->index('evenement_id');
            $table->index('reservation_id');
            $table->index('note');
            $table->index('statut');
            $table->index('created_at');
            $table->fullText(['titre', 'commentaire']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('avis');
    }
};
