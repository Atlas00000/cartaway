from django.db import models
from django.contrib.auth import get_user_model
from apps.products.models import Product, ProductVariant

User = get_user_model()


class Cart(models.Model):
    """Shopping cart model"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='carts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Cart for {self.user.email}"

    @property
    def total_items(self):
        """Get total number of items in cart"""
        return sum(item.quantity for item in self.items.all())

    @property
    def total_price(self):
        """Calculate total price of cart"""
        return sum(item.total_price for item in self.items.all())

    @property
    def total_discount(self):
        """Calculate total discount"""
        return sum(item.total_discount for item in self.items.all())


class CartItem(models.Model):
    """Individual item in shopping cart"""
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, blank=True, null=True)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['cart', 'product', 'variant']
        ordering = ['-added_at']

    def __str__(self):
        variant_text = f" - {self.variant.name}: {self.variant.value}" if self.variant else ""
        return f"{self.product.name}{variant_text} (Qty: {self.quantity})"

    @property
    def unit_price(self):
        """Get unit price including variant adjustment"""
        base_price = self.product.price
        if self.variant and self.variant.price_adjustment:
            base_price += self.variant.price_adjustment
        return base_price

    @property
    def total_price(self):
        """Calculate total price for this item"""
        return self.unit_price * self.quantity

    @property
    def total_discount(self):
        """Calculate total discount for this item"""
        if self.product.compare_price and self.product.compare_price > self.unit_price:
            return (self.product.compare_price - self.unit_price) * self.quantity
        return 0

    @property
    def is_available(self):
        """Check if item is available in stock"""
        if self.variant:
            return self.variant.stock_quantity >= self.quantity
        return self.product.stock_quantity >= self.quantity


class Wishlist(models.Model):
    """User wishlist model"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlists')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'product']
        ordering = ['-added_at']

    def __str__(self):
        return f"{self.user.email} - {self.product.name}"
