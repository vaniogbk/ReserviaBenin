#!/bin/bash
set -e

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force

# Seed si la base est vide ou si le contenu (hébergements) est manquant
USER_COUNT=$(php artisan tinker --execute="echo App\Models\User::count();" 2>/dev/null | grep -E '^[0-9]+$' | head -1)
HEBERGEMENT_COUNT=$(php artisan tinker --execute="echo App\Models\Hebergement::count();" 2>/dev/null | grep -E '^[0-9]+$' | head -1)

if [ "$USER_COUNT" = "0" ] || [ -z "$USER_COUNT" ]; then
    echo "Seeding database (empty)..."
    php artisan db:seed --force
    echo "Database seeded."
elif [ "$HEBERGEMENT_COUNT" = "0" ] || [ -z "$HEBERGEMENT_COUNT" ]; then
    echo "Content missing ($USER_COUNT users, 0 hebergements) — re-seeding..."
    php artisan db:seed --force
    echo "Database re-seeded."
else
    echo "Database already has data ($USER_COUNT users, $HEBERGEMENT_COUNT hebergements), skipping seed."
fi

exec php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
