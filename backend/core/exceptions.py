from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError
from django.http import Http404
from rest_framework.exceptions import APIException
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """
    Custom exception handler for consistent error responses
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)
    
    if response is not None:
        # Customize the error response format
        error_data = {
            'status': 'error',
            'status_code': response.status_code,
            'message': str(exc),
            'error_type': exc.__class__.__name__,
        }
        
        # Add validation errors if available
        if hasattr(exc, 'detail'):
            if isinstance(exc.detail, dict):
                error_data['errors'] = exc.detail
            else:
                error_data['message'] = str(exc.detail)
        
        # Add field-specific errors for validation
        if hasattr(exc, 'get_full_details'):
            error_data['field_errors'] = exc.get_full_details()
        
        response.data = error_data
        
        # Log the error
        logger.error(f"API Error: {exc} in {context['view'].__class__.__name__}")
    
    else:
        # Handle unexpected exceptions
        if isinstance(exc, ValidationError):
            error_data = {
                'status': 'error',
                'status_code': status.HTTP_400_BAD_REQUEST,
                'message': 'Validation error',
                'error_type': 'ValidationError',
                'errors': exc.message_dict if hasattr(exc, 'message_dict') else str(exc),
            }
            response = Response(error_data, status=status.HTTP_400_BAD_REQUEST)
        
        elif isinstance(exc, Http404):
            error_data = {
                'status': 'error',
                'status_code': status.HTTP_404_NOT_FOUND,
                'message': 'Resource not found',
                'error_type': 'NotFound',
            }
            response = Response(error_data, status=status.HTTP_404_NOT_FOUND)
        
        else:
            # Generic error for unexpected exceptions
            error_data = {
                'status': 'error',
                'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR,
                'message': 'Internal server error',
                'error_type': 'InternalError',
            }
            response = Response(error_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Log unexpected errors
            logger.error(f"Unexpected error: {exc}", exc_info=True)
    
    return response


class ValidationAPIException(APIException):
    """
    Custom exception for validation errors
    """
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Validation error occurred.'
    default_code = 'validation_error'


class RateLimitExceeded(APIException):
    """
    Custom exception for rate limiting
    """
    status_code = status.HTTP_429_TOO_MANY_REQUESTS
    default_detail = 'Rate limit exceeded. Please try again later.'
    default_code = 'rate_limit_exceeded'


class ResourceNotFound(APIException):
    """
    Custom exception for resource not found
    """
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = 'The requested resource was not found.'
    default_code = 'not_found'
