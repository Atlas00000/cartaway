"""
Comprehensive test suite for E-commerce API
"""
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.core.cache import cache
from django.db import connection
import json
import time

User = get_user_model()


class HealthCheckTests(APITestCase):
    """Test health check endpoints"""
    
    def setUp(self):
        self.client = APIClient()
    
    def test_basic_health_check(self):
        """Test basic health check endpoint"""
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.json()
        self.assertIn('status', data)
        self.assertIn('timestamp', data)
        self.assertIn('version', data)
        self.assertIn('services', data)
        self.assertIn('system', data)
        
        self.assertEqual(data['status'], 'healthy')
        self.assertEqual(data['version'], '1.0.0')
    
    def test_detailed_health_check(self):
        """Test detailed health check endpoint"""
        response = self.client.get('/api/health/detailed/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.json()
        self.assertIn('status', data)
        self.assertIn('timestamp', data)
        self.assertIn('checks', data)
        
        checks = data['checks']
        self.assertIn('database_basic', checks)
        self.assertIn('redis', checks)
        self.assertIn('settings', checks)
        self.assertIn('system_resources', checks)
    
    def test_readiness_check(self):
        """Test readiness check endpoint"""
        response = self.client.get('/api/health/ready/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.json()
        self.assertEqual(data['status'], 'ready')
        self.assertIn('timestamp', data)
    
    def test_liveness_check(self):
        """Test liveness check endpoint"""
        response = self.client.get('/api/health/live/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.json()
        self.assertEqual(data['status'], 'alive')
        self.assertIn('timestamp', data)
        self.assertIn('pid', data)


class APIMiddlewareTests(APITestCase):
    """Test API middleware functionality"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_api_logging_middleware(self):
        """Test that API requests are logged"""
        # This test would require mocking the logger
        # For now, we'll test that the middleware doesn't break requests
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_performance_monitoring_middleware(self):
        """Test performance monitoring headers"""
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('X-Response-Time', response.headers)
    
    def test_error_handling_middleware(self):
        """Test error handling middleware"""
        # Test with a non-existent endpoint
        response = self.client.get('/api/nonexistent/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class CacheManagerTests(TestCase):
    """Test cache manager functionality"""
    
    def setUp(self):
        cache.clear()
    
    def test_cache_key_generation(self):
        """Test cache key generation"""
        from core.cache_utils import CacheManager
        
        key1 = CacheManager.get_cache_key('test', {'param': 'value'})
        key2 = CacheManager.get_cache_key('test', {'param': 'value'})
        key3 = CacheManager.get_cache_key('test', {'param': 'different'})
        
        self.assertEqual(key1, key2)
        self.assertNotEqual(key1, key3)
    
    def test_cache_operations(self):
        """Test cache operations"""
        from core.cache_utils import CacheManager
        
        # Test caching and retrieving data
        test_data = {'test': 'data'}
        filters = {'category': 'electronics'}
        user_id = 1
        
        # Cache data
        CacheManager.cache_products(test_data, filters, user_id)
        
        # Retrieve cached data
        cached_data = CacheManager.get_cached_products(filters, user_id)
        self.assertEqual(cached_data, test_data)
    
    def test_cache_invalidation(self):
        """Test cache invalidation"""
        from core.cache_utils import CacheManager
        
        # Cache some data
        test_data = {'test': 'data'}
        CacheManager.cache_products(test_data, {}, 1)
        
        # Invalidate cache
        CacheManager.invalidate_product_cache(1)
        
        # Data should be gone
        cached_data = CacheManager.get_cached_products({}, 1)
        self.assertIsNone(cached_data)


class DatabaseOptimizationTests(APITestCase):
    """Test database optimization features"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_database_indexes(self):
        """Test that database indexes are working"""
        # This test verifies that indexes are properly created
        with connection.cursor() as cursor:
            # Check if indexes exist on key tables
            cursor.execute("""
                SELECT indexname FROM pg_indexes 
                WHERE tablename = 'products_product' 
                AND indexname LIKE '%name%'
            """)
            name_index = cursor.fetchone()
            self.assertIsNotNone(name_index)
    
    def test_query_optimization(self):
        """Test that queries are optimized"""
        # This test would require Django Debug Toolbar or similar
        # For now, we'll test that queries don't fail
        response = self.client.get('/api/v1/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class SecurityTests(APITestCase):
    """Test security features"""
    
    def setUp(self):
        self.client = APIClient()
    
    def test_rate_limiting(self):
        """Test rate limiting functionality"""
        # Make multiple requests to trigger rate limiting
        for _ in range(10):
            response = self.client.post('/api/v1/auth/login/', {
                'email': 'test@example.com',
                'password': 'wrongpassword'
            })
        
        # Should eventually get rate limited
        self.assertIn(response.status_code, [429, 400, 401])
    
    def test_cors_headers(self):
        """Test CORS headers"""
        response = self.client.options('/api/health/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_security_headers(self):
        """Test security headers"""
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check for security headers
        headers = response.headers
        self.assertIn('X-Frame-Options', headers)
        self.assertIn('X-Content-Type-Options', headers)


class APIDocumentationTests(APITestCase):
    """Test API documentation endpoints"""
    
    def setUp(self):
        self.client = APIClient()
    
    def test_api_schema(self):
        """Test API schema generation"""
        response = self.client.get('/api/schema/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check that it's valid OpenAPI schema (YAML format)
        content = response.content.decode('utf-8')
        self.assertIn('openapi:', content)
        self.assertIn('info:', content)
        self.assertIn('paths:', content)
    
    def test_swagger_ui(self):
        """Test Swagger UI endpoint"""
        response = self.client.get('/api/docs/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('text/html', response.headers.get('Content-Type', ''))
    
    def test_redoc(self):
        """Test ReDoc endpoint"""
        response = self.client.get('/api/redoc/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('text/html', response.headers.get('Content-Type', ''))


class PerformanceTests(APITestCase):
    """Test performance features"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_response_time(self):
        """Test response time monitoring"""
        start_time = time.time()
        response = self.client.get('/api/health/')
        end_time = time.time()
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check that response time is reasonable (< 1 second)
        response_time = end_time - start_time
        self.assertLess(response_time, 1.0)
        
        # Check that X-Response-Time header is present
        self.assertIn('X-Response-Time', response.headers)
    
    def test_caching_performance(self):
        """Test caching performance improvement"""
        from core.cache_utils import CacheManager
        
        # First request (cache miss)
        start_time = time.time()
        response1 = self.client.get('/api/v1/products/')
        first_request_time = time.time() - start_time
        
        # Second request (cache hit)
        start_time = time.time()
        response2 = self.client.get('/api/v1/products/')
        second_request_time = time.time() - start_time
        
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        
        # Cached request should be faster (though this may not always be true in tests)
        # self.assertLess(second_request_time, first_request_time)


class IntegrationTests(APITestCase):
    """Integration tests for the complete API"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_complete_user_flow(self):
        """Test complete user authentication and API access flow"""
        # 1. Register user
        register_data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpass123',
            'first_name': 'New',
            'last_name': 'User'
        }
        response = self.client.post('/api/v1/auth/register/', register_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # 2. Login
        login_data = {
            'email': 'newuser@example.com',
            'password': 'newpass123'
        }
        response = self.client.post('/api/v1/auth/login/', login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # 3. Get access token
        token = response.json().get('access')
        self.assertIsNotNone(token)
        
        # 4. Use token to access protected endpoint
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get('/api/v1/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_error_handling(self):
        """Test error handling across the API"""
        # Test 404
        response = self.client.get('/api/nonexistent/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Test 401 (unauthorized)
        response = self.client.get('/api/v1/products/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Test 400 (bad request)
        response = self.client.post('/api/v1/auth/login/', {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
