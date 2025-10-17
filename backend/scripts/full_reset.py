#!/usr/bin/env python3
"""
Full Reset Script - Complete reset with sample data
Usage: python full_reset.py [--no-seed] [--confirm]
"""

import os
import sys
import argparse
from datetime import datetime

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.settings import db
from services.algolia_service import AlgoliaService
from services.opportunity_service import OpportunityService

def reset_opportunities():
    """Delete all opportunities from Firebase and Algolia"""
    print("🗑️  Resetting opportunities...")
    
    # Delete from Firebase
    print("🔥 Deleting from Firebase...")
    try:
        opportunities_ref = db.collection('opportunities')
        docs = list(opportunities_ref.stream())
        
        for doc in docs:
            doc.reference.delete()
            print(f"  ✅ Deleted: {doc.id}")
        
        print(f"🔥 Deleted {len(docs)} opportunities from Firebase")
    except Exception as e:
        print(f"❌ Firebase error: {e}")
        return False
    
    # Delete from Algolia
    print("🔍 Clearing Algolia index...")
    try:
        algolia_service = AlgoliaService()
        algolia_service.clear_index()
        print("✅ Algolia index cleared")
    except Exception as e:
        print(f"❌ Algolia error: {e}")
        return False
    
    return True

def seed_sample_data():
    """Add sample opportunities"""
    print("🌱 Adding sample opportunities...")
    
    sample_opportunities = [
        {
            "title": "Software Engineer Internship",
            "organization": "TechCorp Inc.",
            "description": "Join our dynamic engineering team for a 12-week summer internship. Work on cutting-edge projects and gain real-world experience in software development.",
            "type": "internship",
            "location": "San Francisco, CA",
            "deadline": "2024-12-31T23:59:59Z",
            "url": "https://techcorp.com/careers",
            "tags": ["software", "internship", "python", "javascript"],
            "status": "published",
            "created_by_uid": "sample_user_1",
            "created_by_email": "admin@depanku.id",
            "created_at": datetime.now().isoformat()
        },
        {
            "title": "Marketing Coordinator",
            "organization": "StartupXYZ",
            "description": "We're looking for a creative marketing coordinator to help us grow our brand and reach new customers. Perfect for recent graduates!",
            "type": "full-time",
            "location": "Remote",
            "deadline": "2024-12-31T23:59:59Z",
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
            "deadline": "2024-12-31T23:59:59Z",
            "url": "https://airesearchlab.org/fellowship",
            "tags": ["data-science", "machine-learning", "research", "fellowship"],
            "status": "published",
            "created_by_uid": "sample_user_3",
            "created_by_email": "admin@depanku.id",
            "created_at": datetime.now().isoformat()
        }
    ]
    
    try:
        # Add to Firebase
        for opp_data in sample_opportunities:
            try:
                doc_id, _ = OpportunityService.create_opportunity(opp_data)
                print(f"  ✅ Created: {opp_data['title']}")
            except Exception as e:
                print(f"  ❌ Failed to create {opp_data['title']}: {e}")
        
        # Sync to Algolia
        print("🔍 Syncing to Algolia...")
        algolia_service = AlgoliaService()
        algolia_service.sync_all(sample_opportunities)
        print("✅ Synced to Algolia")
        
        return True
        
    except Exception as e:
        print(f"❌ Error seeding data: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Full reset of opportunities database')
    parser.add_argument('--no-seed', action='store_true', help='Skip seeding sample data')
    parser.add_argument('--confirm', action='store_true', help='Skip confirmation prompt')
    
    args = parser.parse_args()
    
    print("🚀 Full Reset Script")
    print("=" * 50)
    
    if not args.confirm:
        print("⚠️  This will delete ALL opportunities from Firebase and Algolia!")
        if not args.no_seed:
            print("🌱 Then it will add sample opportunities.")
        print()
        
        response = input("Continue? (y/N): ").strip().lower()
        if response not in ['y', 'yes']:
            print("❌ Cancelled.")
            return
    
    # Reset opportunities
    if not reset_opportunities():
        print("❌ Reset failed!")
        return
    
    print("✅ Reset completed!")
    
    # Seed sample data
    if not args.no_seed:
        print()
        if seed_sample_data():
            print("✅ Sample data added!")
        else:
            print("❌ Failed to add sample data!")
    
    print("\n🎉 Full reset completed successfully!")

if __name__ == "__main__":
    main()
