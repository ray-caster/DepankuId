"""Bookmark routes"""
from flask import Blueprint, request, jsonify
from services.user_service import UserService
from utils.decorators import require_auth

bookmark_bp = Blueprint('bookmarks', __name__, url_prefix='/api/bookmarks')

@bookmark_bp.route('', methods=['GET'])
@require_auth
def get_bookmarks(user_id: str, user_email: str):
    """Get user's bookmarked opportunities"""
    try:
        opportunities = UserService.get_bookmarks(user_id)
        
        return jsonify({
            "success": True,
            "data": opportunities
        }), 200
    
    except Exception as e:
        print(f"Error in get_bookmarks: {str(e)}")
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@bookmark_bp.route('/<opportunity_id>', methods=['POST'])
@require_auth
def add_bookmark(opportunity_id, user_id: str, user_email: str):
    """Add an opportunity to user's bookmarks"""
    try:
        UserService.add_bookmark(user_id, opportunity_id)
        
        return jsonify({
            "success": True,
            "message": "Bookmark added successfully"
        }), 200
    
    except Exception as e:
        print(f"Error in add_bookmark: {str(e)}")
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@bookmark_bp.route('/<opportunity_id>', methods=['DELETE'])
@require_auth
def remove_bookmark(opportunity_id, user_id: str, user_email: str):
    """Remove an opportunity from user's bookmarks"""
    try:
        UserService.remove_bookmark(user_id, opportunity_id)
        
        return jsonify({
            "success": True,
            "message": "Bookmark removed successfully"
        }), 200
    
    except Exception as e:
        print(f"Error in remove_bookmark: {str(e)}")
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

