"""Sync routes"""
from flask import Blueprint, jsonify
from services.opportunity_service import OpportunityService

sync_bp = Blueprint('sync', __name__, url_prefix='/api/sync')

@sync_bp.route('/algolia', methods=['POST'])
async def sync_algolia():
    """Sync all Firestore opportunities to Algolia"""
    try:
        count = await OpportunityService.sync_to_algolia()
        
        return jsonify({
            "success": True,
            "message": f"Synced {count} opportunities to Algolia"
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

