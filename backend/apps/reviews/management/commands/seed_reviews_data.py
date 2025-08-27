from django.core.management.base import BaseCommand
from apps.reviews.models import (
    ProductReview, ProductRating, AnalyticsEvent, SalesAnalytics,
    ProductAnalytics, CustomerAnalytics
)
from apps.products.models import Product
from apps.users.models import User
from apps.orders.models import Order
from decimal import Decimal
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Create sample reviews and analytics data for testing'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample reviews and analytics data...')

        # Get existing data
        products = Product.objects.all()
        users = User.objects.all()

        if not products.exists() or not users.exists():
            self.stdout.write(self.style.ERROR('No products or users found. Please run seed_products first.'))
            return

        # Create product ratings
        for product in products:
            rating, created = ProductRating.objects.get_or_create(product=product)
            if created:
                self.stdout.write(f'Created rating summary for {product.name}')

        # Create sample reviews
        review_titles = [
            "Great product!", "Excellent quality", "Highly recommended",
            "Good value for money", "Disappointed", "Average product",
            "Amazing!", "Not worth it", "Perfect!", "Could be better"
        ]

        review_comments = [
            "This product exceeded my expectations. The quality is outstanding and it works perfectly.",
            "I'm very happy with this purchase. It's exactly what I was looking for.",
            "Good product overall, but there are some minor issues that could be improved.",
            "Not impressed with the quality. Expected better for the price.",
            "Excellent value for money. Would definitely recommend to others.",
            "The product is okay, but nothing special. It does what it's supposed to do.",
            "Amazing quality and fast delivery. Very satisfied with my purchase.",
            "Disappointed with this product. It doesn't work as advertised.",
            "Perfect product! Exactly what I needed and great customer service.",
            "Good product but the shipping took longer than expected."
        ]

        for product in products:
            # Create 3-8 reviews per product
            num_reviews = random.randint(3, 8)
            for i in range(num_reviews):
                user = random.choice(users)
                rating = random.randint(1, 5)
                title = random.choice(review_titles)
                comment = random.choice(review_comments)

                review, created = ProductReview.objects.get_or_create(
                    product=product,
                    user=user,
                    defaults={
                        'rating': rating,
                        'title': title,
                        'comment': comment,
                        'is_approved': True
                    }
                )
                
                if created:
                    self.stdout.write(f'Created review for {product.name} by {user.get_full_name()}')

        # Update product ratings
        for product in products:
            if hasattr(product, 'rating_summary'):
                product.rating_summary.update_rating_stats()

        # Create analytics events
        event_types = ['page_view', 'product_view', 'add_to_cart', 'search', 'review_submit']
        
        for i in range(100):  # Create 100 random events
            event_type = random.choice(event_types)
            user = random.choice(users) if random.choice([True, False]) else None
            product = random.choice(products) if event_type in ['product_view', 'add_to_cart'] else None
            
            event = AnalyticsEvent.objects.create(
                user=user,
                event_type=event_type,
                product=product,
                category=product.category.name if product else None,
                search_query=f"search term {i}" if event_type == 'search' else None,
                page_url=f"/products/{product.slug}" if product else "/",
                metadata={'source': 'seed_data'}
            )

        self.stdout.write(f'Created {AnalyticsEvent.objects.count()} analytics events')

        # Create sales analytics for the last 30 days
        for i in range(30):
            date = datetime.now().date() - timedelta(days=i)
            
            # Random sales data
            total_orders = random.randint(5, 50)
            total_revenue = Decimal(random.randint(500, 5000))
            total_items_sold = random.randint(10, 100)
            new_customers = random.randint(1, 10)
            returning_customers = random.randint(2, 20)
            
            analytics, created = SalesAnalytics.objects.get_or_create(
                date=date,
                defaults={
                    'total_orders': total_orders,
                    'total_revenue': total_revenue,
                    'total_items_sold': total_items_sold,
                    'average_order_value': total_revenue / total_orders if total_orders > 0 else 0,
                    'new_customers': new_customers,
                    'returning_customers': returning_customers,
                    'total_customers': new_customers + returning_customers,
                    'top_selling_product': random.choice(products),
                    'top_selling_category': random.choice(['Electronics', 'Sports', 'Books', 'Clothing']),
                    'cart_abandonment_rate': Decimal(random.randint(10, 30)),
                    'conversion_rate': Decimal(random.randint(2, 8))
                }
            )
            
            if created:
                self.stdout.write(f'Created sales analytics for {date}')

        # Create product analytics
        for product in products:
            analytics, created = ProductAnalytics.objects.get_or_create(
                product=product,
                defaults={
                    'total_views': random.randint(100, 1000),
                    'unique_views': random.randint(50, 500),
                    'total_sales': random.randint(10, 100),
                    'total_revenue': Decimal(random.randint(500, 5000)),
                    'add_to_cart_count': random.randint(20, 200),
                    'wishlist_count': random.randint(5, 50),
                    'review_count': product.reviews.count(),
                    'conversion_rate': Decimal(random.randint(1, 10))
                }
            )
            
            if created:
                self.stdout.write(f'Created product analytics for {product.name}')

        # Create customer analytics
        for user in users:
            # Get user's orders
            orders = Order.objects.filter(user=user)
            total_orders = orders.count()
            total_spent = sum(order.total_amount for order in orders)
            
            analytics, created = CustomerAnalytics.objects.get_or_create(
                user=user,
                defaults={
                    'total_orders': total_orders,
                    'total_spent': total_spent,
                    'average_order_value': total_spent / total_orders if total_orders > 0 else 0,
                    'total_reviews': user.product_reviews.count(),
                    'total_wishlist_items': user.wishlists.count(),
                    'last_activity': user.date_joined,
                    'customer_segment': 'new' if total_orders < 2 else 'returning'
                }
            )
            
            if created:
                self.stdout.write(f'Created customer analytics for {user.get_full_name()}')

        self.stdout.write(
            self.style.SUCCESS('Successfully created sample reviews and analytics data!')
        )
