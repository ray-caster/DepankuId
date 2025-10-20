#!/usr/bin/env python3
"""
Test script to debug the my applications issue
"""

import os
import sys
from dotenv import load_dotenv

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.application_service import ApplicationService
from services.opportunity_service import OpportunityService
from services.user_service import UserService
from config.settings import db

def test_my_applications():
    """Test the my applications functionality"""
    print("Testing My Applications Functionality")
    print("=" * 50)
    
    # Get all applications from database
    print("1. Checking all applications in database:")
    applications_ref = db.collection('applications')
    docs = applications_ref.stream()
    
    all_applications = []
    for doc in docs:
        data = doc.to_dict()
        all_applications.append(data)
        print(f"   - Application ID: {doc.id}")
        print(f"     User ID: {data.get('user_id')}")
        print(f"     Opportunity ID: {data.get('opportunity_id')}")
        print(f"     Status: {data.get('status')}")
        print()
    
    if not all_applications:
        print("   No applications found in database!")
        return
    
    # Test with the user ID we found
    user_id = all_applications[0].get('user_id')
    print(f"2. Testing with user ID: {user_id}")
    
    # Test ApplicationService.get_user_applications
    print("\n3. Testing ApplicationService.get_user_applications:")
    try:
        applications = ApplicationService.get_user_applications(user_id)
        print(f"   Found {len(applications)} applications")
        for app in applications:
            print(f"   - {app.get('id')} -> {app.get('opportunity_id')}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test the full enrichment process
    print("\n4. Testing full enrichment process:")
    try:
        applications = ApplicationService.get_user_applications(user_id)
        enriched_applications = []
        
        for app in applications:
            print(f"   Processing: {app.get('id')}")
            opportunity_id = app.get('opportunity_id')
            print(f"   Opportunity ID: {opportunity_id}")
            
            opportunity = OpportunityService.get_opportunity_by_id(opportunity_id)
            if opportunity:
                print(f"   ✓ Opportunity found: {opportunity.get('title')}")
                app['opportunity_title'] = opportunity.get('title', 'Unknown')
                app['organization'] = opportunity.get('organization', 'Unknown')
            else:
                print(f"   ✗ Opportunity NOT found!")
                app['opportunity_title'] = 'Opportunity Not Found'
                app['organization'] = 'Unknown'
            
            enriched_applications.append(app)
        
        print(f"\n   Final result: {len(enriched_applications)} enriched applications")
        for app in enriched_applications:
            print(f"   - {app.get('opportunity_title')} by {app.get('organization')}")
            
    except Exception as e:
        print(f"   Error during enrichment: {e}")
    
    # Test user authentication
    print(f"\n5. Testing user authentication for user ID: {user_id}")
    try:
        # Check if user exists in users collection
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if user_doc.exists:
            user_data = user_doc.to_dict()
            print(f"   ✓ User exists in users collection")
            print(f"   Email: {user_data.get('email', 'No email')}")
        else:
            print(f"   ✗ User NOT found in users collection")
            
    except Exception as e:
        print(f"   Error checking user: {e}")

if __name__ == "__main__":
    test_my_applications()
