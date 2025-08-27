from django.db import models
from django.contrib.auth import get_user_model
from apps.products.models import Product, ProductVariant
from decimal import Decimal

User = get_user_model()


class Order(models.Model):
    """Order model for customer purchases"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
        ('partially_refunded', 'Partially Refunded'),
    ]

    order_number = models.CharField(max_length=20, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    
    # Customer Information
    customer_email = models.EmailField()
    customer_first_name = models.CharField(max_length=100)
    customer_last_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Billing Address
    billing_address_line1 = models.CharField(max_length=255)
    billing_address_line2 = models.CharField(max_length=255, blank=True, null=True)
    billing_city = models.CharField(max_length=100)
    billing_state = models.CharField(max_length=100)
    billing_postal_code = models.CharField(max_length=20)
    billing_country = models.CharField(max_length=100, default='United States')
    
    # Shipping Address
    shipping_address_line1 = models.CharField(max_length=255)
    shipping_address_line2 = models.CharField(max_length=255, blank=True, null=True)
    shipping_city = models.CharField(max_length=100)
    shipping_state = models.CharField(max_length=100)
    shipping_postal_code = models.CharField(max_length=20)
    shipping_country = models.CharField(max_length=100, default='United States')
    
    # Financial Information
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Payment Information
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    payment_transaction_id = models.CharField(max_length=100, blank=True, null=True)
    payment_date = models.DateTimeField(blank=True, null=True)
    
    # Shipping Information
    shipping_method = models.CharField(max_length=100, blank=True, null=True)
    tracking_number = models.CharField(max_length=100, blank=True, null=True)
    estimated_delivery = models.DateField(blank=True, null=True)
    
    # Notes and Metadata
    notes = models.TextField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['created_at']),
            models.Index(fields=['order_number']),
            models.Index(fields=['customer_email']),
            models.Index(fields=['payment_status']),
            models.Index(fields=['status', 'payment_status']),
            models.Index(fields=['user', 'created_at']),
        ]

    def __str__(self):
        return f"Order {self.order_number} - {self.customer_email}"

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = self.generate_order_number()
        super().save(*args, **kwargs)

    def generate_order_number(self):
        """Generate unique order number"""
        import random
        import string
        from datetime import datetime
        
        # Format: ORD-YYYYMMDD-XXXXX
        date_part = datetime.now().strftime('%Y%m%d')
        random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
        return f"ORD-{date_part}-{random_part}"

    @property
    def customer_full_name(self):
        return f"{self.customer_first_name} {self.customer_last_name}"

    @property
    def is_paid(self):
        return self.payment_status == 'paid'

    @property
    def can_be_cancelled(self):
        return self.status in ['pending', 'confirmed', 'processing']

    @property
    def can_be_refunded(self):
        return self.payment_status == 'paid' and self.status in ['shipped', 'delivered']


class OrderItem(models.Model):
    """Individual items in an order"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, blank=True, null=True)
    
    product_name = models.CharField(max_length=255)  # Snapshot of product name at time of order
    product_sku = models.CharField(max_length=100, blank=True, null=True)
    variant_name = models.CharField(max_length=255, blank=True, null=True)
    
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Tax and discount for this item
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        variant_text = f" - {self.variant_name}" if self.variant_name else ""
        return f"{self.product_name}{variant_text} (Qty: {self.quantity})"

    def save(self, *args, **kwargs):
        if not self.total_price:
            self.total_price = self.unit_price * self.quantity
        super().save(*args, **kwargs)


class OrderStatusHistory(models.Model):
    """Track order status changes"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='status_history')
    status = models.CharField(max_length=20, choices=Order.STATUS_CHOICES)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Order status histories'

    def __str__(self):
        return f"{self.order.order_number} - {self.status} at {self.created_at}"


class ShippingMethod(models.Model):
    """Available shipping methods"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    estimated_days = models.PositiveIntegerField(help_text="Estimated delivery time in days")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['base_price']

    def __str__(self):
        return f"{self.name} - ${self.base_price} ({self.estimated_days} days)"


class TaxRate(models.Model):
    """Tax rates for different regions"""
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    rate = models.DecimalField(max_digits=5, decimal_places=4, help_text="Tax rate as decimal (e.g., 0.0825 for 8.25%)")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['country', 'state', 'city']

    def __str__(self):
        location = f"{self.city}, {self.state}" if self.city and self.state else self.state or self.country
        return f"{location} - {self.rate * 100}%"
