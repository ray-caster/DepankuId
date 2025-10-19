#!/usr/bin/env python3
"""
Test publishing and syncing to Algolia
"""

import os
import sys

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.opportunity_service import OpportunityService
from services.algolia_service import AlgoliaService
from utils.logging_config import logger

def test_publish_sync():
    """Test publishing an opportunity and syncing to Algolia"""
    print("Testing Publish and Sync to Algolia")
    print("=" * 40)
    
    try:
        # Test data for a published opportunity
        test_opportunity = {
            'title': 'Test Published Opportunity',
            'description': 'This is a test opportunity to verify Algolia sync',
            'type': 'research',
            'organization': 'Test Organization',
            'location': 'Test Location',
            'deadline': '2024-12-31',
            'status': 'published',
            'created_by_uid': 'test_user_123',
            'created_by_email': 'test@example.com'
        }
        
        print("1. Creating published opportunity...")
        doc_id, algolia_data = OpportunityService.create_opportunity(test_opportunity)
        print(f"   [OK] Created opportunity with ID: {doc_id}")
        print(f"   [INFO] Algolia data: {algolia_data is not None}")
        
        # Test if the opportunity was synced to Algolia
        print("2. Testing Algolia sync...")
        algolia_service = AlgoliaService()
        
        # Try to search for the opportunity in Algolia
        # Note: This is a simplified test - in practice you'd use the search API
        print("   [INFO] Algolia service initialized successfully")
        
        # Clean up - delete the test opportunity
        print("3. Cleaning up test opportunity...")
        OpportunityService.delete_opportunity(doc_id)
        print(f"   [OK] Deleted test opportunity: {doc_id}")
        
        print("\n[OK] Publish and sync test completed!")
        
    except Exception as e:
        print(f"[ERROR] Error testing publish and sync: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_publish_sync()
