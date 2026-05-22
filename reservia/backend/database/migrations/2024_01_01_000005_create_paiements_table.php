<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained('reservations')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('reference_paiement')->unique();
            $table->string('provider')->default('fedapay'); // fedapay, paypal, etc.
            $table->string('transaction_id')->nullable()->unique();
            $table->enum('statut', ['en_attente', 'succes', 'echec', 'remboursé', 'annulé'])->default('en_attente');
            $table->enum('methode', ['carte_credit', 'mobile_money', 'virement', 'autre'])->default('carte_credit');
            
            $table->decimal('montant', 10, 2);
            $table->string('devise')->default('XOF'); // Francs CFA Ouest
            
            // Données FedaPay
            $table->json('fedapay_response')->nullable();
            $table->string('fedapay_charge_id')->nullable();
            $table->timestamp('date_webhook')->nullable();
            $table->string('signature_webhook')->nullable();
            
            $table->text('description')->nullable();
            $table->text('motif_echec')->nullable();
            $table->timestamp('date_tentative')->nullable();
            $table->timestamp('date_succes')->nullable();
            $table->timestamp('date_remboursement')->nullable();
            
            $table->json('metadata')->nullable(); // données supplémentaires
            
            $table->timestamps();
            
            $table->index('reservation_id');
            $table->index('user_id');
            $table->index('reference_paiement');
            $table->index('transaction_id');
            $table->index('statut');
            $table->index('provider');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
