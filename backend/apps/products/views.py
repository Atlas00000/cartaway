from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg, Count
from django.core.cache import cache
from core.cache_utils import CacheManager
from .models import Category, Product, ProductReview
from .serializers import (
    CategorySerializer, ProductListSerializer, ProductDetailSerializer,
    ProductCreateUpdateSerializer, ProductReviewSerializer, ProductReviewCreateSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Category viewset for listing and retrieving categories"""
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """Get products for a specific category"""
        category = self.get_object()
        products = Product.objects.filter(category=category, is_active=True)
        
        # Apply filters
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        in_stock = request.query_params.get('in_stock')
        featured = request.query_params.get('featured')
        
        if min_price:
            products = products.filter(price__gte=min_price)
        if max_price:
            products = products.filter(price__lte=max_price)
        if in_stock == 'true':
            products = products.filter(stock_quantity__gt=0)
        if featured == 'true':
            products = products.filter(is_featured=True)
        
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)


class ProductViewSet(viewsets.ModelViewSet):
    """Product viewset with search and filtering"""
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active', 'is_featured', 'is_bestseller']
    search_fields = ['name', 'description', 'short_description', 'sku']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        """Get optimized queryset based on action"""
        queryset = Product.objects.filter(is_active=True)
        
        # Apply additional filters
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        in_stock = self.request.query_params.get('in_stock')
        category_slug = self.request.query_params.get('category_slug')
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if in_stock == 'true':
            queryset = queryset.filter(stock_quantity__gt=0)
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        # Optimize queries with select_related and prefetch_related
        queryset = queryset.select_related(
            'category', 
            'created_by'
        ).prefetch_related(
            'images',
            'variants',
            'reviews',
            'reviews__user'
        )
        
        return queryset

    def list(self, request, *args, **kwargs):
        """List products with caching"""
        # Check cache first
        filters = {
            'min_price': request.query_params.get('min_price'),
            'max_price': request.query_params.get('max_price'),
            'in_stock': request.query_params.get('in_stock'),
            'category_slug': request.query_params.get('category_slug'),
            'search': request.query_params.get('search'),
            'ordering': request.query_params.get('ordering'),
        }
        
        # Remove None values
        filters = {k: v for k, v in filters.items() if v is not None}
        
        user_id = request.user.id if request.user.is_authenticated else None
        cached_data = CacheManager.get_cached_products(filters, user_id)
        
        if cached_data is not None:
            return Response(cached_data)
        
        # Get data from database
        response = super().list(request, *args, **kwargs)
        
        # Cache the response data
        CacheManager.cache_products(response.data, filters, user_id)
        
        return response

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'list':
            return ProductListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ProductCreateUpdateSerializer
        return ProductDetailSerializer

    def get_permissions(self):
        """Set permissions based on action"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [IsAuthenticatedOrReadOnly()]

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured products"""
        products = self.get_queryset().filter(is_featured=True)
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def bestsellers(self, request):
        """Get bestseller products"""
        products = self.get_queryset().filter(is_bestseller=True)
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Advanced search endpoint"""
        query = request.query_params.get('q', '')
        if not query:
            return Response({'error': 'Query parameter "q" is required'}, status=400)
        
        # Search in multiple fields
        products = self.get_queryset().filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(short_description__icontains=query) |
            Q(sku__icontains=query) |
            Q(category__name__icontains=query)
        )
        
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_review(self, request, pk=None):
        """Add a review to a product"""
        product = self.get_object()
        serializer = ProductReviewCreateSerializer(
            data=request.data,
            context={'request': request, 'product_id': product.id}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        """Get reviews for a product"""
        product = self.get_object()
        reviews = product.reviews.filter(is_approved=True)
        serializer = ProductReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Get all categories with product counts"""
        categories = Category.objects.filter(is_active=True).annotate(
            product_count=Count('products', filter=Q(products__is_active=True))
        )
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get product statistics"""
        total_products = Product.objects.filter(is_active=True).count()
        featured_products = Product.objects.filter(is_active=True, is_featured=True).count()
        out_of_stock = Product.objects.filter(is_active=True, stock_quantity=0).count()
        low_stock = Product.objects.filter(
            is_active=True,
            stock_quantity__lte=5,
            stock_quantity__gt=0
        ).count()
        
        return Response({
            'total_products': total_products,
            'featured_products': featured_products,
            'out_of_stock': out_of_stock,
            'low_stock': low_stock
        })
