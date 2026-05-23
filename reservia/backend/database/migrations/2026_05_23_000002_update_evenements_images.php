<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $images = [
            'Festival Culturel Benin 2026'         => 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80',
            'Carnaval Ouidah 2026'                 => 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80',
            'Conférence Entrepreneuriat Africain'  => 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80',
            'Marché Artisanal Cotonou'             => 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=1200&q=80',
            'Nuit Blanche Abomey'                  => 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80',
            'FestiChill Favelas 6'                 => 'https://images.unsplash.com/photo-1540039155733-5bb30b4f11e2?w=1200&q=80',
            'Eat & Drink Festival Cotonou 2027'    => 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
            "Fête de l'Indépendance du Bénin 2026" => 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=1200&q=80',
        ];

        foreach ($images as $titre => $url) {
            DB::table('evenements')
                ->where('titre', $titre)
                ->update(['image_principale' => $url]);
        }
    }

    public function down(): void {}
};
