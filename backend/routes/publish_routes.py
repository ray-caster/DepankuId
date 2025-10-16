"""Publish/unpublish routes for opportunities"""
from flask import Blueprint, jsonify
from services.opportunity_publish_service import OpportunityPublishService
from utils.decorators import require_auth
from utils.logging_config import logger

publish_bp = Blueprint('publish', __name__, url_prefix='/api/opportunities')

@publish_bp.route('/<opportunity_id>/publish', methods=['POST'])
@require_auth
def publish_opportunity(opportunity_id, user_id: str, user_email: str):
    """Publish a draft opportunity"""
    try:
        success, message = OpportunityPublishService.publish_opportunity(opportunity_id)
        
        if success:
            logger.info(f"Opportunity published: {opportunity_id} by {user_email}")
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
