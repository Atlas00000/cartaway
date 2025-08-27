from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.core.mail import send_mail
from django.conf import settings
from .models import Order, OrderItem, OrderStatusHistory, ShippingMethod, TaxRate
from .serializers import (
    OrderSerializer, CreateOrderSerializer, UpdateOrderStatusSerializer,
    ShippingMethodSerializer, TaxRateSerializer, CheckoutSerializer
)
from apps.cart.models import Cart
from django.utils import timezone


class OrderViewSet(viewsets.ModelViewSet):
    """Order viewset for managing customer orders"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Get optimized user's orders"""
        return Order.objects.filter(user=self.request.user).select_related(
            'user'
        ).prefetch_related(
            'items',
            'items__product',
            'items__variant',
            'status_history',
            'status_history__created_by'
        )

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'create':
            return CreateOrderSerializer
        return OrderSerializer

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent orders"""
        orders = self.get_queryset().order_by('-created_at')[:5]
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel an order"""
        order = self.get_object()
        
        if not order.can_be_cancelled:
            return Response({
                'error': 'Order cannot be cancelled'
            }, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            order.status = 'cancelled'
            order.save()

            # Create status history
            OrderStatusHistory.objects.create(
                order=order,
                status='cancelled',
                notes=request.data.get('notes', 'Order cancelled by customer'),
                created_by=request.user
            )

            # Send cancellation email
            self.send_order_status_email(order, 'cancelled')

        return Response({
            'message': 'Order cancelled successfully'
        })

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update order status (admin only)"""
        order = self.get_object()
        serializer = UpdateOrderStatusSerializer(
            data=request.data,
            context={'order': order}
        )
        
        if serializer.is_valid():
            with transaction.atomic():
                old_status = order.status
                order.status = serializer.validated_data['status']
                order.save()

                # Create status history
                OrderStatusHistory.objects.create(
                    order=order,
                    status=order.status,
                    notes=serializer.validated_data.get('notes', f'Status changed from {old_status} to {order.status}'),
                    created_by=request.user
                )

                # Send status update email
                self.send_order_status_email(order, order.status)

            return Response({
                'message': 'Order status updated successfully',
                'order': OrderSerializer(order).data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def tracking(self, request, pk=None):
        """Get order tracking information"""
        order = self.get_object()
        
        return Response({
            'order_number': order.order_number,
            'status': order.status,
            'shipping_method': order.shipping_method,
            'tracking_number': order.tracking_number,
            'estimated_delivery': order.estimated_delivery,
            'status_history': [
                {
                    'status': history.status,
                    'status_display': history.get_status_display(),
                    'notes': history.notes,
                    'created_at': history.created_at
                }
                for history in order.status_history.all()
            ]
        })

    def send_order_status_email(self, order, status):
        """Send order status update email"""
        try:
            subject = f'Order {order.order_number} - Status Update'
            
            if status == 'cancelled':
                message = f"""
                Dear {order.customer_first_name},

                Your order {order.order_number} has been cancelled.

                If you have any questions, please contact our support team.

                Best regards,
                Your E-commerce Team
                """
            else:
                message = f"""
                Dear {order.customer_first_name},

                Your order {order.order_number} status has been updated to: {status}

                You can track your order at: {settings.SITE_URL}/orders/{order.id}/tracking

                Best regards,
                Your E-commerce Team
                """

            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [order.customer_email],
                fail_silently=True
            )
        except Exception as e:
            # Log the error but don't fail the request
            print(f"Failed to send email: {e}")


class ShippingMethodViewSet(viewsets.ReadOnlyModelViewSet):
    """Shipping method viewset"""
    serializer_class = ShippingMethodSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Get active shipping methods"""
        return ShippingMethod.objects.filter(is_active=True)

    @action(detail=False, methods=['post'])
    def calculate_shipping(self, request):
        """Calculate shipping cost for cart"""
        cart_id = request.data.get('cart_id')
        
        try:
            cart = Cart.objects.get(id=cart_id, user=request.user, is_active=True)
        except Cart.DoesNotExist:
            return Response({
                'error': 'Cart not found'
            }, status=status.HTTP_404_NOT_FOUND)

        shipping_methods = self.get_queryset()
        
        # Calculate shipping costs (simplified)
        shipping_options = []
        for method in shipping_methods:
            # In a real implementation, you'd calculate based on weight, distance, etc.
            shipping_options.append({
                'id': method.id,
                'name': method.name,
                'description': method.description,
                'cost': method.base_price,
                'estimated_days': method.estimated_days
            })

        return Response({
            'cart_total': cart.total_price,
            'shipping_options': shipping_options
        })


class TaxRateViewSet(viewsets.ReadOnlyModelViewSet):
    """Tax rate viewset"""
    serializer_class = TaxRateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Get active tax rates"""
        return TaxRate.objects.filter(is_active=True)

    @action(detail=False, methods=['post'])
    def calculate_tax(self, request):
        """Calculate tax for address"""
        address_data = request.data.get('address', {})
        subtotal = request.data.get('subtotal', 0)
        
        try:
            # Find applicable tax rate
            tax_rate = TaxRate.objects.filter(
                country=address_data.get('country', 'United States'),
                state=address_data.get('state'),
                city=address_data.get('city'),
                is_active=True
            ).first()
            
            if tax_rate:
                tax_amount = subtotal * tax_rate.rate
                tax_rate_percentage = tax_rate.rate * 100
            else:
                # Default tax rate
                tax_amount = subtotal * 0.0825  # 8.25%
                tax_rate_percentage = 8.25

            return Response({
                'tax_amount': tax_amount,
                'tax_rate_percentage': tax_rate_percentage,
                'subtotal': subtotal,
                'total': subtotal + tax_amount
            })
        except Exception as e:
            return Response({
                'error': 'Failed to calculate tax'
            }, status=status.HTTP_400_BAD_REQUEST)


class CheckoutView(generics.CreateAPIView):
    """Checkout view for creating orders"""
    serializer_class = CheckoutSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """Create order from checkout data"""
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    # Create order using the validated data
                    order_serializer = CreateOrderSerializer(
                        data=serializer.validated_data,
                        context={'request': request}
                    )
                    
                    if order_serializer.is_valid():
                        order = order_serializer.save()
                        
                        # In a real implementation, you'd process payment here
                        # For now, we'll just mark it as paid
                        order.payment_status = 'paid'
                        order.payment_method = serializer.validated_data.get('payment_method', 'demo')
                        order.payment_date = timezone.now()
                        order.save()

                        # Send order confirmation email
                        self.send_order_confirmation_email(order)

                        return Response({
                            'message': 'Order created successfully',
                            'order': OrderSerializer(order).data
                        }, status=status.HTTP_201_CREATED)
                    else:
                        return Response(order_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                        
            except Exception as e:
                return Response({
                    'error': 'Failed to create order'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def send_order_confirmation_email(self, order):
        """Send order confirmation email"""
        try:
            subject = f'Order Confirmation - {order.order_number}'
            
            message = f"""
            Dear {order.customer_first_name},

            Thank you for your order! Your order has been confirmed and is being processed.

            Order Details:
            Order Number: {order.order_number}
            Total Amount: ${order.total_amount}
            Shipping Address: {order.shipping_address_line1}, {order.shipping_city}, {order.shipping_state}

            You can track your order at: {settings.SITE_URL}/orders/{order.id}/tracking

            Best regards,
            Your E-commerce Team
            """

            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [order.customer_email],
                fail_silently=True
            )
        except Exception as e:
            print(f"Failed to send confirmation email: {e}")


class OrderHistoryView(generics.ListAPIView):
    """View for user's order history"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Get user's order history"""
        return Order.objects.filter(user=self.request.user).order_by('-created_at')
