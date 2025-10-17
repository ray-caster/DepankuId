"""Application model and data structures"""
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from firebase_admin import firestore

class ApplicationModel:
    """Model for application data structure"""
    
    @staticmethod
    def create_application_id(opportunity_id: str, user_id: str) -> str:
        """Create a composite application ID from opportunity_id and user_id"""
        return f"{opportunity_id}_{user_id}"
    
    @staticmethod
    def create_application_data(
        opportunity_id: str,
        user_id: str,
        user_email: str,
        responses: List[Dict[str, Any]],
        status: str = 'pending'
    ) -> Dict[str, Any]:
        """Create application data structure"""
        return {
            'id': ApplicationModel.create_application_id(opportunity_id, user_id),
            'opportunity_id': opportunity_id,
            'user_id': user_id,
            'user_email': user_email,
            'responses': responses,
            'status': status,
            'created_at': datetime.now(timezone.utc),
            'updated_at': datetime.now(timezone.utc),
            'submitted_at': datetime.now(timezone.utc)
        }
    
    @staticmethod
    def update_application_data(
        existing_data: Dict[str, Any],
        responses: List[Dict[str, Any]],
        status: Optional[str] = None
    ) -> Dict[str, Any]:
        """Update existing application data"""
        updated_data = existing_data.copy()
        updated_data['responses'] = responses
        updated_data['updated_at'] = datetime.now(timezone.utc)
        
        if status:
            updated_data['status'] = status
            if status in ['accepted', 'rejected']:
                updated_data['reviewed_at'] = datetime.now(timezone.utc)
        
        return updated_data
