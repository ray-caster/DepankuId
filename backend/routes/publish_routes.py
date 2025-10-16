"""Publish/unpublish routes for opportunities"""
from flask import Blueprint, jsonify, request
from services.opportunity_publish_service import OpportunityPublishService
from utils.decorators import require_auth
from utils.logging_config import logger

publish_bp = Blueprint('publish', __name__, url_prefix='/api/opportunities')

# Add a simple test route to verify the blueprint is working
@publish_bp.route('/test', methods=['GET'])
def test_publish_route():
    """Test route to verify publish blueprint is working"""
    return jsonify({"message": "Publish blueprint is working"}), 200

# Debug route to catch any requests
@publish_bp.route('/debug', methods=['GET', 'POST', 'PUT', 'DELETE'])
def debug_route():
    """Debug route to catch any requests"""
    logger.info(f"Debug route hit: {request.method} {request.path}")
    return jsonify({
        "method": request.method,
        "path": request.path,
        "url": request.url,
        "headers": dict(request.headers)
    }), 200

@publish_bp.route('/<opportunity_id>/publish', methods=['POST'])
def publish_opportunity(opportunity_id):
    """Publish a draft opportunity with AI moderation"""
    try:
        logger.info(f"Publishing opportunity {opportunity_id}")
        # For now, just return a test response
        return jsonify({
            "success": True,
            "message": f"Test publish for opportunity {opportunity_id}"
        }), 200
    
    except Exception as e:
        logger.error(f"Error publishing opportunity: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@publish_bp.route('/<opportunity_id>/unpublish', methods=['POST'])
@require_auth
def unpublish_opportunity(opportunity_id, user_id: str, user_email: str):
    """Unpublish an opportunity (make it a draft)"""
    try:
        success, message = OpportunityPublishService.unpublish_opportunity(opportunity_id)
        
        if success:
            logger.info(f"Opportunity unpublished: {opportunity_id} by {user_email}")
            return jsonify({
                "success": True,
                "message": message
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": message
            }), 400
    
    except Exception as e:
        logger.error(f"Error unpublishing opportunity: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
