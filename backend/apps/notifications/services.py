from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from .models import (
    Notification, NotificationTemplate, NotificationPreference,
    NotificationLog, PriceAlert, StockAlert
)
from apps.products.models import Product
from apps.orders.models import Order
import logging

logger = logging.getLogger(__name__)


class NotificationService:
    """Service class for handling notifications"""
    
    def __init__(self):
        self.default_from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@example.com')
    
    def create_notification(self, user, notification_type, title, message, 
                          priority='medium', content_object=None, action_url=None, action_text=None):
        """Create a new notification"""
        notification = Notification.objects.create(
            user=user,
            notification_type=notification_type,
            title=title,
            message=message,
            priority=priority,
            content_object=content_object,
            action_url=action_url,
            action_text=action_text
        )
        
        # Send notification via appropriate channels
        self.send_notification(notification)
        
        return notification
    
    def send_notification(self, notification):
        """Send notification via appropriate channels"""
        try:
            # Get user preferences
            preferences, created = NotificationPreference.objects.get_or_create(
                user=notification.user,
                defaults={
                    'email_notifications': True,
                    'push_notifications': True,
                    'sms_notifications': False
                }
            )
            
            # Check if we should send email
            if preferences.should_send_notification(notification.notification_type, 'email'):
                self.send_email_notification(notification)
            
            # Check if we should send SMS
            if preferences.should_send_notification(notification.notification_type, 'sms'):
                self.send_sms_notification(notification)
            
            # Check if we should send push notification
            if preferences.should_send_notification(notification.notification_type, 'push'):
                self.send_push_notification(notification)
            
            # Log in-app notification
            self.log_notification(notification, 'in_app', 'delivered')
            
        except Exception as e:
            logger.error(f"Error sending notification {notification.id}: {str(e)}")
            self.log_notification(notification, 'in_app', 'failed', error_message=str(e))
    
    def send_email_notification(self, notification):
        """Send email notification"""
        try:
            # Get user preferences
            preferences = notification.user.notification_preferences
            
            # Check quiet hours
            if preferences.quiet_hours_enabled and self.is_quiet_hours(preferences):
                logger.info(f"Skipping email notification due to quiet hours: {notification.id}")
                return
            
            # Send email
            send_mail(
                subject=notification.title,
                message=notification.message,
                from_email=self.default_from_email,
                recipient_list=[notification.user.email],
                fail_silently=False
            )
            
            # Log successful email
            self.log_notification(notification, 'email', 'delivered')
            
        except Exception as e:
            logger.error(f"Error sending email notification {notification.id}: {str(e)}")
            self.log_notification(notification, 'email', 'failed', error_message=str(e))
    
    def send_sms_notification(self, notification):
        """Send SMS notification (placeholder for SMS service integration)"""
        try:
            # This would integrate with an SMS service like Twilio
            # For now, just log the attempt
            logger.info(f"SMS notification would be sent: {notification.title}")
            self.log_notification(notification, 'sms', 'sent')
            
        except Exception as e:
            logger.error(f"Error sending SMS notification {notification.id}: {str(e)}")
            self.log_notification(notification, 'sms', 'failed', error_message=str(e))
    
    def send_push_notification(self, notification):
        """Send push notification (placeholder for push service integration)"""
        try:
            # This would integrate with a push notification service
            # For now, just log the attempt
            logger.info(f"Push notification would be sent: {notification.title}")
            self.log_notification(notification, 'push', 'sent')
            
        except Exception as e:
            logger.error(f"Error sending push notification {notification.id}: {str(e)}")
            self.log_notification(notification, 'push', 'failed', error_message=str(e))
    
    def log_notification(self, notification, channel, status, error_message=None):
        """Log notification delivery attempt"""
        NotificationLog.objects.create(
            notification=notification,
            channel=channel,
            status=status,
            error_message=error_message,
            sent_at=timezone.now() if status in ['sent', 'delivered'] else None,
            delivered_at=timezone.now() if status == 'delivered' else None
        )
    
    def is_quiet_hours(self, preferences):
        """Check if current time is within quiet hours"""
        if not preferences.quiet_hours_enabled:
            return False
        
        if not preferences.quiet_hours_start or not preferences.quiet_hours_end:
            return False
        
        current_time = timezone.now().time()
        start_time = preferences.quiet_hours_start
        end_time = preferences.quiet_hours_end
        
        if start_time <= end_time:
            return start_time <= current_time <= end_time
        else:
            # Handle overnight quiet hours
            return current_time >= start_time or current_time <= end_time
    
    def create_order_status_notification(self, order, status):
        """Create order status update notification"""
        status_messages = {
            'processing': 'Your order is being processed',
            'shipped': 'Your order has been shipped',
            'delivered': 'Your order has been delivered',
            'cancelled': 'Your order has been cancelled'
        }
        
        message = status_messages.get(status, f'Your order status has been updated to {status}')
        
        return self.create_notification(
            user=order.user,
            notification_type='order_status',
            title=f'Order #{order.id} Status Update',
            message=message,
            priority='high' if status in ['shipped', 'delivered'] else 'medium',
            content_object=order,
            action_url=f'/orders/{order.id}',
            action_text='View Order'
        )
    
    def create_price_drop_alert(self, price_alert):
        """Create price drop alert notification"""
        product = price_alert.product
        current_price = product.price
        
        return self.create_notification(
            user=price_alert.user,
            notification_type='price_drop',
            title=f'Price Drop Alert: {product.name}',
            message=f'The price of {product.name} has dropped to ${current_price}!',
            priority='medium',
            content_object=product,
            action_url=f'/products/{product.slug}',
            action_text='View Product'
        )
    
    def create_back_in_stock_alert(self, stock_alert):
        """Create back in stock alert notification"""
        product = stock_alert.product
        
        return self.create_notification(
            user=stock_alert.user,
            notification_type='back_in_stock',
            title=f'Back in Stock: {product.name}',
            message=f'{product.name} is back in stock!',
            priority='medium',
            content_object=product,
            action_url=f'/products/{product.slug}',
            action_text='View Product'
        )
    
    def create_low_stock_alert(self, product):
        """Create low stock alert for admin users"""
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        # Get admin users
        admin_users = User.objects.filter(is_staff=True)
        
        for user in admin_users:
            self.create_notification(
                user=user,
                notification_type='low_stock',
                title=f'Low Stock Alert: {product.name}',
                message=f'{product.name} is running low on stock. Current quantity: {product.stock_quantity}',
                priority='high',
                content_object=product,
                action_url=f'/admin/products/product/{product.id}/change/',
                action_text='Update Stock'
            )
    
    def create_welcome_notification(self, user):
        """Create welcome notification for new users"""
        return self.create_notification(
            user=user,
            notification_type='welcome',
            title='Welcome to Our Store!',
            message='Thank you for joining us. Explore our products and enjoy shopping!',
            priority='low',
            action_url='/products',
            action_text='Start Shopping'
        )
    
    def create_promotion_notification(self, user, promotion_title, promotion_message, action_url=None):
        """Create promotion notification"""
        return self.create_notification(
            user=user,
            notification_type='promotion',
            title=promotion_title,
            message=promotion_message,
            priority='medium',
            action_url=action_url,
            action_text='View Offer'
        )
    
    def mark_notification_as_read(self, notification_id, user):
        """Mark notification as read"""
        try:
            notification = Notification.objects.get(id=notification_id, user=user)
            notification.mark_as_read()
            return True
        except Notification.DoesNotExist:
            return False
    
    def mark_all_as_read(self, user):
        """Mark all user notifications as read"""
        Notification.objects.filter(user=user, is_read=False).update(
            is_read=True,
            read_at=timezone.now()
        )
    
    def get_notification_summary(self, user):
        """Get notification summary for user"""
        notifications = Notification.objects.filter(user=user, is_archived=False)
        
        return {
            'total_notifications': notifications.count(),
            'unread_count': notifications.filter(is_read=False).count(),
            'read_count': notifications.filter(is_read=True).count(),
            'archived_count': Notification.objects.filter(user=user, is_archived=True).count(),
            'recent_notifications': notifications.order_by('-created_at')[:10]
        }
    
    def get_notification_stats(self):
        """Get notification delivery statistics"""
        logs = NotificationLog.objects.all()
        
        total_sent = logs.count()
        total_delivered = logs.filter(status='delivered').count()
        total_failed = logs.filter(status='failed').count()
        delivery_rate = (total_delivered / total_sent * 100) if total_sent > 0 else 0
        
        # Stats by type
        by_type = {}
        for notification_type, _ in Notification.NOTIFICATION_TYPES:
            count = Notification.objects.filter(notification_type=notification_type).count()
            by_type[notification_type] = count
        
        # Stats by channel
        by_channel = {}
        for channel, _ in NotificationLog.CHANNEL_CHOICES:
            count = logs.filter(channel=channel).count()
            by_channel[channel] = count
        
        return {
            'total_sent': total_sent,
            'total_delivered': total_delivered,
            'total_failed': total_failed,
            'delivery_rate': round(delivery_rate, 2),
            'by_type': by_type,
            'by_channel': by_channel
        }
