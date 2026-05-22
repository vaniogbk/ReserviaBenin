<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chambres', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hebergement_id')->constrained('hebergements')->onDelete('cascade');
            $table->string('nom');
            $table->text('description')->nullable();
            $table->decimal('prix_par_nuit', 10, 2);
            $table->integer('capacite')->default(2);
            $table->integer('surface_m2')->nullable();
            $table->json('images')->nullable();
            $table->json('amenagements')->nullable();
            $table->boolean('actif')->default(true);
            $table->timestamps();

            $table->index('hebergement_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chambres');
    }
};
