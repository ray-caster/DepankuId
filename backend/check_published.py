#!/usr/bin/env python3
"""
Check published opportunities
"""

import os
import sys

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.opportunity_service import OpportunityService

def check_published():
    """Check published opportunities"""
    print("Checking Published Opportunities")
    print("=" * 40)
    
    try:
        opps = OpportunityService.get_all_opportunities()
        published = [o for o in opps if o.get('status') == 'published']
        
        print(f"Total opportunities: {len(opps)}")
        print(f"Published opportunities: {len(published)}")
        
        for opp in published:
            print(f"- {opp.get('title')} (ID: {opp.get('id')})")
            print(f"  Status: {opp.get('status')}")
            print(f"  Organization: {opp.get('organization')}")
            print(f"  Type: {opp.get('type')}")
            print()
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_published()


