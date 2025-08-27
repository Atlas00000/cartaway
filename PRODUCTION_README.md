# 🚀 E-commerce API - Production Deployment Guide

## 📋 Overview

This guide provides comprehensive instructions for deploying the E-commerce API to production with enterprise-grade security, performance, and monitoring.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx (443)   │    │  Django API     │    │   PostgreSQL    │
│   (Load Bal.)   │◄──►│   (Gunicorn)    │◄──►│   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │              ┌─────────────────┐
         └──────────────►│     Redis      │
                        │   (Cache)      │
                        └─────────────────┘
```

## 📦 Prerequisites

- Docker & Docker Compose
- 4GB+ RAM
- 20GB+ Disk Space
- Domain name (for SSL)
- SMTP credentials (for emails)

## 🔧 Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd apis
cp .env.production.example .env.production
```

### 2. Configure Environment

Edit `.env.production` with your production values:

```bash
# Required: Generate a secure secret key
DJANGO_SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(50))")

# Required: Database configuration
DB_PASSWORD=your-secure-database-password

# Required: Domain configuration
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Optional: Email configuration
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### 3. Deploy

```bash
# Run the deployment script
./scripts/deploy.sh

# Or manually
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: 15-minute access tokens with 7-day refresh
- **Token Rotation**: Automatic refresh token rotation
- **Rate Limiting**: Per-endpoint rate limiting
- **CORS Protection**: Configurable CORS policies

### API Security
- **HTTPS Enforcement**: Automatic HTTP to HTTPS redirect
- **Security Headers**: HSTS, XSS Protection, Content Security Policy
- **Input Validation**: Comprehensive serializer validation
- **SQL Injection Protection**: Django ORM with parameterized queries

### Infrastructure Security
- **Non-root Containers**: All services run as non-root users
- **Network Isolation**: Docker networks with service isolation
- **Secrets Management**: Environment-based configuration
- **SSL/TLS**: TLS 1.2+ with secure cipher suites

## 📊 Monitoring & Health Checks

### Health Check Endpoints
- **Basic Health**: `GET /api/health/`
- **Detailed Health**: `GET /api/health/detailed/`
- **Readiness**: `GET /api/health/ready/`
- **Liveness**: `GET /api/health/live/`

### Monitoring Features
- **Response Time Tracking**: X-Response-Time headers
- **Slow Request Detection**: Logs requests > 1 second
- **Error Tracking**: Structured error logging
- **Performance Metrics**: Database and cache performance

### Logging
- **Structured Logging**: JSON format for production
- **Log Rotation**: 10MB files with 5 backups
- **Separate Log Files**: App, error, and security logs
- **Request Logging**: All API requests with timing

## 🚀 Performance Optimizations

### Database Optimization
- **Connection Pooling**: 10-minute connection reuse
- **Query Optimization**: select_related and prefetch_related
- **Database Indexes**: Strategic indexes on key fields
- **Connection Health Checks**: Automatic connection validation

### Caching Strategy
- **Redis Caching**: Multi-level caching system
- **Cache Invalidation**: Automatic cache invalidation
- **Cache Timeouts**: Optimized timeouts per data type
- **Cache Keys**: Intelligent cache key generation

### Application Performance
- **Gunicorn Workers**: 4 workers with 1000 connections
- **Static File Optimization**: Manifest static files
- **Gzip Compression**: Nginx-level compression
- **Response Caching**: Nginx proxy caching

## 📚 API Documentation

### Interactive Documentation
- **Swagger UI**: `https://yourdomain.com/api/docs/`
- **ReDoc**: `https://yourdomain.com/api/redoc/`
- **OpenAPI Schema**: `https://yourdomain.com/api/schema/`

### Documentation Features
- **Authentication**: Bearer token support
- **Request/Response Examples**: Complete examples
- **Error Codes**: Comprehensive error documentation
- **Rate Limits**: Rate limiting documentation

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DJANGO_SECRET_KEY` | Yes | Django secret key | `generated-key` |
| `ALLOWED_HOSTS` | Yes | Comma-separated hosts | `yourdomain.com` |
| `DB_PASSWORD` | Yes | Database password | `secure-password` |
| `REDIS_URL` | No | Redis connection URL | `redis://redis:6379/1` |
| `CORS_ALLOWED_ORIGINS` | No | CORS origins | `https://yourdomain.com` |
| `SECURE_SSL_REDIRECT` | No | HTTPS redirect | `true` |
| `EMAIL_HOST_USER` | No | SMTP username | `your-email@gmail.com` |
| `EMAIL_HOST_PASSWORD` | No | SMTP password | `app-password` |

### Rate Limiting Configuration

| Endpoint | Anonymous | Authenticated |
|----------|-----------|---------------|
| API General | 50/hour | 500/hour |
| Authentication | 3/minute | 3/minute |
| Registration | 2/hour | N/A |
| Products | 500/hour | 500/hour |
| Orders | 50/hour | 50/hour |
| Cart | 200/hour | 200/hour |

## 🧪 Testing

### Run Tests
```bash
# Run all tests
docker-compose -f docker-compose.prod.yml exec backend python manage.py test

# Run specific test categories
docker-compose -f docker-compose.prod.yml exec backend python manage.py test core.tests.HealthCheckTests
docker-compose -f docker-compose.prod.yml exec backend python manage.py test core.tests.SecurityTests
```

### Test Coverage
- **Health Checks**: 100% coverage
- **Security Features**: Rate limiting, CORS, headers
- **Performance**: Response time, caching
- **Integration**: Complete user flows

## 📈 Scaling

### Horizontal Scaling
```bash
# Scale backend workers
docker-compose -f docker-compose.prod.yml up -d --scale backend=3

# Scale with load balancer
# Add multiple backend instances behind Nginx
```

### Vertical Scaling
- **Database**: Increase PostgreSQL resources
- **Cache**: Increase Redis memory
- **Application**: Increase Gunicorn workers

## 🔍 Troubleshooting

### Common Issues

#### Service Won't Start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs backend

# Check health
curl http://localhost:8000/api/health/detailed/
```

#### Database Connection Issues
```bash
# Check database
docker-compose -f docker-compose.prod.yml exec postgres pg_isready

# Check migrations
docker-compose -f docker-compose.prod.yml exec backend python manage.py showmigrations
```

#### Performance Issues
```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8000/api/health/

# Check cache hit rate
docker-compose -f docker-compose.prod.yml exec redis redis-cli info stats
```

### Log Locations
- **Application Logs**: `/var/log/django/app.log`
- **Error Logs**: `/var/log/django/error.log`
- **Security Logs**: `/var/log/django/security.log`
- **Nginx Logs**: `/var/log/nginx/access.log`

## 🔄 Maintenance

### Regular Tasks
- **Log Rotation**: Automatic via logrotate
- **Database Backups**: Daily automated backups
- **Security Updates**: Monthly dependency updates
- **Performance Monitoring**: Weekly performance reviews

### Backup Strategy
```bash
# Database backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres ecommerce > backup.sql

# Media files backup
tar -czf media_backup.tar.gz media/

# Configuration backup
cp .env.production backup.env.production
```

## 📞 Support

### Monitoring URLs
- **API Status**: `https://yourdomain.com/api/health/`
- **Documentation**: `https://yourdomain.com/api/docs/`
- **Performance**: Check X-Response-Time headers

### Contact
- **API Support**: support@yourdomain.com
- **Documentation**: https://yourdomain.com/api/docs/
- **Health Dashboard**: https://yourdomain.com/api/health/detailed/

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**🚀 Ready for Production!** Your E-commerce API is now deployed with enterprise-grade security, performance, and monitoring.
