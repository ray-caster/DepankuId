"""AI routes"""
from flask import Blueprint, request, jsonify
from services.ai_service import AIService

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

