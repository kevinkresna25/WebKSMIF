#!/usr/bin/env sh
set -e

cd /var/www/html

# Jalankan migrasi hanya jika diizinkan (default: true)
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  php artisan migrate --force || true
fi

# Jalankan PHP-FPM di foreground supaya container tetap hidup
exec php-fpm -F
