from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.db.models import Count, Sum, Avg
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

from apps.products.models import Product, Category
from apps.orders.models import Order
from apps.users.models import User
from apps.products.serializers import ProductSerializer, CategorySerializer
from apps.orders.serializers import OrderSerializer
from apps.users.serializers import UserSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_dashboard(request):
    """Admin dashboard with key metrics"""
    # Get date range (default to last 30 days)
    days = int(request.GET.get('days', 30))
    start_date = timezone.now() - timedelta(days=days)
    
    # Calculate metrics
    total_products = Product.objects.count()
    total_orders = Order.objects.filter(created_at__gte=start_date).count()
    total_users = User.objects.filter(date_joined__gte=start_date).count()
    total_revenue = Order.objects.filter(
        created_at__gte=start_date,
        status='completed'
    ).aggregate(total=Sum('total_amount'))['total'] or Decimal('0')
    
    # Recent orders
    recent_orders = Order.objects.select_related('user').order_by('-created_at')[:5]
    recent_orders_data = []
    for order in recent_orders:
        recent_orders_data.append({
            'id': order.id,
            'order_number': order.order_number,
            'customer_email': order.user.email,
            'total_amount': str(order.total_amount),
            'status': order.status,
            'created_at': order.created_at
        })
    
    # Low stock products
    low_stock_products = Product.objects.filter(
        stock_quantity__lte=10
    ).select_related('category')[:5]
    low_stock_data = []
    for product in low_stock_products:
        low_stock_data.append({
            'id': product.id,
            'name': product.name,
            'sku': product.sku,
            'stock_quantity': product.stock_quantity,
            'low_stock_threshold': 10
        })
    
    return Response({
        'total_products': total_products,
        'total_orders': total_orders,
        'total_users': total_users,
        'total_revenue': str(total_revenue),
        'recent_orders': recent_orders_data,
        'low_stock_products': low_stock_data
    })


class AdminProductList(generics.ListCreateAPIView):
    """Admin product management"""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get_queryset(self):
        queryset = Product.objects.select_related('category', 'created_by')
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__slug=category)
        return queryset


class AdminProductDetail(generics.RetrieveUpdateDestroyAPIView):
    """Admin product detail management"""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AdminOrderList(generics.ListAPIView):
    """Admin order management"""
    queryset = Order.objects.select_related('user').prefetch_related('items')
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get_queryset(self):
        queryset = Order.objects.select_related('user').prefetch_related('items')
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset.order_by('-created_at')


