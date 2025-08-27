from django.core.cache import cache
from django.conf import settings
from django.db.models import Model
import hashlib
import json
from typing import Any, Optional, List, Dict


class CacheManager:
    """Cache manager for application-wide caching"""
    
    # Cache timeouts (in seconds)
    CACHE_TIMEOUTS = {
        'products': 1800,  # 30 minutes
        'categories': 3600,  # 1 hour
        'user_cart': 900,  # 15 minutes
        'product_list': 1800,  # 30 minutes
        'category_products': 900,  # 15 minutes
        'featured_products': 3600,  # 1 hour
        'bestseller_products': 3600,  # 1 hour
        'user_profile': 1800,  # 30 minutes
        'order_summary': 300,  # 5 minutes
    }
    
    @classmethod
    def get_cache_key(cls, prefix: str, identifier: Any, user_id: Optional[int] = None) -> str:
        """Generate cache key with prefix and identifier"""
        key_parts = [prefix, str(identifier)]
        if user_id:
            key_parts.append(f"user_{user_id}")
        
        # Create a hash for long keys
        key = "_".join(key_parts)
        if len(key) > 250:  # Redis key length limit
            return f"{prefix}_{hashlib.md5(key.encode()).hexdigest()}"
        return key
    
    @classmethod
    def get_products_cache_key(cls, filters: Dict = None, user_id: Optional[int] = None) -> str:
        """Generate cache key for products list"""
        filter_str = ""
        if filters:
            # Sort filters for consistent cache keys
            sorted_filters = sorted(filters.items())
            filter_str = "_".join([f"{k}_{v}" for k, v in sorted_filters])
        
        return cls.get_cache_key("products_list", filter_str, user_id)
    
    @classmethod
    def get_user_cart_cache_key(cls, user_id: int) -> str:
        """Generate cache key for user cart"""
        return cls.get_cache_key("user_cart", user_id, user_id)
    
    @classmethod
    def get_category_products_cache_key(cls, category_id: int, filters: Dict = None) -> str:
        """Generate cache key for category products"""
        filter_str = ""
        if filters:
            sorted_filters = sorted(filters.items())
            filter_str = "_".join([f"{k}_{v}" for k, v in sorted_filters])
        
        return cls.get_cache_key("category_products", f"{category_id}_{filter_str}")
    
    @classmethod
    def cache_products(cls, products_data: List[Dict], filters: Dict = None, user_id: Optional[int] = None) -> None:
        """Cache products list"""
        cache_key = cls.get_products_cache_key(filters, user_id)
        timeout = cls.CACHE_TIMEOUTS['products']
        cache.set(cache_key, products_data, timeout)
    
    @classmethod
    def get_cached_products(cls, filters: Dict = None, user_id: Optional[int] = None) -> Optional[List[Dict]]:
        """Get cached products list"""
        cache_key = cls.get_products_cache_key(filters, user_id)
        return cache.get(cache_key)
    
    @classmethod
    def cache_user_cart(cls, user_id: int, cart_data: Dict) -> None:
        """Cache user cart data"""
        cache_key = cls.get_user_cart_cache_key(user_id)
        timeout = cls.CACHE_TIMEOUTS['user_cart']
        cache.set(cache_key, cart_data, timeout)
    
    @classmethod
    def get_cached_user_cart(cls, user_id: int) -> Optional[Dict]:
        """Get cached user cart data"""
        cache_key = cls.get_user_cart_cache_key(user_id)
        return cache.get(cache_key)
    
    @classmethod
    def cache_category_products(cls, category_id: int, products_data: List[Dict], filters: Dict = None) -> None:
        """Cache category products"""
        cache_key = cls.get_category_products_cache_key(category_id, filters)
        timeout = cls.CACHE_TIMEOUTS['category_products']
        cache.set(cache_key, products_data, timeout)
    
    @classmethod
    def get_cached_category_products(cls, category_id: int, filters: Dict = None) -> Optional[List[Dict]]:
        """Get cached category products"""
        cache_key = cls.get_category_products_cache_key(category_id, filters)
        return cache.get(cache_key)
    
    @classmethod
    def invalidate_product_cache(cls, product_id: Optional[int] = None) -> None:
        """Invalidate product-related cache"""
        if product_id:
            # Invalidate specific product cache
            cache.delete(f"product_detail_{product_id}")
        
        # Invalidate all product list caches
        cache.delete_pattern("products_list_*")
        cache.delete_pattern("category_products_*")
        cache.delete_pattern("featured_products_*")
        cache.delete_pattern("bestseller_products_*")
    
    @classmethod
    def invalidate_user_cache(cls, user_id: int) -> None:
        """Invalidate user-related cache"""
        cache.delete(cls.get_user_cart_cache_key(user_id))
        cache.delete_pattern(f"user_profile_{user_id}")
        cache.delete_pattern(f"user_orders_{user_id}")
    
    @classmethod
    def invalidate_category_cache(cls, category_id: Optional[int] = None) -> None:
        """Invalidate category-related cache"""
        if category_id:
            cache.delete_pattern(f"category_products_{category_id}_*")
        else:
            cache.delete_pattern("categories_*")
            cache.delete_pattern("category_products_*")


def cache_response(timeout: int = 300, key_prefix: str = "view"):
    """Decorator for caching view responses"""
    def decorator(view_func):
        def wrapper(request, *args, **kwargs):
            # Generate cache key based on request
            cache_key = f"{key_prefix}_{request.path}_{request.user.id if request.user.is_authenticated else 'anon'}"
            
            # Try to get from cache
            cached_response = cache.get(cache_key)
            if cached_response is not None:
                return cached_response
            
            # Execute view and cache response
            response = view_func(request, *args, **kwargs)
            cache.set(cache_key, response, timeout)
            return response
        
        return wrapper
    return decorator


def cache_method_result(timeout: int = 300, key_prefix: str = "method"):
    """Decorator for caching method results"""
    def decorator(method):
        def wrapper(self, *args, **kwargs):
            # Generate cache key
            cache_key = f"{key_prefix}_{method.__name__}_{hash(str(args) + str(kwargs))}"
            
            # Try to get from cache
            cached_result = cache.get(cache_key)
            if cached_result is not None:
                return cached_result
            
            # Execute method and cache result
            result = method(self, *args, **kwargs)
            cache.set(cache_key, result, timeout)
            return result
        
        return wrapper
    return decorator
