"""Authentication routes"""
from flask import Blueprint, request, jsonify
from services.auth_service import AuthService

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """Sign up a new user with email verification"""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        
        if not email or not password or not name:
            return jsonify({
                "success": False,
                "message": "Email, password, and name are required"
            }), 400
        
        try:
            user_id = AuthService.signup(email, password, name)
            return jsonify({
                "success": True,
                "message": "Account created successfully. Please check your email to verify your account."
            }), 201
        except Exception as e:
            return jsonify({
                "success": False,
                "message": f"Failed to create user: {str(e)}"
            }), 400
    
    except Exception as e:
        print(f"Error in signup: {str(e)}")
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@auth_bp.route('/verify-email', methods=['POST'])
def verify_email():
    """Verify user email with token"""
    try:
        data = request.json
        token = data.get('token')
        uid = data.get('uid')
        
        if not token or not uid:
            return jsonify({
                "success": False,
                "message": "Token and UID are required"
            }), 400
        
        try:
            AuthService.verify_email(token, uid)
            return jsonify({
                "success": True,
                "message": "Email verified successfully"
            }), 200
        except ValueError as e:
            return jsonify({
                "success": False,
                "message": str(e)
            }), 400
    
    except Exception as e:
        print(f"Error in verify_email: {str(e)}")
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@auth_bp.route('/signin', methods=['POST'])
def signin():
    """Check email verification status for sign in"""
    try:
        data = request.json
        email = data.get('email')
        
        if not email:
            return jsonify({
                "success": False,
                "message": "Email is required"
            }), 400
        
        try:
            is_verified = AuthService.check_email_verified(email)
        except Exception as e:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404
        
        if not is_verified:
            return jsonify({
                "success": False,
                "message": "Please verify your email before signing in. Check your inbox for the verification link."
            }), 400
        
        return jsonify({
            "success": True,
            "message": "Email verified. Please proceed with sign in.",
            "emailVerified": True
        }), 200
    
    except Exception as e:
        print(f"Error in signin: {str(e)}")
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

