<?php

namespace App\Http\Controllers;

use App\Models\Paiement;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Gère le cycle de vie des paiements en mode sandbox.
 * En production, remplacer confirmerSandbox() par un vrai webhook FedaPay/MTN.
 */
class PaiementController extends Controller
{
    /**
     * Initie un paiement pour une réservation.
     * Retourne les données nécessaires pour afficher le formulaire sandbox.
     */
    public function initier(Request $request): JsonResponse
    {
        $data = $request->validate([
            'numero_reservation' => 'required|string|exists:reservations,numero_reservation',
            'methode'            => 'required|in:carte_credit,mobile_money,mtn_momo,moov_money,fedapay,paypal',
        ]);

        $reservation = Reservation::where('numero_reservation', $data['numero_reservation'])
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($reservation->statut_paiement === 'payé') {
            return response()->json(['message' => 'Cette réservation est déjà payée.'], 422);
        }

        // Supprimer un éventuel paiement en attente existant
        Paiement::where('reservation_id', $reservation->id)
            ->where('statut', 'en_attente')
            ->delete();

        $paiement = Paiement::create([
            'reservation_id'     => $reservation->id,
            'user_id'            => $request->user()->id,
            'reference_paiement' => 'PAY-' . date('Ymd') . '-' . strtoupper(Str::random(8)),
            'provider'           => 'sandbox',
            'statut'             => 'en_attente',
            'methode'            => $data['methode'],
            'montant'            => $reservation->prix_total,
            'devise'             => 'XOF',
            'description'        => 'Réservation ' . $reservation->numero_reservation,
            'date_tentative'     => now(),
            'metadata'           => ['sandbox' => true, 'mode' => 'test'],
        ]);

        return response()->json([
            'paiement_id' => $paiement->id,
            'reference'   => $paiement->reference_paiement,
            'montant'     => $paiement->montant,
            'devise'      => $paiement->devise,
            'sandbox'     => true,
        ], 201);
    }

    /**
     * Confirme un paiement en mode sandbox.
     * Simule la validation sans appeler un vrai prestataire.
     * En production : remplacer par le webhook FedaPay/MTN MoMo.
     */
    public function confirmerSandbox(Request $request, int $id): JsonResponse
    {
        $paiement = Paiement::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->where('statut', 'en_attente')
            ->firstOrFail();

        // Valider les données sandbox selon la méthode
        $methode = $paiement->methode;
        $isCarteOuFedapay = in_array($methode, ['carte_credit', 'fedapay']);
        $isPaypal = $methode === 'paypal';

        if ($isCarteOuFedapay) {
            $request->validate([
                'numero_carte' => 'required|string|min:16|max:19',
                'expiration'   => ['required', 'string', 'regex:/^\d{2}\/\d{2}$/'],
                'cvv'          => 'required|string|min:3|max:4',
                'nom_carte'    => 'required|string|min:3',
            ]);
        } elseif ($isPaypal) {
            $request->validate([
                'paypal_email' => 'required|email',
            ]);
        } else {
            // Mobile Money (MTN MoMo, Moov Money) — new 10-digit Benin format: 01XXXXXXXX
            $request->validate([
                'telephone' => ['required', 'string', 'regex:/^(\+229|00229)?01[0-9]{8}$/'],
            ]);
        }

        // Simuler une transaction réussie
        $paiement->update([
            'statut'           => 'succes',
            'transaction_id'   => 'SANDBOX-TXN-' . strtoupper(Str::random(12)),
            'date_succes'      => now(),
            'metadata'         => array_merge($paiement->metadata ?? [], [
                'sandbox'          => true,
                'confirmed_at'     => now()->toIso8601String(),
                'simulated_method' => $methode,
            ]),
        ]);

        // Marquer la réservation comme confirmée et payée
        $paiement->reservation->update([
            'statut'          => 'confirmée',
            'statut_paiement' => 'payé',
        ]);

        return response()->json([
            'success'            => true,
            'reference'          => $paiement->reference_paiement,
            'transaction_id'     => $paiement->transaction_id,
            'numero_reservation' => $paiement->reservation->numero_reservation,
            'montant'            => $paiement->montant,
        ]);
    }

    /**
     * Retourne le statut d'un paiement.
     */
    public function statut(Request $request, int $id): JsonResponse
    {
        $paiement = Paiement::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->with('reservation')
            ->firstOrFail();

        return response()->json($paiement);
    }
}
