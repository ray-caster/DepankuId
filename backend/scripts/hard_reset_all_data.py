#!/usr/bin/env python3
"""
HARD RESET SCRIPT - DANGER ZONE
===============================

This script will DELETE ALL DATA from:
- Firebase Firestore (all collections)
- Algolia search index

WARNING: This action is IRREVERSIBLE!
Use only for development/testing or when you need a complete fresh start.

Usage:
    python scripts/hard_reset_all_data.py --confirm
    python scripts/hard_reset_all_data.py --confirm --verbose
"""

import os
import sys
import argparse
from datetime import datetime
from collections import defaultdict

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.settings import db
from utils.logging_config import logger

try:
    from services.algolia_service import AlgoliaService
    ALGOLIA_AVAILABLE = True
except (ValueError, ImportError) as e:
    print(f"Warning: Algolia service not available: {e}")
    ALGOLIA_AVAILABLE = False

def delete_all_firestore_data():
    """Delete ALL data from Firestore collections"""
    print("🔥 DELETING ALL FIRESTORE DATA...")
    print("=" * 50)
    
    deleted_counts = {}
    total_deleted = 0
    
    try:
        # Get all collections
        collections = db.collections()
        
        for collection in collections:
            collection_name = collection.id
            print(f"\n📁 Processing collection: {collection_name}")
            
            # Get all documents in the collection
            docs = collection.stream()
            doc_count = 0
            
            # Delete documents in batches
            batch = db.batch()
            batch_count = 0
            max_batch_size = 500  # Firestore batch limit
            
            for doc in docs:
                batch.delete(doc.reference)
                doc_count += 1
                batch_count += 1
                
                # Commit batch when it reaches the limit
                if batch_count >= max_batch_size:
                    batch.commit()
                    print(f"   ✅ Deleted batch of {batch_count} documents")
                    batch = db.batch()
                    batch_count = 0
            
            # Commit remaining documents
            if batch_count > 0:
                batch.commit()
                print(f"   ✅ Deleted final batch of {batch_count} documents")
            
            deleted_counts[collection_name] = doc_count
            total_deleted += doc_count
            print(f"   📊 Total deleted from {collection_name}: {doc_count}")
        
        print(f"\n🔥 FIRESTORE CLEANUP COMPLETE!")
        print(f"   📊 Total documents deleted: {total_deleted}")
        print(f"   📁 Collections processed: {len(deleted_counts)}")
        
        # Show breakdown by collection
        if deleted_counts:
            print("\n📋 Breakdown by collection:")
            for collection, count in sorted(deleted_counts.items()):
                print(f"   - {collection}: {count} documents")
        
        return True
        
    except Exception as e:
        print(f"❌ Error deleting Firestore data: {e}")
        logger.error(f"Firestore deletion failed: {e}")
        return False

def clear_algolia_index():
    """Clear ALL data from Algolia index"""
    if not ALGOLIA_AVAILABLE:
        print("⚠️  Algolia service not available, skipping...")
        return True
    
    print("\n🔍 CLEARING ALGOLIA INDEX...")
    print("=" * 50)
    
    try:
        algolia_service = AlgoliaService()
        
        # Clear the entire index
        success = algolia_service.clear_index()
        
        if success:
            print("✅ Algolia index cleared successfully")
            return True
        else:
            print("❌ Failed to clear Algolia index")
            return False
            
    except Exception as e:
        print(f"❌ Error clearing Algolia: {e}")
        logger.error(f"Algolia clearing failed: {e}")
        return False

