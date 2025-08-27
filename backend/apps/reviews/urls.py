from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductReviewViewSet, ProductRatingViewSet, AnalyticsEventViewSet,
    SalesAnalyticsViewSet, ProductAnalyticsViewSet, CustomerAnalyticsViewSet,
    AnalyticsDashboardView
)

router = DefaultRouter()
router.register(r'reviews', ProductReviewViewSet, basename='review')
router.register(r'ratings', ProductRatingViewSet, basename='rating')
router.register(r'analytics-events', AnalyticsEventViewSet, basename='analytics-event')
router.register(r'sales-analytics', SalesAnalyticsViewSet, basename='sales-analytics')
router.register(r'product-analytics', ProductAnalyticsViewSet, basename='product-analytics')
router.register(r'customer-analytics', CustomerAnalyticsViewSet, basename='customer-analytics')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', AnalyticsDashboardView.as_view(), name='analytics-dashboard'),
]
