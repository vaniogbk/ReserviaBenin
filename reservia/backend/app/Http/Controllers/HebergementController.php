<?php

namespace App\Http\Controllers;

use App\Models\Hebergement;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Gestion publique des hébergements.
 *
 * Tous les endpoints sont publics (pas d'authentification requise).
 * Le filtre `departement` utilise un mapping ville→département car la colonne
 * `departement` des hébergements seedés est null — on filtre sur le champ `ville`.
 * Le filtre `amenagements[]` utilise whereHas + whereJsonContains sur les chambres actives.
 */
class HebergementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Hebergement::where('statut', 'actif');

        if ($request->filled('ville')) {
            $query->where('ville', 'like', '%' . $request->ville . '%');
        }
        if ($request->filled('prix_min')) {
            $query->where('prix_par_nuit', '>=', $request->prix_min);
        }
        if ($request->filled('prix_max')) {
            $query->where('prix_par_nuit', '<=', $request->prix_max);
        }
        if ($request->filled('capacite')) {
            $query->where('capacite_max', '>=', $request->capacite);
        }
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        if ($request->filled('departement')) {
            $dept   = $request->departement;
            $villes = $this->villesDepartement($dept);
            $query->where(function ($q) use ($dept, $villes) {
                $q->where('departement', $dept);
                foreach ($villes as $ville) {
                    $q->orWhere('ville', 'like', '%' . $ville . '%');
                }
            });
        }
        if ($request->filled('q')) {
            $query->where(function ($q) use ($request) {
                $q->where('titre', 'like', '%' . $request->q . '%')
                  ->orWhere('description', 'like', '%' . $request->q . '%');
            });
        }
        if ($request->has('amenagements') && is_array($request->input('amenagements'))) {
            $amenagements = array_filter($request->input('amenagements'));
            if (!empty($amenagements)) {
                $query->whereHas('chambres', function ($q) use ($amenagements) {
                    foreach ($amenagements as $a) {
                        $q->whereJsonContains('amenagements', $a);
                    }
                });
            }
        }

        $perPage = min((int) $request->input('per_page', 12), 100);
        $hebergements = $query->orderByDesc('prix_par_nuit')->paginate($perPage);

        return response()->json($hebergements);
    }

    public function show(int $id): JsonResponse
    {
        $hebergement = Hebergement::where('statut', 'actif')->findOrFail($id);

        return response()->json($hebergement);
    }

    public function chambres(int $id): JsonResponse
    {
        Hebergement::where('statut', 'actif')->findOrFail($id);

        $chambres = \App\Models\Chambre::where('hebergement_id', $id)
            ->where('actif', true)
            ->orderBy('prix_par_nuit')
            ->get();

        return response()->json($chambres);
    }

    public function disponibilites(int $id): JsonResponse
    {
        Hebergement::where('statut', 'actif')->findOrFail($id);

        $reservations = Reservation::where('hebergement_id', $id)
            ->whereNotIn('statut', ['annulée', 'remboursée'])
            ->whereNotNull('date_debut')
            ->whereNotNull('date_fin')
            ->select('date_debut', 'date_fin')
            ->get();

        return response()->json([
            'hebergement_id'      => $id,
            'dates_indisponibles' => $reservations,
        ]);
    }

    private function villesDepartement(string $dept): array
    {
        $map = [
            'Alibori'    => ['Kandi', 'Malanville', 'Gogounou', 'Ségbana', 'Karimama', 'Banikoara'],
            'Atacora'    => ['Natitingou', 'Tanguiéta', 'Boukoumbé', 'Cobly', 'Matéri', 'Péhunco', 'Kérou'],
            'Atlantique' => ['Abomey-Calavi', 'Allada', 'Ouidah', 'Kpomassè', 'Sô-Ava', 'Toffo', 'Zè', 'Cotonou'],
            'Borgou'     => ['Parakou', 'Nikki', 'N\'Dali', 'Pèrèrè', 'Kalalé', 'Sinendé', 'Bembéréké'],
            'Collines'   => ['Savè', 'Dassa', 'Glazoué', 'Bantè', 'Ouèssè', 'Savalou'],
            'Couffo'     => ['Aplahoué', 'Djakotomey', 'Dogbo', 'Klouékanmè', 'Lalo', 'Toviklin'],
            'Donga'      => ['Djougou', 'Bassila', 'Copargo', 'Ouaké'],
            'Littoral'   => ['Cotonou'],
            'Mono'       => ['Lokossa', 'Athiémé', 'Bopa', 'Comé', 'Grand-Popo', 'Houéyogbé'],
            'Ouémé'      => ['Porto-Novo', 'Adjarra', 'Adjohoun', 'Akpro-Missérété', 'Avrankou', 'Sèmè-Podji'],
            'Plateau'    => ['Pobè', 'Adja-Ouèrè', 'Ifangni', 'Kétou', 'Sakété'],
            'Zou'        => ['Abomey', 'Bohicon', 'Covè', 'Djidja', 'Agbangnizoun', 'Za-Kpota'],
        ];

        return $map[$dept] ?? [];
    }

    public function destroy(int $id): JsonResponse
    {
        /** @var \App\Models\User|null $user */
        $user = auth()->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $hebergement = Hebergement::findOrFail($id);
        $hebergement->delete();

        return response()->json(['message' => 'Hébergement supprimé.']);
    }
}
