import logging
import time
import json
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from rest_framework import status

logger = logging.getLogger('apps')


class APILoggingMiddleware(MiddlewareMixin):
    """
    Middleware for logging API requests and responses
    """
    
    def process_request(self, request):
        """Log incoming API requests"""
        if request.path.startswith('/api/'):
            request.start_time = time.time()
            
            # Log request details
            log_data = {
                'type': 'request',
                'method': request.method,
                'path': request.path,
                'user': request.user.username if request.user.is_authenticated else 'anonymous',
                'ip': self.get_client_ip(request),
                'user_agent': request.META.get('HTTP_USER_AGENT', ''),
            }
            
            logger.info(f"API Request: {json.dumps(log_data)}")
    
    def process_response(self, request, response):
        """Log API responses"""
        if hasattr(request, 'start_time') and request.path.startswith('/api/'):
            duration = time.time() - request.start_time
            
            # Log response details
            log_data = {
                'type': 'response',
                'method': request.method,
                'path': request.path,
                'status_code': response.status_code,
                'duration': f"{duration:.3f}s",
                'user': request.user.username if request.user.is_authenticated else 'anonymous',
            }
            
            # Log errors with more detail
            if response.status_code >= 400:
                logger.warning(f"API Error: {json.dumps(log_data)}")
            else:
                logger.info(f"API Response: {json.dumps(log_data)}")
        
        return response
    
    def get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class PerformanceMonitoringMiddleware(MiddlewareMixin):
    """
    Middleware for monitoring API performance
    """
    
    def process_request(self, request):
        """Start performance monitoring"""
        if request.path.startswith('/api/'):
            request.performance_start = time.time()
    
    def process_response(self, request, response):
        """Monitor response performance"""
        if hasattr(request, 'performance_start') and request.path.startswith('/api/'):
            duration = time.time() - request.performance_start
            
            # Log slow requests
            if duration > 1.0:  # Log requests taking more than 1 second
                logger.warning(f"Slow API Request: {request.path} took {duration:.3f}s")
            
            # Add performance headers
            response['X-Response-Time'] = f"{duration:.3f}s"
        
        return response


class ErrorHandlingMiddleware(MiddlewareMixin):
    """
    Middleware for handling and logging errors
    """
    
    def process_exception(self, request, exception):
        """Handle and log exceptions"""
        if request.path.startswith('/api/'):
            error_data = {
                'type': 'exception',
                'method': request.method,
                'path': request.path,
                'exception_type': type(exception).__name__,
                'exception_message': str(exception),
                'user': request.user.username if request.user.is_authenticated else 'anonymous',
                'ip': self.get_client_ip(request),
            }
            
            logger.error(f"API Exception: {json.dumps(error_data)}")
            
            # Return JSON error response for API requests
            return JsonResponse({
                'error': 'Internal server error',
                'message': 'An unexpected error occurred',
                'status_code': 500,
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return None
    
    def get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
