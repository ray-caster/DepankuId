"""Profile routes"""
from flask import Blueprint, request, jsonify
from services.user_service import UserService
from utils.decorators import require_auth

profile_bp = Blueprint('profile', __name__, url_prefix='/api/profile')

@profile_bp.route('', methods=['GET'])
@require_auth
def get_profile():
    """Get user profile"""
    try:
        profile_data = UserService.get_profile(request.user_id)
        
        return jsonify({
            "success": True,
            "data": profile_data
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@profile_bp.route('', methods=['PUT'])
@require_auth
def update_profile():
    """Update user profile"""
    try:
        data = request.json
        profile_data = data.get('profile', {})
        
        UserService.update_profile(request.user_id, profile_data)
        
        return jsonify({
            "success": True,
            "message": "Profile updated successfully"
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@profile_bp.route('/settings/notifications', methods=['GET'])
@require_auth
def get_notification_settings():
    """Get notification settings"""
    try:
        settings = UserService.get_notification_settings(request.user_id)
        
        return jsonify({
            "success": True,
            "data": settings
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@profile_bp.route('/settings/notifications', methods=['PUT'])
@require_auth
def update_notification_settings():
    """Update notification settings"""
    try:
        data = request.json
        settings = data.get('settings', {})
        
        UserService.update_notification_settings(request.user_id, settings)
        
        return jsonify({
            "success": True,
            "message": "Notification settings updated successfully"
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@profile_bp.route('/settings/privacy', methods=['GET'])
@require_auth
def get_privacy_settings():
    """Get privacy settings"""
    try:
        settings = UserService.get_privacy_settings(request.user_id)
        
        return jsonify({
            "success": True,
            "data": settings
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@profile_bp.route('/settings/privacy', methods=['PUT'])
@require_auth
def update_privacy_settings():
    """Update privacy settings"""
    try:
        data = request.json
        settings = data.get('settings', {})
        
        UserService.update_privacy_settings(request.user_id, settings)
        
        return jsonify({
            "success": True,
            "message": "Privacy settings updated successfully"
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@profile_bp.route('/activity', methods=['GET'])
@require_auth
def get_activity():
    """Get user activity"""
    try:
        activity = UserService.get_activity(request.user_id)
        
        return jsonify({
            "success": True,
            "data": activity
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@profile_bp.route('/activity/application', methods=['POST'])
@require_auth
def track_application():
    """Track user application"""
    try:
        data = request.json
        opportunity_id = data.get('opportunityId')
        
        if not opportunity_id:
            return jsonify({
                "success": False,
                "error": "Opportunity ID is required"
            }), 400
        
        UserService.track_application(request.user_id, opportunity_id)
        
        return jsonify({
            "success": True,
            "message": "Application tracked successfully"
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@profile_bp.route('/applications', methods=['GET'])
@require_auth
def get_applications():
    """Get user applications"""
    try:
        applications = UserService.get_applications(request.user_id)
        
        return jsonify({
            "success": True,
            "data": applications
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

