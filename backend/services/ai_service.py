"""AI service - Business logic for AI chat"""
import requests
from config.settings import OPENROUTER_API_KEY, OPENROUTER_URL

class AIService:
    """Service for AI interactions"""
    
    @staticmethod
    def chat(user_message, conversation_history=None):
        """Process AI chat request"""
        if conversation_history is None:
            conversation_history = []
        
        # System prompt for Socratic questioning
        system_prompt = """You are a thoughtful guide for Depanku.id, helping users discover opportunities that match their interests and goals. 

Your role is to:
1. Ask reflective, open-ended questions to understand the user's interests, skills, and aspirations
2. Be warm, encouraging, and conversational
3. Guide users toward clarity about what they're looking for
4. Ask one question at a time
5. Keep responses concise (2-3 sentences max)

Example questions:
- "What kind of problems do you love solving?"
- "Do you enjoy working with people or ideas?"
- "What topics make you lose track of time when you're learning about them?"
- "Are you looking to build skills, meet like-minded people, or explore new fields?"

Based on their answers, help narrow down whether they'd be interested in research programs, competitions, communities, or youth programs."""

        # Prepare messages for OpenRouter
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add conversation history
        for msg in conversation_history:
            messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", "")
            })
        
        # Add current user message
        messages.append({
            "role": "user",
            "content": user_message
        })

        # Call OpenRouter API
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://depanku.id",
            "X-Title": "Depanku.id"
        }

        payload = {
            "model": "anthropic/claude-3.5-sonnet",
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 300
        }

        response = requests.post(OPENROUTER_URL, json=payload, headers=headers)
        response.raise_for_status()
        
        ai_response = response.json()
        assistant_message = ai_response['choices'][0]['message']['content']

        return assistant_message

