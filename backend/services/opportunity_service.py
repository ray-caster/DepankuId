"""Opportunity service - Business logic for opportunities"""
from firebase_admin import firestore
from config.settings import db, algolia_client, ALGOLIA_INDEX_NAME
from datetime import datetime

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
        
        # Add to Algolia
        algolia_data = data.copy()
        algolia_data['objectID'] = doc_ref.id
        algolia_data['createdAt'] = datetime.now().isoformat()
        algolia_client.save_objects(
            index_name=ALGOLIA_INDEX_NAME,
            objects=[algolia_data]
        )
        
        return doc_ref.id, algolia_data
    
    @staticmethod
    def update_opportunity(opportunity_id, data):
        """Update an existing opportunity"""
        doc_ref = db.collection('opportunities').document(opportunity_id)
        doc_ref.update(data)
        
        # Update Algolia
        algolia_data = data.copy()
        algolia_data['objectID'] = opportunity_id
        algolia_client.save_objects(
            index_name=ALGOLIA_INDEX_NAME,
            objects=[algolia_data]
        )
        
        return True
    
    @staticmethod
    def delete_opportunity(opportunity_id):
        """Delete an opportunity"""
        # Delete from Firestore
        db.collection('opportunities').document(opportunity_id).delete()
        
        # Delete from Algolia
        algolia_client.delete_objects(
            index_name=ALGOLIA_INDEX_NAME,
            object_ids=[opportunity_id]
        )
        
        return True
    
    @staticmethod
    def sync_to_algolia():
        """Sync all Firestore opportunities to Algolia"""
        opportunities_ref = db.collection('opportunities')
        docs = opportunities_ref.stream()
        
        records = []
        for doc in docs:
            data = doc.to_dict()
            data['objectID'] = doc.id
            
            # Convert datetime objects to ISO strings for Algolia
            if 'createdAt' in data and data['createdAt']:
                data['createdAt'] = data['createdAt'].isoformat() if hasattr(data['createdAt'], 'isoformat') else str(data['createdAt'])
            
            records.append(data)
        
        if records:
            algolia_client.save_objects(
                index_name=ALGOLIA_INDEX_NAME,
                objects=records
            )
        
        return len(records)

