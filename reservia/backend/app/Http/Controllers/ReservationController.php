<?php

namespace App\Http\Controllers;

use App\Models\Chambre;
use App\Models\Hebergement;
use App\Models\Evenement;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReservationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $reservations = Reservation::where('user_id', $request->user()->id)
            ->with(['hebergement', 'evenement', 'paiement'])
            ->orderByDesc('created_at')
            ->paginate(min((int) $request->get('per_page', 10), 100));

        return response()->json($reservations);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'type'                 => 'required|in:hebergement,evenement',
            'hebergement_id'       => 'required_if:type,hebergement|nullable|integer|exists:hebergements,id',
            'chambre_id'           => 'nullable|integer|exists:chambres,id',
            'evenement_id'         => 'required_if:type,evenement|nullable|integer|exists:evenements,id',
            'date_debut'           => 'required_if:type,hebergement|nullable|date|after_or_equal:today',
            'date_fin'             => 'required_if:type,hebergement|nullable|date|after:date_debut',
            'nombre_guests'        => 'required_if:type,hebergement|nullable|integer|min:1',
            'nombre_places'        => 'required_if:type,evenement|nullable|integer|min:1',
            'notes_particulieres'  => 'nullable|string|max:1000',
        ]);

        $user = $request->user();

        if ($data['type'] === 'hebergement') {
            $hebergement = Hebergement::where('statut', 'actif')
                ->lockForUpdate()
                ->findOrFail($data['hebergement_id']);

            // Utiliser le prix de la chambre sélectionnée si fournie
            $prixUnitaire = $hebergement->prix_par_nuit;
            $chambreId    = null;
            if (!empty($data['chambre_id'])) {
                $chambre = Chambre::where('hebergement_id', $hebergement->id)
                    ->where('actif', true)
                    ->findOrFail($data['chambre_id']);
                $prixUnitaire = $chambre->prix_par_nuit;
                $chambreId    = $chambre->id;
            }

            $nuits     = (int) now()->parse($data['date_debut'])->diffInDays($data['date_fin']);
            $prixTotal = $prixUnitaire * $nuits;

            $reservation = Reservation::create([
                'user_id'             => $user->id,
                'hebergement_id'      => $hebergement->id,
                'chambre_id'          => $chambreId,
                'numero_reservation'  => 'RES-' . date('Ymd') . '-' . strtoupper(Str::random(6)),
                'type'                => 'hebergement',
                'statut'              => 'en_attente',
                'date_debut'          => $data['date_debut'],
                'date_fin'            => $data['date_fin'],
                'nombre_nuits'        => $nuits,
                'nombre_guests'       => $data['nombre_guests'],
                'prix_unitaire'       => $prixUnitaire,
                'prix_total'          => $prixTotal,
                'notes_particulieres' => $data['notes_particulieres'] ?? null,
                'politique_annulation'=> 'modérée',
            ]);
        } else {
            $evenement = Evenement::where('statut', 'publié')
                ->lockForUpdate()
                ->findOrFail($data['evenement_id']);

            if ($evenement->nombre_places_disponibles < $data['nombre_places']) {
                return response()->json(['message' => 'Pas assez de places disponibles.'], 422);
            }

            $prixTotal = $evenement->prix_entree * $data['nombre_places'];

            $reservation = Reservation::create([
                'user_id'             => $user->id,
                'evenement_id'        => $evenement->id,
                'numero_reservation'  => 'RES-' . date('Ymd') . '-' . strtoupper(Str::random(6)),
                'type'                => 'evenement',
                'statut'              => 'en_attente',
                'nombre_places'       => $data['nombre_places'],
                'date_evenement'      => $evenement->date_debut,
                'prix_unitaire'       => $evenement->prix_entree,
                'prix_total'          => $prixTotal,
                'notes_particulieres' => $data['notes_particulieres'] ?? null,
            ]);

            $evenement->decrement('nombre_places_disponibles', $data['nombre_places']);
        }

        return response()->json($reservation->load(['hebergement', 'evenement']), 201);
    }

    public function show(Request $request, string $ref): JsonResponse
    {
        $reservation = Reservation::where('numero_reservation', $ref)
            ->where('user_id', $request->user()->id)
            ->with(['hebergement', 'evenement', 'paiement', 'user:id,prenom,nom,email,telephone,adresse,ville'])
            ->firstOrFail();

        return response()->json($reservation);
    }

    public function annuler(Request $request, string $ref): JsonResponse
    {
        $reservation = Reservation::where('numero_reservation', $ref)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if (!$reservation->peutEtreAnnulee()) {
            return response()->json(['message' => 'Cette réservation ne peut plus être annulée.'], 422);
        }

        $request->validate(['motif' => 'nullable|string|max:500']);

        $reservation->update([
            'statut'                   => 'annulée',
            'motif_annulation'         => $request->motif,
            'date_demande_annulation'  => now(),
            'date_annulation'          => now(),
        ]);

        if ($reservation->type === 'evenement' && $reservation->evenement_id) {
            Evenement::where('id', $reservation->evenement_id)
                ->increment('nombre_places_disponibles', $reservation->nombre_places ?? 0);
        }

        return response()->json(['message' => 'Réservation annulée.', 'reservation' => $reservation]);
    }

    public function recu(Request $request, string $ref): JsonResponse
    {
        $reservation = Reservation::where('numero_reservation', $ref)
            ->where('user_id', $request->user()->id)
            ->with(['hebergement', 'evenement', 'paiement', 'user'])
            ->firstOrFail();

        return response()->json([
            'reservation' => $reservation,
            'recu'        => [
                'numero'       => $reservation->numero_reservation,
                'date_emission'=> now()->toDateTimeString(),
                'montant'      => $reservation->prix_total,
                'statut'       => $reservation->statut_paiement,
            ],
        ]);
    }
}
