#!/bin/bash

# CartAway Development Script
# Usage: ./scripts/dev.sh [option]

set -e

echo "🚀 CartAway Development Setup"
echo "=============================="

case "${1:-local}" in
    "local"|"l")
        echo "📦 Starting Local Development (Backend Docker + Local Frontend)"
        echo "   Backend: Docker containers"
        echo "   Frontend: Local npm run dev"
        echo ""
        
        # Start backend services
        docker-compose up -d
        
        echo "✅ Backend services started!"
        echo "🌐 Backend API: http://localhost:8000"
        echo "🗄️  Database: localhost:5432"
        echo "⚡ Redis: localhost:6379"
        echo ""
        echo "📱 Now start the frontend in a new terminal:"
        echo "   cd frontend && npm run dev"
        echo ""
        echo "🌐 Frontend will be available at: http://localhost:3000"
        ;;
        
    "docker"|"d")
        echo "🐳 Starting Full Docker Development"
        echo "   All services in Docker containers"
        echo ""
        
        # Stop any existing services
        docker-compose down 2>/dev/null || true
        
        # Start development environment
        docker-compose -f docker-compose.dev.yml up -d --build
        
        echo "✅ All services started in Docker!"
        echo "🌐 Frontend: http://localhost:3000"
        echo "🌐 Backend API: http://localhost:8000"
        echo ""
        echo "📋 View logs: docker-compose -f docker-compose.dev.yml logs -f"
        ;;
        
    "prod"|"p")
        echo "🏭 Starting Production Environment"
        echo "   Optimized production build"
        echo ""
        
        # Stop any existing services
        docker-compose down 2>/dev/null || true
        
        # Start production environment
        docker-compose -f docker-compose.prod.yml up -d --build
        
        echo "✅ Production environment started!"
        echo "🌐 Frontend: http://localhost:3000"
        echo "🌐 Backend API: http://localhost:8000"
        echo "🌐 Nginx: http://localhost:80"
        echo ""
        echo "📋 View logs: docker-compose -f docker-compose.prod.yml logs -f"
        ;;
        
    "stop"|"s")
        echo "🛑 Stopping all services..."
        docker-compose down 2>/dev/null || true
        docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
        docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
        echo "✅ All services stopped!"
        ;;
        
    "clean"|"c")
        echo "🧹 Cleaning up Docker resources..."
        docker-compose down -v 2>/dev/null || true
        docker-compose -f docker-compose.dev.yml down -v 2>/dev/null || true
        docker-compose -f docker-compose.prod.yml down -v 2>/dev/null || true
        docker system prune -f
        echo "✅ Cleanup completed!"
        ;;
        
    "logs"|"log")
        echo "📋 Showing logs for current setup..."
        if docker ps | grep -q "ecommerce_frontend_dev"; then
            docker-compose -f docker-compose.dev.yml logs -f
        elif docker ps | grep -q "ecommerce_frontend_prod"; then
            docker-compose -f docker-compose.prod.yml logs -f
        else
            docker-compose logs -f
        fi
        ;;
        
    "help"|"h"|"-h"|"--help")
        echo "Usage: ./scripts/dev.sh [option]"
        echo ""
        echo "Options:"
        echo "  local, l     Start local development (backend Docker + local frontend) [default]"
        echo "  docker, d    Start full Docker development (all services in containers)"
        echo "  prod, p      Start production environment (optimized build)"
        echo "  stop, s      Stop all services"
        echo "  clean, c     Stop all services and clean up Docker resources"
        echo "  logs, log    Show logs for current setup"
        echo "  help, h      Show this help message"
        echo ""
        echo "Examples:"
        echo "  ./scripts/dev.sh          # Start local development"
        echo "  ./scripts/dev.sh docker   # Start full Docker development"
        echo "  ./scripts/dev.sh prod     # Start production environment"
        echo "  ./scripts/dev.sh stop     # Stop all services"
        ;;
        
    *)
        echo "❌ Unknown option: $1"
        echo "Use './scripts/dev.sh help' for available options"
        exit 1
        ;;
esac
