# E-Commerce Admin Panel

A comprehensive, industry-standard admin panel for managing e-commerce operations with full CRUD functionality and real-time analytics.

## 🚀 Quick Start

### Prerequisites
- Backend API running on `http://localhost:8000`
- Admin credentials: `admin@example.com` / `admin123`

### Access Admin Panel
1. Open `admin-panel.html` in your web browser
2. Login with admin credentials
3. Start managing your e-commerce store!

## 📋 Features Overview

### 🔐 Authentication & Security
- **JWT-based authentication** with secure token management
- **Admin-only access control** with role-based permissions
- **Secure API endpoints** with proper authorization headers
- **Session management** with automatic token refresh

### 📊 Dashboard & Analytics
- **Real-time metrics** showing products, orders, users, and revenue
- **Recent orders tracking** with status updates
- **Low stock alerts** for inventory management
- **Sales analytics** with customizable time ranges (7d, 30d, 90d, 1y)
- **Top products performance** with revenue tracking
- **Customer growth tracking** with monthly breakdowns

### 🛍️ Product Management
- **Full CRUD operations**: Create, Read, Update, Delete products
- **Product listing** with pagination and search
- **Category management** with product categorization
- **Stock quantity tracking** with low stock warnings
- **Featured/Bestseller flags** for product promotion
- **SKU management** for inventory tracking
- **Price management** with compare prices and discounts

### 👥 User Management
- **User listing and details** with comprehensive user information
- **User creation and updates** with validation
- **Profile management** with editable user fields
- **Admin user controls** for user administration

### 📦 Inventory Management
- **Stock level monitoring** with real-time updates
- **Low stock thresholds** with automatic alerts
- **Restock functionality** with quantity tracking
- **Inventory status tracking** (active/inactive)
- **Cost price calculations** for profit analysis
- **Supplier information** management

### 📈 Order Management
- **Order listing and details** with comprehensive order information
- **Order status tracking** with status history
- **Customer order history** with order details
- **Order analytics** with revenue tracking
- **Payment status management** with payment tracking

### ⚙️ Settings & Configuration
- **Site settings management** for store configuration
- **Tax rate configuration** with regional tax rates
- **Shipping method settings** with delivery options
- **System preferences** for admin panel customization

## 🔗 API Endpoints

### Dashboard
- `GET /api/v1/admin/dashboard/` - Dashboard metrics and overview

### Products
- `GET /api/v1/admin/products/` - List all products
- `POST /api/v1/admin/products/` - Create new product
- `GET /api/v1/admin/products/{id}/` - Get product details
- `PUT /api/v1/admin/products/{id}/` - Update product
- `DELETE /api/v1/admin/products/{id}/` - Delete product

### Users
- `GET /api/v1/admin/users/` - List all users
- `POST /api/v1/admin/users/` - Create new user
- `GET /api/v1/admin/users/{id}/` - Get user details
- `PUT /api/v1/admin/users/{id}/` - Update user
- `DELETE /api/v1/admin/users/{id}/` - Delete user

### Orders
- `GET /api/v1/admin/orders/` - List all orders
- `GET /api/v1/admin/orders/{id}/` - Get order details
- `PUT /api/v1/admin/orders/{id}/` - Update order status

### Categories
- `GET /api/v1/admin/categories/` - List all categories
- `POST /api/v1/admin/categories/` - Create new category
- `GET /api/v1/admin/categories/{id}/` - Get category details
- `PUT /api/v1/admin/categories/{id}/` - Update category
- `DELETE /api/v1/admin/categories/{id}/` - Delete category

### Analytics
- `GET /api/v1/admin/analytics/` - Analytics data with time ranges

### Inventory
- `GET /api/v1/admin/inventory/` - Inventory overview
- `POST /api/v1/admin/inventory/{id}/restock/` - Restock product

### Settings
- `GET /api/v1/admin/settings/` - Get system settings
- `PUT /api/v1/admin/settings/` - Update system settings

## 🎨 User Interface Features

### Design
- **Clean, modern design** with professional appearance
- **Responsive layout** that works on all devices
- **Intuitive navigation** with clear menu structure
- **Consistent styling** with industry-standard UI patterns

### Functionality
- **Modal dialogs** for actions like adding products
- **Status badges** and indicators for quick status recognition
- **Real-time data updates** without page refresh
- **Error handling** with user-friendly error messages
- **Loading states** for better user experience

### Navigation
- **Sidebar navigation** with clear section organization
- **Active state indicators** for current section
- **Quick access** to all major functions
- **Logout functionality** with session cleanup

## 🔧 Technical Implementation

### Backend (Django REST Framework)
- **RESTful API design** with proper HTTP methods
- **Serializer validation** for data integrity
- **Permission classes** for access control
- **Database optimization** with select_related and prefetch_related
- **Error handling** with proper HTTP status codes

### Frontend (Vanilla JavaScript)
- **Modern JavaScript** with async/await patterns
- **Fetch API** for HTTP requests
- **DOM manipulation** for dynamic content updates
- **Event handling** for user interactions
- **Local storage** for session management

### Security Features
- **JWT token authentication** with secure storage
- **CORS configuration** for cross-origin requests
- **Input validation** on both client and server
- **SQL injection protection** through ORM
- **XSS protection** with proper data sanitization

## 📊 Data Management

### Database Schema
- **Normalized design** for data integrity
- **Foreign key relationships** for data consistency
- **Indexing** for query performance
- **Audit trails** with created_at/updated_at timestamps

### Data Validation
- **Server-side validation** for data integrity
- **Client-side validation** for user experience
- **Business logic validation** for domain rules
- **Error reporting** with detailed error messages

## 🚀 Deployment

### Requirements
- Django backend running on port 8000
- PostgreSQL database
- Redis for caching (optional)
- Modern web browser with JavaScript enabled

### Setup
1. Ensure backend is running: `docker-compose up -d`
2. Open `admin-panel.html` in a web browser
3. Login with admin credentials
4. Start managing your e-commerce store!

## 🔍 Monitoring & Maintenance

### Performance
- **Database query optimization** with proper indexing
- **API response caching** for improved performance
- **Pagination** for large datasets
- **Lazy loading** for better user experience

### Maintenance
- **Regular backups** of database
- **Log monitoring** for error tracking
- **Performance monitoring** for system health
- **Security updates** for vulnerability patches

## 📈 Future Enhancements

### Planned Features
- **Advanced analytics** with charts and graphs
- **Bulk operations** for mass updates
- **Export functionality** for data backup
- **Email notifications** for important events
- **Mobile app** for on-the-go management

### Scalability
- **Microservices architecture** for horizontal scaling
- **Load balancing** for high availability
- **Database sharding** for large datasets
- **CDN integration** for static assets

## 🆘 Support

### Troubleshooting
- Check browser console for JavaScript errors
- Verify backend API is running and accessible
- Ensure admin credentials are correct
- Check network connectivity for API calls

### Common Issues
- **CORS errors**: Ensure backend CORS settings are configured
- **Authentication errors**: Check JWT token validity
- **Data loading issues**: Verify API endpoints are working
- **UI display problems**: Check browser compatibility

---

**Built with ❤️ for modern e-commerce management**
