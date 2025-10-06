"""Authentication service - Business logic for auth"""
import secrets
from firebase_admin import auth, firestore
from config.settings import db, brevo_api_instance, FRONTEND_URL, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME
from brevo_python import SendSmtpEmail, SendSmtpEmailTo, SendSmtpEmailSender
from utils.logging_config import logger

class AuthService:
    """Service for authentication operations"""
    
    @staticmethod
    def signup(email, password, name):
        """Sign up a new user with email verification"""
        # Create user in Firebase Auth
        user = auth.create_user(
            email=email,
            password=password,
            display_name=name,
            email_verified=False
        )
        
        # Generate verification token
        verification_token = secrets.token_urlsafe(32)
        
        # Store verification token in Firestore
        user_ref = db.collection('users').document(user.uid)
        user_ref.set({
            'email': email,
            'name': name,
            'verification_token': verification_token,
            'email_verified': False,
            'created_at': firestore.SERVER_TIMESTAMP
        })
        
        # Send verification email
        verification_link = f"{FRONTEND_URL}/verify-email?token={verification_token}&uid={user.uid}"
        
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
                        To get started, please verify your email address by clicking the button below:
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
        
        return user.uid
    
    @staticmethod
    def verify_email(token, uid):
        """Verify user email with token"""
        # Get user from Firestore
        user_ref = db.collection('users').document(uid)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            raise ValueError("User not found")
        
        user_data = user_doc.to_dict()
        
        if user_data.get('verification_token') != token:
            raise ValueError("Invalid verification token")
        
        # Update user as verified
        user_ref.update({
            'email_verified': True,
            'verification_token': firestore.DELETE_FIELD,
            'verified_at': firestore.SERVER_TIMESTAMP
        })
        
        # Update Firebase Auth
        auth.update_user(uid, email_verified=True)
        
        return True
    
    @staticmethod
    def check_email_verified(email):
        """Check if user email is verified"""
        user = auth.get_user_by_email(email)
        return user.email_verified

