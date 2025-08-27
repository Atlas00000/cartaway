from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductVariant, ProductReview


class CategorySerializer(serializers.ModelSerializer):
    """Category serializer"""
    children = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'image', 'parent', 
            'is_active', 'children', 'product_count', 'created_at'
        ]

    def get_children(self, obj):
        """Get child categories"""
        children = Category.objects.filter(parent=obj, is_active=True)
        return CategorySerializer(children, many=True).data

    def get_product_count(self, obj):
        """Get product count for category"""
        return obj.products.filter(is_active=True).count()


class CategoryCreateUpdateSerializer(serializers.ModelSerializer):
    """Category create/update serializer"""
    slug = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = Category
        fields = [
            'name', 'slug', 'description', 'image', 'parent', 'is_active'
        ]

    def create(self, validated_data):
        """Create category with auto-generated slug"""
        # Auto-generate slug if not provided
        if not validated_data.get('slug'):
            validated_data['slug'] = validated_data['name'].lower().replace(' ', '-').replace('/', '-').replace('\\', '-')
        
        return super().create(validated_data)


class ProductImageSerializer(serializers.ModelSerializer):
    """Product image serializer"""
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']


class ProductVariantSerializer(serializers.ModelSerializer):
    """Product variant serializer"""
    class Meta:
        model = ProductVariant
        fields = ['id', 'name', 'value', 'sku', 'price_adjustment', 'stock_quantity', 'is_active']


class ProductReviewSerializer(serializers.ModelSerializer):
    """Product review serializer"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = ProductReview
        fields = [
            'id', 'rating', 'title', 'comment', 'user_name', 'user_email',
            'is_approved', 'created_at'
        ]
        read_only_fields = ['user', 'is_approved']


class ProductListSerializer(serializers.ModelSerializer):
    """Product list serializer (for catalog)"""
    category = CategorySerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'short_description', 'price', 'compare_price',
            'category', 'primary_image', 'is_in_stock', 'is_low_stock',
            'discount_percentage', 'is_featured', 'is_bestseller',
            'average_rating', 'review_count', 'created_at'
        ]

    def validate_price(self, value):
        """Validate product price"""
        if value <= 0:
            raise serializers.ValidationError("Price must be positive")
        if value > 999999.99:
            raise serializers.ValidationError("Price cannot exceed $999,999.99")
        return value

    def validate_compare_price(self, value):
        """Validate compare price"""
        if value is not None and value <= 0:
            raise serializers.ValidationError("Compare price must be positive")
        return value

    def validate_stock_quantity(self, value):
        """Validate stock quantity"""
        if value < 0:
            raise serializers.ValidationError("Stock quantity cannot be negative")
        if value > 999999:
            raise serializers.ValidationError("Stock quantity cannot exceed 999,999")
        return value

    def validate_low_stock_threshold(self, value):
        """Validate low stock threshold"""
        if value < 0:
            raise serializers.ValidationError("Low stock threshold cannot be negative")
        if value > 1000:
            raise serializers.ValidationError("Low stock threshold cannot exceed 1,000")
        return value

    def get_primary_image(self, obj):
        """Get primary product image"""
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return ProductImageSerializer(primary_image).data
        # Fallback to first image
        first_image = obj.images.first()
        return ProductImageSerializer(first_image).data if first_image else None

    def get_average_rating(self, obj):
        """Calculate average rating"""
        reviews = obj.reviews.filter(is_approved=True)
        if reviews:
            return sum(review.rating for review in reviews) / reviews.count()
        return 0

    def get_review_count(self, obj):
        """Get review count"""
        return obj.reviews.filter(is_approved=True).count()


class ProductDetailSerializer(serializers.ModelSerializer):
    """Product detail serializer"""
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'short_description',
            'price', 'compare_price', 'cost_price', 'sku', 'barcode',
            'weight', 'dimensions', 'stock_quantity', 'low_stock_threshold',
            'track_inventory', 'is_active', 'is_featured', 'is_bestseller',
            'category', 'images', 'variants', 'reviews',
            'is_in_stock', 'is_low_stock', 'discount_percentage',
            'average_rating', 'review_count', 'meta_title', 'meta_description',
            'created_at', 'updated_at'
        ]

    def get_average_rating(self, obj):
        """Calculate average rating"""
        reviews = obj.reviews.filter(is_approved=True)
        if reviews:
            return sum(review.rating for review in reviews) / reviews.count()
        return 0

    def get_review_count(self, obj):
        """Get review count"""
        return obj.reviews.filter(is_approved=True).count()


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Product create/update serializer"""
    slug = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = Product
        fields = [
            'name', 'slug', 'description', 'short_description',
            'price', 'compare_price', 'cost_price', 'sku', 'barcode',
            'weight', 'dimensions', 'stock_quantity', 'low_stock_threshold',
            'track_inventory', 'is_active', 'is_featured', 'is_bestseller',
            'category', 'meta_title', 'meta_description'
        ]

    def create(self, validated_data):
        """Create product with current user"""
        validated_data['created_by'] = self.context['request'].user
        
        # Auto-generate slug if not provided
        if not validated_data.get('slug'):
            validated_data['slug'] = validated_data['name'].lower().replace(' ', '-').replace('/', '-').replace('\\', '-')
        
        return super().create(validated_data)


class ProductReviewCreateSerializer(serializers.ModelSerializer):
    """Product review create serializer"""
    class Meta:
        model = ProductReview
        fields = ['rating', 'title', 'comment']

    def create(self, validated_data):
        """Create review with current user and product"""
        validated_data['user'] = self.context['request'].user
        validated_data['product_id'] = self.context['product_id']
        return super().create(validated_data)

    def validate(self, attrs):
        """Validate review data"""
        product_id = self.context.get('product_id')
        user = self.context['request'].user
        
        # Check if user already reviewed this product
        if ProductReview.objects.filter(product_id=product_id, user=user).exists():
            raise serializers.ValidationError("You have already reviewed this product.")
        
        return attrs
