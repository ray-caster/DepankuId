"""Opportunity data models and schemas"""
from typing import List, Optional
from datetime import datetime
from dataclasses import dataclass, asdict

@dataclass
class SocialMediaLinks:
    """Social media links for an opportunity"""
    website: Optional[str] = None
    twitter: Optional[str] = None
    instagram: Optional[str] = None
    facebook: Optional[str] = None
    linkedin: Optional[str] = None
    youtube: Optional[str] = None
    discord: Optional[str] = None
    telegram: Optional[str] = None
    
    def to_dict(self):
        return {k: v for k, v in asdict(self).items() if v is not None}

@dataclass
class Opportunity:
    """Opportunity model"""
    title: str
    description: str
    type: str  # 'research', 'youth-program', 'community', 'competition'
    organization: str
    tags: List[str]
    created_by_uid: Optional[str] = None  # Firebase user ID
    created_by_email: Optional[str] = None  # User email for reference
    location: Optional[str] = None
    deadline: Optional[str] = None  # ISO format or "indefinite"
    url: Optional[str] = None
    social_media: Optional[dict] = None
    benefits: Optional[str] = None
    eligibility: Optional[str] = None
    cost: Optional[str] = None
    duration: Optional[str] = None
    application_process: Optional[str] = None
    contact_email: Optional[str] = None
    has_indefinite_deadline: bool = False
    status: str = "published"  # 'draft', 'published', 'rejected'
    moderation_notes: Optional[str] = None
    application_form: Optional[dict] = None  # Custom application form data
    
    def to_dict(self):
        data = asdict(self)
        # Clean up None values
        return {k: v for k, v in data.items() if v is not None}

# Opportunity templates
OPPORTUNITY_TEMPLATES = {
    "research": {
        "type": "research",
        "tags": ["research", "academic", "science", "stem"],
        "description": "A research opportunity for students interested in...",
        "benefits": "• Hands-on research experience\n• Mentorship from faculty\n• Potential publication opportunities",
    },
    "competition": {
        "type": "competition",
        "tags": ["competition", "challenge", "contest"],
        "description": "A competitive program where participants...",
        "benefits": "• Prize money\n• Recognition\n• Networking opportunities",
    },
    "youth-program": {
        "type": "youth-program",
        "tags": ["youth", "leadership", "development", "mentorship"],
        "description": "A youth program designed to...",
        "benefits": "• Leadership training\n• Certificate of completion\n• Networking with peers",
    },
    "community": {
        "type": "community",
        "tags": ["community", "networking", "collaboration", "social"],
        "description": "A community for individuals interested in...",
        "benefits": "• Peer support\n• Knowledge sharing\n• Collaborative projects",
    }
}

# Tag presets - now includes all previous categories as tags
TAG_PRESETS = [
    # STEM & Research
    "stem", "research", "science", "technology", "engineering", "math",
    "biology", "chemistry", "physics", "computer-science",
    
    # Tech & Programming
    "coding", "programming", "ai", "machine-learning", "data-science",
    "web-development", "mobile-development", "cybersecurity",
    
    # Competition & Challenges
    "competition", "hackathon", "challenge", "contest", "innovation",
    "case-study",
    
    # Leadership & Professional
    "leadership", "entrepreneurship", "business", "skills-training",
    "mentorship", "professional-development",
    
    # Creative
    "design", "art", "music", "writing", "literature",
    
    # Social Impact
    "environment", "sustainability", "climate", "social-impact",
    "community", "volunteer",
    
    # Health & Education
    "health", "medicine", "psychology", "education",
    
    # Programs
    "youth", "exchange", "scholarship", "fellowship", "summer-program",
    
    # Format
    "online", "hybrid", "in-person", "remote",
    
    # Cost
    "free", "paid", "funded", "stipend",
    
    # Networking & Collaboration
    "networking", "collaboration", "discussion"
]

