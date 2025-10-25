#!/usr/bin/env python3
"""
Test API endpoints for applications
"""

import os
import sys
import requests
import json
from dotenv import load_dotenv

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_api_endpoints():
    """Test the API endpoints"""
    load_dotenv()
    
    base_url = "http://localhost:5000"  # Adjust if your backend runs on different port
    
    print("Testing API Endpoints")
    print("=" * 40)
    
    # Test data
    test_user_id = "ED2o48seTBhpNzfb1DEXNjWjmce2"
    test_opportunity_id = "y6QD7UhWo36CRQJbFQQq"
    
    # You would need to get a real token for testing
    # For now, let's just test the service methods directly
    from services.application_service import ApplicationService
    
    print("Testing ApplicationService.get_user_applications...")
    try:
        user_apps = ApplicationService.get_user_applications(test_user_id)
        print(f"Found {len(user_apps)} user applications")
        for app in user_apps:
            print(f"  - {app.get('applicantEmail')} applied to {app.get('opportunityId')}")
    except Exception as e:
        print(f"Error: {e}")
    
    print("\nTesting ApplicationService.get_opportunity_applications...")
    try:
        opp_apps = ApplicationService.get_opportunity_applications(test_opportunity_id)
        print(f"Found {len(opp_apps)} applications for opportunity {test_opportunity_id}")
        for app in opp_apps:
            print(f"  - {app.get('applicantEmail')} applied")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api_endpoints()

