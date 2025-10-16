"""AI service using Google Gemini for chat and discovery functionality"""
from google import genai
from typing import Dict, List, Optional
from config.settings import GEMINI_API_KEY
from utils.logging_config import logger


class AIService:
    """Service for AI-powered chat and discovery functionality"""
    
    @staticmethod
    def generate_chat_response(message: str, conversation_history: List[Dict] = None) -> str:
        """
        Generate AI chat response using Gemini
        
        Args:
            message: User's message
            conversation_history: Previous conversation messages
            
        Returns:
            AI response string
        """
        if not GEMINI_API_KEY:
            logger.warning("Gemini API key not configured, returning default response")
            return "I'm sorry, but the AI service is not currently available. Please try again later."
        
        try:
            # Initialize Gemini client
            client = genai.Client(api_key=GEMINI_API_KEY)
            
            # Create system prompt for educational opportunities discovery
            system_prompt = """You are an AI assistant for Depanku.id, an educational opportunities platform for Indonesian students. Your role is to help students discover relevant opportunities through Socratic questioning and guidance.

<your_capabilities>
- Ask thoughtful questions to understand student interests and goals
- Suggest relevant educational opportunities (scholarships, internships, competitions, etc.)
- Provide guidance on application processes
- Help students explore different career paths and educational options
- Be encouraging and supportive while maintaining professionalism
</your_capabilities>

<guidelines>
- Always respond in Indonesian (Bahasa Indonesia)
- Ask one focused question at a time to avoid overwhelming students
- Be specific and actionable in your suggestions
- Encourage students to explore opportunities that match their interests
- Maintain a friendly, supportive tone
- If you don't know something, admit it and suggest how they might find the information
</guidelines>

<response_format>
Keep responses concise (2-3 sentences max) and end with a relevant question to continue the conversation.
</response_format>"""
            
            # Build conversation context
            if conversation_history:
                # Format conversation history for Gemini
                conversation_text = ""
                for msg in conversation_history[-5:]:  # Keep last 5 messages for context
                    role = "User" if msg.get("role") == "user" else "Assistant"
                    conversation_text += f"{role}: {msg.get('content', '')}\n"
                
                full_prompt = f"{system_prompt}\n\nPrevious conversation:\n{conversation_text}\n\nCurrent user message: {message}"
            else:
                full_prompt = f"{system_prompt}\n\nUser message: {message}"
            
            # Generate response using Gemini 2.5 Flash
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=full_prompt
            )
            
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"AI chat service error: {str(e)}")
            return "Maaf, terjadi kesalahan dalam sistem AI. Silakan coba lagi nanti."
    
    @staticmethod
    def start_discovery_session(user_profile: Dict = None) -> str:
        """
        Start a new discovery session with personalized greeting
        
        Args:
            user_profile: User's profile information (interests, goals, etc.)
            
        Returns:
            Initial discovery message
        """
        if not GEMINI_API_KEY:
            logger.warning("Gemini API key not configured, returning default discovery message")
            return "Halo! Saya di sini untuk membantu Anda menemukan peluang pendidikan yang tepat. Bisa ceritakan tentang minat dan tujuan pendidikan Anda?"
        
        try:
            # Initialize Gemini client
            client = genai.Client(api_key=GEMINI_API_KEY)
            
            # Create personalized discovery prompt
            if user_profile:
                profile_context = f"""
User Profile:
- Interests: {user_profile.get('interests', 'Not specified')}
- Goals: {user_profile.get('goals', 'Not specified')}
- Education Level: {user_profile.get('education_level', 'Not specified')}
- Preferred Categories: {user_profile.get('preferred_categories', 'Not specified')}
"""
            else:
                profile_context = "No user profile available yet."
            
            discovery_prompt = f"""You are starting a discovery session with a student on Depanku.id. Create a warm, engaging opening message that:

1. Welcomes them to the platform
2. Explains your role in helping them find educational opportunities
3. Asks an initial question to understand their interests and goals
4. Keeps the message concise and encouraging

User context: {profile_context}

Respond in Indonesian and end with a question to start the conversation."""
            
            # Generate discovery message using Gemini 2.5 Flash
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=discovery_prompt
            )
            
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"AI discovery service error: {str(e)}")
            return "Halo! Selamat datang di Depanku.id! Saya di sini untuk membantu Anda menemukan peluang pendidikan yang tepat. Bisa ceritakan tentang minat dan tujuan pendidikan Anda?"
    
    @staticmethod
    def suggest_opportunities(user_interests: List[str], user_goals: str = None) -> str:
        """
        Suggest relevant opportunities based on user interests
        
        Args:
            user_interests: List of user interests
            user_goals: User's educational/career goals
            
        Returns:
            Suggestions for opportunities
        """
        if not GEMINI_API_KEY:
            logger.warning("Gemini API key not configured, returning default suggestions")
            return "Berdasarkan minat Anda, saya sarankan untuk menjelajahi berbagai kategori peluang pendidikan di platform ini."
        
        try:
            # Initialize Gemini client
            client = genai.Client(api_key=GEMINI_API_KEY)
            
            interests_text = ", ".join(user_interests) if user_interests else "Belum ditentukan"
            goals_text = user_goals or "Belum ditentukan"
            
            suggestion_prompt = f"""Based on the following user profile, suggest 3-5 specific types of educational opportunities they should explore:

User Interests: {interests_text}
User Goals: {goals_text}

Provide suggestions in Indonesian that are:
1. Specific and actionable
2. Relevant to their interests
3. Include different types of opportunities (scholarships, internships, competitions, etc.)
4. Encourage exploration of the platform

Format as a numbered list with brief explanations."""
            
            # Generate suggestions using Gemini 2.5 Flash
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=suggestion_prompt
            )
            
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"AI suggestion service error: {str(e)}")
            return "Berdasarkan minat Anda, saya sarankan untuk menjelajahi berbagai kategori peluang pendidikan di platform ini."
