"""AI chat routes for Gemini-powered discovery and assistance"""
from flask import Blueprint, request, jsonify
from utils.decorators import require_auth
from services.ai_service import AIService
from utils.logging_config import logger

ai_bp = Blueprint('ai', __name__, url_prefix='/api/ai')


@ai_bp.route('/chat', methods=['POST'])
@require_auth
def ai_chat(user_id: str, user_email: str):
    """
    AI chat endpoint for discovery and assistance
    
    Expected JSON payload:
    {
        "message": "User's message",
        "conversation_history": [{"role": "user", "content": "..."}, ...]
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "error": "Request body is required"
            }), 400
        
        message = data.get('message', '').strip()
        if not message:
            return jsonify({
                "error": "Message is required"
            }), 400
        
        conversation_history = data.get('conversation_history', [])
        
        # Validate conversation history format
        if not isinstance(conversation_history, list):
            conversation_history = []
        
        # Generate AI response
        ai_response = AIService.generate_chat_response(message, conversation_history)
        
        logger.info(f"AI chat response generated for user message: {message[:50]}...")
        
        return jsonify({
            "response": ai_response,
            "success": True
        }), 200
        
    except Exception as e:
        logger.error(f"AI chat endpoint error: {str(e)}")
        return jsonify({
            "error": "Failed to generate AI response",
            "success": False
        }), 500


@ai_bp.route('/discovery/start', methods=['POST'])
@require_auth
def start_discovery(user_id: str, user_email: str):
    """
    Start a new discovery session
    
    Expected JSON payload (optional):
    {
        "user_profile": {
            "interests": ["technology", "science"],
            "goals": "Career in tech",
            "education_level": "university",
            "preferred_categories": ["scholarships", "internships"]
        }
    }
    """
    try:
        data = request.get_json() or {}
        user_profile = data.get('user_profile', {})
        
        # Generate discovery message
        discovery_message = AIService.start_discovery_session(user_profile)
        
        logger.info("Discovery session started")
        
        return jsonify({
            "message": discovery_message,
            "success": True
        }), 200
        
    except Exception as e:
        logger.error(f"Discovery start endpoint error: {str(e)}")
        return jsonify({
            "error": "Failed to start discovery session",
            "success": False
        }), 500


@ai_bp.route('/suggestions', methods=['POST'])
@require_auth
def get_suggestions(user_id: str, user_email: str):
    """
    Get opportunity suggestions based on user interests
    
    Expected JSON payload:
    {
        "interests": ["technology", "science", "arts"],
        "goals": "Career in technology"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "error": "Request body is required"
            }), 400
        
        interests = data.get('interests', [])
        goals = data.get('goals', '')
        
        if not interests:
            return jsonify({
                "error": "Interests are required"
            }), 400
        
        # Generate suggestions
        suggestions = AIService.suggest_opportunities(interests, goals)
        
        logger.info(f"Opportunity suggestions generated for interests: {interests}")
        
        return jsonify({
            "suggestions": suggestions,
            "success": True
        }), 200
        
    except Exception as e:
        logger.error(f"Suggestions endpoint error: {str(e)}")
        return jsonify({
            "error": "Failed to generate suggestions",
            "success": False
        }), 500


@ai_bp.route('/health', methods=['GET'])
def ai_health():
    """
    Check AI service health
    """
    try:
        # Test basic AI functionality
        test_response = AIService.generate_chat_response("Hello")
        
        return jsonify({
            "status": "healthy",
            "service": "AI Chat Service",
            "model": "gemini-2.5-flash",
            "test_response": test_response[:100] + "..." if len(test_response) > 100 else test_response
        }), 200
        
    except Exception as e:
        logger.error(f"AI health check error: {str(e)}")
        return jsonify({
            "status": "unhealthy",
            "service": "AI Chat Service",
            "error": str(e)
        }), 500
