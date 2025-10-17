"""Application routes"""
from flask import Blueprint, request, jsonify
from services.user_service import UserService
from services.application_service import ApplicationService
from utils.decorators import require_auth

application_bp = Blueprint('application', __name__, url_prefix='/api/applications')

@application_bp.route('/<application_id>/status', methods=['PUT'])
@require_auth
def update_application_status(user_id: str, user_email: str, application_id: str):
    """Update application status"""
    try:
        data = request.json
        status = data.get('status')
        notes = data.get('notes', '')
        
        if not status:
            return jsonify({
                "success": False,
                "error": "Status is required"
            }), 400
        
        if status not in ['pending', 'reviewed', 'accepted', 'rejected']:
            return jsonify({
                "success": False,
                "error": "Invalid status. Must be one of: pending, reviewed, accepted, rejected"
            }), 400
        
        # Update application status
        success = ApplicationService.update_application_status(application_id, status, notes)
        
        if not success:
            return jsonify({
                "success": False,
                "error": "Application not found"
            }), 404
        
        return jsonify({
            "success": True,
            "message": "Application status updated successfully"
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
