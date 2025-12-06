# Use official PHP image with Apache
FROM php:8.2-apache

# Install PDO MySQL extension and other common extensions
RUN docker-php-ext-install pdo_mysql

# Enable Apache rewrite module (optional, useful for routing)
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Set permissions for sessions/logs if needed
RUN chown -R www-data:www-data /var/www/html

# Install Composer if you use it (optional)
# RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Expose port 8080 (Render default HTTP port)
EXPOSE 8080

# Set environment variables from Render automatically
# (Render injects env variables, e.g., DB_HOST, DB_USER, DATABASE_URL, etc.)

# Configure Apache to listen on port 8080
RUN sed -i 's/80/8080/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# Apache runs in foreground
CMD ["apache2-foreground"]
