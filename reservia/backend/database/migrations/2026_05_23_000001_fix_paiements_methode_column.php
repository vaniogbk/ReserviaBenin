<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Change ENUM to string to support all payment methods (mtn_momo, moov_money, fedapay, cinetpay, etc.)
        DB::statement("ALTER TABLE paiements MODIFY COLUMN methode VARCHAR(50) NOT NULL DEFAULT 'carte_credit'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE paiements MODIFY COLUMN methode ENUM('carte_credit','mobile_money','virement','autre') NOT NULL DEFAULT 'carte_credit'");
    }
};
