#!/usr/bin/env python3
"""
Test script to verify applications API endpoint
"""

import requests
import json

def test_applications_api():
    """Test the applications API endpoint"""
    try:
        # Test the API endpoint
        response = requests.get(
            "http://localhost:8000/api/profile/applications",
            headers={
                "Authorization": "Bearer test-token",
                "Content-Type": "application/json"
            }
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and data.get('data'):
                print(f"\nFound {len(data['data'])} applications")
                for app in data['data']:
                    print(f"Application ID: {app.get('id')}")
                    print(f"Opportunity Title: {app.get('opportunity_title', 'N/A')}")
                    print(f"Status: {app.get('status')}")
                    print(f"Submitted At: {app.get('submitted_at')}")
                    print("---")
            else:
                print("No applications found or API returned error")
        else:
            print(f"API Error: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("Could not connect to server. Make sure the backend is running.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_applications_api()
