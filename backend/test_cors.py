#!/usr/bin/env python3
"""
Test script to verify CORS configuration
"""

import requests
import json

def test_cors_preflight():
    """Test CORS preflight request"""
    url = "http://localhost:7100/api/ai/chat"
    
    # Test preflight OPTIONS request
    headers = {
        'Origin': 'https://www.depanku.id',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
    }
    
    try:
        print("Testing CORS preflight request...")
        response = requests.options(url, headers=headers)
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers:")
        for key, value in response.headers.items():
            if 'access-control' in key.lower():
                print(f"  {key}: {value}")
        
        if response.status_code == 200:
            print("SUCCESS: Preflight request handled correctly")
            return True
        else:
            print("ERROR: Preflight request failed")
            return False
            
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def test_cors_post():
    """Test actual POST request"""
    url = "http://localhost:7100/api/ai/chat"
    
    headers = {
        'Origin': 'https://www.depanku.id',
        'Content-Type': 'application/json'
    }
    
    data = {
        'message': 'Hello, this is a test',
        'history': []
    }
    
    try:
        print("\nTesting CORS POST request...")
        response = requests.post(url, headers=headers, json=data)
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers:")
        for key, value in response.headers.items():
            if 'access-control' in key.lower():
                print(f"  {key}: {value}")
        
        if response.status_code == 200:
            print("SUCCESS: POST request handled correctly")
            return True
        else:
            print(f"ERROR: POST request failed - {response.text}")
            return False
            
    except Exception as e:
        print(f"ERROR: {e}")
        return False

if __name__ == "__main__":
    print("Testing CORS configuration for Depanku.id backend...")
    
    preflight_success = test_cors_preflight()
    post_success = test_cors_post()
    
    if preflight_success and post_success:
        print("\nSUCCESS: CORS configuration is working correctly!")
    else:
        print("\nERROR: CORS configuration needs fixing!")
        print("Make sure the backend is running on port 7100")
