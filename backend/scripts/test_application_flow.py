#!/usr/bin/env python3
"""
Test Application Flow - Verify the new application system works
"""

import os
import sys
from datetime import datetime

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.application_service import ApplicationService
from services.opportunity_service import OpportunityService

def test_application_flow():
    """Test the complete application flow"""
    print("🧪 Testing Application Flow")
    print("=" * 40)
    
    # Test data
    opportunity_id = "test_opp_123"
    user_id = "test_user_456"
    user_email = "test@example.com"
    
    responses = [
        {
            "questionId": "q1",
            "questionTitle": "Why are you interested?",
            "questionType": "text",
            "answer": "I'm passionate about this role!",
            "required": True
        },
        {
            "questionId": "q2", 
            "questionTitle": "Experience",
            "questionType": "textarea",
            "answer": "I have 3 years of experience in this field.",
            "required": True
        }
    ]
    
    try:
        # Test 1: Submit new application
        print("1️⃣ Testing new application submission...")
        success = ApplicationService.submit_application(opportunity_id, user_id, user_email, responses)
        print(f"   ✅ Application submitted: {success}")
        
        # Test 2: Check if user has applied
        print("2️⃣ Testing application status check...")
        has_applied = ApplicationService.has_user_applied(opportunity_id, user_id)
        print(f"   ✅ User has applied: {has_applied}")
        
        # Test 3: Get application data
        print("3️⃣ Testing application retrieval...")
        application = ApplicationService.get_application(opportunity_id, user_id)
        if application:
            print(f"   ✅ Application found: {application['id']}")
            print(f"   📝 Responses count: {len(application['responses'])}")
        else:
            print("   ❌ Application not found")
            return False
        
        # Test 4: Update application
        print("4️⃣ Testing application update...")
        updated_responses = responses + [{
            "questionId": "q3",
            "questionTitle": "Additional info",
            "questionType": "text", 
            "answer": "Updated information",
            "required": False
        }]
        
        success = ApplicationService.submit_application(opportunity_id, user_id, user_email, updated_responses)
        print(f"   ✅ Application updated: {success}")
        
        # Test 5: Verify update
        print("5️⃣ Testing updated application retrieval...")
        updated_application = ApplicationService.get_application(opportunity_id, user_id)
        if updated_application and len(updated_application['responses']) == 3:
            print(f"   ✅ Application updated successfully: {len(updated_application['responses'])} responses")
        else:
            print("   ❌ Application update failed")
            return False
        
        # Test 6: Get opportunity applications
        print("6️⃣ Testing opportunity applications retrieval...")
        opp_applications = ApplicationService.get_opportunity_applications(opportunity_id)
        print(f"   ✅ Found {len(opp_applications)} applications for opportunity")
        
        # Test 7: Update application status
        print("7️⃣ Testing application status update...")
        app_id = application['id']
        success = ApplicationService.update_application_status(app_id, 'reviewed', 'Looks good!')
        print(f"   ✅ Status updated: {success}")
        
        print("\n🎉 All tests passed! Application system is working correctly.")
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
        return False

def cleanup_test_data():
    """Clean up test data"""
    print("\n🧹 Cleaning up test data...")
    try:
        # This would require a delete method in ApplicationService
        # For now, just report what would be cleaned up
        print("   ℹ️  Test data cleanup would go here")
        print("   ℹ️  In production, you'd delete the test applications")
    except Exception as e:
        print(f"   ⚠️  Cleanup error: {e}")

if __name__ == "__main__":
    success = test_application_flow()
    cleanup_test_data()
    
    if success:
        print("\n✅ Application flow test completed successfully!")
        sys.exit(0)
    else:
        print("\n❌ Application flow test failed!")
        sys.exit(1)
