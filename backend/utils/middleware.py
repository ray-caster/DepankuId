"""Middleware for request/response logging"""
from flask import request
import time
from utils.logging_config import logger

def log_request_middleware(app):
    """Middleware to log all requests and responses"""
    
    @app.before_request
    def log_request():
        request.start_time = time.time()
        logger.info(f"[REQUEST] {request.method} {request.path}")
        
        if request.method in ['POST', 'PUT', 'PATCH']:
            if request.is_json:
                # Log request body (mask sensitive data)
                body = request.get_json()
                safe_body = mask_sensitive_data(body)
                logger.debug(f"[REQUEST BODY] {safe_body}")
    
    @app.after_request
    def log_response(response):
        duration = time.time() - request.start_time if hasattr(request, 'start_time') else 0
        logger.info(f"[RESPONSE] {request.method} {request.path} - Status: {response.status_code} - Duration: {duration:.3f}s")
        
        # Log response for errors
        if response.status_code >= 400:
            logger.error(f"[ERROR RESPONSE] {response.get_data(as_text=True)[:500]}")
        
        return response

def mask_sensitive_data(data):
    """Mask sensitive data in logs"""
    if not isinstance(data, dict):
        return data
    
    sensitive_keys = ['password', 'token', 'secret', 'api_key', 'private_key']
    masked = data.copy()
    
    for key in masked:
        if any(sensitive in key.lower() for sensitive in sensitive_keys):
            masked[key] = '***MASKED***'
    
    return masked

