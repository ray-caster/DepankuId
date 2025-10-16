"""Publish/unpublish routes for opportunities"""
from flask import Blueprint, jsonify, request
from services.opportunity_publish_service import OpportunityPublishService
from utils.decorators import require_auth
from utils.logging_config import logger
from werkzeug.exceptions import BadRequest

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

# Add a simple POST test route
@publish_bp.route('/<opportunity_id>/test-post', methods=['POST'])
def test_post_route(opportunity_id):
    """Test POST route to verify request handling"""
    logger.info(f"Test POST route called for opportunity {opportunity_id}")
    logger.info(f"Request method: {request.method}")
    logger.info(f"Request headers: {dict(request.headers)}")
    logger.info(f"Request content type: {request.content_type}")
    
    if request.is_json:
        data = request.get_json()
        logger.info(f"Request JSON data: {data}")
    else:
        logger.info("No JSON data in request")
    
    return jsonify({
        "message": f"Test POST route for opportunity {opportunity_id}",
        "opportunity_id": opportunity_id,
        "method": request.method,
        "content_type": request.content_type
    }), 200

# Handle OPTIONS request for CORS (without auth)
@publish_bp.route('/<opportunity_id>/publish', methods=['OPTIONS'])
def publish_opportunity_options(opportunity_id):
    """Handle OPTIONS request for CORS"""
    logger.info(f"OPTIONS request for publish opportunity {opportunity_id}")
    return jsonify({"message": "OK"}), 200

# PUBLISH ROUTE - MOVED TO TOP FOR DEBUGGING
@publish_bp.route('/<opportunity_id>/publish', methods=['POST'])
@require_auth
def publish_opportunity(opportunity_id, user_id: str, user_email: str):
    """Publish a draft opportunity with AI moderation"""
    try:
        logger.info(f"Publishing opportunity {opportunity_id} by user {user_email}")
        logger.info(f"Request method: {request.method}")
        logger.info(f"Request headers: {dict(request.headers)}")
        logger.info(f"Request content type: {request.content_type}")
        
        # Check if request has JSON data (optional for publish)
        if request.is_json:
            data = request.get_json()
            logger.info(f"Request JSON data: {data}")
        else:
            logger.info("No JSON data in request")
        
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
    
    except BadRequest as e:
        logger.error(f"Bad request error publishing opportunity: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Bad request - invalid request format",
            "message": str(e)
        }), 400
    except Exception as e:
        logger.error(f"Error publishing opportunity: {str(e)}")
        logger.error(f"Exception type: {type(e).__name__}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# Handle OPTIONS request for unpublish CORS (without auth)
@publish_bp.route('/<opportunity_id>/unpublish', methods=['OPTIONS'])
def unpublish_opportunity_options(opportunity_id):
    """Handle OPTIONS request for unpublish CORS"""
    logger.info(f"OPTIONS request for unpublish opportunity {opportunity_id}")
    return jsonify({"message": "OK"}), 200

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
