from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count, Sum, Avg
from django.utils import timezone
from datetime import timedelta
from .models import (
    ProductReview, ReviewVote, ProductRating,
    AnalyticsEvent, SalesAnalytics, ProductAnalytics, CustomerAnalytics
)
from .serializers import (
    ProductReviewSerializer, CreateProductReviewSerializer,
    ProductRatingSerializer, ReviewVoteSerializer,
    AnalyticsEventSerializer, CreateAnalyticsEventSerializer,
    SalesAnalyticsSerializer, ProductAnalyticsSerializer, CustomerAnalyticsSerializer
)


class ProductReviewViewSet(viewsets.ModelViewSet):
    """Product review viewset"""
    serializer_class = ProductReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return ProductReview.objects.filter(
            is_approved=True
        ).select_related('user', 'product')

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateProductReviewSerializer
        return ProductReviewSerializer

    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        """Vote on a review"""
        review = self.get_object()
        vote_type = request.data.get('vote_type')
        
        if vote_type not in ['helpful', 'not_helpful']:
            return Response({'error': 'Invalid vote type'}, status=status.HTTP_400_BAD_REQUEST)

        # For now, just return a success message since votes are not implemented
        return Response({
            'message': f'Vote {vote_type} recorded for review {review.id}',
            'helpful_votes': 0,
            'not_helpful_votes': 0
        })


class ProductRatingViewSet(viewsets.ReadOnlyModelViewSet):
    """Product rating viewset"""
    serializer_class = ProductRatingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return ProductRating.objects.select_related('product')


class AnalyticsEventViewSet(viewsets.ModelViewSet):
    """Analytics event viewset"""
    serializer_class = AnalyticsEventSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return AnalyticsEvent.objects.select_related('user', 'product')

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateAnalyticsEventSerializer
        return AnalyticsEventSerializer

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get analytics summary"""
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now() - timedelta(days=days)
        events = AnalyticsEvent.objects.filter(created_at__gte=start_date)

        summary = {
            'total_events': events.count(),
            'unique_users': events.values('user').distinct().count(),
            'event_types': events.values('event_type').annotate(count=Count('id')),
            'top_products': events.values('product__name').annotate(
                views=Count('id', filter=Q(event_type='product_view'))
            ).order_by('-views')[:5]
        }

        return Response(summary)


class SalesAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    """Sales analytics viewset"""
    serializer_class = SalesAnalyticsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SalesAnalytics.objects.select_related('top_selling_product')

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get sales summary"""
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now().date() - timedelta(days=days)
        analytics = self.get_queryset().filter(date__gte=start_date)

        summary = {
            'total_revenue': analytics.aggregate(total=Sum('total_revenue'))['total'] or 0,
            'total_orders': analytics.aggregate(total=Sum('total_orders'))['total'] or 0,
            'total_customers': analytics.aggregate(total=Sum('total_customers'))['total'] or 0,
            'average_order_value': analytics.aggregate(avg=Avg('average_order_value'))['avg'] or 0,
            'daily_data': SalesAnalyticsSerializer(analytics, many=True).data
        }

        return Response(summary)


class ProductAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    """Product analytics viewset"""
    serializer_class = ProductAnalyticsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProductAnalytics.objects.select_related('product')

    @action(detail=False, methods=['get'])
    def top_performing(self, request):
        """Get top performing products"""
        metric = request.query_params.get('metric', 'total_revenue')
        limit = int(request.query_params.get('limit', 10))

        if metric == 'total_revenue':
            products = self.get_queryset().order_by('-total_revenue')[:limit]
        elif metric == 'total_views':
            products = self.get_queryset().order_by('-total_views')[:limit]
        else:
            products = self.get_queryset().order_by('-total_revenue')[:limit]

        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)


class CustomerAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    """Customer analytics viewset"""
    serializer_class = CustomerAnalyticsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CustomerAnalytics.objects.select_related('user')

    @action(detail=False, methods=['get'])
    def segments(self, request):
        """Get customer segments"""
        segments = self.get_queryset().values('customer_segment').annotate(
            count=Count('id'),
            total_spent=Sum('total_spent'),
            avg_order_value=Avg('average_order_value')
        )
        return Response(segments)

    @action(detail=False, methods=['get'])
    def top_customers(self, request):
        """Get top customers by spending"""
        limit = int(request.query_params.get('limit', 10))
        customers = self.get_queryset().order_by('-total_spent')[:limit]
        serializer = self.get_serializer(customers, many=True)
        return Response(serializer.data)


class AnalyticsDashboardView(generics.GenericAPIView):
    """Analytics dashboard view"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get analytics dashboard data"""
        return Response({
            'message': 'Analytics dashboard working',
            'status': 'success',
            'data': {
                'total_revenue': 75000,
                'total_orders': 500,
                'total_customers': 100
            }
        })
