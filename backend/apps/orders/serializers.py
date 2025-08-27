from rest_framework import serializers
from .models import Order, OrderItem, OrderStatusHistory, ShippingMethod, TaxRate
from apps.cart.models import Cart, CartItem
from decimal import Decimal


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for order items"""
    product_name = serializers.CharField(read_only=True)
    variant_name = serializers.CharField(read_only=True)
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'variant', 'product_name', 'product_sku', 'variant_name',
            'quantity', 'unit_price', 'total_price', 'tax_amount', 'discount_amount'
        ]


class OrderStatusHistorySerializer(serializers.ModelSerializer):
    """Serializer for order status history"""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)

    class Meta:
        model = OrderStatusHistory
        fields = ['id', 'status', 'status_display', 'notes', 'created_at', 'created_by_name']


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for orders"""
    items = OrderItemSerializer(many=True, read_only=True)
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)
    customer_full_name = serializers.CharField(read_only=True)
    can_be_cancelled = serializers.BooleanField(read_only=True)
    can_be_refunded = serializers.BooleanField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user', 'status', 'status_display', 'payment_status', 
            'payment_status_display', 'customer_email', 'customer_first_name', 'customer_last_name',
            'customer_full_name', 'customer_phone', 'billing_address_line1', 'billing_address_line2',
            'billing_city', 'billing_state', 'billing_postal_code', 'billing_country',
            'shipping_address_line1', 'shipping_address_line2', 'shipping_city', 'shipping_state',
            'shipping_postal_code', 'shipping_country', 'subtotal', 'tax_amount', 'shipping_amount',
            'discount_amount', 'total_amount', 'payment_method', 'payment_transaction_id',
            'payment_date', 'shipping_method', 'tracking_number', 'estimated_delivery',
            'notes', 'items', 'status_history', 'can_be_cancelled', 'can_be_refunded',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'order_number', 'status', 'payment_status', 'payment_transaction_id',
            'payment_date', 'tracking_number', 'estimated_delivery', 'created_at', 'updated_at'
        ]


class CreateOrderSerializer(serializers.ModelSerializer):
    """Serializer for creating orders from cart"""
    cart_id = serializers.IntegerField(write_only=True)
    shipping_method_id = serializers.IntegerField(write_only=True)
    use_same_address = serializers.BooleanField(default=True, write_only=True)

    class Meta:
        model = Order
        fields = [
            'cart_id', 'shipping_method_id', 'use_same_address',
            'customer_email', 'customer_first_name', 'customer_last_name', 'customer_phone',
            'billing_address_line1', 'billing_address_line2', 'billing_city', 'billing_state',
            'billing_postal_code', 'billing_country', 'shipping_address_line1', 'shipping_address_line2',
            'shipping_city', 'shipping_state', 'shipping_postal_code', 'shipping_country', 'notes'
        ]


class OrderCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for admin order create/update operations"""
    class Meta:
        model = Order
        fields = [
            'user', 'status', 'payment_status', 'customer_email', 'customer_first_name', 
            'customer_last_name', 'customer_phone', 'billing_address_line1', 'billing_address_line2',
            'billing_city', 'billing_state', 'billing_postal_code', 'billing_country',
            'shipping_address_line1', 'shipping_address_line2', 'shipping_city', 'shipping_state',
            'shipping_postal_code', 'shipping_country', 'subtotal', 'tax_amount', 'shipping_amount',
            'discount_amount', 'total_amount', 'payment_method', 'shipping_method', 
            'tracking_number', 'notes'
        ]
        read_only_fields = [
            'order_number', 'payment_transaction_id', 'payment_date', 'estimated_delivery',
            'created_at', 'updated_at'
        ]

    def validate(self, attrs):
        """Validate order data"""
        cart_id = attrs.get('cart_id')
        shipping_method_id = attrs.get('shipping_method_id')
        use_same_address = attrs.get('use_same_address', True)

        # Validate cart exists and has items
        try:
            cart = Cart.objects.get(id=cart_id, user=self.context['request'].user, is_active=True)
            if not cart.items.exists():
                raise serializers.ValidationError("Cart is empty")
        except Cart.DoesNotExist:
            raise serializers.ValidationError("Invalid cart")

        # Validate shipping method
        try:
            shipping_method = ShippingMethod.objects.get(id=shipping_method_id, is_active=True)
        except ShippingMethod.DoesNotExist:
            raise serializers.ValidationError("Invalid shipping method")

        # If using same address, copy billing to shipping
        if use_same_address:
            attrs['shipping_address_line1'] = attrs.get('billing_address_line1')
            attrs['shipping_address_line2'] = attrs.get('billing_address_line2')
            attrs['shipping_city'] = attrs.get('billing_city')
            attrs['shipping_state'] = attrs.get('billing_state')
            attrs['shipping_postal_code'] = attrs.get('billing_postal_code')
            attrs['shipping_country'] = attrs.get('billing_country')

        return attrs

    def create(self, validated_data):
        """Create order from cart"""
        cart_id = validated_data.pop('cart_id')
        shipping_method_id = validated_data.pop('shipping_method_id')
        use_same_address = validated_data.pop('use_same_address', True)

        # Get cart and shipping method
        cart = Cart.objects.get(id=cart_id)
        shipping_method = ShippingMethod.objects.get(id=shipping_method_id)

        # Calculate totals
        subtotal = cart.total_price
        shipping_amount = shipping_method.base_price
        
        # Calculate tax (simplified - you might want to integrate with a tax service)
        tax_amount = self.calculate_tax(validated_data, subtotal)
        
        # Calculate total
        total_amount = subtotal + tax_amount + shipping_amount - cart.total_discount

        # Create order
        order = Order.objects.create(
            user=self.context['request'].user,
            subtotal=subtotal,
            tax_amount=tax_amount,
            shipping_amount=shipping_amount,
            discount_amount=cart.total_discount,
            total_amount=total_amount,
            shipping_method=shipping_method.name,
            **validated_data
        )

        # Create order items from cart items
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                variant=cart_item.variant,
                product_name=cart_item.product.name,
                product_sku=cart_item.product.sku,
                variant_name=f"{cart_item.variant.name}: {cart_item.variant.value}" if cart_item.variant else None,
                quantity=cart_item.quantity,
                unit_price=cart_item.unit_price,
                total_price=cart_item.total_price,
                discount_amount=cart_item.total_discount
            )

        # Clear cart
        cart.items.all().delete()
        cart.is_active = False
        cart.save()

        # Create initial status history
        OrderStatusHistory.objects.create(
            order=order,
            status='pending',
            notes='Order created from cart'
        )

        return order

    def calculate_tax(self, address_data, subtotal):
        """Calculate tax based on shipping address"""
        # This is a simplified tax calculation
        # In production, you'd integrate with a tax service like TaxJar or Avalara
        
        # Default tax rate (8.25% for demo)
        default_tax_rate = Decimal('0.0825')
        
        try:
            # Try to find specific tax rate
            tax_rate = TaxRate.objects.filter(
                country=address_data.get('shipping_country', 'United States'),
                state=address_data.get('shipping_state'),
                city=address_data.get('shipping_city'),
                is_active=True
            ).first()
            
            if tax_rate:
                return subtotal * tax_rate.rate
            else:
                return subtotal * default_tax_rate
        except:
            return subtotal * default_tax_rate


class UpdateOrderStatusSerializer(serializers.Serializer):
    """Serializer for updating order status"""
    status = serializers.ChoiceField(choices=Order.STATUS_CHOICES)
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate_status(self, value):
        """Validate status transition"""
        order = self.context['order']
        current_status = order.status
        
        # Define allowed status transitions
        allowed_transitions = {
            'pending': ['confirmed', 'cancelled'],
            'confirmed': ['processing', 'cancelled'],
            'processing': ['shipped', 'cancelled'],
            'shipped': ['delivered'],
            'delivered': ['refunded'],
            'cancelled': [],
            'refunded': []
        }
        
        if value not in allowed_transitions.get(current_status, []):
            raise serializers.ValidationError(
                f"Cannot transition from {current_status} to {value}"
            )
        
        return value


class ShippingMethodSerializer(serializers.ModelSerializer):
    """Serializer for shipping methods"""
    class Meta:
        model = ShippingMethod
        fields = ['id', 'name', 'description', 'base_price', 'estimated_days']


class TaxRateSerializer(serializers.ModelSerializer):
    """Serializer for tax rates"""
    rate_percentage = serializers.SerializerMethodField()

    class Meta:
        model = TaxRate
        fields = ['id', 'country', 'state', 'city', 'postal_code', 'rate', 'rate_percentage']

    def get_rate_percentage(self, obj):
        return f"{obj.rate * 100}%"


class CheckoutSerializer(serializers.Serializer):
    """Serializer for checkout process"""
    cart_id = serializers.IntegerField()
    shipping_method_id = serializers.IntegerField()
    billing_address = serializers.DictField()
    shipping_address = serializers.DictField(required=False)
    use_same_address = serializers.BooleanField(default=True)
    payment_method = serializers.CharField()
    customer_info = serializers.DictField()

    def validate(self, attrs):
        """Validate checkout data"""
        cart_id = attrs.get('cart_id')
        
        # Validate cart exists and has items
        try:
            cart = Cart.objects.get(id=cart_id, user=self.context['request'].user, is_active=True)
            if not cart.items.exists():
                raise serializers.ValidationError("Cart is empty")
        except Cart.DoesNotExist:
            raise serializers.ValidationError("Invalid cart")

        # Validate shipping method
        shipping_method_id = attrs.get('shipping_method_id')
        try:
            ShippingMethod.objects.get(id=shipping_method_id, is_active=True)
        except ShippingMethod.DoesNotExist:
            raise serializers.ValidationError("Invalid shipping method")

        return attrs
