#!/usr/bin/env python3
"""
Test CORS configuration for the API
"""

import requests
import json

def test_cors_configuration():
    """Test CORS configuration"""
    base_url = "https://api.depanku.id"
    
    # Test endpoints
    endpoints = [
        "/api/test-cors",
        "/api/profile",
        "/api/bookmarks",
        "/api/opportunities/my-opportunities"
    ]
    
    headers = {
        "Origin": "https://www.depanku.id",
        "Content-Type": "application/json"
    }
    
    print("Testing CORS Configuration")
    print("=" * 40)
    
    for endpoint in endpoints:
        print(f"\nTesting {endpoint}:")
        
        # Test OPTIONS request (preflight)
        try:
            response = requests.options(f"{base_url}{endpoint}", headers=headers, timeout=10)
            print(f"  OPTIONS: {response.status_code}")
            print(f"  CORS Headers:")
            for header in response.headers:
                if header.lower().startswith('access-control'):
                    print(f"    {header}: {response.headers[header]}")
            
            if response.status_code == 200:
                print("  [OK] OPTIONS request successful")
            else:
                print(f"  [FAIL] OPTIONS request failed: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"  [ERROR] OPTIONS request error: {e}")
        
        # Test GET request
        try:
            response = requests.get(f"{base_url}{endpoint}", headers=headers, timeout=10)
            print(f"  GET: {response.status_code}")
            
            if response.status_code in [200, 401, 403]:  # 401/403 are expected for auth endpoints
                print("  [OK] GET request successful")
            else:
                print(f"  [FAIL] GET request failed: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"  [ERROR] GET request error: {e}")

if __name__ == "__main__":
    test_cors_configuration()
