# Réservia Bénin — Guide du projet

Plateforme de réservation d'hébergements et d'événements au Bénin.  
Backend Laravel 11 sur Railway · Frontend React 18 sur Vercel · E-mails via Brevo

---

## Architecture

```
reservia/
├── backend/    Laravel 11, API REST, Sanctum, MySQL 8
└── frontend/   React 18, Vite 5, TailwindCSS 3
```

**URLs de production**
- Frontend : https://reserviabenin.vercel.app
- Backend : https://reservia-backend-production.up.railway.app

---

## Lancement en local

### Backend
```bash
cd reservia/backend
cp .env.example .env          # renseigner DB_* et BREVO_API_KEY
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend
```bash
cd reservia/frontend
cp .env.example .env.local    # VITE_API_URL=http://127.0.0.1:8000/api/v1
npm install
npm run dev                   # http://localhost:5173
```

---

## Variables d'environnement importantes

| Variable | Description |
|----------|-------------|
| `BREVO_API_KEY` | Clé API Brevo v3 — envoi des codes OTP et e-mails partenaires |
| `MAIL_FROM_ADDRESS` | Expéditeur vérifié dans Brevo (ex: reserviabenin@gmail.com) |
| `DB_*` | Connexion MySQL Railway (mysql8.railway.internal en interne) |
| `FRONTEND_URL` | URL Vercel — utilisée pour les CORS |
| `VITE_API_URL` | URL Railway — utilisée par le frontend pour les appels API |

---

## Fonctionnalités principales

| Fonctionnalité | Détail |
|----------------|--------|
| Inscription | Formulaire + vérification OTP par e-mail (Brevo) |
| Réservation hébergement | 4 étapes, prix par type de chambre, pré-remplissage profil |
| Réservation événement | Prix d'entrée, sélection de places |
| Paiement sandbox | MTN MoMo, Moov Money, Carte Visa/Mastercard |
| Page Partenaires | Formulaire de candidature → e-mail admin + confirmation candidat |
| Dashboard Admin | KPIs, réservations, utilisateurs, gestion des rôles |
| Pages légales | Mentions légales, Confidentialité, CGU |

---

## Comptes de test

| Rôle | E-mail | Mot de passe |
|------|--------|--------------|
| Admin | admin@reservia.bj | Admin@2024Secure |
| Hôte | maurice@hebergements.bj | Host@2024Secure |
| Client | client1@reservia.bj | Client@2024 |

---

## Déploiement

```bash
# Frontend (depuis reservia/frontend)
vercel --prod

# Backend (depuis reservia/backend)
railway up --service backend --detach
```

Le backend exécute `start.sh` au démarrage : migrations, puis seed automatique si la base est vide.

---

## Structure des pages frontend

```
/                    Accueil
/hebergements        Liste des hébergements
/hebergements/:id    Détail + sélection chambre
/evenements          Liste des événements
/evenements/:id      Détail événement
/reservation/:type/:id  Processus de réservation (4 étapes)
/confirmation/:ref   Page de confirmation + PDF
/profil              Profil + historique des réservations
/partenaires         Page partenaires + formulaire
/login               Connexion
/register            Inscription
/admin               Dashboard admin (rôle admin requis)
/mentions-legales    Mentions légales
/confidentialite     Politique de confidentialité
/cgu                 Conditions générales d'utilisation
```

---

Pour tester l'ensemble des fonctionnalités, consulter `TEST_PLAN.md`.
