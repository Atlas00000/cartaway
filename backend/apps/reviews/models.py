from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.products.models import Product, ProductReview
from apps.orders.models import Order
from decimal import Decimal

User = get_user_model()


# Using existing ProductReview from products app
from apps.products.models import ProductReview


class ReviewImage(models.Model):
    """Images attached to reviews"""
    review = models.ForeignKey(ProductReview, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='review_images/')
    caption = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Image for {self.review.product.name} review"


class ReviewVote(models.Model):
    """Votes on reviews (helpful/not helpful)"""
    VOTE_CHOICES = [
        ('helpful', 'Helpful'),
        ('not_helpful', 'Not Helpful'),
    ]
    
    review = models.ForeignKey(ProductReview, on_delete=models.CASCADE, related_name='votes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='review_votes')
    vote_type = models.CharField(max_length=20, choices=VOTE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['review', 'user']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.vote_type} on {self.review.product.name}"


class ProductRating(models.Model):
    """Aggregated product ratings"""
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='rating_summary')
    
    # Rating statistics
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    total_reviews = models.PositiveIntegerField(default=0)
    five_star_count = models.PositiveIntegerField(default=0)
    four_star_count = models.PositiveIntegerField(default=0)
    three_star_count = models.PositiveIntegerField(default=0)
    two_star_count = models.PositiveIntegerField(default=0)
    one_star_count = models.PositiveIntegerField(default=0)
    
    # Last updated
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-average_rating']

    def __str__(self):
        return f"{self.product.name} - {self.average_rating} stars ({self.total_reviews} reviews)"

    def update_rating_stats(self):
        """Update rating statistics from reviews"""
        reviews = self.product.reviews.filter(is_approved=True)
        
        self.total_reviews = reviews.count()
        
        if self.total_reviews > 0:
            # Calculate average rating
            total_rating = sum(review.rating for review in reviews)
            self.average_rating = Decimal(str(total_rating / self.total_reviews)).quantize(Decimal('0.01'))
            
            # Count ratings by star
            self.five_star_count = reviews.filter(rating=5).count()
            self.four_star_count = reviews.filter(rating=4).count()
            self.three_star_count = reviews.filter(rating=3).count()
            self.two_star_count = reviews.filter(rating=2).count()
            self.one_star_count = reviews.filter(rating=1).count()
        else:
            self.average_rating = 0
            self.five_star_count = 0
            self.four_star_count = 0
            self.three_star_count = 0
            self.two_star_count = 0
            self.one_star_count = 0
        
        self.save()


class AnalyticsEvent(models.Model):
    """Analytics events for tracking user behavior"""
    EVENT_TYPES = [
        ('page_view', 'Page View'),
        ('product_view', 'Product View'),
        ('add_to_cart', 'Add to Cart'),
        ('remove_from_cart', 'Remove from Cart'),
        ('purchase', 'Purchase'),
        ('search', 'Search'),
        ('review_submit', 'Review Submit'),
        ('wishlist_add', 'Wishlist Add'),
        ('wishlist_remove', 'Wishlist Remove'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='analytics_events', blank=True, null=True)
    session_id = models.CharField(max_length=100, blank=True, null=True)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    
    # Event data
    product = models.ForeignKey(Product, on_delete=models.CASCADE, blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    search_query = models.CharField(max_length=200, blank=True, null=True)
    page_url = models.URLField(blank=True, null=True)
    
    # Additional metadata
    metadata = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['event_type', 'created_at']),
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['product', 'created_at']),
        ]

    def __str__(self):
        return f"{self.event_type} - {self.user or 'Anonymous'} - {self.created_at}"


class SalesAnalytics(models.Model):
    """Daily sales analytics"""
    date = models.DateField(unique=True)
    
    # Sales metrics
    total_orders = models.PositiveIntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_items_sold = models.PositiveIntegerField(default=0)
    average_order_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Customer metrics
    new_customers = models.PositiveIntegerField(default=0)
    returning_customers = models.PositiveIntegerField(default=0)
    total_customers = models.PositiveIntegerField(default=0)
    
    # Product metrics
    top_selling_product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    top_selling_category = models.CharField(max_length=100, blank=True, null=True)
    
    # Conversion metrics
    cart_abandonment_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    conversion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        verbose_name_plural = 'Sales Analytics'

    def __str__(self):
        return f"Sales Analytics - {self.date} - ${self.total_revenue}"


