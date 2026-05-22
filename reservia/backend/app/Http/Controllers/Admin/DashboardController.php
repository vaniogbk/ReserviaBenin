<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Evenement;
use App\Models\Hebergement;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    private function checkAdmin(): void
    {
        $user = auth()->user();
        if (!$user || $user->role !== 'admin') {
            abort(403, 'Accès réservé aux administrateurs.');
        }
    }

    public function index(): JsonResponse
    {
        $this->checkAdmin();

        return response()->json([
            'total_utilisateurs'  => User::count(),
            'total_hebergements'  => Hebergement::count(),
            'total_evenements'    => Evenement::count(),
            'total_reservations'  => Reservation::count(),
            'reservations_attente'=> Reservation::where('statut', 'en_attente')->count(),
            'revenus_total'       => Reservation::where('statut_paiement', 'payé')->sum('prix_total'),
        ]);
    }

    public function reservations(Request $request): JsonResponse
    {
        $this->checkAdmin();

        $query = Reservation::with(['user', 'hebergement', 'evenement', 'paiement']);

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        $perPage = min((int) $request->get('per_page', 20), 100);
        return response()->json($query->orderByDesc('created_at')->paginate($perPage));
    }

    public function utilisateurs(Request $request): JsonResponse
    {
        $this->checkAdmin();

        $query = User::query();

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }
        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        $perPage = min((int) $request->get('per_page', 20), 100);
        return response()->json($query->orderByDesc('created_at')->paginate($perPage));
    }

    public function updateRole(Request $request, int $id): JsonResponse
    {
        $this->checkAdmin();

        $data = $request->validate([
            'role' => 'required|in:client,host,admin',
        ]);

        $user = User::findOrFail($id);

        if ($data['role'] === 'admin') {
            $adminCount = User::where('role', 'admin')->count();
            if ($adminCount >= 5) {
                return response()->json(['message' => 'Nombre maximum d\'administrateurs atteint.'], 422);
            }
        }

        $user->update(['role' => $data['role']]);

        return response()->json($user->fresh());
    }

    public function statistiques(): JsonResponse
    {
        $this->checkAdmin();

        $reservationsParMois = Reservation::selectRaw('MONTH(created_at) as mois, COUNT(*) as total, SUM(prix_total) as revenus')
            ->whereYear('created_at', now()->year)
            ->groupBy('mois')
            ->orderBy('mois')
            ->get();

        return response()->json([
            'reservations_par_mois' => $reservationsParMois,
            'top_hebergements'      => Hebergement::orderByDesc('nombre_reservations')->limit(5)->get(['id', 'titre', 'nombre_reservations']),
            'top_evenements'        => Evenement::orderByDesc('nombre_reservations')->limit(5)->get(['id', 'titre', 'nombre_reservations']),
            'utilisateurs_par_role' => User::selectRaw('role, COUNT(*) as total')->groupBy('role')->get(),
        ]);
    }
}
