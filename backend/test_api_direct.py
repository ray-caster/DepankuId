#!/usr/bin/env python3
"""
Test API endpoints directly
"""

import os
import sys
import requests
import json
from dotenv import load_dotenv

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_api_direct():
    """Test the API endpoints directly"""
    load_dotenv()
    
    base_url = "http://localhost:5000"
    
    print("Testing API Endpoints Directly")
    print("=" * 40)
    
    # Test the profile applications endpoint
    test_url = f"{base_url}/api/profile/applications"
    print(f"Testing: {test_url}")
    
    try:
        # This would need a real token, but let's see what error we get
        response = requests.get(test_url, headers={
            'Authorization': 'Bearer test-token'
        })
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test the opportunity applications endpoint
    test_url = f"{base_url}/api/opportunities/y6QD7UhWo36CRQJbFQQq/applications"
    print(f"\nTesting: {test_url}")
    
    try:
        response = requests.get(test_url, headers={
            'Authorization': 'Bearer test-token'
        })
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api_direct()
