"""Opportunity routes"""
from flask import Blueprint, request, jsonify
from services.opportunity_service import OpportunityService
from services.moderation_service import ModerationService
from models.opportunity import OPPORTUNITY_TEMPLATES, TAG_PRESETS
from utils.decorators import require_auth
from utils.logging_config import logger
from config.settings import db

opportunity_bp = Blueprint('opportunities', __name__, url_prefix='/api/opportunities')

@opportunity_bp.route('', methods=['GET'])
def get_opportunities():
    """Get all opportunities from Firestore"""
    try:
        opportunities = OpportunityService.get_all_opportunities()
        return jsonify({
            "success": True,
            "data": opportunities
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@opportunity_bp.route('', methods=['POST'])
@require_auth
def create_opportunity(user_id: str, user_email: str):
    """Create a new opportunity with AI moderation"""
    try:
        data = request.json
        
        # Add user tracking
        data['created_by_uid'] = user_id
        data['created_by_email'] = user_email
        
        # Check if this is a draft or published submission
        is_draft = data.get('status') == 'draft'
        
        if is_draft:
            # Save as draft without moderation
            data['status'] = 'draft'
            doc_id, _ = OpportunityService.create_opportunity(data)
            
            logger.info(f"Opportunity saved as draft: {doc_id} by {user_email}")
            
            return jsonify({
                "success": True,
                "status": "draft",
                "id": doc_id,
                "message": "Opportunity saved as draft"
            }), 201
        else:
            # Moderate content with AI for published submissions
            is_approved, issues = ModerationService.moderate_opportunity(data)
            
            if not is_approved:
                # Save as rejected with moderation notes
                data['status'] = 'rejected'
                data['moderation_notes'] = ModerationService.get_moderation_summary(issues)
                doc_id, _ = OpportunityService.create_opportunity(data)
                
                logger.info(f"Opportunity rejected by moderation: {doc_id}")
                
                return jsonify({
                    "success": False,
                    "status": "rejected",
                    "id": doc_id,
                    "message": "Your opportunity needs revision",
                    "issues": issues,
                    "moderation_notes": data['moderation_notes']
                }), 400
            
            # Content approved, create as published
            data['status'] = 'published'
            doc_id, algolia_data = OpportunityService.create_opportunity(data)
            
            logger.info(f"Opportunity created and published: {doc_id} by {user_email}")
            
            return jsonify({
                "success": True,
                "status": "published",
                "id": doc_id,
                "data": algolia_data
            }), 201
        
    except Exception as e:
        logger.error(f"Error creating opportunity: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@opportunity_bp.route('/<opportunity_id>', methods=['GET'])
def get_opportunity(opportunity_id):
    """Get a single opportunity by ID"""
    try:
        data = OpportunityService.get_opportunity_by_id(opportunity_id)
        
        if data:
            return jsonify({
                "success": True,
                "data": data
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": "Opportunity not found"
            }), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@opportunity_bp.route('/<opportunity_id>', methods=['PUT'])
@require_auth
def update_opportunity(opportunity_id, user_id: str, user_email: str):
    """Update an opportunity"""
    try:
        data = request.json
        
        # Check if status is changing to published
        if data.get('status') == 'published':
            # Moderate content with AI for published submissions
            is_approved, issues = ModerationService.moderate_opportunity(data)
            
            if not is_approved:
                # Update as rejected with moderation notes
                data['status'] = 'rejected'
                data['moderation_notes'] = ModerationService.get_moderation_summary(issues)
                OpportunityService.update_opportunity(opportunity_id, data)
                
                logger.info(f"Opportunity update rejected by moderation: {opportunity_id}")
                
                return jsonify({
                    "success": False,
                    "status": "rejected",
                    "message": "Your opportunity needs revision",
                    "issues": issues,
                    "moderation_notes": data['moderation_notes']
                }), 400
        
        # Update the opportunity
        OpportunityService.update_opportunity(opportunity_id, data)
        
        logger.info(f"Opportunity updated: {opportunity_id} by {user_email}")
        
        return jsonify({
            "success": True,
            "message": "Opportunity updated successfully"
        }), 200
    except Exception as e:
        logger.error(f"Error updating opportunity: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@opportunity_bp.route('/<opportunity_id>', methods=['DELETE'])
@require_auth
def delete_opportunity(opportunity_id, user_id: str, user_email: str):
    """Delete an opportunity"""
    try:
        OpportunityService.delete_opportunity(opportunity_id)
        
        logger.info(f"Opportunity deleted: {opportunity_id} by {user_email}")
        
        return jsonify({
            "success": True,
            "message": "Opportunity deleted successfully"
        }), 200
    except Exception as e:
        logger.error(f"Error deleting opportunity: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@opportunity_bp.route('/templates', methods=['GET'])
def get_templates():
    """Get opportunity templates"""
    return jsonify({
        "success": True,
        "data": OPPORTUNITY_TEMPLATES
    }), 200

@opportunity_bp.route('/presets/tags', methods=['GET'])
def get_tag_presets():
    """Get tag presets"""
    return jsonify({
        "success": True,
        "data": TAG_PRESETS
    }), 200

@opportunity_bp.route('/my-opportunities', methods=['GET'])
@require_auth
def get_my_opportunities(user_id: str, user_email: str):
    """Get all opportunities created by the authenticated user (published and drafts)"""
    try:
        # Get status filter from query params
        status = request.args.get('status')
        
        # Query opportunities created by this user
        opportunities = OpportunityService.get_user_opportunities(user_id, status)
        
        # Sort by status: drafts first, then published
        def sort_key(opp):
            status = opp.get('status', 'published')
            if status == 'draft':
                return 0
            elif status == 'rejected':
                return 1
            else:  # published
                return 2
        
        opportunities.sort(key=sort_key)
        
        return jsonify({
            "success": True,
            "data": opportunities
        }), 200
    except Exception as e:
        logger.error(f"Error fetching user opportunities: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


