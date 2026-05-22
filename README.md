# Réservia Bénin

Plateforme de réservation d'hébergements et d'événements au Bénin.  
Backend Laravel 11 · Frontend React/Vite · Paiement Mobile Money & Carte

---

## Architecture

```
reservia/
├── backend/     Laravel 11 — API REST, Sanctum, MySQL
└── frontend/    React 18 + Vite + TailwindCSS
```

## Lancement en local

### Backend

```bash
cd reservia/backend
cp .env.example .env          # puis renseigner DB_* et APP_KEY
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8765 --docroot=public
```

### Frontend

```bash
cd reservia/frontend
cp .env.example .env.local    # VITE_API_URL=http://127.0.0.1:8765/api/v1
npm install
npm run dev                    # http://localhost:5173
```

## Déploiement

| Service    | Hôte     | Config               |
|------------|----------|----------------------|
| Frontend   | Vercel   | `reservia/frontend/vercel.json` |
| Backend    | Railway  | `reservia/backend/railway.toml` |
| Base MySQL | Railway  | Plugin MySQL intégré |

### Secrets GitHub Actions requis

| Secret              | Description                          |
|---------------------|--------------------------------------|
| `VERCEL_TOKEN`      | Token API Vercel                     |
| `VERCEL_ORG_ID`     | ID de l'organisation Vercel          |
| `VERCEL_PROJECT_ID` | ID du projet Vercel (frontend)       |
| `RAILWAY_TOKEN`     | Token API Railway                    |
| `VITE_API_URL`      | URL production de l'API backend      |

## Paiement sandbox

En mode test, utilisez :
- **Carte** : 4242 4242 4242 4242 · Expiry 12/26 · CVV 123
- **MTN MoMo / Moov Money** : n'importe quel numéro à 10 chiffres

## Technologies

- PHP 8.2 · Laravel 11 · Laravel Sanctum
- React 18 · Vite 5 · TailwindCSS 3
- TanStack Query · React Hook Form · React Icons
- MySQL 8

---

*Projet de fin d'études — Réservia Bénin © 2025*
