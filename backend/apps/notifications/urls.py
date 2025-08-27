from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    NotificationViewSet, NotificationTemplateViewSet, NotificationPreferenceViewSet,
    NotificationLogViewSet, PriceAlertViewSet, StockAlertViewSet,
    NotificationDashboardView
)

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'templates', NotificationTemplateViewSet, basename='notification-template')
router.register(r'preferences', NotificationPreferenceViewSet, basename='notification-preference')
router.register(r'logs', NotificationLogViewSet, basename='notification-log')
router.register(r'price-alerts', PriceAlertViewSet, basename='price-alert')
router.register(r'stock-alerts', StockAlertViewSet, basename='stock-alert')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', NotificationDashboardView.as_view(), name='notification-dashboard'),
]
