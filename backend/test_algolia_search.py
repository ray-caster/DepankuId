#!/usr/bin/env python3
"""
Test Algolia search functionality
"""

import os
import sys
import asyncio

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.algolia_service import AlgoliaService

async def test_algolia_search():
    """Test Algolia search"""
    print("Testing Algolia Search")
    print("=" * 40)
    
    try:
        algolia_service = AlgoliaService()
        
        # Test search
        print("1. Testing search in Algolia...")
        
        # Use the search client directly
        search_client = algolia_service.client
        
        # Search for all opportunities using the correct API
        search_results = await search_client.search_single_index(
            index_name="opportunities",
            search_params={
                "query": "",
                "hitsPerPage": 10
            }
        )
        
        print(f"   [OK] Search completed")
        print(f"   [INFO] Results: {search_results}")
        
        # Check if we have hits
        if 'results' in search_results and len(search_results['results']) > 0:
            hits = search_results['results'][0].get('hits', [])
            print(f"   [OK] Found {len(hits)} opportunities in Algolia")
            
            for hit in hits:
                print(f"   - {hit.get('title', 'No title')} (ID: {hit.get('objectID', 'No ID')})")
        else:
            print("   [WARN] No results found in Algolia")
        
    except Exception as e:
        print(f"[ERROR] Error testing Algolia search: {e}")
        import traceback
        traceback.print_exc()

def main():
    """Main function"""
    asyncio.run(test_algolia_search())

if __name__ == "__main__":
    main()
