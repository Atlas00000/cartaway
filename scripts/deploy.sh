#!/bin/bash

# Production Deployment Script for E-commerce API
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="ecommerce-api"
ENVIRONMENT=${1:-production}
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"

echo -e "${GREEN}🚀 Starting deployment for ${PROJECT_NAME} (${ENVIRONMENT})${NC}"

# Function to print status
print_status() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

# Function to print error
print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to print success
print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Check if environment file exists
if [ ! -f "$ENV_FILE" ]; then
    print_error "Environment file $ENV_FILE not found!"
    print_status "Please copy .env.production.example to .env.production and configure it."
    exit 1
fi

# Load environment variables
print_status "Loading environment variables..."
source "$ENV_FILE"

# Validate required environment variables
required_vars=("DJANGO_SECRET_KEY" "DB_PASSWORD" "ALLOWED_HOSTS")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        print_error "Required environment variable $var is not set!"
        exit 1
    fi
done

print_success "Environment variables validated"

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose -f "$COMPOSE_FILE" down --remove-orphans

# Pull latest images
print_status "Pulling latest images..."
docker-compose -f "$COMPOSE_FILE" pull

# Build and start services
print_status "Building and starting services..."
docker-compose -f "$COMPOSE_FILE" up -d --build

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Check service health
print_status "Checking service health..."

# Check PostgreSQL
if docker-compose -f "$COMPOSE_FILE" exec -T postgres pg_isready -U "$DB_USER" -d "$DB_NAME" > /dev/null 2>&1; then
    print_success "PostgreSQL is ready"
else
    print_error "PostgreSQL is not ready"
    exit 1
fi

# Check Redis
if docker-compose -f "$COMPOSE_FILE" exec -T redis redis-cli ping > /dev/null 2>&1; then
    print_success "Redis is ready"
else
    print_error "Redis is not ready"
    exit 1
fi

# Check Django backend
max_attempts=10
attempt=1
while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:8000/api/health/live/ > /dev/null 2>&1; then
        print_success "Django backend is ready"
        break
    else
        print_status "Waiting for Django backend... (attempt $attempt/$max_attempts)"
        sleep 10
        attempt=$((attempt + 1))
    fi
done

if [ $attempt -gt $max_attempts ]; then
    print_error "Django backend failed to start"
    docker-compose -f "$COMPOSE_FILE" logs backend
    exit 1
fi

# Run database migrations
print_status "Running database migrations..."
docker-compose -f "$COMPOSE_FILE" exec -T backend python manage.py migrate --noinput

# Collect static files
print_status "Collecting static files..."
docker-compose -f "$COMPOSE_FILE" exec -T backend python manage.py collectstatic --noinput

# Create superuser if it doesn't exist
print_status "Checking for superuser..."
if ! docker-compose -f "$COMPOSE_FILE" exec -T backend python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(is_superuser=True).exists()" 2>/dev/null | grep -q "True"; then
    print_status "Creating superuser..."
    docker-compose -f "$COMPOSE_FILE" exec -T backend python manage.py createsuperuser --noinput || true
fi

# Run health checks
print_status "Running comprehensive health checks..."

# Basic health check
if curl -f http://localhost:8000/api/health/ > /dev/null 2>&1; then
    print_success "Basic health check passed"
else
    print_error "Basic health check failed"
    exit 1
fi

# Detailed health check
if curl -f http://localhost:8000/api/health/detailed/ > /dev/null 2>&1; then
    print_success "Detailed health check passed"
else
    print_error "Detailed health check failed"
    exit 1
fi

# API documentation check
if curl -f http://localhost:8000/api/schema/ > /dev/null 2>&1; then
    print_success "API documentation is accessible"
else
    print_error "API documentation is not accessible"
    exit 1
fi

# Performance test
print_status "Running performance test..."
response_time=$(curl -w "%{time_total}" -o /dev/null -s http://localhost:8000/api/health/)
if (( $(echo "$response_time < 1.0" | bc -l) )); then
    print_success "Performance test passed (response time: ${response_time}s)"
else
    print_error "Performance test failed (response time: ${response_time}s)"
fi

# Check Nginx
if curl -f http://localhost:80 > /dev/null 2>&1; then
    print_success "Nginx is accessible"
else
    print_error "Nginx is not accessible"
    exit 1
fi

# Final status check
print_status "Final status check..."
docker-compose -f "$COMPOSE_FILE" ps

print_success "🎉 Deployment completed successfully!"
print_status "API is available at: http://localhost:8000"
print_status "API Documentation: http://localhost:8000/api/docs/"
print_status "Health Check: http://localhost:8000/api/health/"

# Show logs if requested
if [ "$2" = "--logs" ]; then
    print_status "Showing recent logs..."
    docker-compose -f "$COMPOSE_FILE" logs --tail=50
fi
