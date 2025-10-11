"""Authentication service - Business logic for auth"""
import secrets
from datetime import datetime, timedelta
from firebase_admin import auth
from google.cloud.firestore import SERVER_TIMESTAMP
from config.settings import db, brevo_api_instance, FRONTEND_URL, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME
from brevo_python import SendSmtpEmail, SendSmtpEmailTo, SendSmtpEmailSender
from utils.logging_config import logger

class AuthService:
    """Service for authentication operations"""
    
    @staticmethod
    def signup(email, password, name):
        """Sign up a new user with email verification - Industry Standard Implementation"""
        # Check if user already exists in Firebase Auth (verified users)
        try:
            existing_user = auth.get_user_by_email(email)
            if existing_user.email_verified:
                raise ValueError("An account with this email already exists")
            else:
                # User exists but not verified - delete from Firebase Auth
                auth.delete_user(existing_user.uid)
                logger.info(f"Deleted unverified user from Firebase Auth: {email}")
        except auth.UserNotFoundError:
            # User doesn't exist in Firebase Auth, which is what we want
            pass
        
        # Check if there's already a pending verification for this email
        pending_users = db.collection('pending_users').where('email', '==', email).get()
        for doc in pending_users:
            doc.reference.delete()
            logger.info(f"Deleted existing pending verification for: {email}")
        
        # Generate secure verification token
        verification_token = secrets.token_urlsafe(32)
        
        # Store pending user data in Firestore ONLY (NO Firebase Auth user created yet)
        pending_user_ref = db.collection('pending_users').document()
        expires_at = datetime.utcnow() + timedelta(hours=1)
        pending_user_ref.set({
            'email': email,
            'password_hash': password,  # Store temporarily for verification
            'name': name,
            'verification_token': verification_token,
            'created_at': SERVER_TIMESTAMP,
            'expires_at': expires_at
        })
        
        pending_user_id = pending_user_ref.id
        
        # Send verification email
        verification_link = f"{FRONTEND_URL}/verify-email?token={verification_token}&uid={pending_user_id}"
        
        logger.info(f"Sending verification email to {email}")
        
        send_smtp_email = SendSmtpEmail(
            to=[SendSmtpEmailTo(email=email, name=name)],
            sender=SendSmtpEmailSender(email=BREVO_SENDER_EMAIL, name=BREVO_SENDER_NAME),
            subject="🎉 Welcome to Depanku.id - Verify Your Email",
            html_content=f"""
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; color: white; text-align: center;">
                    <h1 style="margin: 0;">✨ Welcome to Depanku.id!</h1>
                </div>
                
                <div style="padding: 30px; background: #f9fafb; border-radius: 10px; margin-top: 20px;">
                    <p style="font-size: 16px; color: #374151;">Hi {name},</p>
                    
                    <p style="font-size: 16px; color: #374151;">
                        Thank you for joining Depanku.id! We're excited to help you discover amazing opportunities 
                        tailored just for you.
                    </p>
                    
                    <p style="font-size: 16px; color: #374151;">
                        To complete your registration, please verify your email address by clicking the button below:
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{verification_link}" 
                           style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                  color: white; 
                                  padding: 15px 40px; 
                                  text-decoration: none; 
                                  border-radius: 8px; 
                                  font-weight: bold; 
                                  display: inline-block;">
                            Verify Email Address
                        </a>
                    </div>
                    
                    <p style="font-size: 14px; color: #6b7280;">
                        Or copy and paste this link into your browser:<br>
                        <a href="{verification_link}" style="color: #667eea; word-break: break-all;">{verification_link}</a>
                    </p>
                    
                    <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">
                        This verification link will expire in 1 hour for security reasons.
                    </p>
                </div>
            </body>
            </html>
            """
        )
        
        try:
            result = brevo_api_instance.send_transac_email(send_smtp_email)
            logger.info(f"Verification email sent successfully to {email}. Message ID: {result.message_id if hasattr(result, 'message_id') else 'N/A'}")
        except Exception as e:
            logger.error(f"Error sending verification email to {email}: {str(e)}")
            # Don't fail the signup if email fails - user can request resend
        
        return pending_user_id
    
    @staticmethod
    def verify_email(token, uid):
        """Verify user email with token and create Firebase Auth user - Industry Standard Implementation"""
        # Get pending user from Firestore
        pending_user_ref = db.collection('pending_users').document(uid)
        pending_user_doc = pending_user_ref.get()
        
        if not pending_user_doc.exists:
            raise ValueError("Verification link is invalid or expired")
        
        pending_user_data = pending_user_doc.to_dict()
        
        # Check if token matches
        if pending_user_data.get('verification_token') != token:
            raise ValueError("Invalid verification token")
        
        # Check if verification has expired
        expires_at = pending_user_data.get('expires_at')
        if expires_at and expires_at < firestore.SERVER_TIMESTAMP:
            # Clean up expired verification
            pending_user_ref.delete()
            raise ValueError("Verification link has expired. Please request a new one.")
        
        # Create Firebase Auth user ONLY after verification
        try:
            firebase_user = auth.create_user(
                email=pending_user_data['email'],
                password=pending_user_data['password_hash'],
                display_name=pending_user_data['name'],
                email_verified=True  # Mark as verified immediately
            )
            
            # Create user profile in Firestore
            user_ref = db.collection('users').document(firebase_user.uid)
            user_ref.set({
                'email': pending_user_data['email'],
                'name': pending_user_data['name'],
                'email_verified': True,
                'verified_at': firestore.SERVER_TIMESTAMP,
                'created_at': firestore.SERVER_TIMESTAMP,
                'last_login': firestore.SERVER_TIMESTAMP,
                'profile_complete': False,
                'preferences': {
                    'notifications': True,
                    'email_updates': True
                }
            })
            
            # Clean up pending user data
            pending_user_ref.delete()
            
            logger.info(f"User account created successfully after email verification: {pending_user_data['email']}")
            
            return {
                'uid': firebase_user.uid,
                'email': pending_user_data['email'],
                'name': pending_user_data['name']
            }
            
        except Exception as e:
            logger.error(f"Failed to create Firebase Auth user after verification: {str(e)}")
            raise ValueError("Failed to create account. Please try again.")
    
    @staticmethod
    def resend_verification_email(email):
        """Resend verification email for pending users"""
        # Check if there's a pending verification
        pending_users = db.collection('pending_users').where('email', '==', email).get()
        
        if not pending_users:
            raise ValueError("No pending verification found for this email")
        
        # Get the most recent pending verification
        pending_user_doc = pending_users[0]
        pending_user_data = pending_user_doc.to_dict()
        
        # Check if verification has expired
        expires_at = pending_user_data.get('expires_at')
        if expires_at and expires_at < firestore.SERVER_TIMESTAMP:
            # Delete expired verification
            pending_user_doc.reference.delete()
            raise ValueError("Verification link has expired. Please sign up again.")
        
        # Generate new verification token
        new_verification_token = secrets.token_urlsafe(32)
        
        # Update the pending user with new token
        new_expires_at = datetime.utcnow() + timedelta(hours=1)
        pending_user_doc.reference.update({
            'verification_token': new_verification_token,
            'expires_at': new_expires_at
        })
        
        # Send new verification email
        verification_link = f"{FRONTEND_URL}/verify-email?token={new_verification_token}&uid={pending_user_doc.id}"
        
        send_smtp_email = SendSmtpEmail(
            to=[SendSmtpEmailTo(email=email, name=pending_user_data['name'])],
            sender=SendSmtpEmailSender(email=BREVO_SENDER_EMAIL, name=BREVO_SENDER_NAME),
            subject="🔄 Depanku.id - New Verification Link",
            html_content=f"""
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; color: white; text-align: center;">
                    <h1 style="margin: 0;">🔄 New Verification Link</h1>
                </div>
                
                <div style="padding: 30px; background: #f9fafb; border-radius: 10px; margin-top: 20px;">
                    <p style="font-size: 16px; color: #374151;">Hi {pending_user_data['name']},</p>
                    
                    <p style="font-size: 16px; color: #374151;">
                        You requested a new verification link for your Depanku.id account.
                    </p>
                    
                    <p style="font-size: 16px; color: #374151;">
                        Click the button below to verify your email address:
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{verification_link}" 
                           style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                  color: white; 
                                  padding: 15px 40px; 
                                  text-decoration: none; 
                                  border-radius: 8px; 
                                  font-weight: bold; 
                                  display: inline-block;">
                            Verify Email Address
                        </a>
                    </div>
                    
                    <p style="font-size: 14px; color: #6b7280;">
                        Or copy and paste this link into your browser:<br>
                        <a href="{verification_link}" style="color: #667eea; word-break: break-all;">{verification_link}</a>
                    </p>
                    
                    <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">
                        This verification link will expire in 1 hour for security reasons.
                    </p>
                </div>
            </body>
            </html>
            """
        )
        
        try:
            result = brevo_api_instance.send_transac_email(send_smtp_email)
            logger.info(f"Verification email resent successfully to {email}")
            return True
        except Exception as e:
            logger.error(f"Error resending verification email to {email}: {str(e)}")
            raise ValueError("Failed to send verification email. Please try again.")
    
    @staticmethod
    def check_email_verified(email):
        """Check if user email is verified"""
        try:
            user = auth.get_user_by_email(email)
            return user.email_verified
        except auth.UserNotFoundError:
            return False

