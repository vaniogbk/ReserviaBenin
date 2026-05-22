FROM php:8.4-cli-alpine

RUN apk add --no-cache \
    bash \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

RUN composer install --no-dev --optimize-autoloader \
    && php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

EXPOSE 8000

CMD bash -c "php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"
