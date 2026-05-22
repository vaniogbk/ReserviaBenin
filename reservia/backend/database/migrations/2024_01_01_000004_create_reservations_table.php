<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('hebergement_id')->nullable()->constrained('hebergements')->onDelete('set null');
            $table->foreignId('evenement_id')->nullable()->constrained('evenements')->onDelete('set null');
            $table->string('numero_reservation')->unique();
            $table->enum('type', ['hebergement', 'evenement'])->default('hebergement');
            $table->enum('statut', ['en_attente', 'confirmée', 'annulée', 'remboursée', 'complétée'])->default('en_attente');
            
            // Pour hebergement
            $table->date('date_debut')->nullable();
            $table->date('date_fin')->nullable();
            $table->integer('nombre_nuits')->nullable();
            $table->integer('nombre_guests')->nullable();
            
            // Pour événement
            $table->integer('nombre_places')->nullable();
            $table->datetime('date_evenement')->nullable();
            
            $table->decimal('prix_unitaire', 10, 2);
            $table->decimal('prix_total', 10, 2);
            $table->decimal('montant_reduction', 10, 2)->default(0);
            $table->integer('pourcentage_reduction')->default(0);
            $table->enum('statut_paiement', ['en_attente', 'payé', 'remboursé', 'échoué'])->default('en_attente');
            $table->text('notes_particulieres')->nullable();
            $table->text('motif_annulation')->nullable();
            
            // Annulation
            $table->enum('politique_annulation', ['flexible', 'modérée', 'stricte'])->default('modérée');
            $table->boolean('remboursement_possible')->default(true);
            $table->decimal('taux_remboursement', 3, 2)->default(1.00);
            
            $table->timestamp('date_demande_annulation')->nullable();
            $table->timestamp('date_annulation')->nullable();
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('hebergement_id');
            $table->index('evenement_id');
            $table->index('numero_reservation');
            $table->index('type');
            $table->index('statut');
            $table->index('statut_paiement');
            $table->index('created_at');
            $table->index(['date_debut', 'date_fin']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
