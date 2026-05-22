#!/bin/bash
set -e

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force

# Seed only if database is empty
USER_COUNT=$(php artisan tinker --execute="echo App\Models\User::count();" 2>/dev/null | grep -E '^[0-9]+$' | head -1)
if [ "$USER_COUNT" = "0" ] || [ -z "$USER_COUNT" ]; then
    echo "Seeding database..."
    php artisan db:seed --force
    echo "Database seeded."
else
    echo "Database already has data ($USER_COUNT users), skipping seed."
fi

exec php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
