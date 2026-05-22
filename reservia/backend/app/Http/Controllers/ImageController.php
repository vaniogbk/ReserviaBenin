<?php
// ================================================================
//  app/Http/Controllers/ImageController.php
//
//  Routes :
//    POST   /api/v1/hebergements/{id}/images        → upload
//    DELETE /api/v1/hebergements/{id}/images/une    → supprimer une image
//    POST   /api/v1/evenements/{id}/images          → upload
//    DELETE /api/v1/evenements/{id}/images/une      → supprimer une image
//    PATCH  /api/v1/hebergements/{id}/images/principale → changer image principale
//    PATCH  /api/v1/evenements/{id}/images/principale   → changer image principale
// ================================================================

namespace App\Http\Controllers;

use App\Models\Hebergement;
use App\Models\Evenement;
use App\Services\ImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function __construct(private ImageService $imageService) {}

    // ==============================================================
    //  HÉBERGEMENTS
    // ==============================================================

    /**
     * POST /api/v1/hebergements/{hebergement}/images
     * Champs multipart : image_principale (file) et/ou autres_images[] (files)
     */
    public function uploadHebergement(Request $request, Hebergement $hebergement): JsonResponse
    {
        // Seul le propriétaire ou un admin peut uploader
        $this->autoriser($hebergement->user_id);

        $request->validate([
            'image_principale'   => 'nullable|file|mimes:jpeg,jpg,png,webp|max:5120',
            'autres_images'      => 'nullable|array|max:9',
            'autres_images.*'    => 'file|mimes:jpeg,jpg,png,webp|max:5120',
        ]);

        $mises_a_jour = [];

        // --- Image principale ---
        if ($request->hasFile('image_principale')) {
            // Supprimer l'ancienne si elle existe
            $this->imageService->supprimer($hebergement->image_principale);

            $chemin = $this->imageService->upload(
                $request->file('image_principale'),
                'hebergements'
            );
            $hebergement->update(['image_principale' => $chemin]);
            $mises_a_jour['image_principale'] = ImageService::url($chemin);
        }

        // --- Autres images ---
        if ($request->hasFile('autres_images')) {
            $existantes = $hebergement->autres_images ?? [];

            foreach ($request->file('autres_images') as $fichier) {
                $chemin      = $this->imageService->upload($fichier, 'hebergements');
                $existantes[] = $chemin;
            }

            $hebergement->update(['autres_images' => $existantes]);
            $mises_a_jour['autres_images'] = array_map(
                fn($c) => ImageService::url($c),
                $existantes
            );
        }

        if (empty($mises_a_jour)) {
            return response()->json(['message' => 'Aucun fichier fourni.'], 422);
        }

        return response()->json([
            'message'      => 'Images mises à jour avec succès.',
            'hebergement'  => $mises_a_jour,
        ], 200);
    }

    /**
     * DELETE /api/v1/hebergements/{hebergement}/images/une
     * Body JSON : { "chemin": "hebergements/2024/01/uuid.webp", "type": "principale|autre" }
     */
    public function supprimerImageHebergement(Request $request, Hebergement $hebergement): JsonResponse
    {
        $this->autoriser($hebergement->user_id);

        $request->validate([
            'chemin' => 'required|string',
            'type'   => 'required|in:principale,autre',
        ]);

        $chemin = $request->input('chemin');

        if ($request->input('type') === 'principale') {
            $this->imageService->supprimer($hebergement->image_principale);
            $hebergement->update(['image_principale' => null]);
        } else {
            $autres = collect($hebergement->autres_images ?? [])
                ->reject(fn($c) => $c === $chemin)
                ->values()
                ->all();

            $this->imageService->supprimer($chemin);
            $hebergement->update(['autres_images' => $autres]);
        }

        return response()->json(['message' => 'Image supprimée.']);
    }

    /**
     * PATCH /api/v1/hebergements/{hebergement}/images/principale
     * Body JSON : { "chemin": "hebergements/2024/01/uuid.webp" }
     * Promouvoir une image de autres_images vers image_principale
     */
    public function setPrincipaleHebergement(Request $request, Hebergement $hebergement): JsonResponse
    {
        $this->autoriser($hebergement->user_id);

        $request->validate(['chemin' => 'required|string']);
        $nouveauChemin  = $request->input('chemin');
        $ancienPrincipal = $hebergement->image_principale;

        // Retirer le nouveau chemin des autres_images
        $autres = collect($hebergement->autres_images ?? [])
            ->reject(fn($c) => $c === $nouveauChemin)
            ->values()
            ->all();

        // Mettre l'ancienne principale dans autres_images (si elle existait)
        if ($ancienPrincipal) {
            $autres[] = $ancienPrincipal;
        }

        $hebergement->update([
            'image_principale' => $nouveauChemin,
            'autres_images'    => $autres,
        ]);

        return response()->json([
            'message'          => 'Image principale mise à jour.',
            'image_principale' => ImageService::url($nouveauChemin),
        ]);
    }

    // ==============================================================
    //  ÉVÉNEMENTS  (même logique)
    // ==============================================================

    /**
     * POST /api/v1/evenements/{evenement}/images
     */
    public function uploadEvenement(Request $request, Evenement $evenement): JsonResponse
    {
        $this->autoriser($evenement->user_id);

        $request->validate([
            'image_principale' => 'nullable|file|mimes:jpeg,jpg,png,webp|max:5120',
            'autres_images'    => 'nullable|array|max:9',
            'autres_images.*'  => 'file|mimes:jpeg,jpg,png,webp|max:5120',
        ]);

        $mises_a_jour = [];

        if ($request->hasFile('image_principale')) {
            $this->imageService->supprimer($evenement->image_principale);
            $chemin = $this->imageService->upload($request->file('image_principale'), 'evenements');
            $evenement->update(['image_principale' => $chemin]);
            $mises_a_jour['image_principale'] = ImageService::url($chemin);
        }

        if ($request->hasFile('autres_images')) {
            $existantes = $evenement->autres_images ?? [];
            foreach ($request->file('autres_images') as $fichier) {
                $chemin = $this->imageService->upload($fichier, 'evenements');
                $existantes[] = $chemin;
            }
            $evenement->update(['autres_images' => $existantes]);
            $mises_a_jour['autres_images'] = array_map(fn($c) => ImageService::url($c), $existantes);
        }

        if (empty($mises_a_jour)) {
            return response()->json(['message' => 'Aucun fichier fourni.'], 422);
        }

        return response()->json([
            'message'    => 'Images mises à jour avec succès.',
            'evenement'  => $mises_a_jour,
        ]);
    }

    /**
     * DELETE /api/v1/evenements/{evenement}/images/une
     */
    public function supprimerImageEvenement(Request $request, Evenement $evenement): JsonResponse
    {
        $this->autoriser($evenement->user_id);

        $request->validate([
            'chemin' => 'required|string',
            'type'   => 'required|in:principale,autre',
        ]);

        $chemin = $request->input('chemin');

        if ($request->input('type') === 'principale') {
            $this->imageService->supprimer($evenement->image_principale);
            $evenement->update(['image_principale' => null]);
        } else {
            $autres = collect($evenement->autres_images ?? [])
                ->reject(fn($c) => $c === $chemin)
                ->values()
                ->all();
            $this->imageService->supprimer($chemin);
            $evenement->update(['autres_images' => $autres]);
        }

        return response()->json(['message' => 'Image supprimée.']);
    }

    /**
     * PATCH /api/v1/evenements/{evenement}/images/principale
     */
    public function setPrincipaleEvenement(Request $request, Evenement $evenement): JsonResponse
    {
        $this->autoriser($evenement->user_id);

        $request->validate(['chemin' => 'required|string']);
        $nouveauChemin   = $request->input('chemin');
        $ancienPrincipal = $evenement->image_principale;

        $autres = collect($evenement->autres_images ?? [])
            ->reject(fn($c) => $c === $nouveauChemin)
            ->values()
            ->all();

        if ($ancienPrincipal) $autres[] = $ancienPrincipal;

        $evenement->update([
            'image_principale' => $nouveauChemin,
            'autres_images'    => $autres,
        ]);

        return response()->json([
            'message'          => 'Image principale mise à jour.',
            'image_principale' => ImageService::url($nouveauChemin),
        ]);
    }

    // ==============================================================
    //  Helper : vérifier que l'utilisateur connecté est autorisé
    // ==============================================================
    private function autoriser(int $proprietaireId): void
    {
        $user = auth()->user();
        if (!$user) abort(401, 'Non authentifié.');
        if ($user->role !== 'admin' && $user->id !== $proprietaireId) {
            abort(403, 'Action non autorisée.');
        }
    }
}
