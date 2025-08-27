from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.db.models import Sum, Count, Q
from django.utils import timezone
from .models import (
    Warehouse, Inventory, Shipment, ShipmentItem, ShipmentTracking,
    InventoryTransaction, ShippingZone, ShippingRate
)
from .serializers import (
    WarehouseSerializer, InventorySerializer, InventoryUpdateSerializer,
    InventoryTransactionSerializer, CreateInventoryTransactionSerializer,
    ShipmentSerializer, CreateShipmentSerializer, UpdateShipmentStatusSerializer,
    ShipmentTrackingSerializer, ShippingZoneSerializer, ShippingRateSerializer,
    CalculateShippingRateSerializer, InventoryReportSerializer
)
from apps.orders.models import Order
from apps.products.models import Product


class WarehouseViewSet(viewsets.ModelViewSet):
    """Warehouse viewset for managing warehouses"""
    serializer_class = WarehouseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Get active warehouses"""
        return Warehouse.objects.filter(is_active=True)

    @action(detail=True, methods=['get'])
    def inventory(self, request, pk=None):
        """Get inventory for a specific warehouse"""
        warehouse = self.get_object()
        inventory = Inventory.objects.filter(warehouse=warehouse).select_related('product', 'variant')
        serializer = InventorySerializer(inventory, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def shipments(self, request, pk=None):
        """Get shipments from a specific warehouse"""
        warehouse = self.get_object()
        shipments = Shipment.objects.filter(origin_warehouse=warehouse).select_related('order')
        serializer = ShipmentSerializer(shipments, many=True)
        return Response(serializer.data)


class InventoryViewSet(viewsets.ModelViewSet):
    """Inventory viewset for managing product inventory"""
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Get inventory with related data"""
        return Inventory.objects.select_related('product', 'variant', 'warehouse')

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action in ['update', 'partial_update']:
            return InventoryUpdateSerializer
        return InventorySerializer

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Get low stock items"""
        inventory = self.get_queryset().filter(is_low_stock=True)
        serializer = self.get_serializer(inventory, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def out_of_stock(self, request):
        """Get out of stock items"""
        inventory = self.get_queryset().filter(is_out_of_stock=True)
        serializer = self.get_serializer(inventory, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def report(self, request):
        """Get inventory report"""
        queryset = self.get_queryset()
        
        total_products = queryset.count()
        low_stock_products = queryset.filter(is_low_stock=True).count()
        out_of_stock_products = queryset.filter(is_out_of_stock=True).count()
        
        # Calculate total value (simplified)
        total_value = sum(
            inv.quantity * (inv.cost_price or 0) 
            for inv in queryset 
            if inv.cost_price
        )
        
        low_stock_items = queryset.filter(is_low_stock=True)
        out_of_stock_items = queryset.filter(is_out_of_stock=True)
        
        report_data = {
            'total_products': total_products,
            'low_stock_products': low_stock_products,
            'out_of_stock_products': out_of_stock_products,
            'total_value': total_value,
            'low_stock_items': InventorySerializer(low_stock_items, many=True).data,
            'out_of_stock_items': InventorySerializer(out_of_stock_items, many=True).data
        }
        
        serializer = InventoryReportSerializer(report_data)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def restock(self, request, pk=None):
        """Restock inventory item"""
        inventory = self.get_object()
        quantity = request.data.get('quantity', 0)
        cost_price = request.data.get('cost_price')
        
        if quantity <= 0:
            return Response({
                'error': 'Quantity must be greater than 0'
            }, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            # Create transaction
            transaction_data = {
                'inventory': inventory,
                'transaction_type': 'restock',
                'quantity': quantity,
                'reference': request.data.get('reference', 'Manual restock'),
                'notes': request.data.get('notes', '')
            }
            
            serializer = CreateInventoryTransactionSerializer(
                data=transaction_data,
                context={'request': request}
            )
            
            if serializer.is_valid():
                serializer.save()
                
                # Update cost price if provided
                if cost_price:
                    inventory.cost_price = cost_price
                    inventory.save()
                
                return Response({
                    'message': f'Successfully restocked {quantity} items',
                    'inventory': InventorySerializer(inventory).data
                })
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def adjust(self, request, pk=None):
        """Adjust inventory quantity"""
        inventory = self.get_object()
        quantity = request.data.get('quantity', 0)
        reason = request.data.get('reason', 'Manual adjustment')
        
        if quantity == 0:
            return Response({
                'error': 'Quantity cannot be zero'
            }, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            transaction_data = {
                'inventory': inventory,
                'transaction_type': 'adjustment',
                'quantity': quantity,
                'reference': request.data.get('reference', 'Manual adjustment'),
                'notes': reason
            }
            
            serializer = CreateInventoryTransactionSerializer(
                data=transaction_data,
                context={'request': request}
            )
            
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'message': f'Successfully adjusted inventory by {quantity}',
                    'inventory': InventorySerializer(inventory).data
                })
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InventoryTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    """Inventory transaction viewset for viewing transaction history"""
    serializer_class = InventoryTransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Get transactions with related data"""
        return InventoryTransaction.objects.select_related(
            'inventory__product', 'inventory__warehouse', 'created_by'
        )

    @action(detail=False, methods=['post'])
    def create_transaction(self, request):
        """Create a new inventory transaction"""
        serializer = CreateInventoryTransactionSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            transaction = serializer.save()
            return Response({
                'message': 'Transaction created successfully',
                'transaction': InventoryTransactionSerializer(transaction).data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ShipmentViewSet(viewsets.ModelViewSet):
    """Shipment viewset for managing order shipments"""
    serializer_class = ShipmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Get shipments with related data"""
        return Shipment.objects.select_related(
            'order', 'origin_warehouse'
        ).prefetch_related('items', 'tracking_events')

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'create':
            return CreateShipmentSerializer
        return ShipmentSerializer

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update shipment status"""
        shipment = self.get_object()
        serializer = UpdateShipmentStatusSerializer(
            shipment,
            data=request.data,
            partial=True
        )
        
        if serializer.is_valid():
            updated_shipment = serializer.save()
            return Response({
                'message': 'Shipment status updated successfully',
                'shipment': ShipmentSerializer(updated_shipment).data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def add_tracking_event(self, request, pk=None):
        """Add tracking event to shipment"""
        shipment = self.get_object()
        
        serializer = ShipmentTrackingSerializer(data=request.data)
        if serializer.is_valid():
            tracking_event = serializer.save(shipment=shipment)
            return Response({
                'message': 'Tracking event added successfully',
                'tracking_event': ShipmentTrackingSerializer(tracking_event).data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def by_status(self, request):
        """Get shipments by status"""
        status_filter = request.query_params.get('status', '')
        if status_filter:
            shipments = self.get_queryset().filter(status=status_filter)
        else:
            shipments = self.get_queryset()
        
        serializer = self.get_serializer(shipments, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent shipments"""
        shipments = self.get_queryset().order_by('-created_at')[:10]
        serializer = self.get_serializer(shipments, many=True)
        return Response(serializer.data)


class ShippingZoneViewSet(viewsets.ModelViewSet):
    """Shipping zone viewset for managing shipping zones"""
    serializer_class = ShippingZoneSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Get active shipping zones"""
        return ShippingZone.objects.filter(is_active=True)

    @action(detail=True, methods=['get'])
    def rates(self, request, pk=None):
        """Get rates for a specific zone"""
        zone = self.get_object()
        rates = ShippingRate.objects.filter(zone=zone, is_active=True)
        serializer = ShippingRateSerializer(rates, many=True)
        return Response(serializer.data)


class ShippingRateViewSet(viewsets.ModelViewSet):
    """Shipping rate viewset for managing shipping rates"""
    serializer_class = ShippingRateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Get active shipping rates"""
        return ShippingRate.objects.filter(is_active=True).select_related('zone')

    @action(detail=False, methods=['post'])
    def calculate(self, request):
        """Calculate shipping rates for an address"""
        serializer = CalculateShippingRateSerializer(data=request.data)
        
        if serializer.is_valid():
            rates = serializer.calculate_rates()
            return Response({
                'rates': rates,
                'address': {
                    'country': serializer.validated_data['country'],
                    'state': serializer.validated_data.get('state', ''),
                    'postal_code': serializer.validated_data.get('postal_code', '')
                }
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ShipmentTrackingViewSet(viewsets.ReadOnlyModelViewSet):
    """Shipment tracking viewset for viewing tracking events"""
    serializer_class = ShipmentTrackingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Get tracking events with related data"""
        return ShipmentTracking.objects.select_related('shipment__order')


class InventoryDashboardView(generics.GenericAPIView):
    """Dashboard view for inventory overview"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get inventory dashboard data"""
        # Get inventory statistics
        total_inventory = Inventory.objects.count()
        low_stock_count = Inventory.objects.filter(is_low_stock=True).count()
        out_of_stock_count = Inventory.objects.filter(is_out_of_stock=True).count()
        
        # Get recent transactions
        recent_transactions = InventoryTransaction.objects.select_related(
            'inventory__product', 'created_by'
        ).order_by('-created_at')[:10]
        
        # Get low stock alerts
        low_stock_items = Inventory.objects.filter(
            is_low_stock=True
        ).select_related('product', 'warehouse')[:5]
        
        # Get recent shipments
        recent_shipments = Shipment.objects.select_related(
            'order', 'origin_warehouse'
        ).order_by('-created_at')[:5]
        
        dashboard_data = {
            'statistics': {
                'total_inventory': total_inventory,
                'low_stock_count': low_stock_count,
                'out_of_stock_count': out_of_stock_count,
                'total_warehouses': Warehouse.objects.filter(is_active=True).count()
            },
            'recent_transactions': InventoryTransactionSerializer(recent_transactions, many=True).data,
            'low_stock_alerts': InventorySerializer(low_stock_items, many=True).data,
            'recent_shipments': ShipmentSerializer(recent_shipments, many=True).data
        }
        
        return Response(dashboard_data)
