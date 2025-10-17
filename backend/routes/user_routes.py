"""User routes"""
from flask import Blueprint, request, jsonify
from services.user_service import UserService
from utils.decorators import require_auth

user_bp = Blueprint('user', __name__, url_prefix='/api/user')

@user_bp.route('/preferences', methods=['POST'])
@require_auth
def save_user_preferences(user_id: str, user_email: str):
    """Save user preferences and conversation data"""
    try:
        data = request.json
        preferences = data.get('preferences', {})
        
        UserService.save_preferences(user_id, preferences)
        
        return jsonify({
            "success": True,
            "message": "Preferences saved successfully"
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@user_bp.route('/preferences/<user_id>', methods=['GET'])
def get_user_preferences(user_id):
    """Get user preferences"""
    try:
        data = UserService.get_preferences(user_id)
        
        return jsonify({
            "success": True,
            "data": data
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

