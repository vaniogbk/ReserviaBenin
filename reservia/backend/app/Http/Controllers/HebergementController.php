<?php

namespace App\Http\Controllers;

use App\Models\Hebergement;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
            $query->where('departement', $request->departement);
        }
        if ($request->filled('q')) {
            $query->where(function ($q) use ($request) {
                $q->where('titre', 'like', '%' . $request->q . '%')
                  ->orWhere('description', 'like', '%' . $request->q . '%');
            });
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
