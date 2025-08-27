from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import (
    Notification, NotificationTemplate, NotificationPreference,
    NotificationLog, PriceAlert, StockAlert
)
from .serializers import (
    NotificationSerializer, CreateNotificationSerializer,
    NotificationTemplateSerializer, NotificationPreferenceSerializer,
    UpdateNotificationPreferenceSerializer, NotificationLogSerializer,
    PriceAlertSerializer, CreatePriceAlertSerializer,
    StockAlertSerializer, CreateStockAlertSerializer,
    NotificationSummarySerializer, NotificationStatsSerializer
)
from .services import NotificationService


class NotificationViewSet(viewsets.ModelViewSet):
    """Notification viewset"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Get user's notifications"""
        return Notification.objects.filter(
            user=self.request.user,
            is_archived=False
        ).order_by('-created_at')

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'create':
            return CreateNotificationSerializer
        return NotificationSerializer

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark notification as read"""
        notification = self.get_object()
        notification.mark_as_read()
        
        return Response({
            'message': 'Notification marked as read',
            'notification': NotificationSerializer(notification).data
        })

    @action(detail=True, methods=['post'])
    def mark_as_unread(self, request, pk=None):
        """Mark notification as unread"""
        notification = self.get_object()
        notification.mark_as_unread()
        
        return Response({
            'message': 'Notification marked as unread',
            'notification': NotificationSerializer(notification).data
        })

    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        """Archive notification"""
        notification = self.get_object()
        notification.archive()
        
        return Response({
            'message': 'Notification archived',
            'notification': NotificationSerializer(notification).data
        })

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Mark all notifications as read"""
        service = NotificationService()
        service.mark_all_as_read(request.user)
        
        return Response({
            'message': 'All notifications marked as read'
        })

    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Get unread notifications"""
        unread_notifications = self.get_queryset().filter(is_read=False)
        
        page = self.paginate_queryset(unread_notifications)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(unread_notifications, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get notification summary"""
        service = NotificationService()
        summary = service.get_notification_summary(request.user)
        
        serializer = NotificationSummarySerializer(summary)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search notifications"""
        query = request.query_params.get('q', '')
        notification_type = request.query_params.get('type', '')
        priority = request.query_params.get('priority', '')
        is_read = request.query_params.get('is_read', '')
        
        queryset = self.get_queryset()
        
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(message__icontains=query)
            )
        
        if notification_type:
            queryset = queryset.filter(notification_type=notification_type)
        
        if priority:
            queryset = queryset.filter(priority=priority)
        
        if is_read != '':
            is_read_bool = is_read.lower() == 'true'
            queryset = queryset.filter(is_read=is_read_bool)
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class NotificationTemplateViewSet(viewsets.ReadOnlyModelViewSet):
    """Notification template viewset (admin only)"""
    serializer_class = NotificationTemplateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Get active notification templates"""
        return NotificationTemplate.objects.filter(is_active=True)

    @action(detail=True, methods=['post'])
    def test(self, request, pk=None):
        """Test notification template"""
        template = self.get_object()
        context = request.data.get('context', {})
        
        rendered_message = template.render_message(context)
        rendered_email = template.render_email(context)
        
        return Response({
            'message': rendered_message,
            'email': rendered_email
        })


class NotificationPreferenceViewSet(viewsets.ModelViewSet):
    """Notification preference viewset"""
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Get user's notification preferences"""
        return NotificationPreference.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action in ['update', 'partial_update']:
            return UpdateNotificationPreferenceSerializer
        return NotificationPreferenceSerializer

    def get_object(self):
        """Get or create user's notification preferences"""
        preferences, created = NotificationPreference.objects.get_or_create(
            user=self.request.user,
            defaults={
                'email_notifications': True,
                'push_notifications': True,
                'sms_notifications': False
            }
        )
        return preferences


class NotificationLogViewSet(viewsets.ReadOnlyModelViewSet):
    """Notification log viewset (admin only)"""
    serializer_class = NotificationLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Get notification logs"""
        return NotificationLog.objects.all()

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get notification statistics"""
        service = NotificationService()
        stats = service.get_notification_stats()
        
        serializer = NotificationStatsSerializer(stats)
        return Response(serializer.data)


class PriceAlertViewSet(viewsets.ModelViewSet):
    """Price alert viewset"""
    serializer_class = PriceAlertSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Get user's price alerts"""
        return PriceAlert.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'create':
            return CreatePriceAlertSerializer
        return PriceAlertSerializer

    @action(detail=True, methods=['post'])
    def toggle(self, request, pk=None):
        """Toggle price alert active status"""
        alert = self.get_object()
        alert.is_active = not alert.is_active
        alert.save()
        
        return Response({
            'message': f'Price alert {"activated" if alert.is_active else "deactivated"}',
            'alert': PriceAlertSerializer(alert).data
        })


class StockAlertViewSet(viewsets.ModelViewSet):
    """Stock alert viewset"""
    serializer_class = StockAlertSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Get user's stock alerts"""
        return StockAlert.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'create':
            return CreateStockAlertSerializer
        return StockAlertSerializer

    @action(detail=True, methods=['post'])
    def toggle(self, request, pk=None):
        """Toggle stock alert active status"""
        alert = self.get_object()
        alert.is_active = not alert.is_active
        alert.save()
        
        return Response({
            'message': f'Stock alert {"activated" if alert.is_active else "deactivated"}',
            'alert': StockAlertSerializer(alert).data
        })


class NotificationDashboardView(generics.GenericAPIView):
    """Notification dashboard view"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get notification dashboard data"""
        service = NotificationService()
        
        # Get notification summary
        summary = service.get_notification_summary(request.user)
        
        # Get recent notifications
        recent_notifications = Notification.objects.filter(
            user=request.user,
            is_archived=False
        ).order_by('-created_at')[:5]
        
        # Get notification preferences
        preferences, created = NotificationPreference.objects.get_or_create(
            user=request.user,
            defaults={
                'email_notifications': True,
                'push_notifications': True,
                'sms_notifications': False
            }
        )
        
        # Get active alerts
        price_alerts = PriceAlert.objects.filter(user=request.user, is_active=True)[:5]
        stock_alerts = StockAlert.objects.filter(user=request.user, is_active=True)[:5]
        
        dashboard_data = {
            'summary': summary,
            'recent_notifications': NotificationSerializer(recent_notifications, many=True).data,
            'preferences': NotificationPreferenceSerializer(preferences).data,
            'price_alerts': PriceAlertSerializer(price_alerts, many=True).data,
            'stock_alerts': StockAlertSerializer(stock_alerts, many=True).data
        }
        
        return Response(dashboard_data)
