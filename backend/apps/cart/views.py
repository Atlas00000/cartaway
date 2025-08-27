from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.cache import cache
from django.db import transaction
from .models import Cart, CartItem, Wishlist
from .serializers import (
    CartSerializer, CartItemSerializer, AddToCartSerializer,
    UpdateCartItemSerializer, WishlistSerializer
)


class CartViewSet(viewsets.ModelViewSet):
    """Cart viewset for managing shopping cart"""
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Get user's active cart"""
        return Cart.objects.filter(user=self.request.user, is_active=True)

    def get_object(self):
        """Get or create user's active cart"""
        cart, created = Cart.objects.get_or_create(
            user=self.request.user,
            is_active=True,
            defaults={'user': self.request.user}
        )
        return cart

    def create(self, request, *args, **kwargs):
        """Create cart item (add to cart)"""
        cart = self.get_object()
        serializer = AddToCartSerializer(data=request.data)
        
        if serializer.is_valid():
            product_id = serializer.validated_data['product_id']
            variant_id = serializer.validated_data.get('variant_id')
            quantity = serializer.validated_data['quantity']

            # Check if item already exists in cart
            existing_item = CartItem.objects.filter(
                cart=cart,
                product_id=product_id,
                variant_id=variant_id
            ).first()

            if existing_item:
                # Update quantity if item exists
                existing_item.quantity += quantity
                existing_item.save()
                item = existing_item
            else:
                # Create new cart item
                item = CartItem.objects.create(
                    cart=cart,
                    product_id=product_id,
                    variant_id=variant_id,
                    quantity=quantity
                )

            # Clear cart cache
            cache_key = f"cart_{request.user.id}"
            cache.delete(cache_key)

            return Response({
                'message': 'Item added to cart successfully',
                'item': CartItemSerializer(item).data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        """Add item to cart"""
        cart = self.get_object()
        serializer = AddToCartSerializer(data=request.data)
        
        if serializer.is_valid():
            product_id = serializer.validated_data['product_id']
            variant_id = serializer.validated_data.get('variant_id')
            quantity = serializer.validated_data['quantity']

            # Check if item already exists in cart
            existing_item = CartItem.objects.filter(
                cart=cart,
                product_id=product_id,
                variant_id=variant_id
            ).first()

            if existing_item:
                # Update quantity if item exists
                existing_item.quantity += quantity
                existing_item.save()
                item = existing_item
            else:
                # Create new cart item
                item = CartItem.objects.create(
                    cart=cart,
                    product_id=product_id,
                    variant_id=variant_id,
                    quantity=quantity
                )

            # Clear cart cache
            cache_key = f"cart_{request.user.id}"
            cache.delete(cache_key)

            return Response({
                'message': 'Item added to cart successfully',
                'item': CartItemSerializer(item).data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put'])
    def update_item(self, request, pk=None):
        """Update cart item quantity"""
        cart = self.get_object()
        item_id = request.data.get('item_id')
        quantity = request.data.get('quantity')

        if not item_id or not quantity:
            return Response({
                'error': 'item_id and quantity are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            item = CartItem.objects.get(id=item_id, cart=cart)
        except CartItem.DoesNotExist:
            return Response({
                'error': 'Cart item not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateCartItemSerializer(data={'quantity': quantity})
        if serializer.is_valid():
            item.quantity = serializer.validated_data['quantity']
            item.save()

            # Clear cart cache
            cache_key = f"cart_{request.user.id}"
            cache.delete(cache_key)

            return Response({
                'message': 'Cart item updated successfully',
                'item': CartItemSerializer(item).data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'])
    def remove_item(self, request, pk=None):
        """Remove item from cart"""
        cart = self.get_object()
        item_id = request.data.get('item_id')

        if not item_id:
            return Response({
                'error': 'item_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            item = CartItem.objects.get(id=item_id, cart=cart)
            item.delete()

            # Clear cart cache
            cache_key = f"cart_{request.user.id}"
            cache.delete(cache_key)

            return Response({
                'message': 'Item removed from cart successfully'
            })
        except CartItem.DoesNotExist:
            return Response({
                'error': 'Cart item not found'
            }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def clear(self, request, pk=None):
        """Clear all items from cart"""
        cart = self.get_object()
        cart.items.all().delete()

        # Clear cart cache
        cache_key = f"cart_{request.user.id}"
        cache.delete(cache_key)

        return Response({
            'message': 'Cart cleared successfully'
        })

    @action(detail=True, methods=['get'])
    def summary(self, request, pk=None):
        """Get cart summary"""
        cart = self.get_object()
        
        return Response({
            'total_items': cart.total_items,
            'total_price': cart.total_price,
            'total_discount': cart.total_discount,
            'item_count': cart.items.count()
        })


class WishlistViewSet(viewsets.ModelViewSet):
    """Wishlist viewset for managing user wishlist"""
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Get user's wishlist"""
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Create wishlist item"""
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def add_to_wishlist(self, request):
        """Add product to wishlist"""
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            product_id = serializer.validated_data['product_id']
            
            # Check if already in wishlist
            if Wishlist.objects.filter(user=request.user, product_id=product_id).exists():
                return Response({
                    'message': 'Product already in wishlist'
                }, status=status.HTTP_200_OK)
            
            serializer.save(user=request.user)
            return Response({
                'message': 'Product added to wishlist successfully',
                'item': serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'])
    def remove_from_wishlist(self, request):
        """Remove product from wishlist"""
        product_id = request.data.get('product_id')
        
        if not product_id:
            return Response({
                'error': 'product_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            wishlist_item = Wishlist.objects.get(
                user=request.user,
                product_id=product_id
            )
            wishlist_item.delete()
            
            return Response({
                'message': 'Product removed from wishlist successfully'
            })
        except Wishlist.DoesNotExist:
            return Response({
                'error': 'Product not found in wishlist'
            }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def move_to_cart(self, request):
        """Move wishlist item to cart"""
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)
        
        if not product_id:
            return Response({
                'error': 'product_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Get wishlist item
            wishlist_item = Wishlist.objects.get(
                user=request.user,
                product_id=product_id
            )
            
            # Get or create cart
            cart, created = Cart.objects.get_or_create(
                user=request.user,
                is_active=True,
                defaults={'user': request.user}
            )
            
            # Add to cart
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=wishlist_item.product,
                defaults={'quantity': quantity}
            )
            
            if not created:
                cart_item.quantity += quantity
                cart_item.save()
            
            # Remove from wishlist
            wishlist_item.delete()
            
            return Response({
                'message': 'Product moved to cart successfully',
                'cart_item': CartItemSerializer(cart_item).data
            })
            
        except Wishlist.DoesNotExist:
            return Response({
                'error': 'Product not found in wishlist'
            }, status=status.HTTP_404_NOT_FOUND)
