from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OrderViewSet, ShippingMethodViewSet, TaxRateViewSet,
    CheckoutView, OrderHistoryView
)

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'shipping-methods', ShippingMethodViewSet, basename='shipping-method')
router.register(r'tax-rates', TaxRateViewSet, basename='tax-rate')

urlpatterns = [
    path('', include(router.urls)),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('order-history/', OrderHistoryView.as_view(), name='order-history'),
]
