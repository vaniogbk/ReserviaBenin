# [TEST] PLAN DE TEST COMPLET - RESERVIA

## [INFO] Pré-requis

```
✓ Backend lancé sur http://localhost:8000
✓ Frontend lancé sur http://localhost:5173
✓ MySQL XAMPP actif (phpmyadmin)
```

---

## [PHASE] 1. VÉRIFICATION DE L'API

### [TEST] 1.1 Health Check

```bash
# Terminal: Exécute cette commande
curl http://localhost:8000/api/v1/health

# Devrait retourner:
{"status":"ok","message":"API is running"}
```

**Résultat:** [OK] / [FAIL]

---

## [PHASE] 2. AUTHENTIFICATION

### [TEST] 2.1 Inscription (Register)

**Navigateur:** http://localhost:5173/register

```
Email:    test@example.com
Nom:      Dupont
Prénom:   Jean
Password: SecurePass123!@

Clique: "S'inscrire"
```

**Attendu:**
- [OK] Pas d'erreur
- [OK] Redirect vers home (connecté)
- [OK] Token stocké en localStorage

**Vérifier navigateur:**
```javascript
// Console dev (F12 → Console)
localStorage.getItem('reservia_token')
// Devrait avoir une longue chaîne de caractères (JWT)
```

**Résultat:** [OK] / [FAIL]

---

### [TEST] 2.2 Logout

**Navigateur:** http://localhost:5173

```
1. Clique sur "Profil" (coin haut-droit)
2. Clique sur "Déconnexion"
```

**Attendu:**
- [OK] Redirect vers /login
- [OK] Token supprimé de localStorage

**Résultat:** [OK] / [FAIL]

---

### [TEST] 2.3 Login

**Navigateur:** http://localhost:5173/login

```
Email:    test@example.com
Password: SecurePass123!@

Clique: "Se connecter"
```

**Attendu:**
- [OK] Pas d'erreur
- [OK] Redirect vers home (connecté)
- [OK] Affiche "Bienvenue Jean Dupont"

**Résultat:** [OK] / [FAIL]

---

## [PHASE] 3. AFFICHAGE DES HÉBERGEMENTS

### [TEST] 3.1 Page Hébergements

**Navigateur:** http://localhost:5173/hebergements

**Attendu:**
- [OK] Page charge sans erreur
- [OK] Affiche des cartes d'hébergements
- [OK] Chaque carte a: nom, image, prix, notation
- [OK] Filtre "Filtrer par..." fonctionne

**Vérifier console (F12):**
```
Pas de messages d'erreur
Pas de "404 Not found"
```

**Résultat:** [OK] / [FAIL]

---

### [TEST] 3.2 Détail Hébergement

**Navigateur:** Clique sur une carte hébergement

**Attendu:**
- [OK] Page charge
- [OK] Affiche: nom, description, prix/nuit, photos
- [OK] Bouton "Réserver" visible
- [OK] Affiche coordonnées du propriétaire

**Résultat:** [OK] / [FAIL]

---

## [PHASE] 4. AFFICHAGE DES ÉVÉNEMENTS

### [TEST] 4.1 Page Événements

**Navigateur:** http://localhost:5173/evenements

**Attendu:**
- [OK] Page charge sans erreur
- [OK] Affiche des cartes d'événements
- [OK] Chaque carte a: titre, date, lieu, prix
- [OK] Filtre fonctionne

**Résultat:** [OK] / [FAIL]

---

### [TEST] 4.2 Détail Événement

**Navigateur:** Clique sur un événement

**Attendu:**
- [OK] Page charge
- [OK] Affiche details: date, heure, lieu, description
- [OK] Bouton "Réserver" visible

**Résultat:** [OK] / [FAIL]

---

## [PHASE] 5. RÉSERVATION (Hébergement)

### [TEST] 5.1 Créer Réservation

**Navigateur:** http://localhost:5173/hebergements → Clique hébergement → "Réserver"

**Étape 1: Dates**
```
Date arrivée: 2026-05-01
Date départ:  2026-05-05
Clique: "Suivant"
```

**Attendu:** [OK] Passe à l'étape 2

**Étape 2: Informations**
```
Nombre personnes: 2
Demandes spéciales: Chambre côté vue, s'il vous plaît
Clique: "Suivant"
```

**Attendu:** [OK] Passe à l'étape 3 (résumé)

**Étape 3: Résumé + Paiement**
```
Affiche:
- Montant HT
- Frais service
- Taxes
- TOTAL

Clique: "Procéder au paiement"
```

**Attendu:**
- [OK] Affiche page de paiement
- [OK] Bouton FedaPay visible

**Résultat:** [OK] / [FAIL]

---

### [TEST] 5.2 Historique Réservations

**Navigateur:** http://localhost:5173/profil

**Attendu:**
- [OK] Affiche la réservation fraîche créée
- [OK] Status: "en_attente"
- [OK] Montant correct
- [OK] Dates affichées

**Résultat:** [OK] / [FAIL]

---

## [PHASE] 6. AUTHENTIFICATION ADMIN

### [TEST] 6.1 Login Admin

**Terminal Backend:**
```bash
# Vérifier qu'un utilisateur admin existe
php artisan tinker
User::where('role', 'admin')->first()
```

