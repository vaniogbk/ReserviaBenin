# Plan de test — Réservia Bénin

**Environnement de production**
- Frontend : https://reservia-benin.vercel.app
- Backend API : https://reservia-backend-production.up.railway.app/api/v1
- Health check : `/api/v1/health` → `{"status":"ok"}`

**Compte admin de test**
- Email : `admin@reservia.bj`
- Mot de passe : `Admin@2024Secure`

---

## 1. Authentification

### 1.1 Inscription avec vérification e-mail
1. Aller sur `/register`
2. Remplir le formulaire (prénom, nom, e-mail réel, téléphone, mot de passe ≥12 car.)
3. Cliquer "Créer mon compte"
4. Vérifier réception du code OTP dans la boîte mail (envoi via Brevo)
5. Saisir le code à 6 chiffres

**Attendu :** redirection vers l'accueil, utilisateur connecté

### 1.2 Connexion / Déconnexion
1. Aller sur `/login`
2. Saisir e-mail + mot de passe
3. Vérifier affichage du prénom dans la navbar
4. Cliquer "Déconnexion" (navbar ou footer)

**Attendu :** retour sur `/`, navbar sans prénom

### 1.3 Footer conditionnel
- Non connecté → footer affiche "Connexion" + "Créer un compte"
- Connecté → footer affiche "Déconnexion" uniquement

---

## 2. Hébergements

### 2.1 Liste
1. Aller sur `/hebergements`
2. Vérifier les cartes (nom, image, prix, note)
3. Tester les filtres (ville, fourchette de prix)

### 2.2 Détail + sélection de chambre
1. Cliquer sur un hébergement avec plusieurs types de chambres
2. Vérifier l'onglet "Chambres" : Standard, Deluxe, VIP avec prix distincts
3. Cliquer "Réserver" sur une chambre Standard
4. Vérifier que l'URL contient `?chambre=<id>` et que le prix dans le récapitulatif est bien celui de la chambre Standard (pas VIP)

---

## 3. Événements

### 3.1 Liste
1. Aller sur `/evenements`
2. Vérifier affichage : titre, date, lieu, prix d'entrée

### 3.2 Détail
1. Cliquer sur un événement
2. Vérifier : description, date/heure, lieu, bouton "Réserver"

---

## 4. Processus de réservation

### 4.1 Réservation hébergement (4 étapes)

**Étape 1 — Dates**
- Sélectionner date arrivée et départ
- Cliquer "Continuer" → vérifier défilement vers le haut

**Étape 2 — Voyageurs**
- Nombre par défaut = 1
- Modifier si besoin, ajouter une demande spéciale

**Étape 3 — Récapitulatif**
- Vérifier montant = prix chambre (si chambre sélectionnée) × nuits
- Vérifier que les infos du profil sont pré-remplies (si déjà réservé auparavant)

**Étape 4 — Paiement**
- Choisir MTN MoMo, Moov Money ou Carte
- La méthode choisie doit être mémorisée pour la prochaine réservation
- Cliquer "Payer" → confirmation sandbox

**Attendu :** page `/confirmation/<ref>` avec récapitulatif et bouton PDF

### 4.2 Annulation
1. Aller sur `/profil`
2. Trouver une réservation "en attente"
3. Cliquer "Annuler" → confirmer
4. Vérifier statut passé à "annulée"

---

## 5. Page Partenaires

1. Aller sur `/partenaires` (lien dans la navbar et dans `/register`)
2. Vérifier affichage : avantages, statistiques, étapes, formulaire
3. Remplir et soumettre le formulaire
4. Vérifier écran de succès après soumission

---

## 6. Pages légales

Vérifier que chacune charge sans erreur et affiche un contenu structuré :
- `/mentions-legales`
- `/confidentialite`
- `/cgu`

Vérifier les liens dans le footer pointent vers ces pages.

---

## 7. Dashboard Admin

Accès : `/admin` (rôle `admin` requis)

### 7.1 Vue d'ensemble
- KPIs : réservations totales, revenus, utilisateurs actifs
- Graphiques par période

### 7.2 Gestion des réservations
- `/admin/reservations` — tableau filtrable par statut

### 7.3 Gestion des utilisateurs
- `/admin/utilisateurs` — liste avec rôle modifiable

### 7.4 Sécurité
- Tenter d'accéder à `/admin` avec un compte client → redirection vers `/`
- Tenter d'appeler `GET /api/v1/admin/reservations` sans token → `401`
- Tenter avec token client → `403`

---

## 8. Scroll et navigation

- Chaque navigation vers une nouvelle route → page défile vers le haut (ScrollToTop actif)
- À chaque étape "Continuer" dans la réservation → scroll vers le haut

---

## 9. Vérifications rapides console

Ouvrir DevTools (F12) sur chaque page principale :
- Aucune erreur rouge
- Aucun `404 Not Found` sur les ressources
- Aucune erreur CORS

---

## Score

| Phase | Tests | Résultat |
|-------|-------|----------|
| Auth (inscription OTP, login, logout) | 3 | |
| Hébergements (liste, détail, prix chambre) | 3 | |
| Événements (liste, détail) | 2 | |
| Réservation (4 étapes, annulation) | 2 | |
| Partenaires | 1 | |
| Pages légales | 3 | |
| Admin (dashboard, sécurité) | 4 | |
| UX (scroll, footer conditionnel) | 2 | |
| **Total** | **20** | **/20** |
