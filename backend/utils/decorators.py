"""Utility decorators for routes"""
from functools import wraps
from flask import request, jsonify
from services.user_service import UserService
from firebase_admin import auth

def require_auth(f):
    """Decorator to require authentication and inject user info"""
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
            # Verify token and get user info
            decoded_token = auth.verify_id_token(id_token)
            user_id = decoded_token['uid']
            user_email = decoded_token.get('email', '')
            
            # Store in request context
            request.user_id = user_id
            request.user_email = user_email
            
            # Pass to the route function
            return f(user_id=user_id, user_email=user_email, *args, **kwargs)
        except Exception as e:
            return jsonify({
                "success": False,
                "message": "Invalid token"
            }), 401
    
    return decorated_function

