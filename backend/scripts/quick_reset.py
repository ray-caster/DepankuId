#!/usr/bin/env python3
"""
Quick Reset Script - Simple hard reset for opportunities
Usage: python quick_reset.py
"""

import os
import sys

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.settings import db
from services.algolia_service import AlgoliaService

def main():
    print("🚀 Quick Reset - Deleting all opportunities...")
    
    # Delete from Firebase
    print("🔥 Deleting from Firebase...")
    try:
        opportunities_ref = db.collection('opportunities')
        docs = list(opportunities_ref.stream())
        
        for doc in docs:
            doc.reference.delete()
            print(f"  ✅ Deleted: {doc.id}")
        
        print(f"🔥 Deleted {len(docs)} opportunities from Firebase")
    except Exception as e:
        print(f"❌ Firebase error: {e}")
    
    # Delete from Algolia
    print("🔍 Clearing Algolia index...")
    try:
        algolia_service = AlgoliaService()
        algolia_service.clear_index()
        print("✅ Algolia index cleared")
    except Exception as e:
        print(f"❌ Algolia error: {e}")
    
    print("✅ Reset complete!")

if __name__ == "__main__":
    main()
