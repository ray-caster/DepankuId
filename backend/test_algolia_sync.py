#!/usr/bin/env python3
"""
Test Algolia sync functionality
"""

import os
import sys

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.algolia_service import AlgoliaService
from services.opportunity_service import OpportunityService
from utils.logging_config import logger

def test_algolia_sync():
    """Test Algolia sync functionality"""
    print("Testing Algolia Sync")
    print("=" * 40)
    
    try:
        # Test Algolia service initialization
        print("1. Testing Algolia service initialization...")
        algolia_service = AlgoliaService()
        print("   [OK] Algolia service initialized successfully")
        
        # Test getting published opportunities
        print("2. Testing published opportunities retrieval...")
        opportunities = OpportunityService.get_all_opportunities()
        published_opportunities = [opp for opp in opportunities if opp.get('status') == 'published']
        print(f"   [OK] Found {len(published_opportunities)} published opportunities")
        
        if published_opportunities:
            # Test syncing to Algolia
            print("3. Testing sync to Algolia...")
            success = algolia_service.sync_all(published_opportunities)
            if success:
                print("   [OK] Successfully synced to Algolia")
            else:
                print("   [FAIL] Failed to sync to Algolia")
        else:
            print("   [WARN] No published opportunities to sync")
        
        # Test clearing index
        print("4. Testing clear index...")
        success = algolia_service.clear_index()
        if success:
            print("   [OK] Successfully cleared Algolia index")
        else:
            print("   [FAIL] Failed to clear Algolia index")
        
        print("\n[OK] Algolia sync test completed!")
        
    except Exception as e:
        print(f"[ERROR] Error testing Algolia sync: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_algolia_sync()
