from rest_framework.throttling import UserRateThrottle, AnonRateThrottle, ScopedRateThrottle


class AuthRateThrottle(UserRateThrottle):
    """
    Throttle for authentication endpoints
    """
    scope = 'auth'
    rate = '5/minute'  # 5 attempts per minute


class RegisterRateThrottle(AnonRateThrottle):
    """
    Throttle for registration endpoint
    """
    scope = 'register'
    rate = '3/hour'  # 3 attempts per hour


class ProductListRateThrottle(UserRateThrottle):
    """
    Throttle for product listing
    """
    scope = 'products'
    rate = '1000/hour'  # 1000 requests per hour


class OrderRateThrottle(UserRateThrottle):
    """
    Throttle for order operations
    """
    scope = 'orders'
    rate = '100/hour'  # 100 requests per hour


class CartRateThrottle(UserRateThrottle):
    """
    Throttle for cart operations
    """
    scope = 'cart'
    rate = '500/hour'  # 500 requests per hour


class AdminRateThrottle(UserRateThrottle):
    """
    Throttle for admin operations
    """
    scope = 'admin'
    rate = '200/hour'  # 200 requests per hour


class BurstRateThrottle(UserRateThrottle):
    """
    Burst throttle for high-frequency operations
    """
    scope = 'burst'
    rate = '60/minute'  # 60 requests per minute


class SustainedRateThrottle(UserRateThrottle):
    """
    Sustained throttle for long-term usage
    """
    scope = 'sustained'
    rate = '1000/day'  # 1000 requests per day
