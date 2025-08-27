from rest_framework import serializers
from .models import (
    ProductReview, ReviewImage, ReviewVote, ProductRating,
    AnalyticsEvent, SalesAnalytics, ProductAnalytics, CustomerAnalytics
)
from apps.products.serializers import ProductListSerializer
from apps.users.serializers import UserProfileSerializer as UserSerializer


class ReviewImageSerializer(serializers.ModelSerializer):
    """Serializer for review images"""
    class Meta:
        model = ReviewImage
        fields = ['id', 'image', 'caption', 'created_at']


class ReviewVoteSerializer(serializers.ModelSerializer):
    """Serializer for review votes"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = ReviewVote
        fields = ['id', 'vote_type', 'user_name', 'created_at']
        read_only_fields = ['user']


class ProductReviewSerializer(serializers.ModelSerializer):
    """Serializer for product reviews"""
    user = UserSerializer(read_only=True)
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = ProductReview
        fields = [
            'id', 'product', 'user', 'rating', 'title', 'comment',
            'is_approved', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user']


class CreateProductReviewSerializer(serializers.ModelSerializer):
    """Serializer for creating product reviews"""
    class Meta:
        model = ProductReview
        fields = ['product', 'rating', 'title', 'comment']

    def validate(self, attrs):
        """Validate review data"""
        user = self.context['request'].user
        product = attrs.get('product')
        rating = attrs.get('rating')

        # Check if user has already reviewed this product
        if ProductReview.objects.filter(user=user, product=product).exists():
            raise serializers.ValidationError("You have already reviewed this product")

        # Validate rating
        if rating < 1 or rating > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")

        return attrs

    def create(self, validated_data):
        """Create review with user"""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class UpdateProductReviewSerializer(serializers.ModelSerializer):
    """Serializer for updating product reviews"""
    class Meta:
        model = ProductReview
        fields = ['rating', 'title', 'comment']

    def validate(self, attrs):
        """Validate update data"""
        rating = attrs.get('rating')
        if rating and (rating < 1 or rating > 5):
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return attrs


class ProductRatingSerializer(serializers.ModelSerializer):
    """Serializer for product ratings"""
    product = ProductListSerializer(read_only=True)
    rating_distribution = serializers.SerializerMethodField()

    class Meta:
        model = ProductRating
        fields = [
            'id', 'product', 'average_rating', 'total_reviews',
            'five_star_count', 'four_star_count', 'three_star_count',
            'two_star_count', 'one_star_count', 'rating_distribution',
            'last_updated'
        ]

    def get_rating_distribution(self, obj):
        """Get rating distribution as percentages"""
        if obj.total_reviews == 0:
            return {
                'five_star': 0,
                'four_star': 0,
                'three_star': 0,
                'two_star': 0,
                'one_star': 0
            }
        
        return {
            'five_star': round((obj.five_star_count / obj.total_reviews) * 100, 1),
            'four_star': round((obj.four_star_count / obj.total_reviews) * 100, 1),
            'three_star': round((obj.three_star_count / obj.total_reviews) * 100, 1),
            'two_star': round((obj.two_star_count / obj.total_reviews) * 100, 1),
            'one_star': round((obj.one_star_count / obj.total_reviews) * 100, 1)
        }


class AnalyticsEventSerializer(serializers.ModelSerializer):
    """Serializer for analytics events"""
    product = ProductListSerializer(read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = AnalyticsEvent
        fields = [
            'id', 'user', 'user_name', 'session_id', 'event_type',
            'product', 'category', 'search_query', 'page_url',
            'metadata', 'created_at'
        ]
        read_only_fields = ['user']


class CreateAnalyticsEventSerializer(serializers.ModelSerializer):
    """Serializer for creating analytics events"""
    class Meta:
        model = AnalyticsEvent
        fields = ['event_type', 'product', 'category', 'search_query', 'page_url', 'metadata']

    def create(self, validated_data):
        """Create event with user and session"""
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            validated_data['user'] = request.user
        
        # Get session ID from request
        if request and hasattr(request, 'session'):
            validated_data['session_id'] = request.session.session_key
        
        return super().create(validated_data)


class SalesAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for sales analytics"""
    top_selling_product = ProductListSerializer(read_only=True)

    class Meta:
        model = SalesAnalytics
        fields = [
            'id', 'date', 'total_orders', 'total_revenue', 'total_items_sold',
            'average_order_value', 'new_customers', 'returning_customers',
            'total_customers', 'top_selling_product', 'top_selling_category',
            'cart_abandonment_rate', 'conversion_rate', 'created_at', 'updated_at'
        ]


class ProductAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for product analytics"""
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = ProductAnalytics
        fields = [
            'id', 'product', 'total_views', 'unique_views', 'total_sales',
            'total_revenue', 'add_to_cart_count', 'wishlist_count',
            'review_count', 'conversion_rate', 'last_updated'
        ]


class CustomerAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for customer analytics"""
    user = UserSerializer(read_only=True)

    class Meta:
        model = CustomerAnalytics
        fields = [
            'id', 'user', 'total_orders', 'total_spent', 'average_order_value',
            'total_reviews', 'total_wishlist_items', 'last_activity',
            'customer_segment', 'created_at', 'updated_at'
        ]


class AnalyticsSummarySerializer(serializers.Serializer):
    """Serializer for analytics summary"""
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_orders = serializers.IntegerField()
    total_customers = serializers.IntegerField()
    average_order_value = serializers.DecimalField(max_digits=10, decimal_places=2)
    conversion_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    top_products = ProductAnalyticsSerializer(many=True)
    top_customers = CustomerAnalyticsSerializer(many=True)
    recent_events = AnalyticsEventSerializer(many=True)


class ReviewModerationSerializer(serializers.Serializer):
    """Serializer for review moderation"""
    review_id = serializers.IntegerField()
    action = serializers.ChoiceField(choices=['approve', 'reject', 'flag'])
    reason = serializers.CharField(required=False, allow_blank=True)


class ReviewSearchSerializer(serializers.Serializer):
    """Serializer for review search"""
    product_id = serializers.IntegerField(required=False)
    rating = serializers.IntegerField(required=False, min_value=1, max_value=5)
    verified_only = serializers.BooleanField(default=False)
    helpful_only = serializers.BooleanField(default=False)
    date_from = serializers.DateField(required=False)
    date_to = serializers.DateField(required=False)
    search = serializers.CharField(required=False, allow_blank=True)
