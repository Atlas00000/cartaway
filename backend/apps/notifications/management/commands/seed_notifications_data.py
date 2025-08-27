from django.core.management.base import BaseCommand
from apps.notifications.models import (
    Notification, NotificationTemplate, NotificationPreference,
    PriceAlert, StockAlert
)
from apps.users.models import User
from apps.products.models import Product
from apps.orders.models import Order
from apps.notifications.services import NotificationService
from decimal import Decimal
import random


class Command(BaseCommand):
    help = 'Create sample notification data for testing'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample notification data...')

        # Get existing data
        users = User.objects.all()
        products = Product.objects.all()

        if not users.exists() or not products.exists():
            self.stdout.write(self.style.ERROR('No users or products found. Please run seed_products first.'))
            return

        # Create notification templates
        self.create_notification_templates()

        # Create notification preferences for users
        for user in users:
            preferences, created = NotificationPreference.objects.get_or_create(
                user=user,
                defaults={
                    'email_notifications': True,
                    'email_order_updates': True,
                    'email_promotions': True,
                    'email_security': True,
                    'email_newsletter': random.choice([True, False]),
                    'sms_notifications': random.choice([True, False]),
                    'sms_order_updates': random.choice([True, False]),
                    'sms_promotions': False,
                    'sms_security': True,
                    'push_notifications': True,
                    'push_order_updates': True,
                    'push_promotions': random.choice([True, False]),
                    'push_security': True,
                    'digest_frequency': random.choice(['immediate', 'daily', 'weekly']),
                    'quiet_hours_enabled': random.choice([True, False])
                }
            )
            
            if created:
                self.stdout.write(f'Created notification preferences for {user.email}')

        # Create sample notifications
        self.create_sample_notifications(users, products)

        # Create price alerts
        self.create_price_alerts(users, products)

        # Create stock alerts
        self.create_stock_alerts(users, products)

        # Create welcome notifications
        service = NotificationService()
        for user in users:
            service.create_welcome_notification(user)

        self.stdout.write(
            self.style.SUCCESS('Successfully created sample notification data!')
        )

    def create_notification_templates(self):
        """Create notification templates"""
        templates_data = [
            {
                'name': 'Order Status Update',
                'template_type': 'order_status',
                'subject': 'Order #{order_id} Status Update',
                'message_template': 'Your order #{order_id} status has been updated to {status}.',
                'email_template': '''
                <html>
                <body>
                    <h2>Order Status Update</h2>
                    <p>Your order #{order_id} status has been updated to <strong>{status}</strong>.</p>
                    <p>Order Total: ${total}</p>
                    <a href="/orders/{order_id}">View Order</a>
                </body>
                </html>
                ''',
                'variables': {'order_id': 'Order ID', 'status': 'Order Status', 'total': 'Order Total'}
            },
            {
                'name': 'Price Drop Alert',
                'template_type': 'price_drop',
                'subject': 'Price Drop Alert: {product_name}',
                'message_template': 'The price of {product_name} has dropped to ${new_price}!',
                'email_template': '''
                <html>
                <body>
                    <h2>Price Drop Alert</h2>
                    <p>The price of <strong>{product_name}</strong> has dropped to <strong>${new_price}</strong>!</p>
                    <p>Original Price: ${original_price}</p>
                    <a href="/products/{product_slug}">View Product</a>
                </body>
                </html>
                ''',
                'variables': {'product_name': 'Product Name', 'new_price': 'New Price', 'original_price': 'Original Price', 'product_slug': 'Product Slug'}
            },
            {
                'name': 'Back in Stock',
                'template_type': 'back_in_stock',
                'subject': 'Back in Stock: {product_name}',
                'message_template': '{product_name} is back in stock!',
                'email_template': '''
                <html>
                <body>
                    <h2>Back in Stock</h2>
                    <p><strong>{product_name}</strong> is back in stock!</p>
                    <p>Current Price: ${price}</p>
                    <a href="/products/{product_slug}">View Product</a>
                </body>
                </html>
                ''',
                'variables': {'product_name': 'Product Name', 'price': 'Product Price', 'product_slug': 'Product Slug'}
            },
            {
                'name': 'Welcome Message',
                'template_type': 'welcome',
                'subject': 'Welcome to Our Store!',
                'message_template': 'Thank you for joining us, {user_name}! Explore our products and enjoy shopping!',
                'email_template': '''
                <html>
                <body>
                    <h2>Welcome to Our Store!</h2>
                    <p>Hi {user_name},</p>
                    <p>Thank you for joining us! We\'re excited to have you as part of our community.</p>
                    <p>Explore our products and enjoy shopping!</p>
                    <a href="/products">Start Shopping</a>
                </body>
                </html>
                ''',
                'variables': {'user_name': 'User Name'}
            }
        ]

        for template_data in templates_data:
            template, created = NotificationTemplate.objects.get_or_create(
                name=template_data['name'],
                template_type=template_data['template_type'],
                defaults=template_data
            )
            
            if created:
                self.stdout.write(f'Created notification template: {template.name}')

    def create_sample_notifications(self, users, products):
        """Create sample notifications for users"""
        notification_types = [
            ('order_status', 'Order Status Update', 'Your order status has been updated'),
            ('price_drop', 'Price Drop Alert', 'A product you\'re watching has dropped in price'),
            ('back_in_stock', 'Back in Stock', 'A product is back in stock'),
            ('promotion', 'Special Offer', 'Check out our latest promotions'),
            ('security', 'Security Alert', 'Your account security has been updated'),
            ('system', 'System Update', 'We\'ve made some improvements to our platform')
        ]

        for user in users:
            # Create 3-8 notifications per user
            num_notifications = random.randint(3, 8)
            for i in range(num_notifications):
                notification_type, title, message = random.choice(notification_types)
                
                # Customize message based on type
                if notification_type == 'order_status':
                    orders = Order.objects.filter(user=user)
                    if orders.exists():
                        order = random.choice(orders)
                        title = f'Order #{order.id} Status Update'
                        message = f'Your order #{order.id} status has been updated to {order.status}'
                
                elif notification_type == 'price_drop':
                    product = random.choice(products)
                    title = f'Price Drop Alert: {product.name}'
                    message = f'The price of {product.name} has dropped to ${product.price}!'
                
                elif notification_type == 'back_in_stock':
                    product = random.choice(products)
                    title = f'Back in Stock: {product.name}'
                    message = f'{product.name} is back in stock!'
                
                elif notification_type == 'promotion':
                    title = 'Special Offer - 20% Off!'
                    message = 'Get 20% off on selected items. Limited time offer!'
                
                notification = Notification.objects.create(
                    user=user,
                    notification_type=notification_type,
                    title=title,
                    message=message,
                    priority=random.choice(['low', 'medium', 'high']),
                    is_read=random.choice([True, False])
                )
                
                if i == 0:  # Only log first notification per user
                    self.stdout.write(f'Created notification for {user.email}: {title}')

    def create_price_alerts(self, users, products):
        """Create price alerts for users"""
        for user in users:
            # Create 1-3 price alerts per user
            num_alerts = random.randint(1, 3)
            selected_products = random.sample(list(products), min(num_alerts, len(products)))
            
            for product in selected_products:
                # Set target price below current price
                target_price = product.price * Decimal('0.8')  # 20% below current price
                
                alert, created = PriceAlert.objects.get_or_create(
                    user=user,
                    product=product,
                    defaults={
                        'target_price': target_price,
                        'current_price': product.price,
                        'is_active': True,
                        'email_alert': True,
                        'sms_alert': random.choice([True, False]),
                        'push_alert': True
                    }
                )
                
                if created:
                    self.stdout.write(f'Created price alert for {user.email}: {product.name} at ${target_price}')

    def create_stock_alerts(self, users, products):
        """Create stock alerts for users"""
        # Only create stock alerts for products that are out of stock
        out_of_stock_products = [p for p in products if not p.is_in_stock]
        
        if not out_of_stock_products:
            self.stdout.write('No out-of-stock products found for stock alerts')
            return
        
        for user in users:
            # Create 1-2 stock alerts per user
            num_alerts = random.randint(1, 2)
            selected_products = random.sample(out_of_stock_products, min(num_alerts, len(out_of_stock_products)))
            
            for product in selected_products:
                alert, created = StockAlert.objects.get_or_create(
                    user=user,
                    product=product,
                    defaults={
                        'is_active': True,
                        'email_alert': True,
                        'sms_alert': random.choice([True, False]),
                        'push_alert': True
                    }
                )
                
                if created:
                    self.stdout.write(f'Created stock alert for {user.email}: {product.name}')
