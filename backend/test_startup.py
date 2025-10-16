#!/usr/bin/env python3
"""
Test script to verify the server can start without Algolia configuration
"""

import os
import sys

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test that all modules can be imported without errors"""
    try:
        print("Testing imports...")
        
        # Test settings import
        from config.settings import db, ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY, ALGOLIA_INDEX_NAME
        print("✓ Settings imported successfully")
        
        # Test opportunity service import
        from services.opportunity_service import OpportunityService
        print("✓ OpportunityService imported successfully")
        
        # Test publish service import
        from services.opportunity_publish_service import OpportunityPublishService
        print("✓ OpportunityPublishService imported successfully")
        
        # Test routes import
        from routes.opportunity_routes import opportunity_bp
        print("✓ Opportunity routes imported successfully")
        
        from routes.publish_routes import publish_bp
        print("✓ Publish routes imported successfully")
        
        # Test app import
        from app import app
        print("✓ Flask app imported successfully")
        
        print("\n✅ All imports successful! Server should start without errors.")
        return True
        
    except Exception as e:
        print(f"\n❌ Import error: {e}")
        return False

if __name__ == "__main__":
    success = test_imports()
    sys.exit(0 if success else 1)
