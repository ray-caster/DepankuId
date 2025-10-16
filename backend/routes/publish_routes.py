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

# Add a simple test route for the specific opportunity ID pattern
@publish_bp.route('/<opportunity_id>/test', methods=['GET'])
def test_opportunity_route(opportunity_id):
    """Test route to verify opportunity ID pattern is working"""
    return jsonify({
        "message": f"Test route for opportunity {opportunity_id}",
        "opportunity_id": opportunity_id
    }), 200

# PUBLISH ROUTE - MOVED TO TOP FOR DEBUGGING
@publish_bp.route('/<opportunity_id>/publish', methods=['POST'])
@require_auth
def publish_opportunity(opportunity_id, user_id: str, user_email: str):
    """Publish a draft opportunity with AI moderation"""
    try:
        logger.info(f"Publishing opportunity {opportunity_id} by user {user_email}")
        success, result = OpportunityPublishService.publish_opportunity(opportunity_id)
        
        if success:
            logger.info(f"Opportunity published: {opportunity_id} by {user_email}")
            return jsonify({
                "success": True,
                "message": result
            }), 200
        else:
            # Handle different types of failure responses
            if isinstance(result, dict):
                # Moderation rejection with detailed feedback
                return jsonify({
                    "success": False,
                    "status": result.get("status"),
                    "message": result.get("message"),
                    "issues": result.get("issues", []),
                    "moderation_notes": result.get("moderation_notes")
                }), 400
            else:
                # Simple error message
                return jsonify({
                    "success": False,
                    "message": result
                }), 400
    
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