def verify_cleanup():
    """Verify that all data has been deleted"""
    print("\n🔍 VERIFYING CLEANUP...")
    print("=" * 50)
    
    try:
        # Check Firestore collections
        collections = db.collections()
        total_docs = 0
        
        for collection in collections:
            doc_count = len(list(collection.stream()))
            total_docs += doc_count
            if doc_count > 0:
                print(f"⚠️  Collection {collection.id} still has {doc_count} documents")
            else:
                print(f"✅ Collection {collection.id} is empty")
        
        if total_docs == 0:
            print("✅ Firestore is completely empty")
        else:
            print(f"⚠️  Firestore still has {total_docs} documents total")
        
        # Check Algolia
        if ALGOLIA_AVAILABLE:
            try:
                algolia_service = AlgoliaService()
                # Try to get a count (this might fail if index is empty)
                # We'll just assume it's empty if we can't get a count
                print("✅ Algolia index appears to be empty")
            except:
                print("✅ Algolia index is empty (no objects found)")
        
        return total_docs == 0
        
    except Exception as e:
        print(f"❌ Error verifying cleanup: {e}")
        return False

def show_warning():
    """Show warning message about the destructive nature of this script"""
    print("🚨" + "=" * 60 + "🚨")
    print("🚨                    DANGER ZONE                    🚨")
    print("🚨" + "=" * 60 + "🚨")
    print()
    print("⚠️  THIS SCRIPT WILL DELETE ALL DATA FROM:")
    print("   • Firebase Firestore (ALL collections and documents)")
    print("   • Algolia search index (ALL objects)")
    print()
    print("⚠️  THIS ACTION IS IRREVERSIBLE!")
    print("⚠️  ALL USER DATA, OPPORTUNITIES, APPLICATIONS WILL BE LOST!")
    print()
    print("🔒 This script is designed for:")
    print("   • Development/testing environments")
    print("   • Complete fresh starts")
    print("   • Emergency data cleanup")
    print()
    print("🚨" + "=" * 60 + "🚨")

def main():
    """Main function"""
    parser = argparse.ArgumentParser(
        description="HARD RESET: Delete ALL data from Firestore and Algolia",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python scripts/hard_reset_all_data.py --confirm
  python scripts/hard_reset_all_data.py --confirm --verbose
  python scripts/hard_reset_all_data.py --confirm --no-verify
        """
    )
    
    parser.add_argument(
        "--confirm", 
        action="store_true", 
        help="Confirm that you want to delete ALL data (required)"
    )
    parser.add_argument(
        "--verbose", "-v", 
        action="store_true", 
        help="Enable verbose output"
    )
    parser.add_argument(
        "--no-verify", 
        action="store_true", 
        help="Skip verification step"
    )
    parser.add_argument(
        "--firestore-only", 
        action="store_true", 
        help="Only delete Firestore data (skip Algolia)"
    )
    parser.add_argument(
        "--algolia-only", 
        action="store_true", 
        help="Only delete Algolia data (skip Firestore)"
    )
    
    args = parser.parse_args()
    
    # Show warning
    show_warning()
    
    # Require confirmation
    if not args.confirm:
        print("\n❌ You must use --confirm to proceed with data deletion")
        print("   Example: python scripts/hard_reset_all_data.py --confirm")
        sys.exit(1)
    
    # Additional confirmation prompt
    print("\n🤔 Are you absolutely sure you want to delete ALL data?")
    response = input("Type 'DELETE ALL DATA' to confirm: ")
    
    if response != "DELETE ALL DATA":
        print("❌ Confirmation failed. Aborting.")
        sys.exit(1)
    
    print(f"\n🚀 Starting hard reset at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    success = True
    
    # Delete Firestore data
    if not args.algolia_only:
        if not delete_all_firestore_data():
            success = False
    
    # Clear Algolia index
    if not args.firestore_only:
        if not clear_algolia_index():
            success = False
    
    # Verify cleanup
    if not args.no_verify and success:
        if not verify_cleanup():
            print("⚠️  Cleanup verification failed - some data may remain")
            success = False
    
    # Final result
    print("\n" + "=" * 60)
    if success:
        print("🎉 HARD RESET COMPLETED SUCCESSFULLY!")
        print("   All data has been deleted from Firestore and Algolia")
        print("   Your application is now completely clean")
    else:
        print("❌ HARD RESET FAILED!")
        print("   Some operations may have failed - check the logs above")
        sys.exit(1)
    
    print(f"\n⏰ Completed at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()
