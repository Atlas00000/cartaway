from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from apps.users.views import register, login, UserProfileView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from core.health_checks import health_check, detailed_health_check, readiness_check, liveness_check

# API v1 endpoints
urlpatterns_v1 = [
    # Authentication endpoints
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', UserProfileView.as_view(), name='profile'),
    
    # API endpoints
    path('', include('apps.products.urls')),
    path('', include('apps.cart.urls')),
    path('', include('apps.orders.urls')),
    path('', include('apps.shipping.urls')),
    path('', include('apps.reviews.urls')),
    path('', include('apps.notifications.urls')),
    path('admin/', include('apps.admin_panel.urls')),
    # path('payments/', include('apps.payments.urls')),
    # path('analytics/', include('apps.analytics.urls')),
]

# Main URL patterns with versioning
urlpatterns = [
    path('v1/', include(urlpatterns_v1)),
    # Default to v1 for backward compatibility
    path('', include(urlpatterns_v1)),
    # Health Checks
    path('health/', health_check, name='health'),
    path('health/detailed/', detailed_health_check, name='health-detailed'),
    path('health/ready/', readiness_check, name='health-ready'),
    path('health/live/', liveness_check, name='health-live'),
    # API Documentation
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
