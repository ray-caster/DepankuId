#!/usr/bin/env python3
"""
Hard Reset Script - Delete all opportunities from Firebase and Algolia
WARNING: This will permanently delete ALL opportunities from both databases!
"""

import os
import sys
import json
from datetime import datetime

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.settings import db
from services.algolia_service import AlgoliaService
from utils.logging_config import logger

def confirm_deletion():
    """Ask for confirmation before proceeding with deletion"""
    print("=" * 60)
    print("⚠️  WARNING: HARD RESET OPPORTUNITIES")
    print("=" * 60)
    print("This script will PERMANENTLY DELETE ALL opportunities from:")
    print("  - Firebase Firestore")
    print("  - Algolia Search Index")
    print()
    print("This action CANNOT be undone!")
    print()
    
    # First confirmation
    response1 = input("Type 'DELETE ALL' to confirm you want to proceed: ").strip()
    if response1 != "DELETE ALL":
        print("❌ Operation cancelled. Nothing was deleted.")
        return False
    
    # Second confirmation
    response2 = input("Are you absolutely sure? Type 'YES' to continue: ").strip()
    if response2 != "YES":
        print("❌ Operation cancelled. Nothing was deleted.")
        return False
    
    print("✅ Confirmed. Proceeding with deletion...")
    return True

def delete_firebase_opportunities():
    """Delete all opportunities from Firebase Firestore"""
    try:
        print("🔥 Deleting opportunities from Firebase...")
        
        # Get all opportunity documents
        opportunities_ref = db.collection('opportunities')
        docs = opportunities_ref.stream()
        
        deleted_count = 0
        for doc in docs:
            try:
                doc.reference.delete()
                deleted_count += 1
                print(f"  ✅ Deleted: {doc.id}")
            except Exception as e:
                print(f"  ❌ Failed to delete {doc.id}: {str(e)}")
        
        print(f"🔥 Firebase: Deleted {deleted_count} opportunities")
        return deleted_count
        
    except Exception as e:
        print(f"❌ Error deleting from Firebase: {str(e)}")
        return 0

def delete_algolia_opportunities():
    """Delete all opportunities from Algolia"""
    try:
        print("🔍 Deleting opportunities from Algolia...")
        
        # Initialize Algolia service
        algolia_service = AlgoliaService()
        
        # Clear the entire index
        algolia_service.clear_index()
        
        print("🔍 Algolia: Cleared entire opportunities index")
        return True
        
    except Exception as e:
        print(f"❌ Error deleting from Algolia: {str(e)}")
        return False

def delete_application_data():
    """Delete all application data (optional)"""
    try:
        print("📝 Deleting application data...")
        
        # Get all application documents
        applications_ref = db.collection('applications')
        docs = applications_ref.stream()
        
        deleted_count = 0
        for doc in docs:
            try:
                doc.reference.delete()
                deleted_count += 1
                print(f"  ✅ Deleted application: {doc.id}")
            except Exception as e:
                print(f"  ❌ Failed to delete application {doc.id}: {str(e)}")
        
        print(f"📝 Applications: Deleted {deleted_count} applications")
        return deleted_count
        
    except Exception as e:
        print(f"❌ Error deleting applications: {str(e)}")
        return 0

def main():
    """Main function to orchestrate the hard reset"""
    print("🚀 Starting Hard Reset Script")
    print(f"⏰ Timestamp: {datetime.now().isoformat()}")
    print()
    
    # Confirm deletion
    if not confirm_deletion():
        return
    
    print()
    print("🗑️  Starting deletion process...")
    print()
    
    # Track results
    results = {
        'firebase_opportunities': 0,
        'algolia_cleared': False,
        'applications': 0,
        'errors': []
    }
    
    try:
        # Delete from Firebase
        results['firebase_opportunities'] = delete_firebase_opportunities()
        print()
        
        # Delete from Algolia
        results['algolia_cleared'] = delete_algolia_opportunities()
        print()
        
        # Ask about application data
        delete_apps = input("🗑️  Also delete all application data? (y/N): ").strip().lower()
        if delete_apps in ['y', 'yes']:
            results['applications'] = delete_application_data()
            print()
        
        # Summary
        print("=" * 60)
        print("📊 DELETION SUMMARY")
        print("=" * 60)
        print(f"🔥 Firebase opportunities deleted: {results['firebase_opportunities']}")
        print(f"🔍 Algolia index cleared: {'✅ Yes' if results['algolia_cleared'] else '❌ No'}")
        print(f"📝 Applications deleted: {results['applications']}")
        print()
        
        if results['errors']:
            print("⚠️  Errors encountered:")
            for error in results['errors']:
                print(f"  - {error}")
            print()
        
        print("✅ Hard reset completed!")
        print("💡 You may want to restart your backend server to clear any cached data.")
        
    except Exception as e:
        print(f"❌ Fatal error during hard reset: {str(e)}")
        logger.error(f"Hard reset failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
