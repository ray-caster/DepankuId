"""Profile routes"""
from flask import Blueprint, request, jsonify
from services.user_service import UserService
from services.opportunity_service import OpportunityService
from utils.decorators import require_auth

profile_bp = Blueprint('profile', __name__, url_prefix='/api/profile')

@profile_bp.route('', methods=['GET'])
@require_auth
def get_profile(user_id: str, user_email: str):
    """Get user profile"""
    try:
        profile_data = UserService.get_profile(user_id)
        
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
def update_profile(user_id: str, user_email: str):
    """Update user profile"""
    try:
        data = request.json
        profile_data = data.get('profile', {})
        
        UserService.update_profile(user_id, profile_data)
        
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
def get_notification_settings(user_id: str, user_email: str):
    """Get notification settings"""
    try:
        settings = UserService.get_notification_settings(user_id)
        
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
def update_notification_settings(user_id: str, user_email: str):
    """Update notification settings"""
    try:
        data = request.json
        settings = data.get('settings', {})
        
        UserService.update_notification_settings(user_id, settings)
        
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
def get_privacy_settings(user_id: str, user_email: str):
    """Get privacy settings"""
    try:
        settings = UserService.get_privacy_settings(user_id)
        
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
def update_privacy_settings(user_id: str, user_email: str):
    """Update privacy settings"""
    try:
        data = request.json
        settings = data.get('settings', {})
        
        UserService.update_privacy_settings(user_id, settings)
        
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
def get_activity(user_id: str, user_email: str):
    """Get user activity"""
    try:
        activity = UserService.get_activity(user_id)
        
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
def track_application(user_id: str, user_email: str):
    """Track user application"""
    try:
        data = request.json
        opportunity_id = data.get('opportunityId')
        
        if not opportunity_id:
            return jsonify({
                "success": False,
                "error": "Opportunity ID is required"
            }), 400
        
        UserService.track_application(user_id, opportunity_id)
        
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
def get_applications(user_id: str, user_email: str):
    """Get user applications"""
    try:
        from services.application_service import ApplicationService
        applications = ApplicationService.get_user_applications(user_id)
        
        # Enrich applications with opportunity details
        enriched_applications = []
        for app in applications:
            # Get opportunity details
            opportunity = OpportunityService.get_opportunity(app.get('opportunity_id'))
            if opportunity:
                app['opportunity_title'] = opportunity.get('title', 'Unknown Opportunity')
                app['organization'] = opportunity.get('organization', 'Unknown Organization')
                app['type'] = opportunity.get('type', 'unknown')
                app['location'] = opportunity.get('location')
                app['deadline'] = opportunity.get('deadline')
                app['url'] = opportunity.get('url')
            else:
                app['opportunity_title'] = 'Opportunity Not Found'
                app['organization'] = 'Unknown'
                app['type'] = 'unknown'
                app['location'] = ''
                app['deadline'] = ''
                app['url'] = ''
            
            enriched_applications.append(app)
        
        return jsonify({
            "success": True,
            "data": enriched_applications
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

