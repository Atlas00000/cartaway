# CartAway Docker Setup

This project provides multiple Docker configurations for different environments.

## 🚀 Quick Start Options

### Option 1: Local Development (Recommended for Development)
```bash
# Start backend services only
docker-compose up -d

# Start frontend locally (in a separate terminal)
cd frontend && npm run dev
```

### Option 2: Full Docker Development
```bash
# Start all services including frontend in Docker
docker-compose -f docker-compose.dev.yml up -d
```

### Option 3: Production Setup
```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up -d
```

## 📁 File Structure

```
├── docker-compose.yml          # Backend services only (development)
├── docker-compose.dev.yml      # Full development environment
├── docker-compose.prod.yml     # Production environment
├── frontend/
│   ├── Dockerfile              # Production frontend build
│   ├── Dockerfile.dev          # Development frontend
│   └── .dockerignore           # Docker ignore rules
└── backend/
    ├── Dockerfile              # Development backend
    └── Dockerfile.prod         # Production backend
```

## 🔧 Configuration Details

### Development Environment (Local Frontend)

**Use when:** You want fast development with hot reloading and direct file access.

**Services:**
- ✅ PostgreSQL (Docker)
- ✅ Redis (Docker) 
- ✅ Django Backend (Docker)
- ❌ Frontend (Local `npm run dev`)

**Commands:**
```bash
# Start backend services
docker-compose up -d

# Start frontend locally
cd frontend && npm run dev

# Access:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Database: localhost:5432
# Redis: localhost:6379
```

### Development Environment (Docker Frontend)

**Use when:** You want everything containerized for consistency.

**Services:**
- ✅ PostgreSQL (Docker)
- ✅ Redis (Docker)
- ✅ Django Backend (Docker)
- ✅ Next.js Frontend (Docker)

**Commands:**
```bash
# Start all services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f frontend

# Access:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
```

### Production Environment

**Use when:** Deploying to production or testing production build.

**Services:**
- ✅ PostgreSQL (Docker)
- ✅ Redis (Docker)
- ✅ Django Backend (Docker)
- ✅ Next.js Frontend (Docker)
- ✅ Nginx Reverse Proxy (Docker)

**Commands:**
```bash
# Build and start production services
docker-compose -f docker-compose.prod.yml up -d --build

# Access:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Nginx: http://localhost:80
```

## 🛠️ Management Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Development environment
docker-compose -f docker-compose.dev.yml logs -f

# Production environment
docker-compose -f docker-compose.prod.yml logs -f
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# Stop production environment
docker-compose -f docker-compose.prod.yml down
```

### Rebuild Services
```bash
# Rebuild all services
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

### Clean Up
```bash
# Remove containers and networks
docker-compose down

# Remove containers, networks, and volumes
docker-compose down -v

# Remove all unused Docker resources
docker system prune -a
```

## 🔍 Troubleshooting

### Port Conflicts
If you get port conflicts, check what's running:
```bash
# Check what's using port 3000
lsof -i :3000

# Check what's using port 8000
lsof -i :8000
```

### Frontend Not Loading
```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up -d --build frontend
```

### Backend API Issues
```bash
# Check backend logs
docker-compose logs backend

# Test API directly
curl http://localhost:8000/api/health/
```

### Database Connection Issues
```bash
# Check database logs
docker-compose logs postgres

# Connect to database
docker-compose exec postgres psql -U ecommerce_user -d ecommerce_db
```

## 🔐 Environment Variables

### Frontend Environment Variables
Create `frontend/.env.local` for local development:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Backend Environment Variables
The backend uses the environment variables defined in the docker-compose files.

## 📊 Performance Tips

### Development
- Use **Option 1** (Local Frontend) for fastest development experience
- Hot reloading works best with local frontend
- Direct file access for debugging

### Production
- Use **Option 3** (Production) for testing production builds
- Nginx provides better performance and SSL termination
- Optimized Docker images with multi-stage builds

## 🚀 Deployment

For production deployment, use the production docker-compose file:

```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d --build

# Scale services if needed
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

## 📝 Notes

- The development setup uses volume mounts for hot reloading
- Production setup uses optimized builds with standalone output
- Nginx is included in production for reverse proxy and SSL termination
- All services are configured with proper networking and dependencies
