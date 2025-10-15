"""Authentication routes"""
from flask import Blueprint, request, jsonify
from services.auth_service import AuthService
from utils.validators import validate_signup_data, validate_signin_data, validate_verification_data, ValidationError
from utils.logging_config import logger
from utils.rate_limiter import rate_limit

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/signup', methods=['POST'])
@rate_limit(limit=5, window=3600)  # 5 signups per hour per IP
def signup():
    """Sign up a new user with email verification"""
    try:
        data = request.json
        
        if not data:
            return jsonify({
                "success": False,
                "message": "Request body is required"
            }), 400
        
        # Validate and sanitize input
        try:
            validated_data = validate_signup_data(data)
        except ValidationError as e:
            logger.warning(f"Signup validation failed: {str(e)}")
            return jsonify({
                "success": False,
                "message": str(e)
            }), 400
        
        try:
            user_id = AuthService.signup(
                validated_data['email'],
                validated_data['password'],
                validated_data['name']
            )
            logger.info(f"User created successfully: {validated_data['email']}")
            return jsonify({
                "success": True,
                "message": "Account created successfully. Please check your email to verify your account."
            }), 201
        except Exception as e:
            logger.error(f"Failed to create user: {str(e)}")
            return jsonify({
                "success": False,
                "message": f"Failed to create user: {str(e)}"
            }), 400
    
    except Exception as e:
        logger.error(f"Unexpected error in signup: {str(e)}")
        return jsonify({
            "success": False,
            "message": "An unexpected error occurred"
        }), 500

@auth_bp.route('/verify-email', methods=['POST'])
def verify_email():
    """Verify user email with token"""
    try:
        data = request.json
        
        if not data:
            return jsonify({
                "success": False,
                "message": "Request body is required"
            }), 400
        
        # Validate and sanitize input
        try:
            validated_data = validate_verification_data(data)
        except ValidationError as e:
            logger.warning(f"Email verification validation failed: {str(e)}")
            return jsonify({
                "success": False,
                "message": str(e)
            }), 400
        
        try:
            result = AuthService.verify_email(validated_data['token'], validated_data['uid'])
            logger.info(f"Email verified successfully for UID: {validated_data['uid']}")
            return jsonify({
                "success": True,
                "message": "Email verified successfully",
                "customToken": result.get('customToken'),
                "user": {
                    "uid": result.get('uid'),
                    "email": result.get('email'),
                    "name": result.get('name')
                }
            }), 200
        except ValueError as e:
            logger.warning(f"Email verification failed: {str(e)}")
            return jsonify({
                "success": False,
                "message": str(e)
            }), 400
    
    except Exception as e:
        logger.error(f"Unexpected error in verify_email: {str(e)}")
        return jsonify({
            "success": False,
            "message": "An unexpected error occurred"
        }), 500

@auth_bp.route('/signin', methods=['POST'])
@rate_limit(limit=10, window=600)  # 10 signin attempts per 10 minutes per IP
def signin():
    """Check email verification status for sign in"""
    try:
        data = request.json
        
        if not data:
            return jsonify({
                "success": False,
                "message": "Request body is required"
            }), 400
        
        # Validate and sanitize input
        try:
            validated_data = validate_signin_data(data)
        except ValidationError as e:
            logger.warning(f"Signin validation failed: {str(e)}")
            return jsonify({
                "success": False,
                "message": str(e)
            }), 400
        
        try:
            is_verified = AuthService.check_email_verified(validated_data['email'])
        except Exception as e:
            logger.warning(f"User not found during signin: {validated_data['email']}")
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404
        
        if not is_verified:
            logger.info(f"Unverified signin attempt: {validated_data['email']}")
            return jsonify({
                "success": False,
                "message": "Please verify your email before signing in. Check your inbox for the verification link."
            }), 400
        
        logger.info(f"Signin verification check passed: {validated_data['email']}")
        return jsonify({
            "success": True,
            "message": "Email verified. Please proceed with sign in.",
            "emailVerified": True
        }), 200
    
    except Exception as e:
        logger.error(f"Unexpected error in signin: {str(e)}")
        return jsonify({
            "success": False,
            "message": "An unexpected error occurred"
        }), 500

@auth_bp.route('/resend-verification', methods=['POST'])
@rate_limit(limit=3, window=3600)  # 3 resends per hour per IP
def resend_verification():
    """Resend verification email for pending users"""
    try:
        data = request.json
        
        if not data or not data.get('email'):
            return jsonify({
                "success": False,
                "message": "Email is required"
            }), 400
        
        email = data['email'].strip().lower()
        
        try:
            AuthService.resend_verification_email(email)
            logger.info(f"Verification email resent to {email}")
            return jsonify({
                "success": True,
                "message": "Verification email sent successfully"
            }), 200
        except ValueError as e:
            logger.warning(f"Resend verification failed: {str(e)}")
            return jsonify({
                "success": False,
                "message": str(e)
            }), 400
    
    except Exception as e:
        logger.error(f"Unexpected error in resend_verification: {str(e)}")
        return jsonify({
            "success": False,
            "message": "An unexpected error occurred"
        }), 500

