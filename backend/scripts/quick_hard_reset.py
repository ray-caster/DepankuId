#!/usr/bin/env python3
"""
QUICK HARD RESET - Delete All Opportunities and Applications
===========================================================

This script deletes all opportunities and applications from both
Firebase Firestore and Algolia search index.

Usage:
    python scripts/quick_hard_reset.py
    python scripts/quick_hard_reset.py --confirm
"""

import os
import sys
from datetime import datetime

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.settings import db
from utils.logging_config import logger

try:
    from services.algolia_service import AlgoliaService
    from services.opportunity_service import OpportunityService
    from services.application_service import ApplicationService
    ALGOLIA_AVAILABLE = True
except (ValueError, ImportError) as e:
    print(f"Warning: Some services not available: {e}")
    ALGOLIA_AVAILABLE = False

def delete_all_opportunities():
    """Delete all opportunities from Firestore"""
    print("🔥 Deleting all opportunities from Firestore...")
    
    try:
        # Use the existing service method
        deleted_count = OpportunityService.delete_all_opportunities()
        print(f"✅ Deleted {deleted_count} opportunities from Firestore")
        return True
    except Exception as e:
        print(f"❌ Error deleting opportunities: {e}")
        return False

def delete_all_applications():
    """Delete all applications from Firestore"""
    print("📋 Deleting all applications from Firestore...")
    
    try:
        # Get all applications
        applications_ref = db.collection('applications')
        docs = list(applications_ref.stream())
        
        if not docs:
            print("✅ No applications found to delete")
            return True
        
        # Delete in batches
        batch = db.batch()
        batch_count = 0
        max_batch_size = 500
        
        for doc in docs:
            batch.delete(doc.reference)
            batch_count += 1
            
            if batch_count >= max_batch_size:
                batch.commit()
                print(f"   Deleted batch of {batch_count} applications")
                batch = db.batch()
                batch_count = 0
        
        # Commit remaining
        if batch_count > 0:
            batch.commit()
            print(f"   Deleted final batch of {batch_count} applications")
        
        print(f"✅ Deleted {len(docs)} applications from Firestore")
        return True
        
    except Exception as e:
        print(f"❌ Error deleting applications: {e}")
        return False

def clear_algolia():
    """Clear Algolia index"""
    if not ALGOLIA_AVAILABLE:
        print("⚠️  Algolia service not available, skipping...")
        return True
    
    print("🔍 Clearing Algolia index...")
    
    try:
        algolia_service = AlgoliaService()
        success = algolia_service.clear_index()
        
        if success:
            print("✅ Algolia index cleared")
            return True
        else:
            print("❌ Failed to clear Algolia index")
            return False
            
    except Exception as e:
        print(f"❌ Error clearing Algolia: {e}")
        return False

def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Quick hard reset - delete all opportunities and applications")
    parser.add_argument("--confirm", action="store_true", help="Skip confirmation prompt")
    
    args = parser.parse_args()
    
    print("🚀 Quick Hard Reset - Opportunities & Applications")
    print("=" * 50)
    print("This will delete:")
    print("• All opportunities from Firestore")
    print("• All applications from Firestore") 
    print("• All data from Algolia index")
    print()
    
    if not args.confirm:
        response = input("Are you sure? (y/N): ")
        if response.lower() != 'y':
            print("❌ Aborted")
            return
    
    print(f"\n⏰ Starting at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    success = True
    
    # Delete opportunities
    if not delete_all_opportunities():
        success = False
    
    # Delete applications
    if not delete_all_applications():
        success = False
    
    # Clear Algolia
    if not clear_algolia():
        success = False
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 Quick hard reset completed successfully!")
        print("All opportunities and applications have been deleted")
    else:
        print("❌ Some operations failed - check the output above")
    
    print(f"⏰ Completed at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()
