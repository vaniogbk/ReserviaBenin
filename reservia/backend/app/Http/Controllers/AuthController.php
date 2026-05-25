<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    // ── Anti-bot : valide le token hCaptcha ───────────────────────────────────
    private function validateHcaptcha(?string $token): bool
    {
        // Token absent : le widget n'a pas pu se charger → on laisse passer (fail-open)
        if (empty($token)) {
            return true;
        }

        // Clé secrète de test hCaptcha → toujours valide
        $secret = config('services.hcaptcha.secret', '0x0000000000000000000000000000000000000000');

        try {
            $res = Http::asForm()->timeout(5)->post('https://api.hcaptcha.com/siteverify', [
                'secret'   => $secret,
                'response' => $token,
            ]);
            return $res->json('success', false);
        } catch (\Throwable $e) {
            Log::warning('hCaptcha unreachable: ' . $e->getMessage());
            return true; // fail-open si le service hCaptcha est inaccessible
        }
    }

    // ── Envoi OTP via Brevo HTTP API (pas de SMTP) ───────────────────────────
    private function sendOtpEmail(User $user, string $otp): void
    {
        $apiKey = config('services.brevo.api_key');
        if (empty($apiKey)) {
            Log::warning('BREVO_API_KEY non configuré — e-mail OTP non envoyé.');
            return;
        }

        $html = view('emails.otp_verification', ['user' => $user, 'otp' => $otp])->render();

        try {
            $res = Http::timeout(5)
                ->withHeaders(['api-key' => $apiKey, 'Content-Type' => 'application/json'])
                ->post('https://api.brevo.com/v3/smtp/email', [
                    'sender'      => ['name' => config('mail.from.name', 'Reservia Bénin'), 'email' => config('mail.from.address', 'reserviabenin@gmail.com')],
                    'to'          => [['email' => $user->email, 'name' => $user->prenom . ' ' . $user->nom]],
                    'subject'     => 'Votre code de vérification — Reservia Bénin',
                    'htmlContent' => $html,
                ]);

            if (!$res->successful()) {
                Log::error('Brevo API error: ' . $res->body());
            }
        } catch (\Throwable $e) {
            Log::error('Brevo API exception: ' . $e->getMessage());
        }
    }

    // ── Génère et met en cache un OTP 6 chiffres (15 min) ────────────────────
    private function generateOtp(int $userId): string
    {
        $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        Cache::put("otp_verify_{$userId}", $otp, now()->addMinutes(15));
        return $otp;
    }

    // ── Masque un e-mail pour l'affichage (ex: k***@gmail.com) ───────────────
    private function maskEmail(string $email): string
    {
        [$local, $domain] = explode('@', $email);
        return mb_substr($local, 0, 1) . '***@' . $domain;
    }

    // ── Inscription ───────────────────────────────────────────────────────────
    public function register(Request $request): JsonResponse
    {
        // Vérification anti-robot
        if (!$this->validateHcaptcha($request->input('hcaptcha_token'))) {
            return response()->json(['message' => 'Vérification anti-robot échouée. Réessayez.'], 422);
        }

        $data = $request->validate([
            'nom'                  => 'required|string|max:255',
            'prenom'               => 'required|string|max:255',
            'email'                => 'required|email|unique:users,email',
            'password'             => ['required', 'confirmed', Password::min(12)->mixedCase()->numbers()],
            'telephone'            => 'nullable|string|max:20',
            'accepte_conditions'   => 'required|accepted',
        ]);

        $user = User::create([
            'nom'                => $data['nom'],
            'prenom'             => $data['prenom'],
            'email'              => $data['email'],
            'password'           => Hash::make($data['password']),
            'telephone'          => $data['telephone'] ?? null,
            'accepte_conditions' => true,
        ]);

        // Envoi du code OTP par e-mail
        $otp = $this->generateOtp($user->id);
        $this->sendOtpEmail($user, $otp);

        return response()->json([
            'requires_verification' => true,
            'user_id'               => $user->id,
            'email_masque'          => $this->maskEmail($user->email),
        ], 201);
    }

    // ── Vérification OTP ─────────────────────────────────────────────────────
    public function verifyOtp(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'otp'     => 'required|string|size:6',
        ]);

        $user   = User::findOrFail($data['user_id']);
        $cached = Cache::get("otp_verify_{$user->id}");

        if (!$cached || $cached !== $data['otp']) {
            return response()->json(['message' => 'Code incorrect ou expiré. Demandez un nouveau code.'], 422);
        }

        $user->markEmailAsVerified();
        Cache::forget("otp_verify_{$user->id}");

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
    }

    // ── Renvoi du code OTP ────────────────────────────────────────────────────
    public function resendOtp(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $user = User::findOrFail($data['user_id']);

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'E-mail déjà vérifié.'], 422);
        }

        // Anti-abus : 1 renvoi par minute
        $cooldownKey = "otp_resend_cooldown_{$user->id}";
        if (Cache::has($cooldownKey)) {
            return response()->json(['message' => 'Attendez 60 secondes avant de renvoyer le code.'], 429);
        }

        $otp = $this->generateOtp($user->id);
        Cache::put($cooldownKey, true, now()->addMinute());
        $this->sendOtpEmail($user, $otp);

        return response()->json(['message' => 'Code renvoyé à ' . $this->maskEmail($user->email)]);
    }

    // ── Connexion ─────────────────────────────────────────────────────────────
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Identifiants incorrects.'], 401);
        }

        if ($user->statut !== 'actif') {
            return response()->json(['message' => 'Compte suspendu ou inactif.'], 403);
        }

        // E-mail non vérifié → renvoyer un OTP et demander vérification
        if (!$user->hasVerifiedEmail()) {
            $otp = $this->generateOtp($user->id);
            $this->sendOtpEmail($user, $otp);

            return response()->json([
                'requires_verification' => true,
                'user_id'               => $user->id,
                'email_masque'          => $this->maskEmail($user->email),
                'message'               => 'Veuillez vérifier votre e-mail. Un nouveau code vous a été envoyé.',
            ], 403);
        }

        $user->update(['date_dernier_login' => now()]);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
    }

    // ── Déconnexion ───────────────────────────────────────────────────────────
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès.']);
    }

    // ── Profil courant ────────────────────────────────────────────────────────
    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    // ── Mise à jour du profil ─────────────────────────────────────────────────
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'nom'       => 'sometimes|string|max:255',
            'prenom'    => 'sometimes|string|max:255',
            'telephone' => 'sometimes|nullable|string|max:20',
            'adresse'   => 'sometimes|nullable|string|max:255',
            'ville'     => 'sometimes|nullable|string|max:100',
            'bio'       => 'sometimes|nullable|string|max:1000',
            'password'  => ['sometimes', 'confirmed', Password::min(12)->mixedCase()->numbers()],
        ]);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);
        return response()->json($user->fresh());
    }
}
