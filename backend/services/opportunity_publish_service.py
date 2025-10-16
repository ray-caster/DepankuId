"""Additional opportunity service methods for publishing/unpublishing"""
from firebase_admin import firestore
from config.settings import db
from services.algolia_service import algolia_service

class OpportunityPublishService:
    """Service for publishing and unpublishing opportunities"""
    
    @staticmethod
    def publish_opportunity(opportunity_id):
        """Publish a draft opportunity"""
        doc_ref = db.collection('opportunities').document(opportunity_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return False, "Opportunity not found"
        
        data = doc.to_dict()
        if data.get('status') == 'published':
            return False, "Opportunity is already published"
        
        # Update status to published
        doc_ref.update({'status': 'published'})
        
        # Add to Algolia
        algolia_data = data.copy()
        algolia_data['objectID'] = opportunity_id
        algolia_data['status'] = 'published'
        algolia_service.save_objects([algolia_data])
        
        return True, "Opportunity published successfully"
    
    @staticmethod
    def unpublish_opportunity(opportunity_id):
        """Unpublish an opportunity (make it a draft)"""
        doc_ref = db.collection('opportunities').document(opportunity_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return False, "Opportunity not found"
        
        data = doc.to_dict()
        if data.get('status') == 'draft':
            return False, "Opportunity is already a draft"
        
        # Update status to draft
        doc_ref.update({'status': 'draft'})
        
        # Remove from Algolia
        algolia_service.delete_objects([opportunity_id])
        
        return True, "Opportunity unpublished successfully"
