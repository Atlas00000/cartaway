from rest_framework import serializers
from .models import (
    Warehouse, Inventory, Shipment, ShipmentItem, ShipmentTracking,
    InventoryTransaction, ShippingZone, ShippingRate
)
from apps.products.serializers import ProductListSerializer
from django.utils import timezone


class WarehouseSerializer(serializers.ModelSerializer):
    """Serializer for warehouses"""
    class Meta:
        model = Warehouse
        fields = [
            'id', 'name', 'address_line1', 'address_line2', 'city', 'state',
            'postal_code', 'country', 'phone', 'email', 'is_active', 'is_primary',
            'created_at', 'updated_at'
        ]


class InventorySerializer(serializers.ModelSerializer):
    """Serializer for inventory"""
    product = ProductListSerializer(read_only=True)
    warehouse = WarehouseSerializer(read_only=True)
    available_quantity = serializers.IntegerField(read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)
    is_out_of_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Inventory
        fields = [
            'id', 'product', 'variant', 'warehouse', 'quantity', 'reserved_quantity',
            'available_quantity', 'low_stock_threshold', 'cost_price', 'last_restock_date',
            'last_restock_quantity', 'aisle', 'shelf', 'bin', 'is_low_stock',
            'is_out_of_stock', 'created_at', 'updated_at'
        ]


class InventoryUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating inventory"""
    class Meta:
        model = Inventory
        fields = ['quantity', 'reserved_quantity', 'low_stock_threshold', 'cost_price']


class InventoryTransactionSerializer(serializers.ModelSerializer):
    """Serializer for inventory transactions"""
    inventory = InventorySerializer(read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)

    class Meta:
        model = InventoryTransaction
        fields = [
            'id', 'inventory', 'transaction_type', 'quantity', 'reference',
            'notes', 'created_by_name', 'created_at'
        ]
        read_only_fields = ['created_by']


class CreateInventoryTransactionSerializer(serializers.ModelSerializer):
    """Serializer for creating inventory transactions"""
    class Meta:
        model = InventoryTransaction
        fields = ['inventory', 'transaction_type', 'quantity', 'reference', 'notes']

    def validate(self, attrs):
        """Validate transaction data"""
        inventory = attrs.get('inventory')
        transaction_type = attrs.get('transaction_type')
        quantity = attrs.get('quantity')

        if transaction_type in ['sale', 'reservation'] and quantity > 0:
            quantity = -quantity  # Make negative for reductions

        if transaction_type in ['restock', 'return'] and quantity < 0:
            quantity = abs(quantity)  # Make positive for additions

        attrs['quantity'] = quantity
        return attrs

    def create(self, validated_data):
        """Create transaction and update inventory"""
        inventory = validated_data['inventory']
        transaction_type = validated_data['transaction_type']
        quantity = validated_data['quantity']

        # Update inventory based on transaction type
        if transaction_type == 'restock':
            inventory.quantity += abs(quantity)
            inventory.last_restock_date = timezone.now()
            inventory.last_restock_quantity = abs(quantity)
        elif transaction_type == 'sale':
            if inventory.available_quantity < abs(quantity):
                raise serializers.ValidationError("Insufficient stock")
            inventory.quantity += quantity  # quantity is negative
        elif transaction_type == 'reservation':
            if inventory.available_quantity < abs(quantity):
                raise serializers.ValidationError("Insufficient stock")
            inventory.reserved_quantity += abs(quantity)
        elif transaction_type == 'release':
            if inventory.reserved_quantity < abs(quantity):
                raise serializers.ValidationError("Insufficient reserved stock")
            inventory.reserved_quantity -= abs(quantity)
        elif transaction_type == 'adjustment':
            inventory.quantity += quantity
        elif transaction_type == 'damage':
            if inventory.quantity < abs(quantity):
                raise serializers.ValidationError("Insufficient stock")
            inventory.quantity += quantity  # quantity is negative
        elif transaction_type == 'return':
            inventory.quantity += abs(quantity)

        inventory.save()
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class ShipmentItemSerializer(serializers.ModelSerializer):
    """Serializer for shipment items"""
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = ShipmentItem
        fields = ['id', 'product', 'variant', 'quantity', 'inventory', 'created_at']


class ShipmentTrackingSerializer(serializers.ModelSerializer):
    """Serializer for shipment tracking events"""
    class Meta:
        model = ShipmentTracking
        fields = ['id', 'status', 'location', 'description', 'timestamp', 'created_at']


class ShipmentSerializer(serializers.ModelSerializer):
    """Serializer for shipments"""
    items = ShipmentItemSerializer(many=True, read_only=True)
    tracking_events = ShipmentTrackingSerializer(many=True, read_only=True)
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    origin_warehouse = WarehouseSerializer(read_only=True)

    class Meta:
        model = Shipment
        fields = [
            'id', 'order', 'order_number', 'tracking_number', 'carrier', 'service',
            'status', 'weight', 'dimensions', 'shipping_cost', 'shipped_date',
            'estimated_delivery', 'actual_delivery', 'origin_warehouse',
            'destination_address', 'notes', 'items', 'tracking_events',
            'created_at', 'updated_at'
        ]


class CreateShipmentSerializer(serializers.ModelSerializer):
    """Serializer for creating shipments"""
    items = serializers.ListField(child=serializers.DictField(), write_only=True)

    class Meta:
        model = Shipment
        fields = [
            'order', 'carrier', 'service', 'weight', 'dimensions', 'shipping_cost',
            'origin_warehouse', 'destination_address', 'notes', 'items'
        ]

    def validate(self, attrs):
        """Validate shipment data"""
        order = attrs.get('order')
        items = attrs.get('items', [])

        # Validate order exists and has items
        if not order:
            raise serializers.ValidationError("Order is required")

        if not items:
            raise serializers.ValidationError("Shipment must contain items")

        # Validate items exist in order
        order_item_ids = [item.id for item in order.items.all()]
        for item_data in items:
            if item_data.get('order_item_id') not in order_item_ids:
                raise serializers.ValidationError(f"Item {item_data.get('order_item_id')} not found in order")

        return attrs

    def create(self, validated_data):
        """Create shipment with items"""
        items_data = validated_data.pop('items')
        
        # Create shipment
        shipment = Shipment.objects.create(**validated_data)

        # Create shipment items
        for item_data in items_data:
            order_item_id = item_data.get('order_item_id')
            quantity = item_data.get('quantity')
            
            # Get order item
            order_item = shipment.order.items.get(id=order_item_id)
            
            # Find inventory for this product/variant
            inventory = Inventory.objects.filter(
                product=order_item.product,
                variant=order_item.variant,
                warehouse=shipment.origin_warehouse
            ).first()

            if not inventory:
                raise serializers.ValidationError(f"No inventory found for {order_item.product.name}")

            # Create shipment item
            ShipmentItem.objects.create(
                shipment=shipment,
                product=order_item.product,
                variant=order_item.variant,
                quantity=quantity,
                inventory=inventory
            )

        # Create initial tracking event
        ShipmentTracking.objects.create(
            shipment=shipment,
            status='pending',
            description='Shipment created',
            timestamp=timezone.now()
        )

        return shipment


class UpdateShipmentStatusSerializer(serializers.Serializer):
    """Serializer for updating shipment status"""
    status = serializers.ChoiceField(choices=Shipment.STATUS_CHOICES)
    location = serializers.CharField(required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)

    def update(self, instance, validated_data):
        """Update shipment status and create tracking event"""
        old_status = instance.status
        instance.status = validated_data['status']
        
        # Update dates based on status
        if validated_data['status'] == 'shipped' and not instance.shipped_date:
            instance.shipped_date = timezone.now()
        elif validated_data['status'] == 'delivered' and not instance.actual_delivery:
            instance.actual_delivery = timezone.now()
        
        instance.save()

        # Create tracking event
        ShipmentTracking.objects.create(
            shipment=instance,
            status=validated_data['status'],
            location=validated_data.get('location', ''),
            description=validated_data.get('description', f'Status changed from {old_status} to {validated_data["status"]}'),
            timestamp=timezone.now()
        )

        return instance


class ShippingZoneSerializer(serializers.ModelSerializer):
    """Serializer for shipping zones"""
    class Meta:
        model = ShippingZone
        fields = [
            'id', 'name', 'description', 'countries', 'states', 'postal_codes',
            'is_active', 'created_at'
        ]


class ShippingRateSerializer(serializers.ModelSerializer):
    """Serializer for shipping rates"""
    zone = ShippingZoneSerializer(read_only=True)

    class Meta:
        model = ShippingRate
        fields = [
            'id', 'zone', 'method_name', 'base_rate', 'per_item_rate',
            'per_weight_rate', 'free_shipping_threshold', 'estimated_days',
            'is_active', 'created_at'
        ]


class CalculateShippingRateSerializer(serializers.Serializer):
    """Serializer for calculating shipping rates"""
    country = serializers.CharField()
    state = serializers.CharField(required=False, allow_blank=True)
    postal_code = serializers.CharField(required=False, allow_blank=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    item_count = serializers.IntegerField(default=0)
    weight = serializers.DecimalField(max_digits=8, decimal_places=2, default=0)

    def calculate_rates(self):
        """Calculate shipping rates for the given address"""
        country = self.validated_data['country']
        state = self.validated_data.get('state', '')
        postal_code = self.validated_data.get('postal_code', '')
        subtotal = self.validated_data['subtotal']
        item_count = self.validated_data['item_count']
        weight = self.validated_data['weight']

        # Find matching zones
        matching_zones = []
        for zone in ShippingZone.objects.filter(is_active=True):
            if zone.matches_address(country, state, postal_code):
                matching_zones.append(zone)

        # Calculate rates for each zone
        rates = []
        for zone in matching_zones:
            for rate in zone.rates.filter(is_active=True):
                calculated_rate = rate.calculate_rate(subtotal, item_count, weight)
                rates.append({
                    'zone': zone.name,
                    'method': rate.method_name,
                    'rate': calculated_rate,
                    'estimated_days': rate.estimated_days,
                    'free_shipping': calculated_rate == 0
                })

        return rates


class InventoryReportSerializer(serializers.Serializer):
    """Serializer for inventory reports"""
    total_products = serializers.IntegerField()
    low_stock_products = serializers.IntegerField()
    out_of_stock_products = serializers.IntegerField()
    total_value = serializers.DecimalField(max_digits=12, decimal_places=2)
    low_stock_items = InventorySerializer(many=True)
    out_of_stock_items = InventorySerializer(many=True)
