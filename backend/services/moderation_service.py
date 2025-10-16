"""Content moderation service using Google Gemini AI"""
from google import genai
from typing import Dict, List, Tuple
from config.settings import GEMINI_API_KEY
from utils.logging_config import logger


class ModerationService:
    """Service for AI-powered content moderation"""
    
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
    <requirements>{opportunity_data.get('requirements', '')}</requirements>
    <benefits>{opportunity_data.get('benefits', '')}</benefits>
    <eligibility>{opportunity_data.get('eligibility', '')}</eligibility>
    <application_process>{opportunity_data.get('application_process', '')}</application_process>
</opportunity_submission>
"""
        
        system_prompt = """You are a content moderator for an educational opportunities platform. Your job is to review opportunity submissions and identify any issues.

<moderation_criteria>
1. Profanity or vulgar language
2. Discriminatory content (racism, sexism, etc.)
3. Spam or misleading information
4. Inappropriate or offensive content
5. Scams or fraudulent opportunities
6. Overly promotional/sales language
7. Irrelevant content
</moderation_criteria>

<response_format>
If the content is APPROPRIATE, respond with:
APPROVED

If the content has ISSUES, respond with a numbered list of specific problems:
REJECTED
1. [Brief specific issue with quote if applicable]
2. [Another issue]

Be strict but fair. Educational content should be professional and appropriate for students.
</response_format>

Examples:
- Profanity: "Remove 'shit' from description"
- Discriminatory: "Remove discriminatory language: 'only for males'"
- Spam: "Appears to be spam - no clear educational value"
- Misleading: "Title is misleading - does not match description"
"""
        
        try:
            # Initialize Gemini client
            client = genai.Client(api_key=GEMINI_API_KEY)
            
            # Create the full prompt
            full_prompt = f"{system_prompt}\n\nPlease review this opportunity submission:\n\n{content_to_check}"
            
            # Generate content using Gemini 2.5 Flash
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=full_prompt,
                generation_config={
                    "temperature": 0.3,
                    "max_output_tokens": 500
                }
            )
            
            ai_response = response.text.strip()
            
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

