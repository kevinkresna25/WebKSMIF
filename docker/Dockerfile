#############################
# A: Composer builder
#############################
FROM php:8.2-cli AS composer-builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip curl git libpq-dev \
 && docker-php-ext-install pdo_mysql pdo_pgsql zip \
 && rm -rf /var/lib/apt/lists/*

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# 1) cache vendor tanpa scripts
COPY composer.json composer.lock ./
RUN composer install --no-interaction --no-dev --prefer-dist --no-ansi --no-progress --optimize-autoloader --no-scripts

# 2) copy source lalu jalankan scripts
COPY . .
RUN composer install --no-interaction --no-dev --prefer-dist --no-ansi --no-progress --optimize-autoloader
RUN php artisan key:generate

#############################
# B: Asset builder (Vite)
#############################
FROM node:20-alpine AS assets

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci
COPY vite.config.js ./
COPY resources ./resources

RUN npm run build

#############################
# C: PHP-FPM (runtime)
#############################
FROM php:8.2-fpm AS php-fpm

WORKDIR /var/www/html

ARG PUID
ARG PGID
RUN groupmod -o -g ${PGID} www-data
RUN usermod  -o -u ${PUID} www-data

RUN apt-get update && apt-get install -y \
    libzip-dev libpq-dev \
 && docker-php-ext-install pdo_mysql pdo_pgsql zip opcache \
 && rm -rf /var/lib/apt/lists/*

COPY --from=composer-builder --chown=${PUID}:${PGID} /app /var/www/html
COPY --from=assets --chown=${PUID}:${PGID} /app/public/build /var/www/html/public/build

RUN php artisan storage:link

RUN chmod +x docker/start.sh \
 && [ -d bootstrap/cache ] && find bootstrap/cache -type d -exec chmod 775 {} \; || true \
 && [ -d bootstrap/cache ] && find bootstrap/cache -type f -exec chmod 664 {} \; || true \
 && chmod 644 artisan

CMD ["docker/start.sh"]

#############################
# D: Nginx
#############################
FROM nginx:1.25-alpine AS nginx

COPY --from=composer-builder /app/public /var/www/html/public
COPY --from=assets /app/public/build /var/www/html/public/build

EXPOSE 80
