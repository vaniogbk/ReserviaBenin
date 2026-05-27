<?php

namespace App\Http\Controllers;

use App\Models\Candidature;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PartenaireController extends Controller
{
    // ── Soumission d'une candidature ─────────────────────────────────────────
    public function candidature(Request $request): JsonResponse
    {
        $data = $request->validate([
            'type_activite'       => 'required|in:hebergement,evenement,restaurant,autre',
            'nom_etablissement'   => 'required|string|max:255',
            'prenom_responsable'  => 'required|string|max:100',
            'nom_responsable'     => 'required|string|max:100',
            'email'               => 'required|email|max:255',
            'telephone'           => 'required|string|max:20',
            'ville'               => 'required|string|max:100',
            'message'             => 'nullable|string|max:2000',
            'accepte'             => 'required|accepted',
        ]);

        // Persister en base pour la gestion admin
        Candidature::create([
            'nom_etablissement'  => $data['nom_etablissement'],
            'prenom_responsable' => $data['prenom_responsable'],
            'nom_responsable'    => $data['nom_responsable'],
            'email'              => $data['email'],
            'telephone'          => $data['telephone'],
            'ville'              => $data['ville'],
            'type_activite'      => $data['type_activite'],
            'message'            => $data['message'] ?? null,
            'statut'             => 'en_attente',
        ]);

        $labels = [
            'hebergement' => 'Hôtel / Auberge / Maison d\'hôtes',
            'evenement'   => 'Organisateur d\'événements',
            'restaurant'  => 'Restaurant / Bar / Espace de fête',
            'autre'       => 'Autre activité touristique',
        ];

        $this->notifyAdmin($data, $labels[$data['type_activite']] ?? $data['type_activite']);
        $this->confirmationCandidat($data);

        return response()->json(['message' => 'Candidature reçue. Nous vous contacterons sous 48h.']);
    }

    // ── Liste des candidatures (admin) ────────────────────────────────────────
    public function index(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $query = Candidature::orderByDesc('created_at');

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        $candidatures = $query->paginate(20);

        return response()->json($candidatures);
    }

    // ── Approuver une candidature ─────────────────────────────────────────────
    public function approuver(int $id): JsonResponse
    {
        /** @var \App\Models\User $admin */
        $admin = auth()->user();
        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $candidature = Candidature::findOrFail($id);
        $candidature->update(['statut' => 'approuvée']);

        // Promouvoir le compte existant ou envoyer une invitation
        $userExistant = User::where('email', $candidature->email)->first();
        if ($userExistant) {
            $userExistant->update([
                'role'          => 'host',
                'type_activite' => $candidature->type_activite,
                'statut'        => 'actif',
            ]);
        }

        $this->emailApprobation($candidature, $userExistant !== null);

        return response()->json([
            'message'        => 'Candidature approuvée.',
            'compte_promu'   => $userExistant !== null,
        ]);
    }

    // ── Rejeter une candidature ───────────────────────────────────────────────
    public function rejeter(Request $request, int $id): JsonResponse
    {
        /** @var \App\Models\User $admin */
        $admin = auth()->user();
        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $candidature = Candidature::findOrFail($id);
        $candidature->update([
            'statut'       => 'rejetée',
            'notes_admin'  => $request->input('notes_admin'),
        ]);

        $this->emailRejet($candidature);

        return response()->json(['message' => 'Candidature rejetée.']);
    }

    // ── E-mail : notification admin ───────────────────────────────────────────
    private function notifyAdmin(array $d, string $typeLabel): void
    {
        $apiKey = config('services.brevo.api_key');
        if (empty($apiKey)) return;

        $html = "
        <div style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f5efe0;padding:30px'>
          <div style='background:#1E1810;border-radius:16px;padding:24px 32px;margin-bottom:24px'>
            <h1 style='color:#C4603A;font-size:22px;margin:0'>Nouvelle candidature partenaire</h1>
          </div>
          <div style='background:#fff;border-radius:16px;padding:24px 32px'>
            <table style='width:100%;border-collapse:collapse'>
              <tr><td style='padding:8px 0;color:#C8A97A;font-size:13px;width:40%'>Type d'activité</td><td style='padding:8px 0;color:#1E1810;font-weight:bold'>{$typeLabel}</td></tr>
              <tr><td style='padding:8px 0;color:#C8A97A;font-size:13px'>Établissement</td><td style='padding:8px 0;color:#1E1810;font-weight:bold'>{$d['nom_etablissement']}</td></tr>
              <tr><td style='padding:8px 0;color:#C8A97A;font-size:13px'>Responsable</td><td style='padding:8px 0;color:#1E1810'>{$d['prenom_responsable']} {$d['nom_responsable']}</td></tr>
              <tr><td style='padding:8px 0;color:#C8A97A;font-size:13px'>E-mail</td><td style='padding:8px 0'><a href='mailto:{$d['email']}' style='color:#C4603A'>{$d['email']}</a></td></tr>
              <tr><td style='padding:8px 0;color:#C8A97A;font-size:13px'>Téléphone</td><td style='padding:8px 0;color:#1E1810'>+229 {$d['telephone']}</td></tr>
              <tr><td style='padding:8px 0;color:#C8A97A;font-size:13px'>Ville</td><td style='padding:8px 0;color:#1E1810'>{$d['ville']}</td></tr>
            </table>
            " . (!empty($d['message']) ? "<hr style='border:1px solid #F5EFE0;margin:16px 0'><p style='color:#C8A97A;font-size:13px;margin:0 0 8px'>Message :</p><p style='color:#1E1810;font-size:14px'>{$d['message']}</p>" : '') . "
          </div>
        </div>";

        try {
            Http::timeout(5)
                ->withHeaders(['api-key' => $apiKey, 'Content-Type' => 'application/json'])
                ->post('https://api.brevo.com/v3/smtp/email', [
                    'sender'      => ['name' => 'Réservia Bénin', 'email' => config('mail.from.address')],
                    'to'          => [['email' => config('mail.from.address'), 'name' => 'Admin Réservia']],
                    'subject'     => "Nouvelle candidature : {$d['nom_etablissement']}",
                    'htmlContent' => $html,
                ]);
        } catch (\Throwable $e) {
            Log::error('Partenaire notify admin failed: ' . $e->getMessage());
        }
    }

    // ── E-mail : confirmation au candidat ────────────────────────────────────
    private function confirmationCandidat(array $d): void
    {
        $apiKey = config('services.brevo.api_key');
        if (empty($apiKey)) return;

        $html = "
        <div style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f5efe0;padding:30px'>
          <div style='background:#1E1810;border-radius:16px;padding:24px 32px;margin-bottom:24px'>
            <p style='margin:0;font-size:22px;font-weight:700;color:#C8A97A'>
              Réser<em style='color:#C4603A'>via</em>
              <span style='font-size:11px;font-weight:400;opacity:.6;letter-spacing:2px;margin-left:4px'>BÉNIN</span>
            </p>
          </div>
          <div style='background:#fff;border-radius:16px;padding:32px'>
            <p style='font-size:20px;font-weight:700;color:#1E1810;margin:0 0 12px'>Candidature bien reçue !</p>
            <p style='color:#C8A97A;font-size:15px;line-height:1.6;margin:0 0 20px'>
              Bonjour <strong style='color:#1E1810'>{$d['prenom_responsable']}</strong>,<br>
              Votre candidature pour <strong style='color:#1E1810'>{$d['nom_etablissement']}</strong>
              a bien été enregistrée. Notre équipe l'examinera et vous contactera sous
              <strong style='color:#1E1810'>48 heures ouvrées</strong>.
            </p>
            <p style='color:#C8A97A;font-size:13px;margin:0'>L'équipe Réservia Bénin</p>
          </div>
        </div>";

        try {
            Http::timeout(5)
                ->withHeaders(['api-key' => $apiKey, 'Content-Type' => 'application/json'])
                ->post('https://api.brevo.com/v3/smtp/email', [
                    'sender'      => ['name' => 'Réservia Bénin', 'email' => config('mail.from.address')],
                    'to'          => [['email' => $d['email'], 'name' => $d['prenom_responsable'] . ' ' . $d['nom_responsable']]],
                    'subject'     => 'Votre candidature partenaire — Réservia Bénin',
                    'htmlContent' => $html,
                ]);
        } catch (\Throwable $e) {
            Log::error('Partenaire confirm email failed: ' . $e->getMessage());
        }
    }

    // ── E-mail : approbation partenaire ───────────────────────────────────────
    private function emailApprobation(Candidature $c, bool $compteExistant): void
    {
        $apiKey = config('services.brevo.api_key');
        if (empty($apiKey)) return;

        $frontendUrl = config('app.frontend_url', 'https://reserviabenin.vercel.app');
        $lien = $compteExistant ? "{$frontendUrl}/login" : "{$frontendUrl}/register";
        $action = $compteExistant ? 'Accéder à mon espace' : 'Créer mon compte';
        $message = $compteExistant
            ? 'Votre compte a été promu au statut de <strong>partenaire</strong>. Connectez-vous pour accéder à votre espace pro.'
            : 'Créez votre compte sur la plateforme pour accéder à votre espace partenaire.';

        $html = "
        <div style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f5efe0;padding:30px'>
          <div style='background:#1E1810;border-radius:16px;padding:24px 32px;margin-bottom:24px'>
            <p style='margin:0;font-size:22px;font-weight:700;color:#C8A97A'>
              Réser<em style='color:#C4603A'>via</em>
              <span style='font-size:11px;font-weight:400;opacity:.6;letter-spacing:2px;margin-left:4px'>BÉNIN</span>
            </p>
          </div>
          <div style='background:#fff;border-radius:16px;padding:32px'>
            <p style='font-size:20px;font-weight:700;color:#1E1810;margin:0 0 12px'>🎉 Candidature approuvée !</p>
            <p style='color:#C8A97A;font-size:15px;line-height:1.6;margin:0 0 20px'>
              Bonjour <strong style='color:#1E1810'>{$c->prenom_responsable}</strong>,<br>
              Félicitations ! Votre candidature pour <strong style='color:#1E1810'>{$c->nom_etablissement}</strong>
              a été <strong style='color:#2d6a4f'>approuvée</strong> par notre équipe.<br><br>
              {$message}
            </p>
            <a href='{$lien}' style='display:inline-block;background:#C4603A;color:#fff;padding:14px 28px;
              border-radius:12px;font-weight:700;text-decoration:none;font-size:15px;margin-bottom:24px'>
              {$action} →
            </a>
            <p style='color:#C8A97A;font-size:13px;margin:0'>L'équipe Réservia Bénin</p>
          </div>
        </div>";

        try {
            Http::timeout(5)
                ->withHeaders(['api-key' => $apiKey, 'Content-Type' => 'application/json'])
                ->post('https://api.brevo.com/v3/smtp/email', [
                    'sender'      => ['name' => 'Réservia Bénin', 'email' => config('mail.from.address')],
                    'to'          => [['email' => $c->email, 'name' => $c->prenom_responsable . ' ' . $c->nom_responsable]],
                    'subject'     => '✅ Votre candidature partenaire a été approuvée — Réservia Bénin',
                    'htmlContent' => $html,
                ]);
        } catch (\Throwable $e) {
            Log::error('Partenaire approbation email failed: ' . $e->getMessage());
        }
    }

    // ── E-mail : rejet partenaire ─────────────────────────────────────────────
    private function emailRejet(Candidature $c): void
    {
        $apiKey = config('services.brevo.api_key');
        if (empty($apiKey)) return;

        $html = "
        <div style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f5efe0;padding:30px'>
          <div style='background:#1E1810;border-radius:16px;padding:24px 32px;margin-bottom:24px'>
            <p style='margin:0;font-size:22px;font-weight:700;color:#C8A97A'>
              Réser<em style='color:#C4603A'>via</em>
            </p>
          </div>
          <div style='background:#fff;border-radius:16px;padding:32px'>
            <p style='font-size:18px;font-weight:700;color:#1E1810;margin:0 0 12px'>Suite à votre candidature</p>
            <p style='color:#C8A97A;font-size:15px;line-height:1.6;margin:0 0 20px'>
              Bonjour <strong style='color:#1E1810'>{$c->prenom_responsable}</strong>,<br>
              Après examen de votre dossier pour <strong style='color:#1E1810'>{$c->nom_etablissement}</strong>,
              nous ne sommes pas en mesure de donner suite à votre candidature pour le moment.<br><br>
              Vous pouvez soumettre une nouvelle candidature dans 3 mois.
            </p>
            <p style='color:#C8A97A;font-size:13px;margin:0'>L'équipe Réservia Bénin</p>
          </div>
        </div>";

        try {
            Http::timeout(5)
                ->withHeaders(['api-key' => $apiKey, 'Content-Type' => 'application/json'])
                ->post('https://api.brevo.com/v3/smtp/email', [
                    'sender'      => ['name' => 'Réservia Bénin', 'email' => config('mail.from.address')],
                    'to'          => [['email' => $c->email, 'name' => $c->prenom_responsable . ' ' . $c->nom_responsable]],
                    'subject'     => 'Votre candidature partenaire — Réservia Bénin',
                    'htmlContent' => $html,
                ]);
        } catch (\Throwable $e) {
            Log::error('Partenaire rejet email failed: ' . $e->getMessage());
        }
    }
}
