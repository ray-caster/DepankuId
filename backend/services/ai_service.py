"""AI service - Business logic for AI chat and discovery"""
import requests
import json
import re
from config.settings import OPENROUTER_API_KEY, OPENROUTER_URL
from services.opportunity_service import OpportunityService

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

    @staticmethod
    def start_discovery_session(user_profile=None):
        """Start a new AI discovery session"""
        if user_profile is None:
            user_profile = {
                'interests': [],
                'skills': [],
                'goals': [],
                'preferredTypes': [],
                'confidence': 0
            }
        
        system_prompt = """You are an AI discovery assistant for Depanku.id, helping users find opportunities that match their interests and goals.

Your role is to:
1. Ask thoughtful, open-ended questions to understand the user's interests, skills, and aspirations
2. Be warm, encouraging, and conversational
3. Guide users toward clarity about what they're looking for
4. Ask ONE question at a time
5. Keep responses concise (1-2 sentences max)
6. Based on responses, determine if you should show them specific opportunities

Question types you can ask:
- Interest exploration: "What topics make you lose track of time when learning?"
- Goal clarification: "Are you looking to build skills, meet people, or explore new fields?"
- Experience level: "What's your experience with [topic]?"
- Opportunity type preference: "Do you prefer research, competitions, or community programs?"

When you have enough information about their interests, you can mention specific opportunities by saying "Let me show you an opportunity that might interest you" and I'll provide relevant opportunities.

Current user profile: {user_profile}

Ask your first question to start the discovery process."""

        messages = [{"role": "system", "content": system_prompt.format(user_profile=json.dumps(user_profile))}]
        
        return AIService._call_openrouter(messages)

    @staticmethod
    def continue_discovery(user_message, conversation_history, user_profile):
        """Continue the discovery conversation"""
        system_prompt = """You are an AI discovery assistant for Depanku.id. Continue the conversation based on the user's response.

Your role:
1. Analyze the user's response and update your understanding
2. Ask ONE follow-up question to learn more
3. Be conversational and encouraging
4. If you have enough information about their interests, suggest showing them opportunities

Current user profile: {user_profile}
Conversation history: {history}

Based on their latest response, ask one thoughtful follow-up question or suggest showing opportunities if you have enough information."""

        # Prepare conversation context
        history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in conversation_history[-5:]])
        
        messages = [
            {"role": "system", "content": system_prompt.format(
                user_profile=json.dumps(user_profile),
                history=history_text
            )},
            {"role": "user", "content": user_message}
        ]
        
        return AIService._call_openrouter(messages)

    @staticmethod
    def analyze_user_profile(conversation_history, user_answers):
        """Analyze conversation to extract user profile information"""
        profile = {
            'interests': [],
            'skills': [],
            'goals': [],
            'preferredTypes': [],
            'confidence': 0
        }
        
        # Extract keywords from conversation
        all_text = " ".join([msg['content'] for msg in conversation_history])
        
        # Common interest keywords
        interest_keywords = [
            'research', 'science', 'technology', 'programming', 'coding', 'data', 'ai', 'machine learning',
            'biology', 'chemistry', 'physics', 'mathematics', 'engineering', 'design', 'art', 'music',
            'writing', 'journalism', 'business', 'entrepreneurship', 'leadership', 'community', 'social',
            'environment', 'sustainability', 'health', 'medicine', 'psychology', 'education', 'teaching'
        ]
        
        # Extract interests
        for keyword in interest_keywords:
            if keyword.lower() in all_text.lower():
                profile['interests'].append(keyword)
        
        # Extract opportunity type preferences
        if any(word in all_text.lower() for word in ['research', 'study', 'investigate']):
            profile['preferredTypes'].append('research')
        if any(word in all_text.lower() for word in ['compete', 'competition', 'contest', 'challenge']):
            profile['preferredTypes'].append('competition')
        if any(word in all_text.lower() for word in ['community', 'group', 'team', 'collaborate']):
            profile['preferredTypes'].append('community')
        if any(word in all_text.lower() for word in ['youth', 'young', 'student', 'program']):
            profile['preferredTypes'].append('youth-program')
        
        # Calculate confidence based on information gathered
        confidence = 0
        if len(profile['interests']) >= 3:
            confidence += 0.3
        if len(profile['preferredTypes']) >= 1:
            confidence += 0.2
        if len(conversation_history) >= 4:
            confidence += 0.3
        if len(user_answers) >= 3:
            confidence += 0.2
        
        profile['confidence'] = min(confidence, 1.0)
        
        return profile

    @staticmethod
    def find_relevant_opportunities(user_profile, limit=5):
        """Find opportunities that match the user's profile"""
        try:
            all_opportunities = OpportunityService.get_all_opportunities()
            
            if not all_opportunities:
                return []
            
            # Score opportunities based on user profile
            scored_opportunities = []
            
            for opp in all_opportunities:
                score = AIService._calculate_relevance_score(opp, user_profile)
                if score > 0:
                    scored_opportunities.append((opp, score))
            
            # Sort by score and return top matches
            scored_opportunities.sort(key=lambda x: x[1], reverse=True)
            
            return [opp for opp, score in scored_opportunities[:limit]]
            
        except Exception as e:
            print(f"Error finding opportunities: {e}")
            return []

    @staticmethod
    def _calculate_relevance_score(opportunity, user_profile):
        """Calculate relevance score for an opportunity"""
        score = 0
        
        # Type matching
        if opportunity.get('type') in user_profile.get('preferredTypes', []):
            score += 2
        
        # Interest matching
        opp_tags = opportunity.get('tags', [])
        user_interests = user_profile.get('interests', [])
        
        for tag in opp_tags:
            for interest in user_interests:
                if interest.lower() in tag.lower() or tag.lower() in interest.lower():
                    score += 1
        
        # Category matching
        opp_categories = opportunity.get('category', [])
        for category in opp_categories:
            for interest in user_interests:
                if interest.lower() in category.lower() or category.lower() in interest.lower():
                    score += 0.5
        
        return score

    @staticmethod
    def generate_opportunity_question(opportunity):
        """Generate a question about a specific opportunity"""
        return f"What do you think about this opportunity: {opportunity.get('title', 'Unknown')}? It's a {opportunity.get('type', 'program')} focused on {', '.join(opportunity.get('tags', [])[:3])}."

    @staticmethod
    def _call_openrouter(messages):
        """Make a call to OpenRouter API"""
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
            "max_tokens": 200
        }

        try:
            response = requests.post(OPENROUTER_URL, json=payload, headers=headers)
            
            if response.status_code != 200:
                error_detail = f"Status: {response.status_code}, Response: {response.text}"
                print(f"OpenRouter API Error Details: {error_detail}")
                raise Exception(f"OpenRouter API error: {error_detail}")
            
            ai_response = response.json()
            return ai_response['choices'][0]['message']['content']
            
        except Exception as e:
            print(f"Error calling OpenRouter: {e}")
            return "I apologize, but I'm having trouble connecting right now. Please try again in a moment."

