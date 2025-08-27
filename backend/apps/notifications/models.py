from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from apps.products.models import Product
from apps.orders.models import Order
from decimal import Decimal

User = get_user_model()


class Notification(models.Model):
    """Base notification model"""
    NOTIFICATION_TYPES = [
        ('order_status', 'Order Status Update'),
        ('order_shipped', 'Order Shipped'),
        ('order_delivered', 'Order Delivered'),
        ('low_stock', 'Low Stock Alert'),
        ('price_drop', 'Price Drop Alert'),
        ('back_in_stock', 'Back in Stock'),
        ('review_response', 'Review Response'),
        ('welcome', 'Welcome Message'),
        ('promotion', 'Promotion'),
        ('security', 'Security Alert'),
        ('system', 'System Notification'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    
    # Related object (optional)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, blank=True, null=True)
    object_id = models.PositiveIntegerField(blank=True, null=True)
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # Notification metadata
    is_read = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)
    read_at = models.DateTimeField(blank=True, null=True)
    
    # Action data
    action_url = models.URLField(blank=True, null=True)
    action_text = models.CharField(max_length=100, blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read', 'created_at']),
            models.Index(fields=['notification_type', 'created_at']),
            models.Index(fields=['priority', 'created_at']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.title}"

    def mark_as_read(self):
        """Mark notification as read"""
        if not self.is_read:
            self.is_read = True
            self.read_at = models.timezone.now()
            self.save(update_fields=['is_read', 'read_at'])

    def mark_as_unread(self):
        """Mark notification as unread"""
        if self.is_read:
            self.is_read = False
            self.read_at = None
            self.save(update_fields=['is_read', 'read_at'])

    def archive(self):
        """Archive notification"""
        self.is_archived = True
        self.save(update_fields=['is_archived'])


class NotificationTemplate(models.Model):
    """Notification templates for consistent messaging"""
    TEMPLATE_TYPES = [
        ('order_status', 'Order Status Update'),
        ('order_shipped', 'Order Shipped'),
        ('order_delivered', 'Order Delivered'),
        ('low_stock', 'Low Stock Alert'),
        ('price_drop', 'Price Drop Alert'),
        ('back_in_stock', 'Back in Stock'),
        ('review_response', 'Review Response'),
        ('welcome', 'Welcome Message'),
        ('promotion', 'Promotion'),
        ('security', 'Security Alert'),
        ('system', 'System Notification'),
    ]
    
    name = models.CharField(max_length=100)
    template_type = models.CharField(max_length=50, choices=TEMPLATE_TYPES)
    subject = models.CharField(max_length=200)
    message_template = models.TextField(help_text="Use {variable} syntax for dynamic content")
    email_template = models.TextField(blank=True, help_text="HTML email template")
    sms_template = models.TextField(blank=True, help_text="SMS template")
    
    # Template variables
    variables = models.JSONField(default=dict, help_text="Available variables for this template")
    
    # Settings
    is_active = models.BooleanField(default=True)
    send_email = models.BooleanField(default=True)
    send_sms = models.BooleanField(default=False)
    send_push = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        unique_together = ['name', 'template_type']

    def __str__(self):
        return f"{self.name} ({self.template_type})"

    def render_message(self, context):
        """Render message with context variables"""
        message = self.message_template
        for key, value in context.items():
            message = message.replace(f"{{{key}}}", str(value))
        return message

    def render_email(self, context):
        """Render email template with context variables"""
        if not self.email_template:
            return self.render_message(context)
        
        email_html = self.email_template
        for key, value in context.items():
            email_html = email_html.replace(f"{{{key}}}", str(value))
        return email_html


class NotificationPreference(models.Model):
    """User notification preferences"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_preferences')
    
    # Email preferences
    email_notifications = models.BooleanField(default=True)
    email_order_updates = models.BooleanField(default=True)
    email_promotions = models.BooleanField(default=True)
    email_security = models.BooleanField(default=True)
    email_newsletter = models.BooleanField(default=False)
    
    # SMS preferences
    sms_notifications = models.BooleanField(default=False)
    sms_order_updates = models.BooleanField(default=False)
    sms_promotions = models.BooleanField(default=False)
    sms_security = models.BooleanField(default=True)
    
    # Push preferences
    push_notifications = models.BooleanField(default=True)
    push_order_updates = models.BooleanField(default=True)
    push_promotions = models.BooleanField(default=False)
    push_security = models.BooleanField(default=True)
    
    # Frequency preferences
    digest_frequency = models.CharField(
        max_length=20,
        choices=[
            ('immediate', 'Immediate'),
            ('hourly', 'Hourly'),
            ('daily', 'Daily'),
            ('weekly', 'Weekly'),
        ],
        default='immediate'
    )
    
    # Quiet hours
    quiet_hours_start = models.TimeField(blank=True, null=True)
    quiet_hours_end = models.TimeField(blank=True, null=True)
    quiet_hours_enabled = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Notification Preference'
        verbose_name_plural = 'Notification Preferences'

    def __str__(self):
        return f"Preferences for {self.user.email}"

    def should_send_notification(self, notification_type, channel='email'):
        """Check if notification should be sent based on preferences"""
        if channel == 'email':
            if not self.email_notifications:
                return False
            
            if notification_type in ['order_status', 'order_shipped', 'order_delivered']:
                return self.email_order_updates
            elif notification_type == 'promotion':
                return self.email_promotions
            elif notification_type == 'security':
                return self.email_security
            else:
                return True
                
        elif channel == 'sms':
            if not self.sms_notifications:
                return False
            
            if notification_type in ['order_status', 'order_shipped', 'order_delivered']:
                return self.sms_order_updates
            elif notification_type == 'promotion':
                return self.sms_promotions
            elif notification_type == 'security':
                return self.sms_security
            else:
                return False
                
        elif channel == 'push':
            if not self.push_notifications:
                return False
            
            if notification_type in ['order_status', 'order_shipped', 'order_delivered']:
                return self.push_order_updates
            elif notification_type == 'promotion':
                return self.push_promotions
            elif notification_type == 'security':
                return self.push_security
            else:
                return True
        
        return False


class NotificationLog(models.Model):
    """Log of sent notifications for tracking"""
    CHANNEL_CHOICES = [
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('push', 'Push'),
        ('in_app', 'In-App'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('failed', 'Failed'),
        ('bounced', 'Bounced'),
    ]
    
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE, related_name='logs')
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Delivery details
    sent_at = models.DateTimeField(blank=True, null=True)
    delivered_at = models.DateTimeField(blank=True, null=True)
    error_message = models.TextField(blank=True, null=True)
    
    # External service details
    external_id = models.CharField(max_length=100, blank=True, null=True)
    external_status = models.CharField(max_length=100, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['notification', 'channel']),
            models.Index(fields=['status', 'created_at']),
        ]

    def __str__(self):
        return f"{self.notification.title} - {self.channel} - {self.status}"


class PriceAlert(models.Model):
    """Price drop alerts for products"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='price_alerts')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='price_alerts')
    
    # Alert settings
    target_price = models.DecimalField(max_digits=10, decimal_places=2)
    current_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    
    # Notification settings
    email_alert = models.BooleanField(default=True)
    sms_alert = models.BooleanField(default=False)
    push_alert = models.BooleanField(default=True)
    
    # Alert history
    last_alert_sent = models.DateTimeField(blank=True, null=True)
    alert_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'product']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.product.name} - ${self.target_price}"

    def should_send_alert(self):
        """Check if price alert should be sent"""
        if not self.is_active:
            return False
        
        # Check if current price is at or below target price
        if self.product.price <= self.target_price:
            return True
        
        return False

    def update_current_price(self, new_price):
        """Update current price and check for alerts"""
        self.current_price = new_price
        self.save(update_fields=['current_price'])
        
        if self.should_send_alert():
            # Create notification
            from .services import NotificationService
            service = NotificationService()
            service.create_price_drop_alert(self)


class StockAlert(models.Model):
    """Back in stock alerts for products"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stock_alerts')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='stock_alerts')
    
    # Alert settings
    is_active = models.BooleanField(default=True)
    
    # Notification settings
    email_alert = models.BooleanField(default=True)
    sms_alert = models.BooleanField(default=False)
    push_alert = models.BooleanField(default=True)
    
    # Alert history
    last_alert_sent = models.DateTimeField(blank=True, null=True)
    alert_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'product']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.product.name} - Stock Alert"

    def should_send_alert(self):
        """Check if stock alert should be sent"""
        if not self.is_active:
            return False
        
        # Check if product is back in stock
        if self.product.is_in_stock:
            return True
        
        return False
