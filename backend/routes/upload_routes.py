"""Upload routes for file handling"""
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
import uuid
from datetime import datetime
from utils.decorators import require_auth
from utils.logging_config import logger
from config.settings import db
from firebase_admin import storage

upload_bp = Blueprint('upload', __name__, url_prefix='/api/upload')

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route('/profile-picture', methods=['POST'])
@require_auth
def upload_profile_picture(user_id: str, user_email: str):
    """Upload profile picture"""
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({
                "success": False,
                "error": "No file provided"
            }), 400
        
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({
                "success": False,
                "error": "No file selected"
            }), 400
        
        # Check file extension
        if not allowed_file(file.filename):
            return jsonify({
                "success": False,
                "error": "Invalid file type. Only PNG, JPG, JPEG, GIF, and WEBP are allowed"
            }), 400
        
        # Check file size (2MB limit)
        file.seek(0, 2)  # Seek to end
        file_size = file.tell()
        file.seek(0)  # Reset to beginning
        
        if file_size > 2 * 1024 * 1024:  # 2MB
            return jsonify({
                "success": False,
                "error": "File size must be less than 2MB"
            }), 400
        
        # Generate unique filename
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        timestamp = int(datetime.now().timestamp() * 1000)
        filename = f"{timestamp}_{uuid.uuid4().hex[:8]}.{file_extension}"
        
        # Upload to Firebase Storage
        bucket = storage.bucket()
        blob_name = f"profile-pictures/{user_id}/{filename}"
        blob = bucket.blob(blob_name)
        
        # Set content type
        content_type = f"image/{file_extension}"
        blob.content_type = content_type
        
        # Upload file
        blob.upload_from_file(file, content_type=content_type)
        
        # Make blob public and get URL
        blob.make_public()
        public_url = blob.public_url
        
        # Update user profile in Firestore
        user_ref = db.collection('users').document(user_id)
        user_ref.update({
            'photoURL': public_url,
            'updated_at': datetime.now()
        })
        
        logger.info(f"Profile picture uploaded for user {user_email}: {public_url}")
        
        return jsonify({
            "success": True,
            "url": public_url,
            "message": "Profile picture uploaded successfully"
        }), 200
        
    except Exception as e:
        logger.error(f"Error uploading profile picture: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Failed to upload profile picture"
        }), 500

@upload_bp.route('/profile-picture', methods=['DELETE'])
@require_auth
def delete_profile_picture(user_id: str, user_email: str):
    """Delete profile picture"""
    try:
        # Get current user data
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return jsonify({
                "success": False,
                "error": "User not found"
            }), 404
        
        user_data = user_doc.to_dict()
        current_photo_url = user_data.get('photoURL')
        
        if not current_photo_url:
            return jsonify({
                "success": False,
                "error": "No profile picture to delete"
            }), 400
        
        # Delete from Firebase Storage if it's our storage
        if 'firebasestorage.googleapis.com' in current_photo_url:
            try:
                # Extract blob name from URL
                # URL format: https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Fto%2Ffile?alt=media
                url_parts = current_photo_url.split('/o/')
                if len(url_parts) > 1:
                    blob_name = url_parts[1].split('?')[0]
                    blob_name = blob_name.replace('%2F', '/')  # Decode URL encoding
                    
                    bucket = storage.bucket()
                    blob = bucket.blob(blob_name)
                    blob.delete()
                    
                    logger.info(f"Profile picture deleted from storage: {blob_name}")
            except Exception as delete_error:
                logger.warning(f"Could not delete profile picture from storage: {delete_error}")
        
        # Update user profile
        user_ref.update({
            'photoURL': None,
            'updated_at': datetime.now()
        })
        
        logger.info(f"Profile picture deleted for user {user_email}")
        
        return jsonify({
            "success": True,
            "message": "Profile picture deleted successfully"
        }), 200
        
    except Exception as e:
        logger.error(f"Error deleting profile picture: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Failed to delete profile picture"
        }), 500
