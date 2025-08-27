from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from django.core.cache import cache
from django.utils import timezone
from django.conf import settings
import psutil
import os
import redis
from datetime import datetime


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Basic health check endpoint
    """
    try:
        # Database check
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            db_status = "healthy"
    except Exception as e:
        db_status = f"error: {str(e)}"

    try:
        # Redis check
        cache.set('health_check', 'ok', timeout=10)
        cache_result = cache.get('health_check')
        redis_status = "healthy" if cache_result == 'ok' else "error"
    except Exception as e:
        redis_status = f"error: {str(e)}"

    # System info
    try:
        memory_info = psutil.virtual_memory()
        disk_info = psutil.disk_usage('/')
        system_info = {
            'memory_usage_percent': memory_info.percent,
            'disk_usage_percent': disk_info.percent,
            'cpu_count': psutil.cpu_count(),
        }
    except Exception:
        system_info = {'error': 'Unable to get system info'}

    health_data = {
        'status': 'healthy' if db_status == 'healthy' and redis_status == 'healthy' else 'unhealthy',
        'timestamp': timezone.now().isoformat(),
        'version': '1.0.0',
        'services': {
            'database': db_status,
            'cache': redis_status,
        },
        'system': system_info,
    }

    http_status = status.HTTP_200_OK if health_data['status'] == 'healthy' else status.HTTP_503_SERVICE_UNAVAILABLE
    
    return Response(health_data, status=http_status)


@api_view(['GET'])
@permission_classes([AllowAny])
def detailed_health_check(request):
    """
    Detailed health check with more comprehensive checks
    """
    checks = {}
    
    # Database checks
    try:
        with connection.cursor() as cursor:
            # Test basic query
            cursor.execute("SELECT 1")
            checks['database_basic'] = {'status': 'healthy', 'response_time': 'fast'}
            
            # Test complex query
            cursor.execute("SELECT COUNT(*) FROM django_migrations")
            checks['database_complex'] = {'status': 'healthy', 'response_time': 'fast'}
            
    except Exception as e:
        checks['database'] = {'status': 'error', 'error': str(e)}

    # Redis checks
    try:
        # Test basic operations
        start_time = timezone.now()
        cache.set('health_test', 'test_value', timeout=60)
        cache.get('health_test')
        cache.delete('health_test')
        response_time = (timezone.now() - start_time).total_seconds()
        
        checks['redis'] = {
            'status': 'healthy',
            'response_time': f"{response_time:.3f}s"
        }
    except Exception as e:
        checks['redis'] = {'status': 'error', 'error': str(e)}

    # Application checks
    try:
        # Check if settings are properly configured
        checks['settings'] = {
            'status': 'healthy',
            'debug': settings.DEBUG,
            'allowed_hosts_configured': bool(settings.ALLOWED_HOSTS),
            'database_configured': bool(settings.DATABASES),
        }
    except Exception as e:
        checks['settings'] = {'status': 'error', 'error': str(e)}

    # System resource checks
    try:
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        checks['system_resources'] = {
            'status': 'healthy',
            'memory': {
                'total_gb': round(memory.total / (1024**3), 2),
                'available_gb': round(memory.available / (1024**3), 2),
                'usage_percent': memory.percent,
            },
            'disk': {
                'total_gb': round(disk.total / (1024**3), 2),
                'free_gb': round(disk.free / (1024**3), 2),
                'usage_percent': disk.percent,
            },
            'cpu_count': psutil.cpu_count(),
        }
        
        # Check if resources are critically low
        if memory.percent > 90 or disk.percent > 90:
            checks['system_resources']['status'] = 'warning'
            
    except Exception as e:
        checks['system_resources'] = {'status': 'error', 'error': str(e)}

    # Overall status
    all_healthy = all(
        check.get('status') == 'healthy' 
        for check in checks.values() 
        if isinstance(check, dict)
    )
    
    overall_status = 'healthy' if all_healthy else 'unhealthy'

    response_data = {
        'status': overall_status,
        'timestamp': timezone.now().isoformat(),
        'checks': checks,
    }

    http_status = status.HTTP_200_OK if overall_status == 'healthy' else status.HTTP_503_SERVICE_UNAVAILABLE
    
    return Response(response_data, status=http_status)


@api_view(['GET'])
@permission_classes([AllowAny])
def readiness_check(request):
    """
    Readiness check for Kubernetes/container orchestration
    """
    try:
        # Essential services check
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        
        cache.set('readiness_test', 'ok', timeout=5)
        cache.get('readiness_test')
        
        return Response({
            'status': 'ready',
            'timestamp': timezone.now().isoformat(),
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'status': 'not_ready',
            'error': str(e),
            'timestamp': timezone.now().isoformat(),
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)


@api_view(['GET'])
@permission_classes([AllowAny])
def liveness_check(request):
    """
    Liveness check for Kubernetes/container orchestration
    """
    return Response({
        'status': 'alive',
        'timestamp': timezone.now().isoformat(),
        'pid': os.getpid(),
    }, status=status.HTTP_200_OK)
