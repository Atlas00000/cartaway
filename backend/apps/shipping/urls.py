from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    WarehouseViewSet, InventoryViewSet, InventoryTransactionViewSet,
    ShipmentViewSet, ShipmentTrackingViewSet, ShippingZoneViewSet,
    ShippingRateViewSet, InventoryDashboardView
)

router = DefaultRouter()
router.register(r'warehouses', WarehouseViewSet, basename='warehouse')
router.register(r'inventory', InventoryViewSet, basename='inventory')
router.register(r'inventory-transactions', InventoryTransactionViewSet, basename='inventory-transaction')
router.register(r'shipments', ShipmentViewSet, basename='shipment')
router.register(r'shipment-tracking', ShipmentTrackingViewSet, basename='shipment-tracking')
router.register(r'shipping-zones', ShippingZoneViewSet, basename='shipping-zone')
router.register(r'shipping-rates', ShippingRateViewSet, basename='shipping-rate')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', InventoryDashboardView.as_view(), name='inventory-dashboard'),
]
