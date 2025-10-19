#!/usr/bin/env python3
"""
Cleanup script to remove duplicate drafts for users.
This script helps clean up the issue where multiple drafts were created due to auto-save.
"""

import os
import sys
from collections import defaultdict
from datetime import datetime, timedelta

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.settings import db
from utils.logging_config import logger

def find_duplicate_drafts():
    """Find duplicate drafts for each user"""
    logger.info("Starting duplicate draft cleanup...")
    
    # Get all draft opportunities
    opportunities_ref = db.collection('opportunities')
    docs = opportunities_ref.where('status', '==', 'draft').stream()
    
    # Group by user and title to find duplicates
    user_drafts = defaultdict(list)
    
    for doc in docs:
        data = doc.to_dict()
        data['id'] = doc.id
        user_id = data.get('created_by_uid')
        title = data.get('title', '').strip()
        
        if user_id and title:
            key = f"{user_id}_{title}"
            user_drafts[key].append(data)
    
    # Find duplicates
    duplicates = []
    for key, drafts in user_drafts.items():
        if len(drafts) > 1:
            # Sort by creation time (keep the most recent)
            drafts.sort(key=lambda x: x.get('createdAt', datetime.min), reverse=True)
            duplicates.append({
                'user_id': drafts[0].get('created_by_uid'),
                'title': drafts[0].get('title'),
                'keep': drafts[0],  # Most recent
                'remove': drafts[1:]  # Older ones
            })
    
    return duplicates

def cleanup_duplicates(dry_run=True):
    """Clean up duplicate drafts"""
    duplicates = find_duplicate_drafts()
    
    if not duplicates:
        print("No duplicate drafts found!")
        return
    
    print(f"Found {len(duplicates)} sets of duplicate drafts:")
    
    total_removed = 0
    for dup in duplicates:
        print(f"\nUser: {dup['user_id']}")
        print(f"   Title: {dup['title']}")
        print(f"   Keeping: {dup['keep']['id']} (most recent)")
        print(f"   Removing: {len(dup['remove'])} duplicates")
        
        for draft in dup['remove']:
            print(f"     - {draft['id']} (created: {draft.get('createdAt', 'unknown')})")
        
        if not dry_run:
            # Delete the older drafts
            for draft in dup['remove']:
                try:
                    db.collection('opportunities').document(draft['id']).delete()
                    total_removed += 1
                    print(f"     Deleted {draft['id']}")
                except Exception as e:
                    print(f"     Failed to delete {draft['id']}: {e}")
    
    if dry_run:
        print(f"\nDRY RUN: Would remove {sum(len(dup['remove']) for dup in duplicates)} duplicate drafts")
        print("Run with --execute to actually remove duplicates")
    else:
        print(f"\nCleanup complete! Removed {total_removed} duplicate drafts")

def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Clean up duplicate opportunity drafts")
    parser.add_argument("--execute", action="store_true", help="Actually remove duplicates (default is dry run)")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    
    args = parser.parse_args()
    
    if args.verbose:
        import logging
        logger.setLevel(logging.DEBUG)
    
    print("Duplicate Draft Cleanup Tool")
    print("=" * 40)
    
    try:
        cleanup_duplicates(dry_run=not args.execute)
    except Exception as e:
        print(f"Error during cleanup: {e}")
        logger.error(f"Cleanup failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
