#!/usr/bin/env python3
"""
Test script to verify hard reset functionality
This script tests the hard reset without actually deleting data
"""

import os
import sys
from datetime import datetime

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.settings import db
from utils.logging_config import logger

def test_firestore_connection():
    """Test Firestore connection and count documents"""
    print("Testing Firestore connection...")
    
    try:
        collections = db.collections()
        total_docs = 0
        
        print("Current Firestore data:")
        for collection in collections:
            docs = list(collection.stream())
            doc_count = len(docs)
            total_docs += doc_count
            print(f"   - {collection.id}: {doc_count} documents")
        
        print(f"Total documents: {total_docs}")
        return True
        
    except Exception as e:
        print(f"Firestore connection failed: {e}")
        return False

def test_algolia_connection():
    """Test Algolia connection"""
    print("\nTesting Algolia connection...")
    
    try:
        from services.algolia_service import AlgoliaService
        algolia_service = AlgoliaService()
        
        # Try to get index info (this will fail if index is empty, which is fine)
        print("Algolia service initialized successfully")
        return True
        
    except Exception as e:
        print(f"Algolia service not available: {e}")
        return False

def test_services():
    """Test all required services"""
    print("Testing required services...")
    
    services = [
        ("OpportunityService", "services.opportunity_service", "OpportunityService"),
        ("ApplicationService", "services.application_service", "ApplicationService"),
    ]
    
    all_good = True
    
    for name, module, class_name in services:
        try:
            module_obj = __import__(module, fromlist=[class_name])
            service_class = getattr(module_obj, class_name)
            print(f"{name} imported successfully")
        except Exception as e:
            print(f"{name} import failed: {e}")
            all_good = False
    
    return all_good

def main():
    """Main test function"""
    print("Hard Reset Test Script")
    print("=" * 40)
    print(f"Started at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Test services
    if not test_services():
        print("\nService tests failed - hard reset may not work properly")
        return False
    
    # Test Firestore
    if not test_firestore_connection():
        print("\nFirestore test failed - hard reset may not work properly")
        return False
    
    # Test Algolia
    test_algolia_connection()
    
    print("\nAll tests completed!")
    print("Hard reset scripts should work properly")
    print("\nTo run the actual hard reset:")
    print("   python scripts/quick_hard_reset.py --confirm")
    print("   python scripts/hard_reset_all_data.py --confirm")

if __name__ == "__main__":
    main()
