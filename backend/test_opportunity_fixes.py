#!/usr/bin/env python3
"""
Test script to verify the opportunity service fixes work correctly.
"""

import os
import sys
import asyncio
from datetime import datetime

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.opportunity_service import OpportunityService
from utils.logging_config import logger

def test_opportunity_creation():
    """Test that opportunity creation works without event loop issues"""
    logger.info("Testing opportunity creation...")
    
    test_data = {
        'title': 'Test Opportunity',
        'description': 'This is a test opportunity',
        'type': 'research',
        'organization': 'Test Org',
        'tags': ['test', 'research'],
        'status': 'draft',
        'created_by_uid': 'test_user_123',
        'created_by_email': 'test@example.com'
    }
    
    try:
        # Test creation
        doc_id, algolia_data = OpportunityService.create_opportunity(test_data)
        logger.info(f"✓ Opportunity created successfully: {doc_id}")
        
        # Test retrieval
        retrieved = OpportunityService.get_opportunity_by_id(doc_id)
        if retrieved:
            logger.info(f"✓ Opportunity retrieved successfully: {retrieved['title']}")
        else:
            logger.error("✗ Failed to retrieve opportunity")
            return False
        
        # Test update
        update_data = {'title': 'Updated Test Opportunity'}
        OpportunityService.update_opportunity(doc_id, update_data)
        logger.info("✓ Opportunity updated successfully")
        
        # Test deletion
        OpportunityService.delete_opportunity(doc_id)
        logger.info("✓ Opportunity deleted successfully")
        
        return True
        
    except Exception as e:
        logger.error(f"✗ Test failed: {e}")
        return False

def test_user_opportunities():
    """Test getting user opportunities"""
    logger.info("Testing user opportunities retrieval...")
    
    try:
        # Test getting all opportunities for a user
        opportunities = OpportunityService.get_user_opportunities('test_user_123')
        logger.info(f"✓ Retrieved {len(opportunities)} opportunities for user")
        
        # Test getting drafts only
        drafts = OpportunityService.get_user_opportunities('test_user_123', 'draft')
        logger.info(f"✓ Retrieved {len(drafts)} drafts for user")
        
        return True
        
    except Exception as e:
        logger.error(f"✗ User opportunities test failed: {e}")
        return False

def main():
    """Run all tests"""
    logger.info("Starting opportunity service tests...")
    
    tests = [
        test_opportunity_creation,
        test_user_opportunities
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        logger.info("")  # Empty line for readability
    
    logger.info(f"Tests completed: {passed}/{total} passed")
    
    if passed == total:
        logger.info("✓ All tests passed!")
        return 0
    else:
        logger.error("✗ Some tests failed!")
        return 1

if __name__ == "__main__":
    exit(main())
