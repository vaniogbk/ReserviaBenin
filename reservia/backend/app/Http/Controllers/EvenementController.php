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

    public function creer(Request $request): JsonResponse
    {
        /** @var \App\Models\User|null $user */
        $user = auth()->user();
        if (!$user || !in_array($user->role, ['host', 'admin'])) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $data = $request->validate([
            'titre'               => 'required|string|max:255',
            'categorie'           => 'required|in:vodoun,gastronomie,culture,seminaire,nature,art',
            'description'         => 'required|string',
            'lieu'                => 'required|string|max:255',
            'ville'               => 'required|string|max:100',
            'date_debut'          => 'required|date',
            'date_fin'            => 'required|date|after_or_equal:date_debut',
            'prix_entree'         => 'required|numeric|min:0',
            'nombre_places_total' => 'required|integer|min:1',
        ]);

        $evenement = Evenement::create([
            ...$data,
            'user_id'                   => $user->id,
            'statut'                    => 'publié',
            'nombre_places_disponibles' => $data['nombre_places_total'],
        ]);

        return response()->json($evenement, 201);
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
