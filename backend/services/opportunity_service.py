"""Opportunity service - Business logic for opportunities"""
from firebase_admin import firestore
from config.settings import db
from datetime import datetime
from services.algolia_service import algolia_service

class OpportunityService:
    """Service for managing opportunities"""
    
    @staticmethod
    def get_all_opportunities():
        """Get all opportunities from Firestore"""
        opportunities_ref = db.collection('opportunities')
        docs = opportunities_ref.stream()
        
        opportunities = []
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            opportunities.append(data)
        
        return opportunities
    
    @staticmethod
    def get_opportunity_by_id(opportunity_id):
        """Get a single opportunity by ID"""
        doc_ref = db.collection('opportunities').document(opportunity_id)
        doc = doc_ref.get()
        
        if doc.exists:
            data = doc.to_dict()
            data['id'] = doc.id
            return data
        return None
    
    @staticmethod
    def create_opportunity(data):
        """Create a new opportunity"""
        # Add to Firestore
        doc_ref = db.collection('opportunities').document()
        firestore_data = data.copy()
        firestore_data['createdAt'] = firestore.SERVER_TIMESTAMP
        doc_ref.set(firestore_data)
        
        # Only add to Algolia if published
        if data.get('status') == 'published':
            algolia_data = data.copy()
            algolia_data['objectID'] = doc_ref.id
            algolia_data['createdAt'] = datetime.now().isoformat()
            algolia_service.save_objects([algolia_data])
        else:
            algolia_data = None
        
        return doc_ref.id, algolia_data
    
    @staticmethod
    def update_opportunity(opportunity_id, data):
        """Update an existing opportunity"""
        doc_ref = db.collection('opportunities').document(opportunity_id)
        doc_ref.update(data)
        
        # Handle Algolia based on status
        if data.get('status') == 'published':
            # Add/update in Algolia
            algolia_data = data.copy()
            algolia_data['objectID'] = opportunity_id
            algolia_service.save_objects([algolia_data])
        elif data.get('status') == 'draft':
            # Remove from Algolia if it was published before
            algolia_service.delete_objects([opportunity_id])
        
        return True
    
    @staticmethod
    def delete_opportunity(opportunity_id):
        """Delete an opportunity"""
        # Delete from Firestore
        db.collection('opportunities').document(opportunity_id).delete()
        
        # Delete from Algolia
        algolia_service.delete_objects([opportunity_id])
        
        return True
    
    @staticmethod
    def sync_to_algolia():
        """Sync all published Firestore opportunities to Algolia"""
        opportunities_ref = db.collection('opportunities')
        # Only sync published opportunities
        docs = opportunities_ref.where('status', '==', 'published').stream()
        
        records = []
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            records.append(data)
        
        if records:
            return algolia_service.sync_all(records)
        else:
            return 0
    
    @staticmethod
    def get_user_opportunities(user_id, status=None):
        """Get opportunities created by a specific user, optionally filtered by status"""
        opportunities_ref = db.collection('opportunities')
        query = opportunities_ref.where('created_by_uid', '==', user_id)
        
        if status:
            query = query.where('status', '==', status)
        
        docs = query.stream()
        
        opportunities = []
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            opportunities.append(data)
        
        return opportunities

