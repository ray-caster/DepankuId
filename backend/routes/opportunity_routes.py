"""Opportunity routes"""
from flask import Blueprint, request, jsonify
from services.opportunity_service import OpportunityService
from models.opportunity import OPPORTUNITY_TEMPLATES, TAG_PRESETS

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
def create_opportunity():
    """Create a new opportunity"""
    try:
        data = request.json
        doc_id, algolia_data = OpportunityService.create_opportunity(data)
        
        return jsonify({
            "success": True,
            "id": doc_id,
            "data": algolia_data
        }), 201
    except Exception as e:
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
def update_opportunity(opportunity_id):
    """Update an opportunity"""
    try:
        data = request.json
        OpportunityService.update_opportunity(opportunity_id, data)
        
        return jsonify({
            "success": True,
            "message": "Opportunity updated successfully"
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@opportunity_bp.route('/<opportunity_id>', methods=['DELETE'])
def delete_opportunity(opportunity_id):
    """Delete an opportunity"""
    try:
        OpportunityService.delete_opportunity(opportunity_id)
        
        return jsonify({
            "success": True,
            "message": "Opportunity deleted successfully"
        }), 200
    except Exception as e:
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