class AdminOrderDetail(generics.RetrieveUpdateAPIView):
    """Admin order detail management"""
    queryset = Order.objects.select_related('user').prefetch_related('items')
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AdminUserList(generics.ListCreateAPIView):
    """Admin user management"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AdminUserDetail(generics.RetrieveUpdateDestroyAPIView):
    """Admin user detail management"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AdminCategoryList(generics.ListCreateAPIView):
    """Admin category management"""
    queryset = Category.objects.annotate(product_count=Count('products'))
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AdminCategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    """Admin category detail management"""
    queryset = Category.objects.annotate(product_count=Count('products'))
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_analytics(request):
    """Admin analytics data"""
    time_range = request.GET.get('time_range', '30d')
    
    # Calculate days based on time range
    if time_range == '7d':
        days = 7
    elif time_range == '90d':
        days = 90
    elif time_range == '1y':
        days = 365
    else:
        days = 30
    
    start_date = timezone.now() - timedelta(days=days)
    
    # Calculate metrics
    total_revenue = Order.objects.filter(
        created_at__gte=start_date,
        status='completed'
    ).aggregate(total=Sum('total_amount'))['total'] or Decimal('0')
    
    total_orders = Order.objects.filter(created_at__gte=start_date).count()
    total_customers = User.objects.filter(date_joined__gte=start_date).count()
    average_order_value = Order.objects.filter(
        created_at__gte=start_date,
        status='completed'
    ).aggregate(avg=Avg('total_amount'))['avg'] or Decimal('0')
    
    # Top products
    top_products = Product.objects.annotate(
        quantity_sold=Sum('order_items__quantity')
    ).filter(
        order_items__order__created_at__gte=start_date
    ).order_by('-quantity_sold')[:5]
    
    top_products_data = []
    for product in top_products:
        revenue = product.order_items.filter(
            order__created_at__gte=start_date
        ).aggregate(
            total=Sum('total_price')
        )['total'] or Decimal('0')
        
        top_products_data.append({
            'id': product.id,
            'name': product.name,
            'category': product.category.name,
            'quantity_sold': product.quantity_sold or 0,
            'revenue': str(revenue)
        })
    
    # Sales by month (simplified)
    sales_by_month = []
    for i in range(min(days, 12)):  # Max 12 months
        month_start = start_date + timedelta(days=i * 30)
        month_end = month_start + timedelta(days=30)
        
        month_revenue = Order.objects.filter(
            created_at__gte=month_start,
            created_at__lt=month_end,
            status='completed'
        ).aggregate(total=Sum('total_amount'))['total'] or Decimal('0')
        
        sales_by_month.append({
            'month': month_start.strftime('%B %Y'),
            'revenue': str(month_revenue)
        })
    
    # Order status distribution
    status_counts = Order.objects.filter(
        created_at__gte=start_date
    ).values('status').annotate(count=Count('id'))
    
    total_orders_count = sum(item['count'] for item in status_counts)
    order_status_distribution = []
    for item in status_counts:
        percentage = (item['count'] / total_orders_count * 100) if total_orders_count > 0 else 0
        order_status_distribution.append({
            'status': item['status'],
            'count': item['count'],
            'percentage': round(percentage, 1)
        })
    
    # Customer growth (simplified)
    customer_growth = []
    for i in range(min(days // 30, 12)):  # Monthly for up to 12 months
        month_start = start_date + timedelta(days=i * 30)
        month_end = month_start + timedelta(days=30)
        
        new_customers = User.objects.filter(
            date_joined__gte=month_start,
            date_joined__lt=month_end
        ).count()
        
        customer_growth.append({
            'period': month_start.strftime('%B %Y'),
            'new_customers': new_customers
        })
    
    return Response({
        'total_revenue': float(total_revenue),
        'total_orders': total_orders,
        'total_customers': total_customers,
        'average_order_value': float(average_order_value),
        'top_products': top_products_data,
        'sales_by_month': sales_by_month,
        'order_status_distribution': order_status_distribution,
        'customer_growth': customer_growth
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_inventory(request):
    """Admin inventory management"""
    products = Product.objects.select_related('category').all()
    
    inventory_data = []
    for product in products:
        inventory_data.append({
            'id': product.id,
            'product_name': product.name,
            'sku': product.sku,
            'current_stock': product.stock_quantity,
            'low_stock_threshold': 10,
            'reorder_point': 5,
            'last_restocked': product.updated_at.isoformat() if product.updated_at else None,
            'supplier': 'Default Supplier',
            'cost_price': str(product.price * Decimal('0.6')),  # Simplified cost calculation
            'status': 'active' if product.is_active else 'inactive'
        })
    
    return Response(inventory_data)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_inventory_restock(request, product_id):
    """Restock inventory item"""
    try:
        product = Product.objects.get(id=product_id)
        quantity = int(request.data.get('quantity', 0))
        
        if quantity > 0:
            product.stock_quantity += quantity
            product.save()
            
            return Response({
                'message': f'Successfully restocked {quantity} units of {product.name}',
                'new_stock': product.stock_quantity
            })
        else:
            return Response(
                {'error': 'Quantity must be greater than 0'},
                status=status.HTTP_400_BAD_REQUEST
            )
    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_settings(request):
    """Admin settings management"""
    if request.method == 'GET':
        # Return default settings
        return Response({
            'site_name': 'E-Commerce Store',
            'site_description': 'Your one-stop shop for everything you need',
            'contact_email': 'admin@example.com',
            'support_phone': '+1-555-0123',
            'currency': 'USD',
            'tax_rate': 8.5,
            'shipping_enabled': True,
            'notifications_enabled': True,
            'maintenance_mode': False
        })
    
    elif request.method == 'PUT':
        # Update settings (simplified - in real app, save to database)
        settings_data = request.data
        return Response({
            'message': 'Settings updated successfully',
            'settings': settings_data
        })
