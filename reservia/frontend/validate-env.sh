#!/bin/bash
# Frontend Environment Validation Script
# Vérifie que toutes les variables requises sont configurées

set -e

echo "🔍 Validation de l'environnement frontend..."

# Variables obligatoires
REQUIRED_VARS=(
    "VITE_API_URL"
)

# Fichier env source
ENV_FILE=".env.local"

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Fichier $ENV_FILE non trouvé"
    echo "   Créer: cp .env.example $ENV_FILE"
    exit 1
fi

# Charger les variables
export $(cat .env.local | grep -v '#' | xargs)

# Vérifier chaque var obligatoire
MISSING=0
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ $var non défini"
        MISSING=$((MISSING + 1))
    else
        echo "✓ $var = ${!var}"
    fi
done

if [ $MISSING -gt 0 ]; then
    echo ""
    echo "❌ $MISSING paramètres manquants dans $ENV_FILE"
    exit 1
fi

echo ""
echo "✅ Configuration validée - prêt pour build"
exit 0

