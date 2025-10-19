#!/usr/bin/env python3
"""
Test the quick reset functions without actually deleting data
"""

import os
import sys

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.settings import db

def test_opportunity_count():
    """Test counting opportunities without deleting"""
    print("Testing opportunity counting...")
    
    try:
        opportunities_ref = db.collection('opportunities')
        docs = list(opportunities_ref.stream())
        print(f"Found {len(docs)} opportunities")
        return len(docs)
    except Exception as e:
        print(f"Error counting opportunities: {e}")
        return 0

def test_application_count():
    """Test counting applications without deleting"""
    print("Testing application counting...")
    
    try:
        applications_ref = db.collection('applications')
        docs = list(applications_ref.stream())
        print(f"Found {len(docs)} applications")
        return len(docs)
    except Exception as e:
        print(f"Error counting applications: {e}")
        return 0

def main():
    """Test the quick reset functions"""
    print("Testing Quick Reset Functions")
    print("=" * 40)
    
    opp_count = test_opportunity_count()
    app_count = test_application_count()
    
    print(f"\nSummary:")
    print(f"Opportunities: {opp_count}")
    print(f"Applications: {app_count}")
    print(f"Total: {opp_count + app_count}")
    
    print(f"\nThe quick reset script would delete:")
    print(f"- {opp_count} opportunities")
    print(f"- {app_count} applications")
    print(f"- All Algolia data")
    
    print(f"\nTo run the actual reset:")
    print(f"python scripts/quick_hard_reset.py --confirm")

if __name__ == "__main__":
    main()
