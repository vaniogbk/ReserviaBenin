<?php

namespace App\Http\Controllers;

use App\Models\Hebergement;
use App\Models\Evenement;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Espace partenaire (host) — chaque hôte voit uniquement ses propres données.
 * Accessible aux utilisateurs avec role=host ou role=admin.
 */
class HostController extends Controller
{
    private function checkHost(): ?\App\Models\User
    {
        /** @var \App\Models\User|null $user */
        $user = auth()->user();
        if (!$user || !in_array($user->role, ['host', 'admin'])) {
            return null;
        }
        return $user;
    }

    // ── Statistiques de l'hôte ────────────────────────────────────────────────
    public function stats(): JsonResponse
    {
        $user = $this->checkHost();
        if (!$user) return response()->json(['message' => 'Accès refusé.'], 403);

        $hebergements = Hebergement::where('user_id', $user->id)->count();
        $evenements   = Evenement::where('user_id', $user->id)->count();

        $reservations = Reservation::whereHas('hebergement', fn($q) => $q->where('user_id', $user->id))
            ->orWhereHas('evenement', fn($q) => $q->where('user_id', $user->id))
            ->where('statut', '!=', 'annulée');

        $total_reservations = $reservations->count();
        $revenus = Reservation::where('statut_paiement', 'payé')
            ->where(function ($q) use ($user) {
                $q->whereHas('hebergement', fn($sq) => $sq->where('user_id', $user->id))
                  ->orWhereHas('evenement', fn($sq) => $sq->where('user_id', $user->id));
            })
            ->sum('prix_total');

        return response()->json([
            'hebergements'      => $hebergements,
            'evenements'        => $evenements,
            'total_reservations'=> $total_reservations,
            'revenus_total'     => $revenus,
            'type_activite'     => $user->type_activite,
        ]);
    }

    // ── Hébergements de l'hôte ────────────────────────────────────────────────
    public function hebergements(): JsonResponse
    {
        $user = $this->checkHost();
        if (!$user) return response()->json(['message' => 'Accès refusé.'], 403);

        $hebergements = Hebergement::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($hebergements);
    }

    // ── Événements de l'hôte ─────────────────────────────────────────────────
    public function evenements(): JsonResponse
    {
        $user = $this->checkHost();
        if (!$user) return response()->json(['message' => 'Accès refusé.'], 403);

        $evenements = Evenement::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($evenements);
    }

    // ── Réservations des établissements de l'hôte ─────────────────────────────
    public function reservations(Request $request): JsonResponse
    {
        $user = $this->checkHost();
        if (!$user) return response()->json(['message' => 'Accès refusé.'], 403);

        $reservations = Reservation::with(['hebergement', 'evenement', 'user'])
            ->where(function ($q) use ($user) {
                $q->whereHas('hebergement', fn($sq) => $sq->where('user_id', $user->id))
                  ->orWhereHas('evenement', fn($sq) => $sq->where('user_id', $user->id));
            })
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json($reservations);
    }
}
