<?php

namespace Database\Seeders;

use App\Models\Chambre;
use App\Models\Hebergement;
use Illuminate\Database\Seeder;

class ChambreSeeder extends Seeder
{
    public function run(): void
    {
        $catalogue = [

            // ── SOFITEL ──────────────────────────────────────
            'Sofitel Cotonou Marina Hotel & Spa' => [
                ['nom'=>'Chambre Luxe King','description'=>'38m², lit king-size, vue Atlantique, salle de bain marbre, terrasse privée.','prix_par_nuit'=>310000,'capacite'=>2,'surface_m2'=>38,
                 'amenagements'=>['wifi','clim','minibar','coffre-fort','terrasse','vue_océan'],
                 'images'=>['https://www.ahstatic.com/photos/b845_rokga_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_rokgaos_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_hobth_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_ho_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_rokgaef_00_p_1024x768.jpg']],
                ['nom'=>'Chambre Luxe Twin','description'=>'35m², deux lits doubles, décoration élégante, douche à l\'italienne.','prix_par_nuit'=>295000,'capacite'=>2,'surface_m2'=>35,
                 'amenagements'=>['wifi','clim','minibar','coffre-fort','douche_italienne'],
                 'images'=>['https://www.ahstatic.com/photos/b845_rotwa_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_rokga_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_hobth_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_ho_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_rokgaos_00_p_1024x768.jpg']],
                ['nom'=>'Club Room Vue Océan','description'=>'40m², accès salon privé, petit-déjeuner, boissons incluses, vue Atlantique.','prix_par_nuit'=>380000,'capacite'=>2,'surface_m2'=>40,
                 'amenagements'=>['wifi','clim','salon_club','petit_déjeuner','minibar','terrasse'],
                 'images'=>['https://www.ahstatic.com/photos/b845_rokgaef_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_rokgaos_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_rotwa_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_ho_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_hobth_00_p_1024x768.jpg']],
                ['nom'=>'Suite Junior','description'=>'60m², salon séparé, chambre king, double salle de bain, terrasse panoramique océan.','prix_par_nuit'=>520000,'capacite'=>2,'surface_m2'=>60,
                 'amenagements'=>['wifi','clim','salon','minibar','terrasse','baignoire','douche_italienne'],
                 'images'=>['https://www.ahstatic.com/photos/b845_roskd_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_rokgaos_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_roska_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_roskb_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_roskc_00_p_1024x768.jpg']],
                ['nom'=>'Suite Marina','description'=>'85m², vue directe marina, salon spacieux, baignoire balnéo, service chambre 24h.','prix_par_nuit'=>750000,'capacite'=>3,'surface_m2'=>85,
                 'amenagements'=>['wifi','clim','salon','baignoire_balnéo','minibar','terrasse','service_24h'],
                 'images'=>['https://www.ahstatic.com/photos/b845_roskc_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_roskd_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_roskb_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_roska_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_rokgaos_00_p_1024x768.jpg']],
                ['nom'=>'Suite Présidentielle','description'=>'150m², deux chambres, grand salon, salle à manger, terrasse jacuzzi, vue 360° Atlantique, butler dédié.','prix_par_nuit'=>1500000,'capacite'=>4,'surface_m2'=>150,
                 'amenagements'=>['wifi','clim','jacuzzi','salon','salle_manger','butler','terrasse','minibar'],
                 'images'=>['https://www.ahstatic.com/photos/b845_roska_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_roskb_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_roskc_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_roskd_00_p_1024x768.jpg','https://www.ahstatic.com/photos/b845_rokgaos_00_p_1024x768.jpg']],
            ],

            // ── GOLDEN TULIP ─────────────────────────────────
            'Golden Tulip Le Diplomate Cotonou' => [
                ['nom'=>'Chambre Standard','description'=>'28m², lit queen, TV satellite, salle de bain moderne, vue jardin.','prix_par_nuit'=>145000,'capacite'=>2,'surface_m2'=>28,
                 'amenagements'=>['wifi','clim','tv_satellite','coffre-fort'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/89/1a/8a/golden-suite.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/88/fa/8a/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/88/f9/66/exterior.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/89/1b/2c/bathroom.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/89/1c/44/standard-room.jpg']],
                ['nom'=>'Chambre Supérieure Vue Mer','description'=>'32m², lit king, vue partielle océan, salle de bain en marbre.','prix_par_nuit'=>175000,'capacite'=>2,'surface_m2'=>32,
                 'amenagements'=>['wifi','clim','minibar','vue_mer','coffre-fort'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/89/1c/44/standard-room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/89/1a/8a/golden-suite.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/88/fa/8a/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/88/f9/66/exterior.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/89/1b/2c/bathroom.jpg']],
                ['nom'=>'Suite Diplomatique','description'=>'65m², salon séparé, deux salles de bain, vue panoramique Atlantique.','prix_par_nuit'=>280000,'capacite'=>2,'surface_m2'=>65,
                 'amenagements'=>['wifi','clim','salon','baignoire','minibar','vue_mer','service_chambre'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/89/1a/8a/golden-suite.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/89/1b/2c/bathroom.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/88/fa/8a/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/88/f9/66/exterior.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/89/1c/44/standard-room.jpg']],
                ['nom'=>'Suite Présidentielle','description'=>'120m², deux chambres king, salon VIP, salle de réunion privée, terrasse panoramique, butler.','prix_par_nuit'=>550000,'capacite'=>4,'surface_m2'=>120,
                 'amenagements'=>['wifi','clim','salon','salle_réunion','butler','terrasse','jacuzzi','minibar'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/89/1a/8a/golden-suite.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/89/1c/44/standard-room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/88/fa/8a/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/88/f9/66/exterior.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/89/1b/2c/bathroom.jpg']],
            ],

            // ── MERCURE ──────────────────────────────────────
            'Mercure Cotonou Nouveau Palais Hotel' => [
                ['nom'=>'Chambre Standard','description'=>'26m², lit queen, bureau de travail, TV écran plat, salle de bain douche.','prix_par_nuit'=>120000,'capacite'=>2,'surface_m2'=>26,
                 'amenagements'=>['wifi','clim','bureau','tv'],
                 'images'=>['https://www.ahstatic.com/photos/A0K3_ro_00_p_1024x768.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/1e/96/d2/mercure-cotonou.jpg','https://www.ahstatic.com/photos/A0K3_hobth_00_p_1024x768.jpg','https://www.ahstatic.com/photos/A0K3_hopol_00_p_1024x768.jpg','https://www.ahstatic.com/photos/A0K3_hores_00_p_1024x768.jpg']],
                ['nom'=>'Chambre Supérieure','description'=>'30m², lit king, coin salon, vue piscine panoramique 7ème étage.','prix_par_nuit'=>155000,'capacite'=>2,'surface_m2'=>30,
                 'amenagements'=>['wifi','clim','minibar','coffre-fort','vue_piscine'],
                 'images'=>['https://www.ahstatic.com/photos/A0K3_ro_00_p_1024x768.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/1e/96/d2/mercure-cotonou.jpg','https://www.ahstatic.com/photos/A0K3_hopol_00_p_1024x768.jpg','https://www.ahstatic.com/photos/A0K3_hobth_00_p_1024x768.jpg','https://www.ahstatic.com/photos/A0K3_hores_00_p_1024x768.jpg']],
                ['nom'=>'Suite Junior','description'=>'50m², salon séparé, chambre king, terrasse avec vue panoramique sur Cotonou.','prix_par_nuit'=>250000,'capacite'=>2,'surface_m2'=>50,
                 'amenagements'=>['wifi','clim','salon','minibar','terrasse','baignoire'],
                 'images'=>['https://www.ahstatic.com/photos/A0K3_ro_00_p_1024x768.jpg','https://www.ahstatic.com/photos/A0K3_hobth_00_p_1024x768.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/1e/96/d2/mercure-cotonou.jpg','https://www.ahstatic.com/photos/A0K3_hopol_00_p_1024x768.jpg','https://www.ahstatic.com/photos/A0K3_hores_00_p_1024x768.jpg']],
            ],

            // ── MAISON ROUGE ─────────────────────────────────
            'Maison Rouge Cotonou' => [
                ['nom'=>'Chambre Classique','description'=>'19m², textiles africains contemporains, lit double, salle de bain privée avec douche.','prix_par_nuit'=>109000,'capacite'=>2,'surface_m2'=>19,
                 'amenagements'=>['wifi','clim','tv','coffre-fort'],
                 'images'=>['https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/07/hotel-maison-rouge-cotonou-benin-chambre-classique-vue-sur-cour-00001.jpg','https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/06/hotel-maison-rouge-cotonou-benin-00003.jpg','https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/06/hotel-maison-rouge-cotonou-benin-piscine.jpg','https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/07/hotel-maison-rouge-cotonou-benin-restaurant.jpg','https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/06/hotel-maison-rouge-cotonou-benin-00001.jpg']],
                ['nom'=>'Chambre Supérieure','description'=>'25–30m², lit king, œuvres d\'art originales, salle de bain terrazzo avec baignoire, terrasse jardin.','prix_par_nuit'=>146000,'capacite'=>2,'surface_m2'=>27,
                 'amenagements'=>['wifi','clim','baignoire','terrasse','minibar'],
                 'images'=>['https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/06/hotel-maison-rouge-cotonou-benin-00003.jpg','https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/07/hotel-maison-rouge-cotonou-benin-chambre-classique-vue-sur-cour-00001.jpg','https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/06/hotel-maison-rouge-cotonou-benin-piscine.jpg','https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/07/hotel-maison-rouge-cotonou-benin-restaurant.jpg','https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/06/hotel-maison-rouge-cotonou-benin-00001.jpg']],
                ['nom'=>'Suite Junior','description'=>'40m², salon lounge, chambre king décorée par un artiste béninois, baignoire en cuivre, vue piscine/mer.','prix_par_nuit'=>156000,'capacite'=>2,'surface_m2'=>40,
                 'amenagements'=>['wifi','clim','salon','baignoire_cuivre','minibar','vue_piscine'],
                 'images'=>['https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/06/hotel-maison-rouge-cotonou-benin-piscine.jpg','https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/06/hotel-maison-rouge-cotonou-benin-00003.jpg','https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/07/hotel-maison-rouge-cotonou-benin-chambre-classique-vue-sur-cour-00001.jpg','https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/07/hotel-maison-rouge-cotonou-benin-restaurant.jpg','https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/06/hotel-maison-rouge-cotonou-benin-00001.jpg']],
                ['nom'=>'Suite Supérieure','description'=>'55m², deux salles de bain, grand salon, chambre king face à la mer, petit-déjeuner inclus.','prix_par_nuit'=>166000,'capacite'=>2,'surface_m2'=>55,
                 'amenagements'=>['wifi','clim','salon','deux_sdb','petit_déjeuner','vue_mer'],
                 'images'=>['https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/06/hotel-maison-rouge-cotonou-benin-00001.jpg','https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/06/hotel-maison-rouge-cotonou-benin-00003.jpg','https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/06/hotel-maison-rouge-cotonou-benin-piscine.jpg','https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/07/hotel-maison-rouge-cotonou-benin-restaurant.jpg','https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/07/hotel-maison-rouge-cotonou-benin-chambre-classique-vue-sur-cour-00001.jpg']],
                ['nom'=>'Suite Présidentielle','description'=>'80m² en duplex, terrasse privée, vue 180° Atlantique, baignoire terrazzo, salon d\'art, butler dédié.','prix_par_nuit'=>296000,'capacite'=>3,'surface_m2'=>80,
                 'amenagements'=>['wifi','clim','terrasse','jacuzzi','butler','salon_art','vue_mer'],
                 'images'=>['https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/06/hotel-maison-rouge-cotonou-benin-00003.jpg','https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/06/hotel-maison-rouge-cotonou-benin-00001.jpg','https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/06/hotel-maison-rouge-cotonou-benin-piscine.jpg','https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/07/hotel-maison-rouge-cotonou-benin-restaurant.jpg','https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/07/hotel-maison-rouge-cotonou-benin-chambre-classique-vue-sur-cour-00001.jpg']],
            ],

            // ── BENIN ROYAL ──────────────────────────────────
            'Benin Royal Hotel' => [
                ['nom'=>'Chambre Standard','description'=>'25m², lit queen, TV satellite, climatisation, salle de bain avec baignoire.','prix_par_nuit'=>80000,'capacite'=>2,'surface_m2'=>25,
                 'amenagements'=>['wifi','clim','tv_satellite'],
                 'images'=>['https://s3-cdn.hotellinksolutions.com/hls/data/2540/website/general/bn/normal_normal_banner1-benin-royal-hotel-compressor.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/f7/3a/1e/benin-royal-hotel.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/f7/3c/aa/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/f7/3e/f1/restaurant.jpg','https://s3-cdn.hotellinksolutions.com/hls/data/2540/website/rooms/standard-room-1.jpg']],
                ['nom'=>'Chambre Supérieure','description'=>'32m², lit king, vue panoramique ville, salle de bain luxueuse, coin bureau.','prix_par_nuit'=>100000,'capacite'=>2,'surface_m2'=>32,
                 'amenagements'=>['wifi','clim','minibar','bureau','vue_ville'],
                 'images'=>['https://s3-cdn.hotellinksolutions.com/hls/data/2540/website/general/bn/normal_normal_banner1-benin-royal-hotel-compressor.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/f7/3a/1e/benin-royal-hotel.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/f7/3c/aa/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/f7/3e/f1/restaurant.jpg','https://s3-cdn.hotellinksolutions.com/hls/data/2540/website/rooms/standard-room-1.jpg']],
                ['nom'=>'Suite Junior','description'=>'50m², grand salon, chambre king, deux salles de bain, balcon privé vue piscine.','prix_par_nuit'=>140000,'capacite'=>3,'surface_m2'=>50,
                 'amenagements'=>['wifi','clim','salon','minibar','balcon','vue_piscine'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/f7/3c/aa/pool.jpg','https://s3-cdn.hotellinksolutions.com/hls/data/2540/website/general/bn/normal_normal_banner1-benin-royal-hotel-compressor.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/f7/3a/1e/benin-royal-hotel.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/f7/3e/f1/restaurant.jpg','https://s3-cdn.hotellinksolutions.com/hls/data/2540/website/rooms/standard-room-1.jpg']],
                ['nom'=>'Suite Royale','description'=>'90m², deux chambres king, salon VIP, salle de bain en marbre, terrasse vue Cotonou, butler.','prix_par_nuit'=>250000,'capacite'=>4,'surface_m2'=>90,
                 'amenagements'=>['wifi','clim','salon','baignoire','terrasse','butler','minibar'],
                 'images'=>['https://s3-cdn.hotellinksolutions.com/hls/data/2540/website/general/bn/normal_normal_banner1-benin-royal-hotel-compressor.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/f7/3a/1e/benin-royal-hotel.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/f7/3c/aa/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/f7/3e/f1/restaurant.jpg','https://s3-cdn.hotellinksolutions.com/hls/data/2540/website/rooms/standard-room-1.jpg']],
            ],

            // ── AZALAÏ ───────────────────────────────────────
            'Azalaï Hôtel de la Plage Cotonou' => [
                ['nom'=>'Chambre Standard Plage','description'=>'26m², vue jardin, lit queen, salle de bain fraîche, accès direct plage.','prix_par_nuit'=>65000,'capacite'=>2,'surface_m2'=>26,
                 'amenagements'=>['wifi','clim','tv','accès_plage'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/74/49/7c/azalai-hotel-cotonou.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/74/50/8c/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/74/48/5a/beach.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/74/4a/9d/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/74/4b/1e/room.jpg']],
                ['nom'=>'Chambre Supérieure Vue Océan','description'=>'32m², lit king, vue Atlantique, balcon privé, salle de bain avec baignoire.','prix_par_nuit'=>85000,'capacite'=>2,'surface_m2'=>32,
                 'amenagements'=>['wifi','clim','minibar','balcon','vue_océan'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/74/50/8c/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/74/49/7c/azalai-hotel-cotonou.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/74/48/5a/beach.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/74/4a/9d/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/74/4b/1e/room.jpg']],
                ['nom'=>'Suite Azalaï','description'=>'60m², salon avec vue mer, chambre king, deux salles de bain, terrasse privée, petit-déjeuner inclus.','prix_par_nuit'=>150000,'capacite'=>3,'surface_m2'=>60,
                 'amenagements'=>['wifi','clim','salon','terrasse','petit_déjeuner','vue_mer','minibar'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/74/49/7c/azalai-hotel-cotonou.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/74/50/8c/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/74/48/5a/beach.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/74/4a/9d/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/74/4b/1e/room.jpg']],
            ],

            // ── BEST WESTERN ─────────────────────────────────
            'Best Western Premier Benin Hotel' => [
                ['nom'=>'Chambre Standard','description'=>'26m², lit queen, bureau, TV, salle de bain moderne, navette aéroport incluse.','prix_par_nuit'=>80000,'capacite'=>2,'surface_m2'=>26,
                 'amenagements'=>['wifi','clim','bureau','navette_aéroport'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/04/7e/fe/best-western-plus-nobila.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/04/7f/12/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/04/7d/cc/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/04/7e/11/bathroom.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/04/7c/88/restaurant.jpg']],
                ['nom'=>'Chambre Supérieure','description'=>'32m², lit king, coin détente, vue piscine, accès gym inclus.','prix_par_nuit'=>110000,'capacite'=>2,'surface_m2'=>32,
                 'amenagements'=>['wifi','clim','minibar','gym','vue_piscine'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/04/7f/12/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/04/7e/fe/best-western-plus-nobila.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/04/7d/cc/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/04/7e/11/bathroom.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/04/7c/88/restaurant.jpg']],
                ['nom'=>'Suite Premium','description'=>'55m², salon séparé, chambre king, salle de bain en marbre, petit-déjeuner buffet inclus.','prix_par_nuit'=>185000,'capacite'=>3,'surface_m2'=>55,
                 'amenagements'=>['wifi','clim','salon','petit_déjeuner','minibar','baignoire'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/04/7e/fe/best-western-plus-nobila.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/04/7f/12/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/04/7d/cc/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/04/7e/11/bathroom.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/04/7c/88/restaurant.jpg']],
            ],

            // ── BENIN MARINA ─────────────────────────────────
            'Hôtel Bénin Marina' => [
                ['nom'=>'Chambre Standard Marina','description'=>'28m², lit queen, vue jardin ou marina, salle de bain avec douche.','prix_par_nuit'=>90000,'capacite'=>2,'surface_m2'=>28,
                 'amenagements'=>['wifi','clim','tv','coffre-fort'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/19/5f/ba/benin-marina-hotel.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/19/5e/8a/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/19/60/2c/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/19/5d/44/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/19/5c/16/lobby.jpg']],
                ['nom'=>'Chambre Supérieure Vue Mer','description'=>'35m², lit king, vue Atlantique, balcon privé, salle de bain luxueuse.','prix_par_nuit'=>125000,'capacite'=>2,'surface_m2'=>35,
                 'amenagements'=>['wifi','clim','minibar','balcon','vue_mer'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/19/5e/8a/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/19/5f/ba/benin-marina-hotel.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/19/60/2c/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/19/5d/44/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/19/5c/16/lobby.jpg']],
                ['nom'=>'Suite Penthouse Marina','description'=>'80m², salon panoramique, chambre king, deux salles de bain, terrasse vue 180° Atlantique.','prix_par_nuit'=>250000,'capacite'=>3,'surface_m2'=>80,
                 'amenagements'=>['wifi','clim','salon','terrasse','jacuzzi','butler','minibar','vue_panoramique'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/19/5f/ba/benin-marina-hotel.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/19/5e/8a/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/19/60/2c/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/19/5d/44/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/19/5c/16/lobby.jpg']],
            ],

            // ── IBIS ─────────────────────────────────────────
            'Ibis Cotonou' => [
                ['nom'=>'Chambre Ibis','description'=>'18m², lit queen ou twin, bureau, salle de bain avec douche. Rapport qualité-prix imbattable.','prix_par_nuit'=>42000,'capacite'=>2,'surface_m2'=>18,
                 'amenagements'=>['wifi','clim','bureau','douche'],
                 'images'=>['https://www.ahstatic.com/photos/6681_ho_00_p_1024x768.jpg','https://www.ahstatic.com/photos/6681_ro_00_p_1024x768.jpg','https://www.ahstatic.com/photos/6681_hobth_00_p_1024x768.jpg','https://www.ahstatic.com/photos/6681_hores_00_p_1024x768.jpg','https://www.ahstatic.com/photos/6681_hobar_00_p_1024x768.jpg']],
                ['nom'=>'Chambre Ibis Twin','description'=>'18m², deux lits simples, idéale pour collègues ou amis, bureau de travail.','prix_par_nuit'=>45000,'capacite'=>2,'surface_m2'=>18,
                 'amenagements'=>['wifi','clim','bureau','douche','tv'],
                 'images'=>['https://www.ahstatic.com/photos/6681_ro_00_p_1024x768.jpg','https://www.ahstatic.com/photos/6681_ho_00_p_1024x768.jpg','https://www.ahstatic.com/photos/6681_hobth_00_p_1024x768.jpg','https://www.ahstatic.com/photos/6681_hores_00_p_1024x768.jpg','https://www.ahstatic.com/photos/6681_hobar_00_p_1024x768.jpg']],
                ['nom'=>'Suite Ibis Styles','description'=>'30m², salon avec canapé-lit, chambre séparée, idéale familles ou séjour affaires prolongé.','prix_par_nuit'=>68000,'capacite'=>3,'surface_m2'=>30,
                 'amenagements'=>['wifi','clim','salon','bureau','douche','petit_déjeuner'],
                 'images'=>['https://www.ahstatic.com/photos/6681_ho_00_p_1024x768.jpg','https://www.ahstatic.com/photos/6681_ro_00_p_1024x768.jpg','https://www.ahstatic.com/photos/6681_hobth_00_p_1024x768.jpg','https://www.ahstatic.com/photos/6681_hores_00_p_1024x768.jpg','https://www.ahstatic.com/photos/6681_hobar_00_p_1024x768.jpg']],
            ],

            // ── LES ORCHIDÉES ────────────────────────────────
            'Hôtel Les Orchidées Cotonou' => [
                ['nom'=>'Chambre Standard','description'=>'22m², décoration florale, lit double, climatisation, salle de bain privée.','prix_par_nuit'=>58000,'capacite'=>2,'surface_m2'=>22,
                 'amenagements'=>['wifi','clim','tv'],
                 'images'=>['https://www.hotellesorchidees.com/img/slider/1.jpg','https://www.hotellesorchidees.com/img/slider/2.jpg','https://www.hotellesorchidees.com/img/slider/3.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/c3/4a/7b/hotel-les-orchidees.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/c3/4b/8c/pool.jpg']],
                ['nom'=>'Chambre Supérieure','description'=>'28m², lit king, vue piscine, mini-terrasse, salle de bain avec baignoire.','prix_par_nuit'=>78000,'capacite'=>2,'surface_m2'=>28,
                 'amenagements'=>['wifi','clim','minibar','vue_piscine','terrasse'],
                 'images'=>['https://www.hotellesorchidees.com/img/slider/2.jpg','https://www.hotellesorchidees.com/img/slider/1.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/c3/4a/7b/hotel-les-orchidees.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/c3/4b/8c/pool.jpg','https://www.hotellesorchidees.com/img/slider/3.jpg']],
                ['nom'=>'Suite Orchidée','description'=>'50m², salon fleuri, chambre king luxueuse, salle de bain avec baignoire sur pieds, petit-déjeuner buffet inclus.','prix_par_nuit'=>120000,'capacite'=>2,'surface_m2'=>50,
                 'amenagements'=>['wifi','clim','salon','petit_déjeuner','baignoire','minibar'],
                 'images'=>['https://www.hotellesorchidees.com/img/slider/3.jpg','https://www.hotellesorchidees.com/img/slider/1.jpg','https://www.hotellesorchidees.com/img/slider/2.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/c3/4a/7b/hotel-les-orchidees.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/c3/4b/8c/pool.jpg']],
            ],

            // ── CONTINENTAL ──────────────────────────────────
            'Hôtel Continental Cotonou' => [
                ['nom'=>'Chambre Standard','description'=>'22m², lit double ou twin, TV, climatisation, salle de bain avec douche.','prix_par_nuit'=>50000,'capacite'=>2,'surface_m2'=>22,
                 'amenagements'=>['wifi','clim','tv'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/41/35/8b/hotel-continental-cotonou.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/41/36/4c/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/41/37/1d/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/41/34/6a/lobby.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/41/38/2e/bar.jpg']],
                ['nom'=>'Chambre Supérieure','description'=>'30m², lit king, coin salon, vue ville, salle de bain luxueuse.','prix_par_nuit'=>65000,'capacite'=>2,'surface_m2'=>30,
                 'amenagements'=>['wifi','clim','minibar','vue_ville'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/41/36/4c/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/41/35/8b/hotel-continental-cotonou.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/41/37/1d/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/41/34/6a/lobby.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/41/38/2e/bar.jpg']],
            ],

            // ── LE KARE EBENE ────────────────────────────────
            'Le Kare Ebene' => [
                ['nom'=>'Chambre Design','description'=>'24m², décoration africaine contemporaine unique, lit queen, salle de bain en béton ciré.','prix_par_nuit'=>65000,'capacite'=>2,'surface_m2'=>24,
                 'amenagements'=>['wifi','clim','design_africain'],
                 'images'=>['https://www.lekareebene.com/wp-content/uploads/2025/05/bienvenu-au-kare-ebene-boutik-hotel-1536x1025.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/a1/c3/44/kare-ebene-room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/a1/c4/55/rooftop-bar.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/a1/c2/33/bathroom.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/a1/c5/66/restaurant.jpg']],
                ['nom'=>'Chambre Supérieure Terrasse','description'=>'30m², terrasse privée, lit king, vue sur les toits de Cotonou, mini-bar.','prix_par_nuit'=>85000,'capacite'=>2,'surface_m2'=>30,
                 'amenagements'=>['wifi','clim','terrasse','minibar','vue_ville'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/a1/c4/55/rooftop-bar.jpg','https://www.lekareebene.com/wp-content/uploads/2025/05/bienvenu-au-kare-ebene-boutik-hotel-1536x1025.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/a1/c3/44/kare-ebene-room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/a1/c2/33/bathroom.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/a1/c5/66/restaurant.jpg']],
                ['nom'=>'Suite Rooftop','description'=>'50m², accès rooftop bar privatisé, salon lounge, chambre king, vue 360° sur Cotonou.','prix_par_nuit'=>140000,'capacite'=>2,'surface_m2'=>50,
                 'amenagements'=>['wifi','clim','rooftop_privé','salon','minibar','vue_360'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/a1/c4/55/rooftop-bar.jpg','https://www.lekareebene.com/wp-content/uploads/2025/05/bienvenu-au-kare-ebene-boutik-hotel-1536x1025.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/a1/c3/44/kare-ebene-room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/a1/c5/66/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/a1/c2/33/bathroom.jpg']],
            ],

            // ── VILLA KARO ───────────────────────────────────
            'Villa Karo Cotonou' => [
                ['nom'=>'Suite Art Standard','description'=>'Chambre de 35m² décorée par un artiste béninois, lit king, salle de bain avec baignoire, accès jardin et galerie.','prix_par_nuit'=>120000,'capacite'=>2,'surface_m2'=>35,
                 'amenagements'=>['wifi','clim','art_africain','galerie','jardin'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/b7/2a/1d/villa-karo.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/b7/2b/2e/garden.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/b7/2c/3f/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/b7/2d/4a/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/b7/2e/5b/room.jpg']],
                ['nom'=>'Suite Prestige Art','description'=>'55m², œuvres originales, salon privé, terrasse dans le jardin tropical, piscine privée partagée.','prix_par_nuit'=>200000,'capacite'=>3,'surface_m2'=>55,
                 'amenagements'=>['wifi','clim','salon','terrasse','piscine','butler','art_africain'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/b7/2c/3f/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/b7/2a/1d/villa-karo.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/b7/2b/2e/garden.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/b7/2d/4a/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/b7/2e/5b/room.jpg']],
            ],

            // ── TROPICAL ─────────────────────────────────────
            'Tropical Hôtel Cotonou' => [
                ['nom'=>'Chambre Tropicale','description'=>'24m², décor tropical, lit double, vue jardin avec cocotiers, salle de bain fraîche.','prix_par_nuit'=>52000,'capacite'=>2,'surface_m2'=>24,
                 'amenagements'=>['wifi','clim','tv','vue_jardin'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/d1/6d/4b/tropical-hotel.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/d1/6e/5c/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/d1/6f/6d/garden.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/d1/70/7e/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/d1/71/8f/room.jpg']],
                ['nom'=>'Bungalow Tropical','description'=>'32m², bungalow indépendant entouré de verdure, lit king, terrasse avec vue piscine.','prix_par_nuit'=>75000,'capacite'=>2,'surface_m2'=>32,
                 'amenagements'=>['wifi','clim','terrasse','vue_piscine','minibar'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/d1/6e/5c/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/d1/6d/4b/tropical-hotel.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/d1/6f/6d/garden.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/d1/70/7e/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/d1/71/8f/room.jpg']],
            ],

            // ── HOTEL DU LAC ─────────────────────────────────
            'Hôtel du Lac Cotonou' => [
                ['nom'=>'Chambre Vue Lac','description'=>'24m², lit queen, terrasse vue sur le lac Nokoué, salle de bain privée.','prix_par_nuit'=>45000,'capacite'=>2,'surface_m2'=>24,
                 'amenagements'=>['wifi','clim','terrasse','vue_lac'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/b9/39/22/pool-side.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/b9/3a/33/lake-view.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/b9/3b/44/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/b9/38/11/exterior.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/b9/3c/55/room.jpg']],
                ['nom'=>'Suite Panoramique Lac','description'=>'40m², salon avec baie vitrée face au lac, chambre king, accès terrasse panoramique.','prix_par_nuit'=>68000,'capacite'=>2,'surface_m2'=>40,
                 'amenagements'=>['wifi','clim','salon','terrasse','vue_panoramique'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/b9/3a/33/lake-view.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/b9/39/22/pool-side.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/b9/3b/44/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/b9/38/11/exterior.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/b9/3c/55/room.jpg']],
            ],

            // ── CROIX DU SUD ─────────────────────────────────
            'Hôtel Croix du Sud Cotonou' => [
                ['nom'=>'Chambre Familiale','description'=>'30m², deux lits doubles, idéale familles, vue jardin, salle de bain avec baignoire.','prix_par_nuit'=>48000,'capacite'=>4,'surface_m2'=>30,
                 'amenagements'=>['wifi','clim','tv','vue_jardin','adapté_familles'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/4a/6b/70/hotel-croix-du-sud.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/4a/6c/81/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/4a/6d/92/garden.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/4a/6e/a3/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/4a/6f/b4/restaurant.jpg']],
                ['nom'=>'Suite Junior','description'=>'42m², salon séparé, lit king, terrasse ombragée, piscine partagée, petit-déjeuner inclus.','prix_par_nuit'=>70000,'capacite'=>2,'surface_m2'=>42,
                 'amenagements'=>['wifi','clim','salon','terrasse','petit_déjeuner'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/4a/6c/81/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/4a/6b/70/hotel-croix-du-sud.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/4a/6d/92/garden.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/4a/6e/a3/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/4a/6f/b4/restaurant.jpg']],
            ],

            // ── BENIN BERGE ──────────────────────────────────
            'Benin Berge Hotel' => [
                ['nom'=>'Chambre Standard Balcon','description'=>'24m², balcon privé, lit queen, salle de bain moderne, vue quartier diplomatique.','prix_par_nuit'=>60000,'capacite'=>2,'surface_m2'=>24,
                 'amenagements'=>['wifi','clim','balcon','tv'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/82/f5/50/benin-berge-hotel.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/82/f6/61/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/82/f7/72/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/82/f4/3f/lobby.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/82/f8/83/bathroom.jpg']],
                ['nom'=>'Suite Berge','description'=>'45m², salon panoramique, chambre king, deux salles de bain, balcon face à la mer.','prix_par_nuit'=>90000,'capacite'=>2,'surface_m2'=>45,
                 'amenagements'=>['wifi','clim','salon','deux_sdb','balcon','minibar'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/82/f6/61/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/82/f5/50/benin-berge-hotel.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/82/f7/72/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/82/f4/3f/lobby.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/82/f8/83/bathroom.jpg']],
            ],

            // ── MAISON DE CANELYA ────────────────────────────
            'La Maison de Canelya' => [
                ['nom'=>'Chambre Créole','description'=>'22m², textiles locaux, lit double, jardin fleuri, salle de bain privée.','prix_par_nuit'=>55000,'capacite'=>2,'surface_m2'=>22,
                 'amenagements'=>['wifi','clim','jardin','cuisine_locale'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/4d/f8/c0/la-maison-de-canelia.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/4d/f9/d1/garden.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/4d/fa/e2/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/4d/fb/f3/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/4d/fc/04/kitchen.jpg']],
                ['nom'=>'Suite Maison','description'=>'38m², salon avec bibliothèque, lit king, terrasse jardin privée, petit-déjeuner créole inclus.','prix_par_nuit'=>78000,'capacite'=>2,'surface_m2'=>38,
                 'amenagements'=>['wifi','clim','salon','terrasse','petit_déjeuner','piscine'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/4d/fa/e2/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/4d/f8/c0/la-maison-de-canelia.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/4d/f9/d1/garden.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/4d/fb/f3/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/4d/fc/04/kitchen.jpg']],
            ],

            // ── PERLE BLEUE ──────────────────────────────────
            'Résidence Hôtel Perle Bleue' => [
                ['nom'=>'Studio Perle Bleue','description'=>'28m², kitchenette équipée, lit double, terrasse, piscine commune, idéal séjour prolongé.','prix_par_nuit'=>52000,'capacite'=>2,'surface_m2'=>28,
                 'amenagements'=>['wifi','clim','kitchenette','terrasse','piscine'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1f/3c/d8/a9/residence-perle-bleue.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1f/3c/d9/ba/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1f/3c/da/cb/studio.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1f/3c/db/dc/kitchen.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1f/3c/dc/ed/garden.jpg']],
                ['nom'=>'Appartement Perle Bleue','description'=>'55m², 2 chambres, salon, cuisine équipée, deux salles de bain, terrasse vue jardin.','prix_par_nuit'=>82000,'capacite'=>4,'surface_m2'=>55,
                 'amenagements'=>['wifi','clim','cuisine','salon','terrasse','piscine','deux_sdb'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1f/3c/d9/ba/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1f/3c/d8/a9/residence-perle-bleue.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1f/3c/da/cb/studio.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1f/3c/db/dc/kitchen.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1f/3c/dc/ed/garden.jpg']],
            ],

            // ── MARYHOUSE ────────────────────────────────────
            'Residence MaryHouse' => [
                ['nom'=>'Chambre Standard','description'=>'20m², lit double, petit-déjeuner maison inclus, Wi-Fi, à 5 min de l\'aéroport.','prix_par_nuit'=>28000,'capacite'=>2,'surface_m2'=>20,
                 'amenagements'=>['wifi','clim','petit_déjeuner','navette_aéroport'],
                 'images'=>['https://maryhouse.bj/wp-content/uploads/2024/07/img-bannerV09-1920x1315.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/11/22/33/maryhouse-room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/11/23/44/maryhouse-breakfast.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/11/24/55/maryhouse-exterior.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/11/25/66/maryhouse-garden.jpg']],
                ['nom'=>'Chambre Supérieure','description'=>'28m², lit king, terrasse, salle de bain avec douche, petit-déjeuner buffet inclus.','prix_par_nuit'=>42000,'capacite'=>2,'surface_m2'=>28,
                 'amenagements'=>['wifi','clim','terrasse','petit_déjeuner'],
                 'images'=>['https://maryhouse.bj/wp-content/uploads/2024/07/img-bannerV09-1920x1315.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/11/23/44/maryhouse-breakfast.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/11/22/33/maryhouse-room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/11/24/55/maryhouse-exterior.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/11/25/66/maryhouse-garden.jpg']],
            ],

            // ── IVOIRE ───────────────────────────────────────
            'Résidence Ivoire Cotonou' => [
                ['nom'=>'Appartement 2 pièces','description'=>'45m², salon, 1 chambre king, cuisine équipée, terrasse, sécurité 24h, parking.','prix_par_nuit'=>58000,'capacite'=>2,'surface_m2'=>45,
                 'amenagements'=>['wifi','clim','cuisine','parking','sécurité_24h','terrasse'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/a2/58/3a/caption.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/a2/59/4b/living-room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/a2/5a/5c/kitchen.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/a2/5b/6d/bedroom.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/a2/5c/7e/terrace.jpg']],
                ['nom'=>'Appartement 3 pièces','description'=>'70m², salon spacieux, 2 chambres, cuisine équipée, 2 salles de bain, terrasse, parking, conciergerie.','prix_par_nuit'=>85000,'capacite'=>4,'surface_m2'=>70,
                 'amenagements'=>['wifi','clim','cuisine','parking','sécurité_24h','deux_sdb','conciergerie'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/a2/59/4b/living-room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/a2/58/3a/caption.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/a2/5a/5c/kitchen.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/a2/5b/6d/bedroom.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/a2/5c/7e/terrace.jpg']],
            ],

            // ── KALAUPAPA ────────────────────────────────────
            'Auberge Kalaupapa' => [
                ['nom'=>'Chambre Standard','description'=>'20m², lit double, jardin verdoyant, salle de bain privée, proche pirogues Ganvié.','prix_par_nuit'=>45000,'capacite'=>2,'surface_m2'=>20,
                 'amenagements'=>['wifi','clim','jardin','excursion_ganvié'],
                 'images'=>['https://auberge-kalaupapa.org/wp-content/uploads/2025/11/kal-chbleue-2024-2-bdef.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/12/ec/4e/kalaupapa-garden.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/12/eb/3d/kalaupapa-room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/12/ea/2c/kalaupapa-restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/12/e9/1b/kalaupapa-exterior.jpg']],
                ['nom'=>'Suite Lacustre','description'=>'35m², terrasse vue lagune, lit king, salle de bain luxueuse, petit-déjeuner et visite Ganvié inclus.','prix_par_nuit'=>68000,'capacite'=>2,'surface_m2'=>35,
                 'amenagements'=>['wifi','clim','terrasse','petit_déjeuner','excursion_ganvié','vue_lagune'],
                 'images'=>['https://auberge-kalaupapa.org/wp-content/uploads/2025/11/kal-chbleue-2024-2-bdef.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/12/ec/4e/kalaupapa-garden.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/12/eb/3d/kalaupapa-room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/12/ea/2c/kalaupapa-restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/12/e9/1b/kalaupapa-exterior.jpg']],
            ],

            // ── CASA DEL PAPA ────────────────────────────────
            'Casa del Papa Resort & SPA' => [
                ['nom'=>'Chambre Vue Lagon','description'=>'28m², lit king, vue lagon, décoration coloniale, salle de bain avec douche à l\'italienne.','prix_par_nuit'=>72000,'capacite'=>2,'surface_m2'=>28,
                 'amenagements'=>['wifi','clim','vue_lagon','terrasse'],
                 'images'=>['https://wa-uploads.profitroom.com/casadelpapa/1920x1080/17053093858117_paisaje2.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/16/04/lagoon.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/17/15/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/18/26/spa.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/19/37/restaurant.jpg']],
                ['nom'=>'Bungalow sur Pilotis','description'=>'40m², bungalow sur pilotis au-dessus du lagon, lit king, terrasse avec vue océan, accès direct eau.','prix_par_nuit'=>110000,'capacite'=>2,'surface_m2'=>40,
                 'amenagements'=>['wifi','clim','terrasse','vue_océan','accès_eau','minibar'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/16/04/lagoon.jpg','https://wa-uploads.profitroom.com/casadelpapa/1920x1080/17053093858117_paisaje2.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/17/15/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/18/26/spa.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/19/37/restaurant.jpg']],
                ['nom'=>'Suite Présidentielle Lagon','description'=>'75m², salon panoramique, deux chambres, jacuzzi extérieur, terrasse privée sur lagon, butler.','prix_par_nuit'=>200000,'capacite'=>4,'surface_m2'=>75,
                 'amenagements'=>['wifi','clim','jacuzzi','salon','butler','terrasse','vue_lagon','minibar'],
                 'images'=>['https://wa-uploads.profitroom.com/casadelpapa/1920x1080/17053093858117_paisaje2.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/16/04/lagoon.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/17/15/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/18/26/spa.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/19/37/restaurant.jpg']],
            ],

            // ── DOMAINE DE LA PALMERAIE ──────────────────────
            'Domaine de la Palmeraie' => [
                ['nom'=>'Villa Palmier','description'=>'Villa de 60m² avec piscine privée, salon extérieur, cuisine équipée, chef personnel disponible.','prix_par_nuit'=>175000,'capacite'=>3,'surface_m2'=>60,
                 'amenagements'=>['wifi','clim','piscine_privée','chef_personnel','cuisine','jardin'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/ac/62/91/domaine-de-la-palmeraie.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/ac/63/a2/pool-villa.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/ac/64/b3/garden.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/ac/65/c4/bedroom.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/ac/66/d5/kitchen.jpg']],
                ['nom'=>'Grande Villa Palmeraie','description'=>'Villa de 120m² pour 6 personnes, 3 chambres king, salon, salle de bain hammam, chef, guide vaudou.','prix_par_nuit'=>350000,'capacite'=>6,'surface_m2'=>120,
                 'amenagements'=>['wifi','clim','piscine_privée','chef_personnel','hammam','guide_culturel','cuisine'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/ac/63/a2/pool-villa.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/ac/62/91/domaine-de-la-palmeraie.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/ac/64/b3/garden.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/ac/65/c4/bedroom.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/ac/66/d5/kitchen.jpg']],
            ],

            // ── JARDIN SECRET OUIDAH ─────────────────────────
            'Le Jardin Secret Ouidah' => [
                ['nom'=>'Bungalow Éco','description'=>'Bungalow de 22m² en matériaux naturels, lit double, vue jardin tropical, salle de bain avec douche solaire.','prix_par_nuit'=>48000,'capacite'=>2,'surface_m2'=>22,
                 'amenagements'=>['wifi','ventilateur','jardin','piscine_biologique','cuisine_locale'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/70/e4/2c/le-jardin-secret.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/70/e5/3d/bungalow.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/70/e6/4e/garden.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/70/e7/5f/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/70/e8/6a/restaurant.jpg']],
                ['nom'=>'Suite Jardin','description'=>'35m², salon extérieur privé, lit king, salle de bain à ciel ouvert, accès direct piscine biologique.','prix_par_nuit'=>72000,'capacite'=>2,'surface_m2'=>35,
                 'amenagements'=>['wifi','clim','terrasse','piscine_biologique','petit_déjeuner'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/70/e7/5f/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/70/e4/2c/le-jardin-secret.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/70/e5/3d/bungalow.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/70/e6/4e/garden.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/70/e8/6a/restaurant.jpg']],
            ],

            // ── DJEGBA OUIDAH ────────────────────────────────
            'Djegba Hotel Ouidah' => [
                ['nom'=>'Chambre Standard','description'=>'18m², lit double, climatisation, salle de bain, proche Route de l\'Esclave et Forêt des Pythons.','prix_par_nuit'=>28000,'capacite'=>2,'surface_m2'=>18,
                 'amenagements'=>['wifi','clim','tv'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/91/e5/15/trouvez-l-equilibre-parfait.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/91/e6/26/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/91/e7/37/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/91/e8/48/exterior.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/91/e9/59/ocean-view.jpg']],
                ['nom'=>'Chambre Vue Océan','description'=>'24m², vue Atlantique, lit queen, balcon, salle de bain avec douche fraîche.','prix_par_nuit'=>40000,'capacite'=>2,'surface_m2'=>24,
                 'amenagements'=>['wifi','clim','balcon','vue_océan'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/91/e9/59/ocean-view.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/91/e5/15/trouvez-l-equilibre-parfait.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/91/e6/26/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/91/e7/37/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/91/e8/48/exterior.jpg']],
            ],

            // ── ASVA BEACH RESORT ────────────────────────────
            'Asva Beach Resort' => [
                ['nom'=>'Villa Bord de Mer','description'=>'Villa de 45m² avec terrasse privée face à l\'Atlantique, lit king, salle de bain luxueuse.','prix_par_nuit'=>120000,'capacite'=>2,'surface_m2'=>45,
                 'amenagements'=>['wifi','clim','terrasse','vue_mer','accès_plage'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/15/f3/asva-beach-resort.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/16/04/beach.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/17/15/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/18/26/villa.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/19/37/restaurant.jpg']],
                ['nom'=>'Suite Deluxe Plage','description'=>'60m², accès direct plage, salon panoramique, deux salles de bain, lit king, jacuzzi extérieur.','prix_par_nuit'=>185000,'capacite'=>2,'surface_m2'=>60,
                 'amenagements'=>['wifi','clim','accès_plage','jacuzzi','salon','deux_sdb','minibar'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/16/04/beach.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/15/f3/asva-beach-resort.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/17/15/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/18/26/villa.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/19/37/restaurant.jpg']],
                ['nom'=>'Villa Présidentielle','description'=>'100m², villa exclusive 4 personnes, piscine privée, chef, salle de détente, vue 180° Atlantique.','prix_par_nuit'=>350000,'capacite'=>4,'surface_m2'=>100,
                 'amenagements'=>['wifi','clim','piscine_privée','chef','salon','butler','terrasse','vue_panoramique'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/17/15/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/15/f3/asva-beach-resort.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/16/04/beach.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/18/26/villa.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/8b/19/37/restaurant.jpg']],
            ],

            // ── AWALÉ PLAGE ──────────────────────────────────
            'Hotel Awalé Plage' => [
                ['nom'=>'Bungalow Cocotier','description'=>'Bungalow de 20m² sous les cocotiers, lit double, accès direct plage, salle de bain simple.','prix_par_nuit'=>25000,'capacite'=>2,'surface_m2'=>20,
                 'amenagements'=>['wifi','ventilateur','accès_plage','restaurant'],
                 'images'=>['https://www.hotel-benin-awaleplage.com/wp-content/uploads/2023/06/header-site-awale-plage-2023.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/11/22/33/bungalow.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/11/23/44/beach.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/11/24/55/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/11/25/66/exterior.jpg']],
                ['nom'=>'Chambre Supérieure Vue Mer','description'=>'28m², lit queen, terrasse vue Atlantique, salle de bain avec douche, restaurant inclus.','prix_par_nuit'=>38000,'capacite'=>2,'surface_m2'=>28,
                 'amenagements'=>['wifi','clim','terrasse','vue_mer','accès_plage'],
                 'images'=>['https://www.hotel-benin-awaleplage.com/wp-content/uploads/2023/06/header-site-awale-plage-2023.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/11/23/44/beach.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/11/22/33/bungalow.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/11/24/55/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/11/25/66/exterior.jpg']],
            ],

            // ── AUBERGE DE GRAND POPO ────────────────────────
            'Auberge de Grand-Popo' => [
                ['nom'=>'Bungalow Plage','description'=>'Bungalow pittoresque de 20m² directement sur la plage. Lit double, ventilateur, salle de bain.','prix_par_nuit'=>32000,'capacite'=>2,'surface_m2'=>20,
                 'amenagements'=>['ventilateur','accès_plage','restaurant','bar'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/b9/df/76/farafina-hotel.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/b9/e0/87/beach.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/b9/e1/98/bungalow.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/b9/e2/a9/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/b9/e3/ba/garden.jpg']],
                ['nom'=>'Chambre Bohème','description'=>'26m², décor franco-béninois, lit king, vue plage, salle de bain avec baignoire en céramique.','prix_par_nuit'=>50000,'capacite'=>2,'surface_m2'=>26,
                 'amenagements'=>['wifi','clim','vue_plage','baignoire'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/b9/e0/87/beach.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/b9/df/76/farafina-hotel.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/b9/e1/98/bungalow.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/b9/e2/a9/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/b9/e3/ba/garden.jpg']],
            ],

            // ── OUADADA PORTO-NOVO ───────────────────────────
            'Résidences Ouadada Porto-Novo' => [
                ['nom'=>'Appartement 2 pièces','description'=>'42m², salon, chambre queen, cuisine, terrasse vue jardin, proche Palais Royal.','prix_par_nuit'=>45000,'capacite'=>2,'surface_m2'=>42,
                 'amenagements'=>['wifi','clim','cuisine','terrasse','parking'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1e/85/c2/7a/residences-ouadada.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1e/85/c3/8b/living-room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1e/85/c4/9c/kitchen.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1e/85/c5/ad/terrace.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1e/85/c6/be/garden.jpg']],
                ['nom'=>'Appartement Familial','description'=>'70m², deux chambres, salon, cuisine, deux salles de bain, jardin privé, parking.','prix_par_nuit'=>68000,'capacite'=>4,'surface_m2'=>70,
                 'amenagements'=>['wifi','clim','cuisine','jardin','parking','deux_sdb'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1e/85/c3/8b/living-room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1e/85/c2/7a/residences-ouadada.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1e/85/c4/9c/kitchen.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1e/85/c5/ad/terrace.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1e/85/c6/be/garden.jpg']],
            ],

            // ── BEAURIVAGE PORTO-NOVO ────────────────────────
            'Hôtel Beaurivage Porto-Novo' => [
                ['nom'=>'Chambre Standard','description'=>'22m², lit double, vue jardin, climatisation, salle de bain privée, proche musées.','prix_par_nuit'=>38000,'capacite'=>2,'surface_m2'=>22,
                 'amenagements'=>['wifi','clim','tv'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/67/03/19/hotel-beaurivage.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/67/04/2a/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/67/05/3b/lagoon-view.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/67/06/4c/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/67/07/5d/terrace.jpg']],
                ['nom'=>'Chambre Vue Lagune','description'=>'30m², vue sur la lagune de Porto-Novo, lit king, terrasse, salle de bain avec baignoire.','prix_par_nuit'=>56000,'capacite'=>2,'surface_m2'=>30,
                 'amenagements'=>['wifi','clim','terrasse','vue_lagune','minibar'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/67/05/3b/lagoon-view.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/67/03/19/hotel-beaurivage.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/67/04/2a/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/67/06/4c/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/67/07/5d/terrace.jpg']],
            ],

            // ── SILVA PORTO-NOVO ─────────────────────────────
            'Hôtel Silva Porto-Novo' => [
                ['nom'=>'Chambre Simple','description'=>'16m², lit simple, climatisation, salle de bain partagée, idéale voyageur solo.','prix_par_nuit'=>18000,'capacite'=>1,'surface_m2'=>16,
                 'amenagements'=>['wifi','clim','restaurant'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/2d/e3/f1/hotel-silva.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/2d/e4/02/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/2d/e5/13/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/2d/e6/24/exterior.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/2d/e7/35/street.jpg']],
                ['nom'=>'Chambre Double','description'=>'20m², lit double, climatisation, salle de bain privée avec douche, proche marché central.','prix_par_nuit'=>28000,'capacite'=>2,'surface_m2'=>20,
                 'amenagements'=>['wifi','clim','tv','sdb_privée'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/2d/e4/02/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/2d/e3/f1/hotel-silva.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/2d/e5/13/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/2d/e6/24/exterior.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/2d/e7/35/street.jpg']],
            ],

            // ── CHEZ MONIQUE ABOMEY ──────────────────────────
            'Chez Monique Abomey' => [
                ['nom'=>'Chambre Simple','description'=>'16m², lit simple, cour intérieure ombragée, salle de bain partagée, cuisine béninoise au petit-déjeuner.','prix_par_nuit'=>15000,'capacite'=>1,'surface_m2'=>16,
                 'amenagements'=>['wifi','ventilateur','cuisine_locale','guide_palais'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/12/72/f5/l-univers-de-chez-monique.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/12/73/06/courtyard.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/12/74/17/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/12/75/28/breakfast.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/12/76/39/garden.jpg']],
                ['nom'=>'Chambre Double','description'=>'20m², lit double, cour avec jardin, salle de bain privée, repas traditionnels sur demande.','prix_par_nuit'=>22000,'capacite'=>2,'surface_m2'=>20,
                 'amenagements'=>['wifi','ventilateur','cuisine_locale','jardin'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/12/73/06/courtyard.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/12/72/f5/l-univers-de-chez-monique.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/12/74/17/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/12/75/28/breakfast.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/12/76/39/garden.jpg']],
            ],

            // ── CHEZ SABINE ABOMEY ───────────────────────────
            'Chez Sabine Abomey' => [
                ['nom'=>'Chambre Standard','description'=>'18m², lit double, salle de bain privée, guide touristique francophone inclus pour les Palais Royaux.','prix_par_nuit'=>22000,'capacite'=>2,'surface_m2'=>18,
                 'amenagements'=>['wifi','clim','guide_palais','petit_déjeuner'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/c3/a6/99/chez-sabine.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/c3/a7/aa/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/c3/a8/bb/garden.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/c3/a9/cc/breakfast.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/c3/aa/dd/courtyard.jpg']],
                ['nom'=>'Suite Familiale','description'=>'35m², deux chambres, salon, salle de bain, cuisine partagée, idéale familles visitant Abomey.','prix_par_nuit'=>38000,'capacite'=>4,'surface_m2'=>35,
                 'amenagements'=>['wifi','clim','cuisine','jardin','guide_palais'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/c3/a7/aa/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/c3/a6/99/chez-sabine.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/c3/a8/bb/garden.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/c3/a9/cc/breakfast.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/c3/aa/dd/courtyard.jpg']],
            ],

            // ── LE BELIER NATITINGOU ─────────────────────────
            'Le Bélier Natitingou' => [
                ['nom'=>'Chambre Standard Safari','description'=>'24m², lit double, vue jardin, salle de bain privée. Idéale avant/après safari au Parc Pendjari.','prix_par_nuit'=>50000,'capacite'=>2,'surface_m2'=>24,
                 'amenagements'=>['wifi','clim','guide_safari','restaurant'],
                 'images'=>['https://static.wixstatic.com/media/95638f_6231e3b308104e8c8f2aa29700755994~mv2_d_4608_3456_s_4_2.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/11/22/33/le-belier-room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/11/23/44/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/11/24/55/garden.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/11/25/66/pool.jpg']],
                ['nom'=>'Suite Pendjari','description'=>'40m², salon avec vue sur les montagnes, lit king, salle de bain luxueuse, package safari Pendjari inclus.','prix_par_nuit'=>80000,'capacite'=>2,'surface_m2'=>40,
                 'amenagements'=>['wifi','clim','salon','vue_montagne','safari_pendjari','petit_déjeuner'],
                 'images'=>['https://static.wixstatic.com/media/95638f_6231e3b308104e8c8f2aa29700755994~mv2_d_4608_3456_s_4_2.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/11/23/44/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/11/22/33/le-belier-room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/11/24/55/garden.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/11/25/66/pool.jpg']],
            ],

            // ── GITE CHEZ NOEL ───────────────────────────────
            'Gîte Chez Noël Natitingou' => [
                ['nom'=>'Chambre Standard','description'=>'18m², lit double, salle de bain privée, cuisine locale, guide certifié Pendjari inclus.','prix_par_nuit'=>20000,'capacite'=>2,'surface_m2'=>18,
                 'amenagements'=>['wifi','ventilateur','cuisine_locale','guide_pendjari'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/12/ed/5f/caption.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/12/ee/6a/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/12/ef/7b/garden.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/12/f0/8c/breakfast.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/12/f1/9d/exterior.jpg']],
                ['nom'=>'Chambre Familiale','description'=>'28m², deux lits, jardin, idéale familles ou groupes safari, salle de bain privée.','prix_par_nuit'=>32000,'capacite'=>4,'surface_m2'=>28,
                 'amenagements'=>['wifi','ventilateur','jardin','guide_pendjari','cuisine_locale'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/12/ee/6a/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/12/ed/5f/caption.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/12/ef/7b/garden.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/12/f0/8c/breakfast.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/12/f1/9d/exterior.jpg']],
            ],

            // ── IYA-OASIS PARAKOU ────────────────────────────
            'Hôtel Iya-Oasis Parakou' => [
                ['nom'=>'Chambre Standard','description'=>'24m², lit queen, bureau, TV, salle de bain avec douche. Proche centre économique nord-Bénin.','prix_par_nuit'=>38000,'capacite'=>2,'surface_m2'=>24,
                 'amenagements'=>['wifi','clim','bureau','tv'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/91/15/0c/caption.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/91/16/1d/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/91/17/2e/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/91/18/3f/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/91/19/4a/exterior.jpg']],
                ['nom'=>'Chambre Supérieure Piscine','description'=>'30m², lit king, vue piscine, balcon, salle de bain luxueuse, petit-déjeuner inclus.','prix_par_nuit'=>52000,'capacite'=>2,'surface_m2'=>30,
                 'amenagements'=>['wifi','clim','vue_piscine','balcon','petit_déjeuner'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/91/17/2e/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/91/15/0c/caption.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/91/16/1d/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/91/18/3f/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/91/19/4a/exterior.jpg']],
                ['nom'=>'Suite Oasis','description'=>'50m², salon séparé, chambre king, salle de réunion privée, accès piscine et gym, parking.','prix_par_nuit'=>85000,'capacite'=>3,'surface_m2'=>50,
                 'amenagements'=>['wifi','clim','salon','salle_réunion','piscine','gym','parking'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/91/15/0c/caption.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/91/17/2e/pool.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/91/16/1d/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/91/18/3f/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/91/19/4a/exterior.jpg']],
            ],

            // ── GRAND MARCHÉ PARAKOU ─────────────────────────
            'Hôtel du Grand Marché Parakou' => [
                ['nom'=>'Chambre Standard','description'=>'18m², lit double, climatisation, salle de bain avec douche, proche grand marché du nord.','prix_par_nuit'=>25000,'capacite'=>2,'surface_m2'=>18,
                 'amenagements'=>['wifi','clim','tv','restaurant'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/a4/72/88/hotel-du-grand-marche.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/a4/73/99/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/a4/74/aa/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/a4/75/bb/market-view.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/a4/76/cc/terrace.jpg']],
                ['nom'=>'Chambre Supérieure Terrasse','description'=>'26m², lit king, terrasse animée vue sur le marché, salle de bain privée, restaurant actif.','prix_par_nuit'=>38000,'capacite'=>2,'surface_m2'=>26,
                 'amenagements'=>['wifi','clim','terrasse','vue_marché','restaurant'],
                 'images'=>['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/a4/75/bb/market-view.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/a4/72/88/hotel-du-grand-marche.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/a4/73/99/room.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/a4/74/aa/restaurant.jpg','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/a4/76/cc/terrace.jpg']],
            ],

        ];

        foreach ($catalogue as $titre => $chambres) {
            $hebergement = Hebergement::where('titre', $titre)->first();
            if (!$hebergement) continue;

            foreach ($chambres as $c) {
                Chambre::create([
                    'hebergement_id' => $hebergement->id,
                    'nom'            => $c['nom'],
                    'description'    => $c['description'],
                    'prix_par_nuit'  => $c['prix_par_nuit'],
                    'capacite'       => $c['capacite'],
                    'surface_m2'     => $c['surface_m2'],
                    'amenagements'   => $c['amenagements'],
                    'images'         => $c['images'],
                    'actif'          => true,
                ]);
            }
        }
    }
}
