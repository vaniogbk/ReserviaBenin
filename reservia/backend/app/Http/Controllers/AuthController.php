<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
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

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ], 201);
    }

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

        $user->update(['date_dernier_login' => now()]);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

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
