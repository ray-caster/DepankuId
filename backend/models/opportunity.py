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
    category: List[str]
    organization: str
    tags: List[str]
    location: Optional[str] = None
    deadline: Optional[str] = None  # ISO format or "indefinite"
    url: Optional[str] = None
    social_media: Optional[dict] = None
    requirements: Optional[str] = None
    benefits: Optional[str] = None
    eligibility: Optional[str] = None
    cost: Optional[str] = None
    duration: Optional[str] = None
    application_process: Optional[str] = None
    contact_email: Optional[str] = None
    has_indefinite_deadline: bool = False
    
    def to_dict(self):
        data = asdict(self)
        # Clean up None values
        return {k: v for k, v in data.items() if v is not None}

# Opportunity templates
OPPORTUNITY_TEMPLATES = {
    "research": {
        "type": "research",
        "category": ["STEM", "Research"],
        "tags": ["research", "academic", "science"],
        "description": "A research opportunity for students interested in...",
        "requirements": "• Undergraduate or graduate student\n• Strong academic record\n• Interest in research",
        "benefits": "• Hands-on research experience\n• Mentorship from faculty\n• Potential publication opportunities",
    },
    "competition": {
        "type": "competition",
        "category": ["Competition"],
        "tags": ["competition", "challenge"],
        "description": "A competitive program where participants...",
        "requirements": "• Age requirements\n• Team size requirements\n• Submission format",
        "benefits": "• Prize money\n• Recognition\n• Networking opportunities",
    },
    "youth-program": {
        "type": "youth-program",
        "category": ["Youth Development", "Leadership"],
        "tags": ["youth", "leadership", "development"],
        "description": "A youth program designed to...",
        "requirements": "• Age range: 15-25\n• Leadership interest\n• Community engagement",
        "benefits": "• Leadership training\n• Certificate of completion\n• Networking with peers",
    },
    "community": {
        "type": "community",
        "category": ["Community", "Networking"],
        "tags": ["community", "networking", "collaboration"],
        "description": "A community for individuals interested in...",
        "requirements": "• Open to all\n• Interest in the field\n• Active participation",
        "benefits": "• Peer support\n• Knowledge sharing\n• Collaborative projects",
    }
}

# Preset categories by type
CATEGORY_PRESETS = {
    "research": [
        "STEM", "Research", "Science", "Engineering", "Technology", 
        "Mathematics", "Biology", "Chemistry", "Physics", "Computer Science"
    ],
    "competition": [
        "Competition", "Hackathon", "Challenge", "Contest", "Innovation",
        "Coding", "Design", "Business", "Case Study"
    ],
    "youth-program": [
        "Youth Development", "Leadership", "Skills Training", "Mentorship",
        "Volunteer", "Exchange Program", "Summer Program"
    ],
    "community": [
        "Community", "Networking", "Social", "Discussion", "Collaboration",
        "Support Group", "Interest Group"
    ]
}

# Tag presets
TAG_PRESETS = [
    "stem", "research", "science", "technology", "engineering", "math",
    "coding", "programming", "ai", "machine-learning", "data-science",
    "web-development", "mobile-development", "cybersecurity",
    "leadership", "entrepreneurship", "business", "innovation",
    "design", "art", "music", "writing", "literature",
    "environment", "sustainability", "climate", "social-impact",
    "health", "medicine", "psychology", "education",
    "international", "exchange", "scholarship", "fellowship",
    "hackathon", "competition", "challenge", "contest",
    "online", "hybrid", "in-person", "remote",
    "free", "paid", "funded", "stipend"
]

