from rest_framework import serializers
from .models import (
    Notification, NotificationTemplate, NotificationPreference,
    NotificationLog, PriceAlert, StockAlert
)
from apps.users.serializers import UserProfileSerializer as UserSerializer
from apps.products.serializers import ProductListSerializer


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for notifications"""
    user = UserSerializer(read_only=True)
    notification_type_display = serializers.CharField(source='get_notification_type_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'notification_type', 'notification_type_display',
            'title', 'message', 'priority', 'priority_display',
            'is_read', 'is_archived', 'read_at', 'action_url', 'action_text',
            'created_at', 'updated_at', 'time_ago'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_time_ago(self, obj):
        """Get human-readable time ago"""
        from django.utils import timezone
        from datetime import timedelta
        
        now = timezone.now()
        diff = now - obj.created_at
        
        if diff.days > 0:
            return f"{diff.days} day{'s' if diff.days != 1 else ''} ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} hour{'s' if hours != 1 else ''} ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
        else:
            return "Just now"


class CreateNotificationSerializer(serializers.ModelSerializer):
    """Serializer for creating notifications"""
    class Meta:
        model = Notification
        fields = [
            'user', 'notification_type', 'title', 'message', 'priority',
            'action_url', 'action_text'
        ]

    def create(self, validated_data):
        """Create notification and send via appropriate channels"""
        notification = super().create(validated_data)
        
        # Send notification via appropriate channels
        from .services import NotificationService
        service = NotificationService()
        service.send_notification(notification)
        
        return notification


class NotificationTemplateSerializer(serializers.ModelSerializer):
    """Serializer for notification templates"""
    template_type_display = serializers.CharField(source='get_template_type_display', read_only=True)

    class Meta:
        model = NotificationTemplate
        fields = [
            'id', 'name', 'template_type', 'template_type_display',
            'subject', 'message_template', 'email_template', 'sms_template',
            'variables', 'is_active', 'send_email', 'send_sms', 'send_push',
            'created_at', 'updated_at'
        ]


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    """Serializer for notification preferences"""
    user = UserSerializer(read_only=True)
    digest_frequency_display = serializers.CharField(source='get_digest_frequency_display', read_only=True)

    class Meta:
        model = NotificationPreference
        fields = [
            'id', 'user', 'email_notifications', 'email_order_updates',
            'email_promotions', 'email_security', 'email_newsletter',
            'sms_notifications', 'sms_order_updates', 'sms_promotions',
            'sms_security', 'push_notifications', 'push_order_updates',
            'push_promotions', 'push_security', 'digest_frequency',
            'digest_frequency_display', 'quiet_hours_start', 'quiet_hours_end',
            'quiet_hours_enabled', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']


class UpdateNotificationPreferenceSerializer(serializers.ModelSerializer):
    """Serializer for updating notification preferences"""
    class Meta:
        model = NotificationPreference
        fields = [
            'email_notifications', 'email_order_updates', 'email_promotions',
            'email_security', 'email_newsletter', 'sms_notifications',
            'sms_order_updates', 'sms_promotions', 'sms_security',
            'push_notifications', 'push_order_updates', 'push_promotions',
            'push_security', 'digest_frequency', 'quiet_hours_start',
            'quiet_hours_end', 'quiet_hours_enabled'
        ]


class NotificationLogSerializer(serializers.ModelSerializer):
    """Serializer for notification logs"""
    notification = NotificationSerializer(read_only=True)
    channel_display = serializers.CharField(source='get_channel_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = NotificationLog
        fields = [
            'id', 'notification', 'channel', 'channel_display', 'status',
            'status_display', 'sent_at', 'delivered_at', 'error_message',
            'external_id', 'external_status', 'created_at', 'updated_at'
        ]


class PriceAlertSerializer(serializers.ModelSerializer):
    """Serializer for price alerts"""
    user = UserSerializer(read_only=True)
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = PriceAlert
        fields = [
            'id', 'user', 'product', 'target_price', 'current_price',
            'is_active', 'email_alert', 'sms_alert', 'push_alert',
            'last_alert_sent', 'alert_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'current_price', 'last_alert_sent', 'alert_count']


class CreatePriceAlertSerializer(serializers.ModelSerializer):
    """Serializer for creating price alerts"""
    class Meta:
        model = PriceAlert
        fields = ['product', 'target_price', 'email_alert', 'sms_alert', 'push_alert']

    def validate(self, attrs):
        """Validate price alert data"""
        product = attrs.get('product')
        target_price = attrs.get('target_price')
        
        if target_price <= 0:
            raise serializers.ValidationError("Target price must be greater than 0")
        
        if target_price >= product.price:
            raise serializers.ValidationError("Target price must be less than current price")
        
        return attrs

    def create(self, validated_data):
        """Create price alert with user and current price"""
        validated_data['user'] = self.context['request'].user
        validated_data['current_price'] = validated_data['product'].price
        return super().create(validated_data)


class StockAlertSerializer(serializers.ModelSerializer):
    """Serializer for stock alerts"""
    user = UserSerializer(read_only=True)
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = StockAlert
        fields = [
            'id', 'user', 'product', 'is_active', 'email_alert',
            'sms_alert', 'push_alert', 'last_alert_sent', 'alert_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'last_alert_sent', 'alert_count']


class CreateStockAlertSerializer(serializers.ModelSerializer):
    """Serializer for creating stock alerts"""
    class Meta:
        model = StockAlert
        fields = ['product', 'email_alert', 'sms_alert', 'push_alert']

    def validate(self, attrs):
        """Validate stock alert data"""
        product = attrs.get('product')
        
        if product.is_in_stock:
            raise serializers.ValidationError("Product is already in stock")
        
        return attrs

    def create(self, validated_data):
        """Create stock alert with user"""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class NotificationSummarySerializer(serializers.Serializer):
    """Serializer for notification summary"""
    total_notifications = serializers.IntegerField()
    unread_count = serializers.IntegerField()
    read_count = serializers.IntegerField()
    archived_count = serializers.IntegerField()
    recent_notifications = NotificationSerializer(many=True)


class NotificationStatsSerializer(serializers.Serializer):
    """Serializer for notification statistics"""
    total_sent = serializers.IntegerField()
    total_delivered = serializers.IntegerField()
    total_failed = serializers.IntegerField()
    delivery_rate = serializers.FloatField()
    by_type = serializers.DictField()
    by_channel = serializers.DictField()
