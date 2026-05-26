# Réservia Bénin

Plateforme web de réservation d'hébergements et d'événements au Bénin.  
Conçue pour mettre en valeur le tourisme béninois : écolodges, hôtels, villas, festivals vodoun, gastronomie locale.

**Production** → [reserviabenin.vercel.app](https://reserviabenin.vercel.app)

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Navigateur                          │
│           React 18 + Vite + TailwindCSS                 │
│              reserviabenin.vercel.app                   │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTPS / JSON (Bearer token)
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  API REST — Laravel 11                  │
│         reservia-backend-production.up.railway.app      │
│                                                         │
│  Auth (Sanctum)  │  Hébergements  │  Événements        │
│  Réservations    │  Paiements     │  Admin              │
└───────────────────────┬─────────────────────────────────┘
                        │
          ┌─────────────┴──────────────┐
          ▼                            ▼
   MySQL 8 (Railway)           Brevo REST API
   6 tables principales        Envoi OTP + emails
```

```
reservia/
├── backend/     Laravel 11 · PHP 8.2 · Sanctum · MySQL
└── frontend/    React 18 · Vite 5 · TailwindCSS 3
```

---

## Fonctionnalités

| Domaine | Fonctionnalité |
|---------|---------------|
| Authentification | Inscription, connexion, vérification OTP par e-mail (Brevo) |
| Hébergements | Catalogue filtrable par type, département, prix, équipements |
| Hébergements | Fiches détaillées avec galerie, chambres & suites, widget de réservation sticky |
| Chambres | Filtre dynamique par équipements (piscine, jacuzzi, vue mer, etc.) |
| Événements | Catalogue par catégorie (vodoun, gastronomie, culture, séminaire...) |
| Réservation | Tunnel 3 étapes : infos → récapitulatif → paiement |
| Paiement | Sandbox MTN MoMo, Moov Money, Carte Visa/Mastercard |
| Événements gratuits | Confirmation immédiate sans étape paiement |
| Confirmation | Page de confirmation + téléchargement reçu PDF |
| Profil | Historique des réservations, annulation sous 48h |
| Partenaires | Formulaire de candidature avec confirmation e-mail automatique |
| Admin | Dashboard KPIs, gestion réservations/hébergements/événements/utilisateurs |
| Pages légales | Mentions légales, Politique de confidentialité, CGU |

---

## Stack technique

**Backend**
- PHP 8.2 · Laravel 11 · Laravel Sanctum
- MySQL 8 (Railway) · Eloquent ORM
- Brevo REST API (e-mails transactionnels)
- DomPDF (génération reçus PDF)
- Déployé sur Railway (Docker)

**Frontend**
- React 18 · Vite 5 · TailwindCSS 3
- TanStack Query (cache & état serveur)
- React Hook Form · React Hot Toast · React Icons
- Axios · date-fns · html2canvas
- Déployé sur Vercel

---

## Lancement en local

### Prérequis
- PHP 8.2+ et Composer
- Node.js 18+ et npm
- MySQL 8+

### Backend
```bash
cd reservia/backend
cp .env.example .env
# Renseigner : DB_*, APP_KEY, BREVO_API_KEY, MAIL_FROM_ADDRESS
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8765
# API disponible sur http://127.0.0.1:8765/api/v1
```

### Frontend
```bash
cd reservia/frontend
cp .env.example .env.local
# Définir : VITE_API_URL=http://127.0.0.1:8765/api/v1
npm install
npm run dev
# Interface sur http://localhost:5173
```

---

## Variables d'environnement

### Backend (`.env`)
| Variable | Description |
|----------|-------------|
| `APP_KEY` | Clé secrète Laravel (générée par `artisan key:generate`) |
| `DB_HOST` / `DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` | Connexion MySQL |
| `BREVO_API_KEY` | Clé API Brevo v3 — envoi OTP et e-mails partenaires |
| `MAIL_FROM_ADDRESS` | Adresse expéditeur vérifiée dans Brevo |
| `FRONTEND_URL` | URL Vercel — utilisée pour les headers CORS |

### Frontend (`.env.local`)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | URL complète de l'API (ex: `https://...railway.app/api/v1`) |

---

## API — Principaux endpoints

```
# Public
GET    /api/v1/hebergements              Liste filtrée (ville, type, département, prix, équipements)
GET    /api/v1/hebergements/{id}         Détail hébergement
GET    /api/v1/hebergements/{id}/chambres        Chambres disponibles
GET    /api/v1/hebergements/{id}/disponibilites  Dates réservées
GET    /api/v1/evenements                Liste filtrée (catégorie, ville)
GET    /api/v1/evenements/{id}           Détail événement

# Authentification
POST   /api/v1/register                 Inscription (déclenche OTP)
POST   /api/v1/login                    Connexion → Bearer token
POST   /api/v1/email/verify-otp         Vérification code OTP

# Authentifié (Bearer token requis)
POST   /api/v1/reservations             Créer une réservation
GET    /api/v1/reservations             Mes réservations
GET    /api/v1/reservations/{ref}       Détail réservation
PATCH  /api/v1/reservations/{ref}/annuler  Annuler
GET    /api/v1/reservations/{ref}/recu  Télécharger reçu PDF
POST   /api/v1/paiements/initier        Initier paiement sandbox

# Admin
GET    /api/v1/admin/dashboard          KPIs globaux
GET    /api/v1/admin/reservations       Toutes les réservations
GET    /api/v1/admin/utilisateurs       Gestion utilisateurs
```

---

## Comptes de test

| Rôle | E-mail | Mot de passe |
|------|--------|--------------|
| Admin | admin@reservia.bj | Admin@2024Secure |
| Hôte | maurice@hebergements.bj | Host@2024Secure |
| Client | client1@reservia.bj | Client@2024 |

**Paiement sandbox**
- Carte : `4242 4242 4242 4242` · Expiry `12/26` · CVV `123`
- MTN MoMo / Moov Money : n'importe quel numéro à 8 ou 10 chiffres

---

## Déploiement

| Service | Plateforme | Configuration |
|---------|------------|---------------|
| Frontend | Vercel | `reservia/frontend/vercel.json` |
| Backend | Railway | `reservia/backend/railway.toml` + `Dockerfile` |
| Base MySQL | Railway | Plugin MySQL intégré |
| E-mails | Brevo | Clé API dans variables Railway |

Le backend exécute `start.sh` au démarrage : migrations automatiques, puis seed si la base est vide.

```bash
# Déployer le frontend
cd reservia/frontend && vercel --prod

# Déployer le backend
railway up --service backend --detach
```

---

## Structure des pages

```
/                     Accueil — hero, recherche, hébergements vedettes, événements
/hebergements         Catalogue avec filtres (type, département, prix, équipements)
/hebergements/:id     Fiche détaillée + galerie + chambres filtrables + réservation
/evenements           Catalogue avec filtres (catégorie, ville)
/evenements/:id       Fiche événement + réservation
/reservation/:type/:id  Tunnel de réservation (3 étapes)
/confirmation/:ref    Confirmation + reçu PDF
/profil               Historique personnel + annulations
/partenaires          Devenir prestataire
/login                Connexion
/register             Inscription avec vérification OTP
/admin                Dashboard administrateur (rôle admin requis)
/mentions-legales     Mentions légales
/confidentialite      Politique de confidentialité
/cgu                  Conditions générales d'utilisation
```

---

*Réservia Bénin — Projet de fin d'études 2025/2026 · Développé par [Vanio.dev](https://vanio.dev)*
