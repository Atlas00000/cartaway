from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Product, Category
from core.cache_utils import CacheManager


@receiver(post_save, sender=Product)
def invalidate_product_cache_on_save(sender, instance, **kwargs):
    """Invalidate product cache when product is saved"""
    CacheManager.invalidate_product_cache(instance.id)


@receiver(post_delete, sender=Product)
def invalidate_product_cache_on_delete(sender, instance, **kwargs):
    """Invalidate product cache when product is deleted"""
    CacheManager.invalidate_product_cache(instance.id)


@receiver(post_save, sender=Category)
def invalidate_category_cache_on_save(sender, instance, **kwargs):
    """Invalidate category cache when category is saved"""
    CacheManager.invalidate_category_cache(instance.id)


@receiver(post_delete, sender=Category)
def invalidate_category_cache_on_delete(sender, instance, **kwargs):
    """Invalidate category cache when category is deleted"""
    CacheManager.invalidate_category_cache(instance.id)
