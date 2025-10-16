"""Centralized error response system for backend API"""

from flask import jsonify
from utils.logging_config import logger

# Error codes and messages
ERROR_CODES = {
    # Authentication Errors
    'AUTH_001': {
        'message': 'Invalid authentication token',
        'user_message': 'Your session has expired. Please sign in again.',
        'status_code': 401
    },
    'AUTH_002': {
        'message': 'User not authenticated',
        'user_message': 'Please sign in to continue.',
        'status_code': 401
    },
    'AUTH_003': {
        'message': 'Invalid email or password',
        'user_message': 'Incorrect email or password. Please try again.',
        'status_code': 401
    },
    'AUTH_004': {
        'message': 'Email not verified',
        'user_message': 'Please verify your email address before continuing.',
        'status_code': 403
    },
    'AUTH_005': {
        'message': 'Admin access required',
        'user_message': 'You need admin privileges to access this feature.',
        'status_code': 403
    },

    # Validation Errors
    'VAL_001': {
        'message': 'Required field missing',
        'user_message': 'Please fill in all required fields.',
        'status_code': 400
    },
    'VAL_002': {
        'message': 'Invalid email format',
        'user_message': 'Please enter a valid email address.',
        'status_code': 400
    },
    'VAL_003': {
        'message': 'Invalid URL format',
        'user_message': 'Please enter a valid URL (e.g., https://example.com).',
        'status_code': 400
    },
    'VAL_004': {
        'message': 'Invalid date format',
        'user_message': 'Please enter a valid date.',
        'status_code': 400
    },
    'VAL_005': {
        'message': 'Text too long',
        'user_message': 'The text is too long. Please shorten it.',
        'status_code': 400
    },
    'VAL_006': {
        'message': 'Invalid opportunity type',
        'user_message': 'Please select a valid opportunity type.',
        'status_code': 400
    },

    # Server Errors
    'SRV_001': {
        'message': 'Internal server error',
        'user_message': 'Something went wrong on our end. Please try again later.',
        'status_code': 500
    },
    'SRV_002': {
        'message': 'Database connection failed',
        'user_message': 'Unable to save data. Please try again.',
        'status_code': 500
    },
    'SRV_003': {
        'message': 'External service unavailable',
        'user_message': 'A required service is temporarily unavailable. Please try again later.',
        'status_code': 503
    },

    # Permission Errors
    'PERM_001': {
        'message': 'Insufficient permissions',
        'user_message': 'You don\'t have permission to perform this action.',
        'status_code': 403
    },
    'PERM_002': {
        'message': 'Resource access denied',
        'user_message': 'You cannot access this resource.',
        'status_code': 403
    },

    # Not Found Errors
    'NF_001': {
        'message': 'Opportunity not found',
        'user_message': 'The opportunity you\'re looking for doesn\'t exist or has been removed.',
        'status_code': 404
    },
    'NF_002': {
        'message': 'User not found',
        'user_message': 'User account not found.',
        'status_code': 404
    },

    # Opportunity Specific Errors
    'OPP_001': {
        'message': 'Opportunity creation failed',
        'user_message': 'Unable to create opportunity. Please try again.',
        'status_code': 500
    },
    'OPP_002': {
        'message': 'Opportunity update failed',
        'user_message': 'Unable to update opportunity. Please try again.',
        'status_code': 500
    },
    'OPP_003': {
        'message': 'Opportunity deletion failed',
        'user_message': 'Unable to delete opportunity. Please try again.',
        'status_code': 500
    },
    'OPP_004': {
        'message': 'Opportunity already published',
        'user_message': 'This opportunity is already published.',
        'status_code': 400
    },
    'OPP_005': {
        'message': 'Opportunity already unpublished',
        'user_message': 'This opportunity is already unpublished.',
        'status_code': 400
    },
    'OPP_006': {
        'message': 'No draft to publish',
        'user_message': 'No draft found to publish. Please save your changes first.',
        'status_code': 400
    }
}

def create_error_response(error_code: str, context: str = None, additional_data: dict = None):
    """Create a standardized error response"""
    if error_code not in ERROR_CODES:
        error_code = 'SRV_001'  # Default to internal server error
    
    error_info = ERROR_CODES[error_code]
    
    response_data = {
        'success': False,
        'code': error_code,
        'message': error_info['message'],
        'user_message': error_info['user_message'],
        'type': 'error'
    }
    
    if context:
        response_data['context'] = context
    
    if additional_data:
        response_data.update(additional_data)
    
    # Log the error
    logger.error(f"Error {error_code}: {error_info['message']} - Context: {context}")
    
    return jsonify(response_data), error_info['status_code']

def create_success_response(message: str, data: dict = None, status_code: int = 200):
    """Create a standardized success response"""
    response_data = {
        'success': True,
        'message': message
    }
    
    if data:
        response_data.update(data)
    
    return jsonify(response_data), status_code

def handle_exception(exception: Exception, context: str = None):
    """Handle exceptions and return appropriate error response"""
    error_message = str(exception)
    
    # Map common exceptions to error codes
    if 'not found' in error_message.lower():
        return create_error_response('NF_001', context)
    elif 'permission' in error_message.lower() or 'unauthorized' in error_message.lower():
        return create_error_response('PERM_001', context)
    elif 'validation' in error_message.lower() or 'invalid' in error_message.lower():
        return create_error_response('VAL_001', context)
    elif 'database' in error_message.lower() or 'connection' in error_message.lower():
        return create_error_response('SRV_002', context)
    else:
        return create_error_response('SRV_001', context, {'original_error': error_message})
