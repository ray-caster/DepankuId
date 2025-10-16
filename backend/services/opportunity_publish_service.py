"""Additional opportunity service methods for publishing/unpublishing"""
from firebase_admin import firestore
from config.settings import db
from services.moderation_service import ModerationService
from utils.logging_config import logger
try:
    from services.algolia_service import algolia_service
    ALGOLIA_AVAILABLE = True
except (ValueError, ImportError) as e:
    print(f"Warning: Algolia service not available: {e}")
    ALGOLIA_AVAILABLE = False
    algolia_service = None

class OpportunityPublishService:
    """Service for publishing and unpublishing opportunities"""
    
    @staticmethod
    def publish_opportunity(opportunity_id):
        """Publish a draft opportunity with AI moderation"""
        doc_ref = db.collection('opportunities').document(opportunity_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return False, "Opportunity not found"
        
        data = doc.to_dict()
        if data.get('status') == 'published':
            return False, "Opportunity is already published"
        
        # Moderate content with AI before publishing
        logger.info(f"Moderating opportunity {opportunity_id} before publishing")
        is_approved, issues = ModerationService.moderate_opportunity(data)
        
        if not is_approved:
            # Update as rejected with moderation notes
            data['status'] = 'rejected'
            data['moderation_notes'] = ModerationService.get_moderation_summary(issues)
            doc_ref.update(data)
            
            logger.info(f"Opportunity {opportunity_id} rejected by moderation during publish")
            
            return False, {
                "status": "rejected",
                "message": "Your opportunity needs revision",
                "issues": issues,
                "moderation_notes": data['moderation_notes']
            }
        
        # Content approved, publish the opportunity
        data['status'] = 'published'
        data['moderation_notes'] = ''  # Clear any previous moderation notes
        doc_ref.update(data)
        
        # Add to Algolia
        if ALGOLIA_AVAILABLE:
            algolia_data = data.copy()
            algolia_data['objectID'] = opportunity_id
            algolia_data['status'] = 'published'
            algolia_service.save_objects([algolia_data])
        
        logger.info(f"Opportunity {opportunity_id} published successfully after moderation")
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
        if ALGOLIA_AVAILABLE:
            algolia_service.delete_objects([opportunity_id])
        
        return True, "Opportunity unpublished successfully"