class ProductAnalytics(models.Model):
    """Product-specific analytics"""
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='analytics')
    
    # View metrics
    total_views = models.PositiveIntegerField(default=0)
    unique_views = models.PositiveIntegerField(default=0)
    
    # Sales metrics
    total_sales = models.PositiveIntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Engagement metrics
    add_to_cart_count = models.PositiveIntegerField(default=0)
    wishlist_count = models.PositiveIntegerField(default=0)
    review_count = models.PositiveIntegerField(default=0)
    
    # Conversion metrics
    conversion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Last updated
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-total_revenue']
        verbose_name_plural = 'Product Analytics'

    def __str__(self):
        return f"{self.product.name} - {self.total_views} views, ${self.total_revenue} revenue"

    def update_analytics(self):
        """Update analytics from events"""
        from datetime import datetime, timedelta
        
        # Get events from last 30 days
        thirty_days_ago = datetime.now() - timedelta(days=30)
        events = AnalyticsEvent.objects.filter(
            product=self.product,
            created_at__gte=thirty_days_ago
        )
        
        # Update view metrics
        self.total_views = events.filter(event_type='product_view').count()
        self.unique_views = events.filter(event_type='product_view').values('user').distinct().count()
        
        # Update engagement metrics
        self.add_to_cart_count = events.filter(event_type='add_to_cart').count()
        self.wishlist_count = events.filter(event_type='wishlist_add').count()
        self.review_count = self.product.reviews.filter(is_approved=True).count()
        
        # Calculate conversion rate
        if self.total_views > 0:
            purchases = events.filter(event_type='purchase').count()
            self.conversion_rate = Decimal(str((purchases / self.total_views) * 100)).quantize(Decimal('0.01'))
        
        self.save()


class CustomerAnalytics(models.Model):
    """Customer behavior analytics"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='analytics')
    
    # Activity metrics
    total_orders = models.PositiveIntegerField(default=0)
    total_spent = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    average_order_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Engagement metrics
    total_reviews = models.PositiveIntegerField(default=0)
    total_wishlist_items = models.PositiveIntegerField(default=0)
    last_activity = models.DateTimeField(blank=True, null=True)
    
    # Customer segment
    customer_segment = models.CharField(
        max_length=20,
        choices=[
            ('new', 'New Customer'),
            ('returning', 'Returning Customer'),
            ('loyal', 'Loyal Customer'),
            ('vip', 'VIP Customer'),
        ],
        default='new'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-total_spent']
        verbose_name_plural = 'Customer Analytics'

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.customer_segment} - ${self.total_spent}"

    def update_analytics(self):
        """Update customer analytics"""
        # Update order metrics
        orders = self.user.orders.all()
        self.total_orders = orders.count()
        self.total_spent = sum(order.total_amount for order in orders)
        
        if self.total_orders > 0:
            self.average_order_value = self.total_spent / self.total_orders
        
        # Update engagement metrics
        self.total_reviews = self.user.reviews.count()
        self.total_wishlist_items = self.user.wishlist_items.count()
        
        # Update last activity
        last_order = orders.order_by('-created_at').first()
        last_review = self.user.reviews.order_by('-created_at').first()
        
        if last_order and last_review:
            self.last_activity = max(last_order.created_at, last_review.created_at)
        elif last_order:
            self.last_activity = last_order.created_at
        elif last_review:
            self.last_activity = last_review.created_at
        
        # Update customer segment
        if self.total_orders >= 10 and self.total_spent >= 1000:
            self.customer_segment = 'vip'
        elif self.total_orders >= 5:
            self.customer_segment = 'loyal'
        elif self.total_orders >= 2:
            self.customer_segment = 'returning'
        else:
            self.customer_segment = 'new'
        
        self.save()
