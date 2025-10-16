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
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

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
        logger.info("No duplicate drafts found.")
        return
    
    logger.info(f"Found {len(duplicates)} sets of duplicate drafts")
    
    total_removed = 0
    for duplicate in duplicates:
        user_id = duplicate['user_id']
        title = duplicate['title']
        to_remove = duplicate['remove']
        
        logger.info(f"User {user_id}: '{title}' - {len(to_remove)} duplicates to remove")
        
        for draft in to_remove:
            draft_id = draft['id']
            logger.info(f"  - Would remove draft: {draft_id}")
            
            if not dry_run:
                try:
                    # Delete from Firestore
                    db.collection('opportunities').document(draft_id).delete()
                    logger.info(f"  - Removed draft: {draft_id}")
                    total_removed += 1
                except Exception as e:
                    logger.error(f"  - Error removing draft {draft_id}: {e}")
    
    if dry_run:
        logger.info(f"DRY RUN: Would remove {sum(len(d['remove']) for d in duplicates)} duplicate drafts")
    else:
        logger.info(f"Removed {total_removed} duplicate drafts")

def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Clean up duplicate drafts')
    parser.add_argument('--dry-run', action='store_true', default=True,
                       help='Show what would be removed without actually removing (default: True)')
    parser.add_argument('--execute', action='store_true',
                       help='Actually execute the cleanup (overrides --dry-run)')
    
    args = parser.parse_args()
    
    dry_run = args.dry_run and not args.execute
    
    if dry_run:
        logger.info("Running in DRY RUN mode - no changes will be made")
    else:
        logger.info("Running in EXECUTE mode - changes will be made")
        response = input("Are you sure you want to delete duplicate drafts? (yes/no): ")
        if response.lower() != 'yes':
            logger.info("Operation cancelled")
            return
    
    cleanup_duplicates(dry_run=dry_run)

if __name__ == "__main__":
    main()
