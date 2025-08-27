from django.db import models
from django.contrib.auth import get_user_model
from apps.orders.models import Order
from apps.products.models import Product, ProductVariant
from decimal import Decimal

User = get_user_model()


class Warehouse(models.Model):
    """Warehouse model for inventory management"""
    name = models.CharField(max_length=200)
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default='United States')
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - {self.city}, {self.state}"

    def save(self, *args, **kwargs):
        # Ensure only one primary warehouse
        if self.is_primary:
            Warehouse.objects.filter(is_primary=True).update(is_primary=False)
        super().save(*args, **kwargs)


class Inventory(models.Model):
    """Inventory model for tracking product stock"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='inventory')
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, blank=True, null=True)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='inventory')
    
    quantity = models.PositiveIntegerField(default=0)
    reserved_quantity = models.PositiveIntegerField(default=0)
    low_stock_threshold = models.PositiveIntegerField(default=5)
    
    # Cost tracking
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    last_restock_date = models.DateTimeField(blank=True, null=True)
    last_restock_quantity = models.PositiveIntegerField(blank=True, null=True)
    
    # Location within warehouse
    aisle = models.CharField(max_length=50, blank=True, null=True)
    shelf = models.CharField(max_length=50, blank=True, null=True)
    bin = models.CharField(max_length=50, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['product', 'variant', 'warehouse']
        ordering = ['product__name', 'warehouse__name']

    def __str__(self):
        variant_text = f" - {self.variant.name}: {self.variant.value}" if self.variant else ""
        return f"{self.product.name}{variant_text} at {self.warehouse.name}"

    @property
    def available_quantity(self):
        """Get available quantity (total - reserved)"""
        return self.quantity - self.reserved_quantity

    @property
    def is_low_stock(self):
        """Check if stock is low"""
        return self.available_quantity <= self.low_stock_threshold

    @property
    def is_out_of_stock(self):
        """Check if out of stock"""
        return self.available_quantity <= 0

    def reserve_quantity(self, quantity):
        """Reserve quantity for order"""
        if self.available_quantity >= quantity:
            self.reserved_quantity += quantity
            self.save()
            return True
        return False

    def release_reserved_quantity(self, quantity):
        """Release reserved quantity"""
        if self.reserved_quantity >= quantity:
            self.reserved_quantity -= quantity
            self.save()
            return True
        return False

    def consume_quantity(self, quantity):
        """Consume quantity (reduce both total and reserved)"""
        if self.available_quantity >= quantity and self.reserved_quantity >= quantity:
            self.quantity -= quantity
            self.reserved_quantity -= quantity
            self.save()
            return True
        return False


class Shipment(models.Model):
    """Shipment model for tracking order shipments"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('in_transit', 'In Transit'),
        ('out_for_delivery', 'Out for Delivery'),
        ('delivered', 'Delivered'),
        ('failed', 'Failed'),
        ('returned', 'Returned'),
    ]

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='shipments')
    tracking_number = models.CharField(max_length=100, unique=True)
    carrier = models.CharField(max_length=100)  # UPS, FedEx, USPS, etc.
    service = models.CharField(max_length=100)  # Ground, Express, etc.
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Shipping details
    weight = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    dimensions = models.CharField(max_length=100, blank=True, null=True)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    
    # Dates
    shipped_date = models.DateTimeField(blank=True, null=True)
    estimated_delivery = models.DateTimeField(blank=True, null=True)
    actual_delivery = models.DateTimeField(blank=True, null=True)
    
    # Origin and destination
    origin_warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='outgoing_shipments')
    destination_address = models.TextField()
    
    # Notes and metadata
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Shipment {self.tracking_number} - {self.order.order_number}"

    def generate_tracking_number(self):
        """Generate unique tracking number"""
        import random
        import string
        from datetime import datetime
        
        # Format: CAR-YYYYMMDD-XXXXX
        date_part = datetime.now().strftime('%Y%m%d')
        random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
        return f"{self.carrier[:3].upper()}-{date_part}-{random_part}"

    def save(self, *args, **kwargs):
        if not self.tracking_number:
            self.tracking_number = self.generate_tracking_number()
        super().save(*args, **kwargs)


class ShipmentItem(models.Model):
    """Individual items in a shipment"""
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, blank=True, null=True)
    quantity = models.PositiveIntegerField()
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE, related_name='shipment_items')
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['shipment', 'product', 'variant']

    def __str__(self):
        variant_text = f" - {self.variant.name}: {self.variant.value}" if self.variant else ""
        return f"{self.product.name}{variant_text} (Qty: {self.quantity})"


class ShipmentTracking(models.Model):
    """Tracking events for shipments"""
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name='tracking_events')
    status = models.CharField(max_length=50)
    location = models.CharField(max_length=200, blank=True, null=True)
    description = models.TextField()
    timestamp = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.shipment.tracking_number} - {self.status} at {self.timestamp}"


class InventoryTransaction(models.Model):
    """Track inventory changes"""
    TRANSACTION_TYPES = [
        ('restock', 'Restock'),
        ('sale', 'Sale'),
        ('reservation', 'Reservation'),
        ('release', 'Release Reservation'),
        ('adjustment', 'Adjustment'),
        ('damage', 'Damage'),
        ('return', 'Return'),
    ]

    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    quantity = models.IntegerField()  # Positive for additions, negative for subtractions
    reference = models.CharField(max_length=100, blank=True, null=True)  # Order number, PO number, etc.
    notes = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.inventory} - {self.transaction_type} ({self.quantity})"


class ShippingZone(models.Model):
    """Shipping zones for rate calculation"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    countries = models.JSONField(default=list)  # List of country codes
    states = models.JSONField(default=list)  # List of state codes
    postal_codes = models.JSONField(default=list)  # List of postal code patterns
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    def matches_address(self, country, state=None, postal_code=None):
        """Check if address matches this zone"""
        if country not in self.countries:
            return False
        
        if state and self.states and state not in self.states:
            return False
        
        if postal_code and self.postal_codes:
            # Simple pattern matching - could be enhanced with regex
            for pattern in self.postal_codes:
                if postal_code.startswith(pattern):
                    return True
            return False
        
        return True


class ShippingRate(models.Model):
    """Shipping rates for different zones and methods"""
    zone = models.ForeignKey(ShippingZone, on_delete=models.CASCADE, related_name='rates')
    method_name = models.CharField(max_length=100)
    base_rate = models.DecimalField(max_digits=10, decimal_places=2)
    per_item_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    per_weight_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # per pound
    free_shipping_threshold = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    estimated_days = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['zone', 'method_name']
        ordering = ['zone__name', 'base_rate']

    def __str__(self):
        return f"{self.zone.name} - {self.method_name}"

    def calculate_rate(self, subtotal=0, item_count=0, weight=0):
        """Calculate shipping rate"""
        if self.free_shipping_threshold and subtotal >= self.free_shipping_threshold:
            return 0
        
        rate = self.base_rate
        rate += self.per_item_rate * item_count
        rate += self.per_weight_rate * weight
        
        return max(0, rate)
