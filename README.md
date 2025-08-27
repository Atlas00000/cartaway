# E-commerce API Platform

A modern, modular e-commerce platform built with Django REST API and Next.js frontend, all containerized with Docker.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ecommerce-api
```

2. **Start the development environment**
```bash
docker-compose up -d
```

3. **Run database migrations**
```bash
docker-compose exec backend python manage.py migrate
```

4. **Create a superuser (optional)**
```bash
docker-compose exec backend python manage.py createsuperuser
```

5. **Access the applications**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/

## 🏗️ Architecture

### Backend (Django)
- **Framework**: Django 4.2 with Django REST Framework
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Authentication**: JWT tokens
- **Structure**: Modular apps for each feature

### Frontend (Next.js)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios

### Infrastructure
- **Containerization**: Docker Compose
- **Networking**: Custom bridge network
- **Volumes**: Persistent data storage

## 📁 Project Structure

```
├── docker-compose.yml          # Main orchestration
├── backend/                    # Django backend
│   ├── apps/                   # Modular Django apps
│   │   ├── users/             # Authentication & user management
│   │   ├── products/          # Product & catalog management
│   │   ├── cart/              # Shopping cart functionality
│   │   ├── orders/            # Order management
│   │   ├── payments/          # Payment processing
│   │   ├── shipping/          # Shipping & delivery
│   │   ├── reviews/           # Reviews & ratings
│   │   ├── analytics/         # Analytics & reporting
│   │   └── notifications/     # Notification system
│   ├── core/                  # Django settings & configuration
│   ├── api/                   # API URL routing
│   └── requirements.txt       # Python dependencies
├── frontend/                  # Next.js frontend
│   ├── app/                   # Next.js app directory
│   ├── components/            # Reusable UI components
│   ├── services/              # API service functions
│   └── package.json           # Node.js dependencies
└── README.md                  # Project documentation
```

## 🔧 Development

### Backend Development
```bash
# Access Django shell
docker-compose exec backend python manage.py shell

# Run tests
docker-compose exec backend python manage.py test

# Create new app
docker-compose exec backend python manage.py startapp apps/newapp
```

### Frontend Development
```bash
# Access Next.js container
docker-compose exec frontend sh

# Install new dependencies
docker-compose exec frontend npm install package-name
```

### Database Operations
```bash
# Create migrations
docker-compose exec backend python manage.py makemigrations

# Apply migrations
docker-compose exec backend python manage.py migrate

# Reset database
docker-compose down -v
docker-compose up -d
```

## 🔐 Authentication

The platform uses JWT (JSON Web Tokens) for authentication:

- **Access Token**: Short-lived (60 minutes)
- **Refresh Token**: Long-lived (24 hours)
- **Endpoints**:
  - `POST /api/auth/register/` - User registration
  - `POST /api/auth/login/` - User login
  - `POST /api/auth/refresh/` - Token refresh
  - `GET /api/auth/profile/` - User profile

## 📊 API Endpoints

### Current Phase (Phase 1 - Foundation)
- ✅ User registration and login
- ✅ JWT authentication
- ✅ User profile management

### Upcoming Phases
- 🔄 Product catalog and search
- 🔄 Shopping cart functionality
- 🔄 Order management
- 🔄 Payment processing
- 🔄 Shipping and inventory
- 🔄 Reviews and ratings
- 🔄 Analytics and reporting
- 🔄 Notifications system

## 🛠️ Environment Variables

### Backend
```env
DEBUG=1
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@host:port/db
REDIS_URL=redis://redis:6379/0
```

### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 🚀 Deployment

### Production Setup
1. Update environment variables
2. Set `DEBUG=False`
3. Configure proper `ALLOWED_HOSTS`
4. Set up SSL certificates
5. Configure production database
6. Set up monitoring and logging

### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 🧪 Testing

```bash
# Run backend tests
docker-compose exec backend python manage.py test

# Run frontend tests
docker-compose exec frontend npm test

# Run all tests
docker-compose exec backend python manage.py test && docker-compose exec frontend npm test
```

## 📈 Monitoring

- **Application Logs**: `docker-compose logs -f [service]`
- **Database**: PostgreSQL logs
- **Cache**: Redis monitoring
- **Performance**: Django debug toolbar (development)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the roadmap for upcoming features

---

**Built with ❤️ using Django, Next.js, and Docker**
