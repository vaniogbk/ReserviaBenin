<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HebergementController;
use App\Http\Controllers\EvenementController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\PartenaireController;

// ── Fix temporaire : activation des comptes (à supprimer après usage) ──
Route::get('/fix-accounts-x7k2m', function () {
    $count = DB::table('users')->whereNull('email_verified_at')->count();
    DB::table('users')->whereNull('email_verified_at')->update(['email_verified_at' => now()]);
    return response()->json(['ok' => true, 'comptes_actives' => $count]);
});

// ── Préfixe v1 ──────────────────────────────────────────────
Route::prefix('v1')->group(function () {

    // ── Auth ──
    Route::post('/register',            [AuthController::class, 'register']);
    Route::post('/login',               [AuthController::class, 'login']);
    Route::post('/email/verify-otp',    [AuthController::class, 'verifyOtp'])->middleware('throttle:5,1');
    Route::post('/email/resend-otp',    [AuthController::class, 'resendOtp'])->middleware('throttle:3,1');

    // ── Public : Hébergements ──
    Route::get('/hebergements',                       [HebergementController::class, 'index']);
    Route::get('/hebergements/{id}',                  [HebergementController::class, 'show']);
    Route::get('/hebergements/{id}/chambres',         [HebergementController::class, 'chambres']);
    Route::get('/hebergements/{id}/disponibilites',   [HebergementController::class, 'disponibilites']);

    // ── Public : Événements ──
    Route::get('/evenements',            [EvenementController::class, 'index']);
    Route::get('/evenements/{id}',       [EvenementController::class, 'show']);

    // ── Partenaires ──
    Route::post('/partenaires/candidature', [PartenaireController::class, 'candidature'])->middleware('throttle:3,5');

    // ── Health check ──
    Route::get('/health', fn() => response()->json(['status' => 'ok', 'timestamp' => now()]));

    // ── Authentifié ──
    Route::middleware('auth:sanctum')->group(function () {

        // Auth
        Route::post('/logout',  [AuthController::class, 'logout']);
        Route::get('/user',     [AuthController::class, 'me']);
        Route::put('/user',     [AuthController::class, 'update']);

        // Réservations
        Route::get('/reservations',              [ReservationController::class, 'index']);
        Route::post('/reservations',             [ReservationController::class, 'store']);
        Route::get('/reservations/{ref}',        [ReservationController::class, 'show']);
        Route::patch('/reservations/{ref}/annuler', [ReservationController::class, 'annuler']);
        Route::get('/reservations/{ref}/recu',   [ReservationController::class, 'recu']);

        // Paiements
        Route::post('/paiements/initier',          [PaiementController::class, 'initier']);
        Route::post('/paiements/{id}/confirmer',   [PaiementController::class, 'confirmerSandbox']);
        Route::get('/paiements/{id}/statut',       [PaiementController::class, 'statut']);

        // Images Hébergements
        Route::post('/hebergements/{hebergement}/images',             [ImageController::class, 'uploadHebergement']);
        Route::delete('/hebergements/{hebergement}/images/une',       [ImageController::class, 'supprimerImageHebergement']);
        Route::patch('/hebergements/{hebergement}/images/principale', [ImageController::class, 'setPrincipaleHebergement']);

        // Images Événements
        Route::post('/evenements/{evenement}/images',                 [ImageController::class, 'uploadEvenement']);
        Route::delete('/evenements/{evenement}/images/une',           [ImageController::class, 'supprimerImageEvenement']);
        Route::patch('/evenements/{evenement}/images/principale',     [ImageController::class, 'setPrincipaleEvenement']);

        // Admin
        Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
            Route::get('/dashboard',                    [DashboardController::class, 'index']);
            Route::get('/reservations',                 [DashboardController::class, 'reservations']);
            Route::get('/utilisateurs',                 [DashboardController::class, 'utilisateurs']);
            Route::patch('/utilisateurs/{id}/role',     [DashboardController::class, 'updateRole']);
            Route::get('/statistiques',                 [DashboardController::class, 'statistiques']);
            Route::delete('/hebergements/{id}',         [HebergementController::class, 'destroy']);
            Route::delete('/evenements/{id}',           [EvenementController::class, 'destroy']);
        });
    });
});