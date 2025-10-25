#!/usr/bin/env python3
"""
Test CORS configuration locally
"""

from app import app
import json

def test_cors_locally():
    """Test CORS configuration locally"""
    with app.test_client() as client:
        print("Testing CORS Configuration Locally")
        print("=" * 40)
        
        # Test OPTIONS request
        response = client.options('/api/test-cors', 
                                headers={'Origin': 'https://www.depanku.id'})
        
        print(f"OPTIONS Status: {response.status_code}")
        print("CORS Headers:")
        for header, value in response.headers:
            if 'access-control' in header.lower():
                print(f"  {header}: {value}")
        
        # Test GET request
        response = client.get('/api/test-cors', 
                            headers={'Origin': 'https://www.depanku.id'})
        
        print(f"\nGET Status: {response.status_code}")
        print("CORS Headers:")
        for header, value in response.headers:
            if 'access-control' in header.lower():
                print(f"  {header}: {value}")

if __name__ == "__main__":
    test_cors_locally()
