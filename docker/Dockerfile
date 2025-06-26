#############################
# Stage 1: Build Stage
#############################
FROM php:8.2-cli AS builder

WORKDIR /app

# Instal dependensi sistem dan ekstensi PHP yang diperlukan
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    curl \
    git \
    libpq-dev \
    && docker-php-ext-install pdo_mysql pdo_pgsql zip

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy the rest of the application code
COPY . .

# Copy composer.json and composer.lock
COPY composer.json composer.lock ./

# Setup dependencies
RUN composer install --no-interaction --optimize-autoloader --no-dev
# RUN composer install

RUN php artisan key:generate
RUN php artisan storage:link


#############################
# Stage 2: PHP-FPM
#############################
FROM php:8.2-fpm AS php-fpm

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    libzip-dev \
    libpq-dev \
    && docker-php-ext-install pdo_mysql pdo_pgsql zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Salin hasil build dari stage sebelumnya
COPY --from=builder /app /var/www/html

# Set permission
RUN chmod +x docker/start.sh
RUN chown -R www-data:www-data . && \
    chmod -R 775 storage bootstrap/cache && \
    chmod -R 755 public && \
    find config vendor -type f -exec chmod 644 {} \; && \
    chmod 644 artisan

# CMD ["php", "artisan", "serve", "--host", "0.0.0.0", "--port", "8000"]
# CMD ["php-fpm"]

CMD ["docker/start.sh"]



#############################
# Stage 3: Nginx
#############################
FROM nginx:1.25-alpine AS nginx

# Salin folder public dari hasil build
COPY --from=builder /app/public /var/www/html/public

# Expose port 80
EXPOSE 80
