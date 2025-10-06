"""Error handling utilities"""
from flask import jsonify
from functools import wraps
import traceback
from utils.logging_config import logger

def handle_errors(f):
    """Decorator for consistent error handling"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except ValueError as e:
            logger.error(f"Validation error in {f.__name__}: {str(e)}")
            return jsonify({
                "success": False,
                "error": str(e),
                "type": "validation_error"
            }), 400
        except PermissionError as e:
            logger.error(f"Permission error in {f.__name__}: {str(e)}")
            return jsonify({
                "success": False,
                "error": "Unauthorized",
                "type": "permission_error"
            }), 403
        except Exception as e:
            logger.error(f"Unexpected error in {f.__name__}: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return jsonify({
                "success": False,
                "error": "Internal server error",
                "message": str(e) if logger.level == 10 else "An unexpected error occurred",
                "type": "server_error"
            }), 500
    
    return decorated_function

def register_error_handlers(app):
    """Register global error handlers for the Flask app"""
    
    @app.errorhandler(404)
    def not_found(e):
        logger.warning(f"404 error: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Resource not found",
            "type": "not_found"
        }), 404
    
    @app.errorhandler(405)
    def method_not_allowed(e):
        logger.warning(f"405 error: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Method not allowed",
            "type": "method_not_allowed"
        }), 405
    
    @app.errorhandler(500)
    def internal_error(e):
        logger.error(f"500 error: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        return jsonify({
            "success": False,
            "error": "Internal server error",
            "type": "server_error"
        }), 500

