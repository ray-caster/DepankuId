"""User service - Business logic for user operations"""
from firebase_admin import auth, firestore
from config.settings import db

class UserService:
    """Service for user operations"""
    
    @staticmethod
    def save_preferences(user_id, preferences):
        """Save user preferences"""
        user_ref = db.collection('users').document(user_id)
        user_ref.set({
            'preferences': preferences,
            'updated_at': firestore.SERVER_TIMESTAMP
        }, merge=True)
        
        return True
    
    @staticmethod
    def get_preferences(user_id):
        """Get user preferences"""
        user_ref = db.collection('users').document(user_id)
        doc = user_ref.get()
        
        if doc.exists:
            return doc.to_dict()
        return {"preferences": {}}
    
    @staticmethod
    def get_profile(user_id):
        """Get user profile"""
        user_ref = db.collection('users').document(user_id)
        doc = user_ref.get()
        
        if doc.exists:
            return doc.to_dict()
        return {}
    
    @staticmethod
    def update_profile(user_id, profile_data):
        """Update user profile"""
        user_ref = db.collection('users').document(user_id)
        user_ref.set({
            'profile': profile_data,
            'updated_at': firestore.SERVER_TIMESTAMP
        }, merge=True)
        
        return True
    
    @staticmethod
    def get_notification_settings(user_id):
        """Get notification settings"""
        user_ref = db.collection('users').document(user_id)
        doc = user_ref.get()
        
        if doc.exists:
            data = doc.to_dict()
            return data.get('notification_settings', {
                'emailNotifications': True,
                'deadlineReminders': True,
                'newOpportunities': False,
                'weeklyDigest': True
            })
        return {
            'emailNotifications': True,
            'deadlineReminders': True,
            'newOpportunities': False,
            'weeklyDigest': True
        }
    
    @staticmethod
    def update_notification_settings(user_id, settings):
        """Update notification settings"""
        user_ref = db.collection('users').document(user_id)
        user_ref.set({
            'notification_settings': settings,
            'updated_at': firestore.SERVER_TIMESTAMP
        }, merge=True)
        
        return True
    
    @staticmethod
    def get_privacy_settings(user_id):
        """Get privacy settings"""
        user_ref = db.collection('users').document(user_id)
        doc = user_ref.get()
        
        if doc.exists:
            data = doc.to_dict()
            return data.get('privacy_settings', {
                'profileVisibility': 'public',
                'showEmail': False,
                'showBookmarks': False
            })
        return {
            'profileVisibility': 'public',
            'showEmail': False,
            'showBookmarks': False
        }
    
    @staticmethod
    def update_privacy_settings(user_id, settings):
        """Update privacy settings"""
        user_ref = db.collection('users').document(user_id)
        user_ref.set({
            'privacy_settings': settings,
            'updated_at': firestore.SERVER_TIMESTAMP
        }, merge=True)
        
        return True
    
    @staticmethod
    def get_bookmarks(user_id):
        """Get user's bookmarked opportunities"""
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return []
        
        user_data = user_doc.to_dict()
        bookmark_ids = user_data.get('bookmarks', [])
        
        # Fetch opportunity details
        opportunities = []
        for opp_id in bookmark_ids:
            opp_doc = db.collection('opportunities').document(opp_id).get()
            if opp_doc.exists:
                opp_data = opp_doc.to_dict()
                opp_data['id'] = opp_doc.id
                opportunities.append(opp_data)
        
        return opportunities
    
    @staticmethod
    def add_bookmark(user_id, opportunity_id):
        """Add an opportunity to user's bookmarks"""
        user_ref = db.collection('users').document(user_id)
        user_ref.set({
            'bookmarks': firestore.ArrayUnion([opportunity_id])
        }, merge=True)
        
        return True
    
    @staticmethod
    def remove_bookmark(user_id, opportunity_id):
        """Remove an opportunity from user's bookmarks"""
        user_ref = db.collection('users').document(user_id)
        user_ref.set({
            'bookmarks': firestore.ArrayRemove([opportunity_id])
        }, merge=True)
        
        return True
    
    @staticmethod
    def get_activity(user_id):
        """Get user activity"""
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return []
        
        user_data = user_doc.to_dict()
        return user_data.get('activity', [])
    
    @staticmethod
    def track_application(user_id, opportunity_id):
        """Track user application"""
        from datetime import datetime, timezone
        
        try:
            user_ref = db.collection('users').document(user_id)
            
            # Add application to activity
            activity_item = {
                'type': 'application',
                'opportunity_id': opportunity_id,
                'timestamp': datetime.now(timezone.utc)
            }
            
            # Use set with merge=True to create document if it doesn't exist
            user_ref.set({
                'activity': firestore.ArrayUnion([activity_item]),
                'applications': firestore.ArrayUnion([opportunity_id]),
                'last_activity': firestore.SERVER_TIMESTAMP
            }, merge=True)
            
            return True
        except Exception as e:
            print(f"Error tracking application for user {user_id}: {str(e)}")
            raise e
    
    @staticmethod
    def get_applications(user_id):
        """Get user applications"""
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return []
        
        user_data = user_doc.to_dict()
        application_ids = user_data.get('applications', [])
        
        # Fetch opportunity details for applications
        applications = []
        for opp_id in application_ids:
            opp_doc = db.collection('opportunities').document(opp_id).get()
            if opp_doc.exists:
                opp_data = opp_doc.to_dict()
                opp_data['id'] = opp_doc.id
                opp_data['applied_at'] = user_data.get('activity', [])
                applications.append(opp_data)
        
        return applications
    
    @staticmethod
    def verify_token(id_token):
        """Verify Firebase ID token and return user ID"""
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token['uid']

