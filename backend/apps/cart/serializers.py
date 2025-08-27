from rest_framework import serializers
from .models import Cart, CartItem, Wishlist
from apps.products.serializers import ProductListSerializer


class CartItemSerializer(serializers.ModelSerializer):
    """Cart item serializer"""
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    variant_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_discount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    is_available = serializers.BooleanField(read_only=True)

    class Meta:
        model = CartItem
        fields = [
            'id', 'product', 'product_id', 'variant_id', 'quantity',
            'unit_price', 'total_price', 'total_discount', 'is_available',
            'added_at'
        ]

    def validate_quantity(self, value):
        """Validate quantity"""
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0")
        return value

    def validate(self, attrs):
        """Validate cart item data"""
        product_id = attrs.get('product_id')
        variant_id = attrs.get('variant_id')
        quantity = attrs.get('quantity', 1)

        # Check if product exists and is active
        try:
            from apps.products.models import Product
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product not found or inactive")

        # Check if variant exists (if provided)
        if variant_id:
            try:
                from apps.products.models import ProductVariant
                variant = ProductVariant.objects.get(id=variant_id, product=product, is_active=True)
            except ProductVariant.DoesNotExist:
                raise serializers.ValidationError("Product variant not found or inactive")

            # Check stock availability for variant
            if variant.stock_quantity < quantity:
                raise serializers.ValidationError(f"Only {variant.stock_quantity} items available in stock")
        else:
            # Check stock availability for product
            if product.stock_quantity < quantity:
                raise serializers.ValidationError(f"Only {product.stock_quantity} items available in stock")

        return attrs


class CartSerializer(serializers.ModelSerializer):
    """Cart serializer"""
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_discount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Cart
        fields = [
            'id', 'items', 'total_items', 'total_price', 'total_discount',
            'created_at', 'updated_at'
        ]


class AddToCartSerializer(serializers.Serializer):
    """Serializer for adding items to cart"""
    product_id = serializers.IntegerField()
    variant_id = serializers.IntegerField(required=False, allow_null=True)
    quantity = serializers.IntegerField(default=1, min_value=1)

    def validate_quantity(self, value):
        """Validate quantity"""
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0")
        return value


class UpdateCartItemSerializer(serializers.Serializer):
    """Serializer for updating cart item quantity"""
    quantity = serializers.IntegerField(min_value=1)

    def validate_quantity(self, value):
        """Validate quantity"""
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0")
        return value


class WishlistSerializer(serializers.ModelSerializer):
    """Wishlist serializer"""
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'product_id', 'added_at']

    def validate_product_id(self, value):
        """Validate product exists and is active"""
        try:
            from apps.products.models import Product
            product = Product.objects.get(id=value, is_active=True)
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product not found or inactive")
        return value
