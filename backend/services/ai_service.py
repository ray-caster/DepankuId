"""AI service - Business logic for AI chat and discovery"""
import requests
import json
import re
from config.settings import OPENROUTER_API_KEY, OPENROUTER_URL
from services.opportunity_service import OpportunityService

class AIService:
    """Service for AI interactions"""
    
    @staticmethod
    def _clean_response(response_text):
        """Clean and validate AI response to prevent garbled output"""
        if not response_text or not isinstance(response_text, str):
            return "I'd love to learn more about your interests! What subjects do you enjoy most?"
        
        # Remove any garbled text patterns
        cleaned = response_text.strip()
        
        # Remove common garbled patterns
        garbled_patterns = [
            r'[^\w\s\?\!\.\,\-\'\"]+',  # Remove special characters except basic punctuation
            r'\d+\.\d+\.\d+',  # Remove version numbers
            r'[^\x00-\x7F]+',  # Remove non-ASCII characters
            r'\b\w{1,2}\b',  # Remove very short words that might be garbled
        ]
        
        for pattern in garbled_patterns:
            cleaned = re.sub(pattern, ' ', cleaned)
        
        # Clean up multiple spaces
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        
        # Fix common grammar issues
        cleaned = re.sub(r'\bThat\'?\s*', 'That\'s ', cleaned)  # Fix "That'" -> "That's"
        cleaned = re.sub(r'\bWhat\s*you\b', 'What do you', cleaned)  # Fix "What you" -> "What do you"
        cleaned = re.sub(r'\bbegin\s+sentence\?\s*', '', cleaned)  # Remove "begin sentence?"
        cleaned = re.sub(r'\bgreat\s+hear\b', 'great to hear', cleaned)  # Fix "great hear" -> "great to hear"
        cleaned = re.sub(r'\bscience\s+experiments\?\s*begin\s+sentence\?\s*', 'science experiments?', cleaned)  # Remove trailing garbage
        cleaned = re.sub(r'\bmath\s+problems\s+science\s+experiments\?\s*begin\s+sentence\?\s*', 'math problems or science experiments?', cleaned)  # Fix combined question
        
        # Socratic question improvements
        cleaned = re.sub(r'\bWhat\s+exactly\s+do\s+you\s+mean\b', 'What exactly do you mean', cleaned)
        cleaned = re.sub(r'\bWhat\s+assumptions\s+are\s+you\s+making\b', 'What assumptions are you making', cleaned)
        cleaned = re.sub(r'\bHow\s+would\s+others\s+see\s+this\b', 'How would others see this', cleaned)
        cleaned = re.sub(r'\bWhat\s+are\s+the\s+implications\b', 'What are the implications', cleaned)
        
        # Check if response seems garbled or incoherent
        if (len(cleaned) < 10 or 
            len(cleaned.split()) < 3 or 
            'begin sentence' in cleaned.lower() or
            cleaned.count('?') > 2 or
            any(word in cleaned.lower() for word in ['garbled', 'error', 'undefined'])):
            
            # Provide predefined Socratic responses as fallbacks
            fallback_responses = [
                "What exactly do you mean by that goal?",
                "What assumptions are you making about achieving it?",
                "What evidence supports your current approach?",
                "How would others see this situation?",
                "What are the implications of pursuing this path?"
            ]
            
            # Use a simple hash to pick a consistent fallback
            import hashlib
            hash_val = int(hashlib.md5(response_text.encode()).hexdigest()[:8], 16)
            return fallback_responses[hash_val % len(fallback_responses)]
        
        # Ensure it ends with a question mark or period
        if not cleaned.endswith(('?', '.', '!')):
            cleaned += '?'
        
        return cleaned
    
    @staticmethod
    def chat(user_message, conversation_history=None):
        """Process AI chat request"""
        if conversation_history is None:
            conversation_history = []
        
        # System prompt for Socratic questioning
        system_prompt = """You are a helpful AI assistant for Depanku.id, a platform that helps students find opportunities like research programs, competitions, and youth programs.

CRITICAL INSTRUCTIONS:
- Always respond with clear, coherent sentences
- Ask ONE question at a time
- Keep responses under 50 words
- Be encouraging and friendly
- Focus on understanding the user's interests and goals

RESPONSE FORMAT:
- Start with a brief acknowledgment of their answer
- Ask ONE specific follow-up question
- End with encouragement

EXAMPLE RESPONSES:
- "That's interesting! What subjects do you enjoy most in school?"
- "Great! Are you more interested in individual projects or team activities?"
- "I see! What kind of problems do you like solving?"

NEVER:
- Ask multiple questions at once
- Give long explanations
- Use confusing language
- Repeat the same question"""

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
            "temperature": 0.4,
            "max_tokens": 150,
            "top_p": 0.8,
            "frequency_penalty": 0.2,
            "presence_penalty": 0.2
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
            
            # Clean the response to prevent garbled output
            cleaned_message = AIService._clean_response(assistant_message)

            return cleaned_message
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
        """Start a new AI discovery session with Socratic questioning"""
        if user_profile is None:
            user_profile = {
                'interests': [],
                'skills': [],
                'goals': [],
                'preferredTypes': [],
                'confidence': 0
            }
        
        # Always start with the same question
        return "What are you currently pursuing?"

    @staticmethod
    def continue_discovery(user_message, conversation_history, user_profile):
        """Continue the discovery conversation with Socratic questioning"""
        system_prompt = """You are Socrates, the ancient Greek philosopher, helping students discover opportunities through insightful questioning.

YOUR ROLE:
- Embody Socratic questioning methodology
- Ask ONE penetrating question that makes the student think deeper
- Help them clarify their goals and identify gaps
- Guide them toward specific opportunities that fulfill their aspirations

SOCRATIC QUESTIONING FRAMEWORK:
1. CLARIFICATION: "What exactly do you mean by...?"
2. ASSUMPTION PROBING: "What assumptions are you making?"
3. EVIDENCE REASONING: "What evidence supports this?"
4. PERSPECTIVE VIEWPOINTS: "How would others see this?"
5. IMPLICATIONS CONSEQUENCES: "What are the implications?"
6. META-COGNITION: "Why is this question important?"

GOAL-FOCUSED EXAMPLES:
- If they say "I want to get into Stanford" → "What extracurriculars do you currently have that align with Stanford's values?"
- If they say "I want to be a doctor" → "What specific medical experiences have you had so far?"
- If they say "I want to start a business" → "What problem have you identified that you're passionate about solving?"
- If they say "I want to do research" → "What research questions keep you up at night?"

CHAIN OF THOUGHT PROCESSING:
1. Analyze their response for goals, current status, and gaps
2. Identify the most important question to ask next
3. Frame it as a Socratic question that promotes deeper thinking
4. Focus on actionable next steps toward their goal

RESPONSE REQUIREMENTS:
- Ask exactly ONE question
- Keep it under 30 words
- Make it thought-provoking and specific
- Connect to their stated goal
- Encourage self-reflection

NEVER:
- Ask multiple questions
- Give advice or answers
- Use complex language
- Ask about personal details unrelated to goals

Based on their response, ask one Socratic question that helps them think deeper about achieving their goal."""

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
    def analyze_goal_and_suggest_opportunities(user_message, conversation_history):
        """Analyze user's goal and suggest specific opportunities using Socratic reasoning"""
        system_prompt = """You are Socrates helping students achieve their goals through strategic questioning and opportunity identification.

ANALYSIS FRAMEWORK:
1. Extract the user's stated goal
2. Identify current gaps in their profile
3. Suggest specific opportunities that address those gaps
4. Frame suggestions as Socratic questions

GOAL-OPPORTUNITY MAPPING:
- Stanford/IVY League → Research programs, leadership competitions, community service
- Medical School → Medical research, healthcare volunteering, science competitions
- Business/Entrepreneurship → Business competitions, startup programs, leadership roles
- Research Career → Research programs, academic competitions, publication opportunities
- Tech Industry → Coding competitions, tech internships, hackathons

RESPONSE FORMAT:
- Ask ONE Socratic question about their current approach
- Suggest ONE specific opportunity type
- Frame it as a question that makes them think

EXAMPLES:
- "What specific research experience do you have that demonstrates your academic potential?"
- "How have you shown leadership in your community that aligns with Stanford's values?"
- "What medical experiences have you had that confirm your passion for healthcare?"

Based on their goal, ask one strategic question and suggest one opportunity type."""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"User's latest response: {user_message}\nConversation history: {conversation_history}"}
        ]
        
        return AIService._call_openrouter(messages)

    @staticmethod
    def generate_opportunity_question(opportunity):
        """Generate a Socratic question about a specific opportunity"""
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
            "temperature": 0.4,
            "max_tokens": 150,
            "top_p": 0.8,
            "frequency_penalty": 0.2,
            "presence_penalty": 0.2
        }

        try:
            response = requests.post(OPENROUTER_URL, json=payload, headers=headers)
            
            if response.status_code != 200:
                error_detail = f"Status: {response.status_code}, Response: {response.text}"
                print(f"OpenRouter API Error Details: {error_detail}")
                raise Exception(f"OpenRouter API error: {error_detail}")
            
            ai_response = response.json()
            assistant_message = ai_response['choices'][0]['message']['content']
            
            # Clean the response to prevent garbled output
            cleaned_message = AIService._clean_response(assistant_message)
            
            return cleaned_message
            
        except Exception as e:
            print(f"Error calling OpenRouter: {e}")
            return "I apologize, but I'm having trouble connecting right now. Please try again in a moment."

