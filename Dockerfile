FROM php:8.2-apache

# Serve static files and PHP from the web root
WORKDIR /var/www/html
COPY . .

EXPOSE 80
