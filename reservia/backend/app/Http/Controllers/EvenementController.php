<?php

namespace App\Http\Controllers;

use App\Models\Evenement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EvenementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Evenement::where('statut', 'publié');

        if ($request->filled('ville')) {
            $query->where('ville', 'like', '%' . $request->ville . '%');
        }
        if ($request->filled('categorie')) {
            $query->where('categorie', $request->categorie);
        }
        if ($request->filled('prix_max')) {
            $query->where('prix_entree', '<=', $request->prix_max);
        }
        if ($request->filled('a_venir')) {
            $query->where('date_debut', '>', now());
        }
        if ($request->filled('q')) {
            $query->where(function ($q) use ($request) {
                $q->where('titre', 'like', '%' . $request->q . '%')
                  ->orWhere('description', 'like', '%' . $request->q . '%');
            });
        }

        $perPage = min((int) $request->get('per_page', 12), 100);
        $evenements = $query->orderBy('date_debut')->paginate($perPage);

        return response()->json($evenements);
    }

    public function show(int $id): JsonResponse
    {
        $evenement = Evenement::where('statut', 'publié')->findOrFail($id);

        return response()->json($evenement);
    }

    public function destroy(int $id): JsonResponse
    {
        $user = auth()->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $evenement = Evenement::findOrFail($id);
        $evenement->delete();

        return response()->json(['message' => 'Événement supprimé.']);
    }
}