**Si pas d'admin, créer un:**
```php
User::create([
  'nom' => 'Admin',
  'prenom' => 'Test',
  'email' => 'admin@reservia.local',
  'password' => bcrypt('AdminPass123!@'),
  'role' => 'admin'
])
```

**Navigateur:** http://localhost:5173/login (avec admin@reservia.local)

**Attendu:**
- [OK] Login réussit
- [OK] Affiche "Dashboard" dans le menu

**Résultat:** [OK] / [FAIL]

---

## [PHASE] 7. DASHBOARD ADMIN

### [TEST] 7.1 Accès Dashboard

**Navigateur:** http://localhost:5173/admin/dashboard

**Attendu:**
- [OK] Page charge
- [OK] Affiche KPIs (revenus, réservations, utilisateurs)
- [OK] Graphique visible
- [OK] Menu latéral admin visible

**Résultat:** [OK] / [FAIL]

---

### [TEST] 7.2 Gestion Réservations Admin

**Navigateur:** http://localhost:5173/admin/reservations

**Attendu:**
- [OK] Tableau affiche les réservations
- [OK] Filtre par statut fonctionne
- [OK] Affiche: client, montant, date, status

**Résultat:** [OK] / [FAIL]

---

### [TEST] 7.3 Gestion Hébergements Admin

**Navigateur:** http://localhost:5173/admin/hebergements

**Attendu:**
- [OK] Liste des hébergements
- [OK] Buttons: Éditer, supprimer
- [OK] Toggle activation fonctionne

**Résultat:** [OK] / [FAIL]

---

### [TEST] 7.4 Gestion Utilisateurs Admin

**Navigateur:** http://localhost:5173/admin/utilisateurs

**Attendu:**
- [OK] Liste des utilisateurs
- [OK] Affiche: nom, email, rôle
- [OK] Peut modifier rôle (dropdown)

**Résultat:** [OK] / [FAIL]

---

## [PHASE] 8. TESTS DE SÉCURITÉ

### [TEST] 8.1 Rate Limiting Auth

```bash
# Terminal: Tente 6 logins rapidement
for i in {1..6}; do
  curl -X POST http://localhost:8000/api/v1/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

**Attendu:**
- [OK] Après 5 tentatives → Error 429 (Too Many Requests)

**Résultat:** [OK] / [FAIL]

---

### [TEST] 8.2 Protection XSS

**Navigateur:** Page Réservation → Demandes spéciales

```
Colle: <script>alert('XSS')</script>
Soumet la réservation
```

**Attendu:**
- [OK] Pas de popup alert
- [OK] Script rejeté ou échappé

**Résultat:** [OK] / [FAIL]

---

### [TEST] 8.3 Authorization - User ne peut voir autre réservation

**Terminal:**
```bash
# Récupère token user normal
TOKEN=$(curl -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!@"}' \
  | jq '.token')

# Essaye d'accéder à /admin/reservations (devrait être bloqué)
curl http://localhost:8000/api/v1/admin/reservations \
  -H "Authorization: Bearer $TOKEN"
```

**Attendu:**
- [OK] Erreur 403 (Forbidden)
- [OK] Pas d'accès à admin

**Résultat:** [OK] / [FAIL]

---

## [PHASE] 9. VÉRIFICATIONS PERFORMANCE

### [TEST] 9.1 Temps de chargement - Page Hébergements

**Console Navigation (F12):**
```
Devtools → Network tab
Recharge la page: F5

Observe: DOMContentLoaded time
```

**Attendu:**
- [OK] < 2 secondes
- [OK] Pas de requêtes pending

**Résultat:** [OK] / [FAIL] - Temps: ___ms

---

### [TEST] 9.2 Vérifier Indexes DB

```bash
# Terminal Backend
php artisan tinker
DB::select('SHOW INDEX FROM reservations')
DB::select('SHOW INDEX FROM hebergements')
DB::select('SHOW INDEX FROM evenements')
```

**Attendu:**
- [OK] Index sur user_id
- [OK] Index sur statut
- [OK] Index sur dates

**Résultat:** [OK] / [FAIL]

---

## [PHASE] 10. VÉRIFICATIONS ERREURS

### [TEST] 10.1 Console Dev - Pas d'erreurs

**Navigateur:** F12 → Console

Visiter toutes les pages:
- [OK] Home
- [OK] Hébergements
- [OK] Événements
- [OK] Réservation
- [OK] Admin Dashboard

**Attendu:**
- [WARN] Aucune erreur rouge
- [WARN] Aucun "404 Not found"
- [WARN] Aucun "CORS error"

**Résultat:** [OK] / [FAIL]

---

### [TEST] 10.2 Backend Logs - Aucune erreur

```bash
# Terminal Backend
# Regarde la console PHP artisan serve

Attendu:
✓ Pas de "Exception"
✓ Pas de "Fatal error"
✓ Pas de "Undefined variable"
```

**Résultat:** [OK] / [FAIL]

---

## [RÉSUMÉ] SCORE FINAL

Compte le nombre de [OK]:

```
Total Tests:     ____ / 30
Tests [OK]:      ____ / 30
Score %:         ___ %
```

### Status:
- ✅ **90-100%**: PRÊT POUR PRODUCTION
- ⚠️  **70-89%**: OK, corriger les bugs mineurs
- ❌ **<70%**: Bloquer, corriger avant de continuer
