#!/usr/bin/env python3
"""
Debug script to check applications in the database
"""

import os
import sys
from dotenv import load_dotenv

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.application_service import ApplicationService
from config.settings import db

def debug_applications():
    """Debug applications in the database"""
    print("Debugging Applications in Database")
    print("=" * 40)
    
    try:
        # Get all applications from the database
        applications_ref = db.collection('applications')
        docs = applications_ref.stream()
        
        print(f"Found {len(list(docs))} applications in database")
        
        # Get applications again (since stream() consumes the iterator)
        docs = applications_ref.stream()
        
        for i, doc in enumerate(docs, 1):
            print(f"\nApplication {i}:")
            print(f"  Document ID: {doc.id}")
            data = doc.to_dict()
            print(f"  Raw data: {data}")
            
            # Test the transformation
            try:
                transformed = {
                    'id': data.get('id', doc.id),
                    'opportunityId': data.get('opportunity_id', ''),
                    'applicantId': data.get('user_id', ''),
                    'applicantEmail': data.get('user_email', ''),
                    'applicantName': data.get('user_email', '').split('@')[0],
                    'responses': data.get('responses', []),
                    'status': data.get('status', 'pending'),
                    'submittedAt': data.get('submitted_at', data.get('created_at', '')),
                    'reviewedAt': data.get('reviewed_at'),
                    'notes': data.get('notes', '')
                }
                print(f"  Transformed: {transformed}")
            except Exception as e:
                print(f"  Error transforming: {e}")
        
        # Test the service methods
        print(f"\n" + "=" * 40)
        print("Testing Service Methods")
        print("=" * 40)
        
        # Get all applications using the service
        all_apps = ApplicationService.get_user_applications("ED2o48seTBhpNzfb1DEXNjWjmce2")
        print(f"User applications: {len(all_apps)}")
        for app in all_apps:
            print(f"  {app}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    load_dotenv()
    debug_applications()


