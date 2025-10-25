#!/usr/bin/env python3
"""
Simple CORS test without full app initialization
"""

def test_cors_headers():
    """Test CORS header logic"""
    from flask import Flask, request, jsonify
    
    app = Flask(__name__)
    
    ALLOWED_ORIGINS = [
        'http://localhost:7550',
        'http://localhost:6550', 
        'https://www.depanku.id',
        'https://depanku.id'
    ]
    
    @app.after_request
    def after_request(response):
        """Add CORS headers to all responses"""
        origin = request.headers.get('Origin')
        
        # Check if origin is in allowed list
        if origin in ALLOWED_ORIGINS:
            response.headers['Access-Control-Allow-Origin'] = origin
        else:
            # For development, allow localhost
            if origin and ('localhost' in origin or '127.0.0.1' in origin):
                response.headers['Access-Control-Allow-Origin'] = origin
        
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Accept, Origin'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Max-Age'] = '3600'
        
        return response
    
    @app.route('/test')
    def test():
        return jsonify({'message': 'test'})
    
    with app.test_client() as client:
        print("Testing CORS Headers")
        print("=" * 30)
        
        # Test with allowed origin
        response = client.get('/test', headers={'Origin': 'https://www.depanku.id'})
        print(f"Status: {response.status_code}")
        print("CORS Headers:")
        for header, value in response.headers:
            if 'access-control' in header.lower():
                print(f"  {header}: {value}")
        
        print("\n" + "=" * 30)
        
        # Test OPTIONS request
        response = client.options('/test', headers={'Origin': 'https://www.depanku.id'})
        print(f"OPTIONS Status: {response.status_code}")
        print("CORS Headers:")
        for header, value in response.headers:
            if 'access-control' in header.lower():
                print(f"  {header}: {value}")

if __name__ == "__main__":
    test_cors_headers()
