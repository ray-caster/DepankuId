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
            "model": "deepseek/deepseek-chat-v3.1:free",
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 300
        }

        try:
            # Debug logging
            print(f"Making request to OpenRouter with model: {payload['model']}")
            print(f"API Key present: {bool(OPENROUTER_API_KEY)}")
            
            response = requests.post(OPENROUTER_URL, json=payload, headers=headers)
            
            # Better error handling with detailed response
            if response.status_code != 200:
                error_detail = f"Status: {response.status_code}, Response: {response.text}"
                print(f"OpenRouter API Error Details: {error_detail}")
                raise Exception(f"OpenRouter API error: {error_detail}")
            
            ai_response = response.json()
            assistant_message = ai_response['choices'][0]['message']['content']

            return assistant_message
        except requests.exceptions.HTTPError as e:
            # Log detailed error information
            print(f"OpenRouter API Error: {e}")
            print(f"Response status: {response.status_code}")
            print(f"Response text: {response.text}")
            raise
        except Exception as e:
            print(f"Unexpected error in AI service: {e}")
            return "I apologize, but I'm having trouble connecting right now. Please try again in a moment."

