#!/usr/bin/env python3
"""
Seed Sample Opportunities - Add sample data after reset
Usage: python seed_sample_opportunities.py
"""

import os
import sys
from datetime import datetime, timedelta

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.settings import db
from services.opportunity_service import OpportunityService
from services.algolia_service import AlgoliaService

def create_sample_opportunities():
    """Create sample opportunities for testing"""
    
    sample_opportunities = [
        {
            "title": "Software Engineer Internship",
            "organization": "TechCorp Inc.",
            "description": "Join our dynamic engineering team for a 12-week summer internship. Work on cutting-edge projects and gain real-world experience in software development.",
            "type": "internship",
            "location": "San Francisco, CA",
            "deadline": (datetime.now() + timedelta(days=30)).isoformat(),
            "url": "https://techcorp.com/careers",
            "tags": ["software", "internship", "python", "javascript"],
            "status": "published",
            "created_by_uid": "sample_user_1",
            "created_by_email": "admin@depanku.id",
            "created_at": datetime.now().isoformat(),
            "application_form": {
                "id": "sample_form_1",
                "title": "Software Engineer Application",
                "description": "Please complete this application form",
                "pages": [{
                    "id": "page_1",
                    "title": "Personal Information",
                    "questions": [
                        {
                            "id": "q1",
                            "title": "Why are you interested in this position?",
                            "type": "text",
                            "required": True,
                            "placeholder": "Tell us about your passion for software engineering..."
                        },
                        {
                            "id": "q2",
                            "title": "Programming Languages",
                            "type": "checkbox",
                            "required": True,
                            "options": ["Python", "JavaScript", "Java", "C++", "Go", "Rust"],
                            "placeholder": "Select all that apply"
                        }
                    ]
                }]
            }
        },
        {
            "title": "Marketing Coordinator",
            "organization": "StartupXYZ",
            "description": "We're looking for a creative marketing coordinator to help us grow our brand and reach new customers. Perfect for recent graduates!",
            "type": "full-time",
            "location": "Remote",
            "deadline": (datetime.now() + timedelta(days=45)).isoformat(),
            "url": "https://startupxyz.com/jobs",
            "tags": ["marketing", "remote", "entry-level", "startup"],
            "status": "published",
            "created_by_uid": "sample_user_2",
            "created_by_email": "admin@depanku.id",
            "created_at": datetime.now().isoformat()
        },
        {
            "title": "Data Science Fellowship",
            "organization": "AI Research Lab",
            "description": "Join our prestigious data science fellowship program. Work on machine learning projects that impact millions of users worldwide.",
            "type": "fellowship",
            "location": "New York, NY",
            "deadline": (datetime.now() + timedelta(days=60)).isoformat(),
            "url": "https://airesearchlab.org/fellowship",
            "tags": ["data-science", "machine-learning", "research", "fellowship"],
            "status": "published",
            "created_by_uid": "sample_user_3",
            "created_by_email": "admin@depanku.id",
            "created_at": datetime.now().isoformat()
        },
        {
            "title": "Product Design Intern",
            "organization": "DesignStudio",
            "description": "Work with our design team to create beautiful, user-friendly products. Great opportunity for design students!",
            "type": "internship",
            "location": "Los Angeles, CA",
            "deadline": (datetime.now() + timedelta(days=20)).isoformat(),
            "url": "https://designstudio.com/internships",
            "tags": ["design", "ui-ux", "internship", "creative"],
            "status": "published",
            "created_by_uid": "sample_user_4",
            "created_by_email": "admin@depanku.id",
            "created_at": datetime.now().isoformat()
        },
        {
            "title": "DevOps Engineer",
            "organization": "CloudTech Solutions",
            "description": "Help us scale our infrastructure and improve our deployment processes. Experience with AWS, Docker, and Kubernetes required.",
            "type": "full-time",
            "location": "Austin, TX",
            "deadline": (datetime.now() + timedelta(days=90)).isoformat(),
            "url": "https://cloudtech.com/careers",
            "tags": ["devops", "aws", "docker", "kubernetes", "infrastructure"],
            "status": "published",
            "created_by_uid": "sample_user_5",
            "created_by_email": "admin@depanku.id",
            "created_at": datetime.now().isoformat()
        }
    ]
    
    return sample_opportunities

def main():
    print("🌱 Seeding sample opportunities...")
    
    try:
        # Create sample opportunities
        sample_data = create_sample_opportunities()
        
        # Add to Firebase
        print("🔥 Adding to Firebase...")
        for i, opp_data in enumerate(sample_data, 1):
            try:
                doc_id, _ = OpportunityService.create_opportunity(opp_data)
                print(f"  ✅ Created: {opp_data['title']} (ID: {doc_id})")
            except Exception as e:
                print(f"  ❌ Failed to create {opp_data['title']}: {e}")
        
        # Sync to Algolia
        print("🔍 Syncing to Algolia...")
        try:
            algolia_service = AlgoliaService()
            algolia_service.sync_all_opportunities()
            print("✅ Synced to Algolia")
        except Exception as e:
            print(f"❌ Algolia sync error: {e}")
        
        print(f"✅ Created {len(sample_data)} sample opportunities!")
        
    except Exception as e:
        print(f"❌ Error seeding data: {e}")

if __name__ == "__main__":
    main()
