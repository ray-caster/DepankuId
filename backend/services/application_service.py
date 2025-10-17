"""Application service - Business logic for application operations"""
from datetime import datetime
from firebase_admin import firestore
from config.settings import db
from models.application import ApplicationModel
from utils.logging_config import logger

class ApplicationService:
    """Service for application operations"""
    
    @staticmethod
    def submit_application(opportunity_id: str, user_id: str, user_email: str, responses: list) -> bool:
        """Submit or update an application for an opportunity"""
        try:
            application_id = ApplicationModel.create_application_id(opportunity_id, user_id)
            application_ref = db.collection('applications').document(application_id)
            
            # Check if application already exists
            existing_doc = application_ref.get()
            
            if existing_doc.exists:
                # Update existing application
                existing_data = existing_doc.to_dict()
                updated_data = ApplicationModel.update_application_data(existing_data, responses)
                application_ref.set(updated_data)
                logger.info(f"Updated application {application_id} for user {user_email}")
            else:
                # Create new application
                application_data = ApplicationModel.create_application_data(
                    opportunity_id, user_id, user_email, responses
                )
                application_ref.set(application_data)
                logger.info(f"Created new application {application_id} for user {user_email}")
            
            return True
            
        except Exception as e:
            logger.error(f"Error submitting application: {str(e)}")
            raise e
    
    @staticmethod
    def get_application(opportunity_id: str, user_id: str) -> dict:
        """Get a specific application by opportunity_id and user_id"""
        try:
            application_id = ApplicationModel.create_application_id(opportunity_id, user_id)
            application_ref = db.collection('applications').document(application_id)
            doc = application_ref.get()
            
            if doc.exists:
                return doc.to_dict()
            return None
            
        except Exception as e:
            logger.error(f"Error getting application: {str(e)}")
            raise e
    
    @staticmethod
    def get_opportunity_applications(opportunity_id: str) -> list:
        """Get all applications for a specific opportunity"""
        try:
            applications_ref = db.collection('applications')
            query = applications_ref.where('opportunity_id', '==', opportunity_id)
            docs = query.stream()
            
            applications = []
            for doc in docs:
                application_data = doc.to_dict()
                applications.append(application_data)
            
            # Sort by created_at (newest first)
            applications.sort(key=lambda x: x.get('created_at', datetime.min), reverse=True)
            
            return applications
            
        except Exception as e:
            logger.error(f"Error getting opportunity applications: {str(e)}")
            raise e
    
    @staticmethod
    def get_user_applications(user_id: str) -> list:
        """Get all applications by a specific user"""
        try:
            applications_ref = db.collection('applications')
            query = applications_ref.where('user_id', '==', user_id)
            docs = query.stream()
            
            applications = []
            for doc in docs:
                application_data = doc.to_dict()
                applications.append(application_data)
            
            # Sort by created_at (newest first)
            applications.sort(key=lambda x: x.get('created_at', datetime.min), reverse=True)
            
            return applications
            
        except Exception as e:
            logger.error(f"Error getting user applications: {str(e)}")
            raise e
    
    @staticmethod
    def update_application_status(application_id: str, status: str, notes: str = '') -> bool:
        """Update application status"""
        try:
            application_ref = db.collection('applications').document(application_id)
            doc = application_ref.get()
            
            if not doc.exists:
                return False
            
            existing_data = doc.to_dict()
            updated_data = ApplicationModel.update_application_data(existing_data, existing_data['responses'], status)
            
            if notes:
                updated_data['notes'] = notes
            
            application_ref.set(updated_data)
            logger.info(f"Updated application {application_id} status to {status}")
            
            return True
            
        except Exception as e:
            logger.error(f"Error updating application status: {str(e)}")
            raise e
    
    @staticmethod
    def has_user_applied(opportunity_id: str, user_id: str) -> bool:
        """Check if user has already applied to an opportunity"""
        try:
            application = ApplicationService.get_application(opportunity_id, user_id)
            return application is not None
            
        except Exception as e:
            logger.error(f"Error checking if user applied: {str(e)}")
            return False
