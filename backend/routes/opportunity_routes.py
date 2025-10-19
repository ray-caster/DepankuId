"""Opportunity routes"""
from flask import Blueprint, request, jsonify
from services.opportunity_service import OpportunityService
from services.moderation_service import ModerationService
from services.opportunity_publish_service import OpportunityPublishService
from services.application_service import ApplicationService
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
            # Check for existing draft with same title by same user
            existing_draft = OpportunityService.find_draft_by_title(user_id, data.get('title', ''))
            
            if existing_draft:
                # Update existing draft instead of creating new one
                data['status'] = 'draft'
                OpportunityService.update_opportunity(existing_draft['id'], data)
                
                logger.info(f"Existing draft updated: {existing_draft['id']} by {user_email}")
                
                return jsonify({
                    "success": True,
                    "status": "draft",
                    "id": existing_draft['id'],
                    "message": "Draft updated successfully"
                }), 200
            else:
                # Create new draft
                data['status'] = 'draft'
                doc_id, _ = OpportunityService.create_opportunity(data)
                
                logger.info(f"New draft created: {doc_id} by {user_email}")
                
                return jsonify({
                    "success": True,
                    "status": "draft",
                    "id": doc_id,
                    "message": "Draft saved successfully"
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

@opportunity_bp.route('/<opportunity_id>/applications', methods=['GET'])
@require_auth
def get_opportunity_applications(user_id: str, user_email: str, opportunity_id: str):
    """Get applications for a specific opportunity"""
    try:
        # First verify that the user owns this opportunity
        opportunity = OpportunityService.get_opportunity(opportunity_id)
        if not opportunity:
            return jsonify({
                "success": False,
                "error": "Opportunity not found"
            }), 404
        
        if opportunity.get('created_by_uid') != user_id:
            return jsonify({
                "success": False,
                "error": "You don't have permission to view applications for this opportunity"
            }), 403
        
        # Get applications for this opportunity
        applications = ApplicationService.get_opportunity_applications(opportunity_id)
        
        return jsonify({
            "success": True,
            "data": applications
        }), 200
    
    except Exception as e:
        logger.error(f"Error fetching opportunity applications: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@opportunity_bp.route('/<opportunity_id>/apply', methods=['POST'])
@require_auth
def submit_application(user_id: str, user_email: str, opportunity_id: str):
    """Submit an application for an opportunity"""
    try:
        data = request.json
        responses = data.get('responses', [])
        
        if not responses:
            return jsonify({
                "success": False,
                "error": "Application responses are required"
            }), 400
        
        # Submit or update application
        ApplicationService.submit_application(opportunity_id, user_id, user_email, responses)
        
        return jsonify({
            "success": True,
            "message": "Application submitted successfully"
        }), 200
    
    except Exception as e:
        logger.error(f"Error submitting application: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@opportunity_bp.route('/<opportunity_id>/application-status', methods=['GET'])
@require_auth
def get_application_status(user_id: str, user_email: str, opportunity_id: str):
    """Check if user has already applied to an opportunity and get application data"""
    try:
        # Check if user has applied
        has_applied = ApplicationService.has_user_applied(opportunity_id, user_id)
        
        if has_applied:
            # Get the application data
            application = ApplicationService.get_application(opportunity_id, user_id)
            return jsonify({
                "success": True,
                "has_applied": True,
                "application": application
            }), 200
        else:
            return jsonify({
                "success": True,
                "has_applied": False,
                "application": None
            }), 200
    
    except Exception as e:
        logger.error(f"Error checking application status: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


