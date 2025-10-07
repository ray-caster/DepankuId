"""AI routes"""
from flask import Blueprint, request, jsonify
from services.ai_service import AIService
import json

ai_bp = Blueprint('ai', __name__, url_prefix='/api/ai')

@ai_bp.route('/chat', methods=['POST', 'OPTIONS'])
def ai_chat():
    """AI Socratic discovery endpoint"""
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.json
        user_message = data.get('message', '')
        conversation_history = data.get('history', [])
        
        assistant_message = AIService.chat(user_message, conversation_history)

        return jsonify({
            "success": True,
            "message": assistant_message,
            "conversation_id": data.get('conversation_id', None)
        }), 200

    except Exception as e:
        print(f"Error in AI chat: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@ai_bp.route('/discovery/start', methods=['POST', 'OPTIONS'])
def start_discovery():
    """Start a new AI discovery session"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.json or {}
        user_profile = data.get('user_profile', {})
        
        # Start discovery session
        ai_response = AIService.start_discovery_session(user_profile)
        
        return jsonify({
            "success": True,
            "message": ai_response,
            "user_profile": user_profile,
            "session_id": data.get('session_id', 'default')
        }), 200
        
    except Exception as e:
        print(f"Error starting discovery: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@ai_bp.route('/discovery/continue', methods=['POST', 'OPTIONS'])
def continue_discovery():
    """Continue the discovery conversation"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.json
        user_message = data.get('message', '')
        conversation_history = data.get('history', [])
        user_profile = data.get('user_profile', {})
        
        # Continue discovery conversation
        ai_response = AIService.continue_discovery(user_message, conversation_history, user_profile)
        
        # Analyze user profile based on conversation
        updated_profile = AIService.analyze_user_profile(conversation_history, data.get('user_answers', {}))
        
        # Check if we should show opportunities
        should_show_opportunities = updated_profile.get('confidence', 0) >= 0.7
        
        response_data = {
            "success": True,
            "message": ai_response,
            "user_profile": updated_profile,
            "should_show_opportunities": should_show_opportunities
        }
        
        # If confidence is high enough, find relevant opportunities
        if should_show_opportunities:
            opportunities = AIService.find_relevant_opportunities(updated_profile, limit=3)
            response_data["opportunities"] = opportunities
        
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"Error continuing discovery: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@ai_bp.route('/discovery/opportunities', methods=['POST', 'OPTIONS'])
def get_discovery_opportunities():
    """Get opportunities for discovery session"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.json
        user_profile = data.get('user_profile', {})
        limit = data.get('limit', 5)
        
        # Find relevant opportunities
        opportunities = AIService.find_relevant_opportunities(user_profile, limit=limit)
        
        return jsonify({
            "success": True,
            "opportunities": opportunities,
            "count": len(opportunities)
        }), 200
        
    except Exception as e:
        print(f"Error getting discovery opportunities: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@ai_bp.route('/discovery/analyze', methods=['POST', 'OPTIONS'])
def analyze_profile():
    """Analyze user profile from conversation"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.json
        conversation_history = data.get('history', [])
        user_answers = data.get('user_answers', {})
        
        # Analyze user profile
        user_profile = AIService.analyze_user_profile(conversation_history, user_answers)
        
        return jsonify({
            "success": True,
            "user_profile": user_profile
        }), 200
        
    except Exception as e:
        print(f"Error analyzing profile: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

