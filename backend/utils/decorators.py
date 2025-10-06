"""Utility decorators for routes"""
from functools import wraps
from flask import request, jsonify
from services.user_service import UserService

def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({
                "success": False,
                "message": "Unauthorized"
            }), 401
        
        id_token = auth_header.split('Bearer ')[1]
        try:
            user_id = UserService.verify_token(id_token)
            request.user_id = user_id
        except Exception as e:
            return jsonify({
                "success": False,
                "message": "Invalid token"
            }), 401
        
        return f(*args, **kwargs)
    
    return decorated_function

