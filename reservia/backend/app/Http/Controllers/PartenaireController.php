<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PartenaireController extends Controller
{
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
                    'subject'     => "Nouvelle candidature partenaire : {$d['nom_etablissement']}",
                    'htmlContent' => $html,
                ]);
        } catch (\Throwable $e) {
            Log::error('Partenaire notify admin failed: ' . $e->getMessage());
        }
    }

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
            <p style='font-size:20px;font-weight:700;color:#1E1810;margin:0 0 12px'>
              Candidature bien reçue !
            </p>
            <p style='color:#C8A97A;font-size:15px;line-height:1.6;margin:0 0 20px'>
              Bonjour <strong style='color:#1E1810'>{$d['prenom_responsable']}</strong>,<br>
              Votre candidature pour <strong style='color:#1E1810'>{$d['nom_etablissement']}</strong>
              a bien été enregistrée. Notre équipe l'examinera et vous contactera sous
              <strong style='color:#1E1810'>48 heures ouvrées</strong>.
            </p>
            <div style='background:#f5efe0;border-radius:12px;padding:16px 20px;margin:20px 0'>
              <p style='margin:0;font-size:13px;color:#C8A97A'>Pour toute question :</p>
              <a href='mailto:partenaires@reservia-benin.com'
                style='color:#C4603A;font-weight:600;font-size:14px'>
                partenaires@reservia-benin.com
              </a>
            </div>
            <p style='color:#C8A97A;font-size:13px;margin:0'>
              L'équipe Réservia Bénin
            </p>
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
}
