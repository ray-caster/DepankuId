"""Content moderation service using Google Gemini AI"""
from google import genai
from typing import Dict, List, Tuple
from config.settings import GEMINI_API_KEY
from utils.logging_config import logger
import asyncio
import concurrent.futures


class ModerationService:
    """Service for AI-powered content moderation"""
    
    @staticmethod
    def _run_gemini_safely(prompt: str) -> str:
        """Safely run Gemini client in sync context"""
        try:
            # Initialize Gemini client
            client = genai.Client(api_key=GEMINI_API_KEY)
            
            # Run in a separate thread to avoid event loop issues
            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(
                    client.models.generate_content,
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                response = future.result(timeout=30)  # 30 second timeout
                return response.text.strip()
                
        except Exception as e:
            logger.error(f"Gemini client error: {str(e)}")
            raise e
    
    @staticmethod
    def moderate_opportunity(opportunity_data: dict) -> Tuple[bool, List[str]]:
        """
        Moderate opportunity content using AI
        
        Args:
            opportunity_data: Dictionary containing opportunity fields
            
        Returns:
            Tuple of (is_approved, list of issues/suggestions)
        """
        if not GEMINI_API_KEY:
            logger.warning("Gemini API key not configured, skipping moderation")
            return True, []
        
        # Construct content to moderate
        content_to_check = f"""
<opportunity_submission>
    <title>{opportunity_data.get('title', '')}</title>
    <description>{opportunity_data.get('description', '')}</description>
    <organization>{opportunity_data.get('organization', '')}</organization>
    <benefits>{opportunity_data.get('benefits', '')}</benefits>
    <eligibility>{opportunity_data.get('eligibility', '')}</eligibility>
    <application_process>{opportunity_data.get('application_process', '')}</application_process>
</opportunity_submission>
"""
        
        system_prompt = """You are a content moderator for an educational opportunities platform. Your ONLY job is to check for profanity and vulgar language.

<moderation_criteria>
ONLY check for:
1. Profanity or vulgar language (swear words, inappropriate language)
</moderation_criteria>

<response_format>
If the content contains NO profanity, respond with:
APPROVED

If the content contains profanity, respond with:
REJECTED
1. [Specific profanity found with quote]

ONLY reject for profanity. Approve everything else.
</response_format>

Examples:
- Profanity: "Remove 'shit' from description"
- No profanity: APPROVED (even if content seems promotional, incomplete, or unclear)
"""
        
        try:
            # Create the full prompt
            full_prompt = f"{system_prompt}\n\nPlease review this opportunity submission:\n\n{content_to_check}"
            
            # Generate content using Gemini 2.5 Flash safely
            ai_response = ModerationService._run_gemini_safely(full_prompt)
            
            logger.info(f"Moderation response: {ai_response}")
            
            # Parse response
            if ai_response.startswith("APPROVED"):
                return True, []
            elif ai_response.startswith("REJECTED"):
                # Extract issues from numbered list
                lines = ai_response.split('\n')[1:]  # Skip "REJECTED" line
                issues = [line.strip() for line in lines if line.strip() and line.strip()[0].isdigit()]
                # Remove numbering
                issues = [issue.split('. ', 1)[1] if '. ' in issue else issue for issue in issues]
                return False, issues
            else:
                # Unexpected response format, approve by default
                logger.warning(f"Unexpected moderation response format: {ai_response}")
                return True, []
                
        except Exception as e:
            logger.error(f"Gemini moderation service error: {str(e)}")
            # On error, approve by default to not block legitimate submissions
            return True, []
    
    @staticmethod
    def get_moderation_summary(issues: List[str]) -> str:
        """Generate a user-friendly summary of moderation issues"""
        if not issues:
            return ""
        
        summary = "Your opportunity submission has the following issues:\n\n"
        for i, issue in enumerate(issues, 1):
            summary += f"{i}. {issue}\n"
        
        summary += "\nPlease revise and resubmit."
        return summary

