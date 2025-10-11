# 📧 Complete Brevo Implementation Tutorial

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Brevo Account Setup](#brevo-account-setup)
4. [Backend Implementation](#backend-implementation)
5. [Email Templates](#email-templates)
6. [Advanced Features](#advanced-features)
7. [Testing & Debugging](#testing--debugging)
8. [Production Deployment](#production-deployment)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This tutorial covers implementing Brevo (formerly Sendinblue) for transactional emails in your DepankuId project. Brevo is used for:
- ✅ Email verification during signup
- ✅ Password reset emails
- ✅ Notification emails
- ✅ Marketing campaigns (optional)

**Current Implementation Status:**
- ✅ Email verification system
- ✅ Resend verification functionality
- ✅ Professional HTML email templates
- ✅ Environment configuration

---

## Prerequisites

### 1. Required Dependencies
```bash
# Already in your requirements.txt
brevo-python>=1.2.0
```

### 2. Environment Variables
```env
# Brevo Configuration
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=verify@depanku.id
BREVO_SENDER_NAME=Depanku Verification
```

---

## Brevo Account Setup

### Step 1: Create Brevo Account
1. Go to [Brevo.com](https://www.brevo.com)
2. Sign up for a free account
3. Verify your email address

### Step 2: Get API Key
1. Login to Brevo Dashboard
2. Go to **Settings** → **API Keys**
3. Click **Create a new API key**
4. Name it: `DepankuId Production`
5. Select permissions: **Send emails**
6. Copy the API key (starts with `xkeys-`)

### Step 3: Verify Sender Email
1. Go to **Settings** → **Senders & IP**
2. Click **Add a sender**
3. Enter: `verify@depanku.id`
4. Verify the email (check your inbox)
5. Configure DKIM (recommended for production)

### Step 4: Domain Authentication (Production)
1. Go to **Settings** → **Senders & IP**
2. Click **Authenticate your domain**
3. Add DNS records to your domain
4. Wait for verification (can take 24-48 hours)

---

## Backend Implementation

### Current Configuration

**File: `backend/config/settings.py`**
```python
# Brevo Configuration
BREVO_API_KEY = os.getenv("BREVO_API_KEY")
BREVO_SENDER_EMAIL = os.getenv("BREVO_SENDER_EMAIL", "verify@depanku.id")
BREVO_SENDER_NAME = os.getenv("BREVO_SENDER_NAME", "Depanku Verification")

brevo_configuration = brevo_python.Configuration()
brevo_configuration.api_key['api-key'] = BREVO_API_KEY
brevo_api_instance = TransactionalEmailsApi(brevo_python.ApiClient(brevo_configuration))
```

### Email Service Implementation

**File: `backend/services/auth_service.py`**
```python
from brevo_python import SendSmtpEmail, SendSmtpEmailTo, SendSmtpEmailSender
from config.settings import brevo_api_instance, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME

class AuthService:
    @staticmethod
    def send_verification_email(email, name, verification_link):
        """Send email verification"""
        send_smtp_email = SendSmtpEmail(
            to=[SendSmtpEmailTo(email=email, name=name)],
            sender=SendSmtpEmailSender(
                email=BREVO_SENDER_EMAIL,
                name=BREVO_SENDER_NAME
            ),
            subject="Verify Your Depanku.id Account",
            htmlContent=create_verification_template(name, verification_link)
        )
        
        try:
            result = brevo_api_instance.send_transac_email(send_smtp_email)
            logger.info(f"Verification email sent to {email}")
            return True
        except Exception as e:
            logger.error(f"Email send failed: {str(e)}")
            return False
```

---

## Email Templates

### 1. Verification Email Template

**Current Implementation:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Verify Your Email - Depanku.id</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #667eea; font-size: 28px;">Welcome to Depanku.id!</h1>
        </div>
        
        <p style="font-size: 16px; color: #374151;">Hello {name},</p>
        
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
```

### 2. Password Reset Template

**Create: `backend/templates/password_reset.html`**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reset Your Password - Depanku.id</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #667eea; font-size: 28px;">Password Reset Request</h1>
        </div>
        
        <p style="font-size: 16px; color: #374151;">Hello {name},</p>
        
        <p style="font-size: 16px; color: #374151;">
            We received a request to reset your password for your Depanku.id account.
        </p>
        
        <p style="font-size: 16px; color: #374151;">
            Click the button below to reset your password:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{reset_link}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 40px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: bold; 
                      display: inline-block;">
                Reset Password
            </a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280;">
            Or copy and paste this link into your browser:<br>
            <a href="{reset_link}" style="color: #667eea; word-break: break-all;">{reset_link}</a>
        </p>
        
        <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">
            This reset link will expire in 1 hour for security reasons.
            If you didn't request this reset, please ignore this email.
        </p>
    </div>
</body>
</html>
```

### 3. Welcome Email Template

**Create: `backend/templates/welcome.html`**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to Depanku.id!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #667eea; font-size: 28px;">Welcome to Depanku.id! 🎉</h1>
        </div>
        
        <p style="font-size: 16px; color: #374151;">Hello {name},</p>
        
        <p style="font-size: 16px; color: #374151;">
            Congratulations! Your email has been verified and your Depanku.id account is now active.
        </p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #667eea; margin-top: 0;">What you can do now:</h3>
            <ul style="color: #374151;">
                <li>🔍 <strong>Discover opportunities</strong> tailored to your interests</li>
                <li>🔖 <strong>Bookmark favorites</strong> for easy access</li>
                <li>📧 <strong>Get deadline reminders</strong> for important applications</li>
                <li>📊 <strong>Track your progress</strong> and applications</li>
                <li>✨ <strong>Share opportunities</strong> with friends</li>
            </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{frontend_url}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 40px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: bold; 
                      display: inline-block;">
                Start Exploring
            </a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280;">
            Need help? Check out our <a href="{frontend_url}/about" style="color: #667eea;">About page</a> 
            or contact us at <a href="mailto:support@depanku.id" style="color: #667eea;">support@depanku.id</a>
        </p>
    </div>
</body>
</html>
```

---

## Advanced Features

### 1. Email Service Class

**Create: `backend/services/email_service.py`**
```python
"""Email service for Brevo integration"""
import os
from datetime import datetime, timedelta
from brevo_python import SendSmtpEmail, SendSmtpEmailTo, SendSmtpEmailSender
from config.settings import brevo_api_instance, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME, FRONTEND_URL
from utils.logging_config import logger

class EmailService:
    """Service for sending emails via Brevo"""
    
    @staticmethod
    def send_verification_email(email, name, verification_link):
        """Send email verification"""
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Verify Your Email - Depanku.id</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #667eea; font-size: 28px;">Welcome to Depanku.id!</h1>
                </div>
                
                <p style="font-size: 16px; color: #374151;">Hello {name},</p>
                
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
        
        return EmailService._send_email(
            to_email=email,
            to_name=name,
            subject="Verify Your Depanku.id Account",
            html_content=html_content
        )
    
    @staticmethod
    def send_welcome_email(email, name):
        """Send welcome email after verification"""
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Welcome to Depanku.id!</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #667eea; font-size: 28px;">Welcome to Depanku.id! 🎉</h1>
                </div>
                
                <p style="font-size: 16px; color: #374151;">Hello {name},</p>
                
                <p style="font-size: 16px; color: #374151;">
                    Congratulations! Your email has been verified and your Depanku.id account is now active.
                </p>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #667eea; margin-top: 0;">What you can do now:</h3>
                    <ul style="color: #374151;">
                        <li>🔍 <strong>Discover opportunities</strong> tailored to your interests</li>
                        <li>🔖 <strong>Bookmark favorites</strong> for easy access</li>
                        <li>📧 <strong>Get deadline reminders</strong> for important applications</li>
                        <li>📊 <strong>Track your progress</strong> and applications</li>
                        <li>✨ <strong>Share opportunities</strong> with friends</li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{FRONTEND_URL}" 
                       style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                              color: white; 
                              padding: 15px 40px; 
                              text-decoration: none; 
                              border-radius: 8px; 
                              font-weight: bold; 
                              display: inline-block;">
                        Start Exploring
                    </a>
                </div>
                
                <p style="font-size: 14px; color: #6b7280;">
                    Need help? Check out our <a href="{FRONTEND_URL}/about" style="color: #667eea;">About page</a> 
                    or contact us at <a href="mailto:support@depanku.id" style="color: #667eea;">support@depanku.id</a>
                </p>
            </div>
        </body>
        </html>
        """
        
        return EmailService._send_email(
            to_email=email,
            to_name=name,
            subject="Welcome to Depanku.id! 🎉",
            html_content=html_content
        )
    
    @staticmethod
    def send_password_reset_email(email, name, reset_link):
        """Send password reset email"""
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Reset Your Password - Depanku.id</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #667eea; font-size: 28px;">Password Reset Request</h1>
                </div>
                
                <p style="font-size: 16px; color: #374151;">Hello {name},</p>
                
                <p style="font-size: 16px; color: #374151;">
                    We received a request to reset your password for your Depanku.id account.
                </p>
                
                <p style="font-size: 16px; color: #374151;">
                    Click the button below to reset your password:
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_link}" 
                       style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                              color: white; 
                              padding: 15px 40px; 
                              text-decoration: none; 
                              border-radius: 8px; 
                              font-weight: bold; 
                              display: inline-block;">
                        Reset Password
                    </a>
                </div>
                
                <p style="font-size: 14px; color: #6b7280;">
                    Or copy and paste this link into your browser:<br>
                    <a href="{reset_link}" style="color: #667eea; word-break: break-all;">{reset_link}</a>
                </p>
                
                <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">
                    This reset link will expire in 1 hour for security reasons.
                    If you didn't request this reset, please ignore this email.
                </p>
            </div>
        </body>
        </html>
        """
        
        return EmailService._send_email(
            to_email=email,
            to_name=name,
            subject="Reset Your Depanku.id Password",
            html_content=html_content
        )
    
    @staticmethod
    def send_opportunity_reminder(email, name, opportunity_title, deadline):
        """Send deadline reminder email"""
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Deadline Reminder - Depanku.id</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #667eea; font-size: 28px;">⏰ Deadline Reminder</h1>
                </div>
                
                <p style="font-size: 16px; color: #374151;">Hello {name},</p>
                
                <p style="font-size: 16px; color: #374151;">
                    This is a friendly reminder that the application deadline for 
                    <strong>"{opportunity_title}"</strong> is approaching.
                </p>
                
                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; font-weight: bold; color: #92400e;">
                        📅 Deadline: {deadline}
                    </p>
                </div>
                
                <p style="font-size: 16px; color: #374151;">
                    Don't miss out on this opportunity! Make sure to submit your application on time.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{FRONTEND_URL}/search" 
                       style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                              color: white; 
                              padding: 15px 40px; 
                              text-decoration: none; 
                              border-radius: 8px; 
                              font-weight: bold; 
                              display: inline-block;">
                        View Opportunity
                    </a>
                </div>
            </div>
        </body>
        </html>
        """
        
        return EmailService._send_email(
            to_email=email,
            to_name=name,
            subject=f"⏰ Deadline Reminder: {opportunity_title}",
            html_content=html_content
        )
    
    @staticmethod
    def _send_email(to_email, to_name, subject, html_content):
        """Internal method to send email via Brevo"""
        try:
            send_smtp_email = SendSmtpEmail(
                to=[SendSmtpEmailTo(email=to_email, name=to_name)],
                sender=SendSmtpEmailSender(
                    email=BREVO_SENDER_EMAIL,
                    name=BREVO_SENDER_NAME
                ),
                subject=subject,
                htmlContent=html_content
            )
            
            result = brevo_api_instance.send_transac_email(send_smtp_email)
            logger.info(f"Email sent successfully to {to_email}. Message ID: {result.message_id if hasattr(result, 'message_id') else 'N/A'}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False
```

### 2. Email Routes

**Create: `backend/routes/email_routes.py`**
```python
"""Email routes for Brevo integration"""
from flask import Blueprint, request, jsonify
from services.email_service import EmailService
from utils.decorators import require_auth
from utils.logging_config import logger

email_bp = Blueprint('email', __name__, url_prefix='/api/email')

@email_bp.route('/send-welcome', methods=['POST'])
@require_auth
def send_welcome_email():
    """Send welcome email to verified user"""
    try:
        data = request.get_json()
        email = data.get('email')
        name = data.get('name')
        
        if not email or not name:
            return jsonify({
                "success": False,
                "error": "Email and name are required"
            }), 400
        
        success = EmailService.send_welcome_email(email, name)
        
        if success:
            return jsonify({
                "success": True,
                "message": "Welcome email sent successfully"
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": "Failed to send welcome email"
            }), 500
            
    except Exception as e:
        logger.error(f"Error sending welcome email: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Internal server error"
        }), 500

@email_bp.route('/send-reminder', methods=['POST'])
@require_auth
def send_reminder_email():
    """Send deadline reminder email"""
    try:
        data = request.get_json()
        email = data.get('email')
        name = data.get('name')
        opportunity_title = data.get('opportunity_title')
        deadline = data.get('deadline')
        
        if not all([email, name, opportunity_title, deadline]):
            return jsonify({
                "success": False,
                "error": "All fields are required"
            }), 400
        
        success = EmailService.send_opportunity_reminder(
            email, name, opportunity_title, deadline
        )
        
        if success:
            return jsonify({
                "success": True,
                "message": "Reminder email sent successfully"
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": "Failed to send reminder email"
            }), 500
            
    except Exception as e:
        logger.error(f"Error sending reminder email: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Internal server error"
        }), 500
```

### 3. Update App Configuration

**Update: `backend/app.py`**
```python
# Add email routes import
from routes.email_routes import email_bp

# Register email blueprint
app.register_blueprint(email_bp)
```

---

## Testing & Debugging

### 1. Test Email Sending

**Create: `backend/test_email.py`**
```python
"""Test script for Brevo email functionality"""
import os
from dotenv import load_dotenv
from services.email_service import EmailService

load_dotenv()

def test_verification_email():
    """Test verification email"""
    print("Testing verification email...")
    
    success = EmailService.send_verification_email(
        email="test@example.com",
        name="Test User",
        verification_link="https://depanku.id/verify-email?token=test123"
    )
    
    print(f"Verification email test: {'✅ Success' if success else '❌ Failed'}")

def test_welcome_email():
    """Test welcome email"""
    print("Testing welcome email...")
    
    success = EmailService.send_welcome_email(
        email="test@example.com",
        name="Test User"
    )
    
    print(f"Welcome email test: {'✅ Success' if success else '❌ Failed'}")

def test_reminder_email():
    """Test reminder email"""
    print("Testing reminder email...")
    
    success = EmailService.send_opportunity_reminder(
        email="test@example.com",
        name="Test User",
        opportunity_title="Summer Research Program",
        deadline="2024-03-15"
    )
    
    print(f"Reminder email test: {'✅ Success' if success else '❌ Failed'}")

if __name__ == "__main__":
    print("🧪 Testing Brevo Email Integration")
    print("=" * 40)
    
    test_verification_email()
    test_welcome_email()
    test_reminder_email()
    
    print("\n✅ Email testing completed!")
```

### 2. Run Tests
```bash
cd backend
python test_email.py
```

### 3. Debug Common Issues

**Check Environment Variables:**
```python
import os
from dotenv import load_dotenv

load_dotenv()

print(f"BREVO_API_KEY: {'✅ Set' if os.getenv('BREVO_API_KEY') else '❌ Missing'}")
print(f"BREVO_SENDER_EMAIL: {'✅ Set' if os.getenv('BREVO_SENDER_EMAIL') else '❌ Missing'}")
print(f"BREVO_SENDER_NAME: {'✅ Set' if os.getenv('BREVO_SENDER_NAME') else '❌ Missing'}")
```

---

## Production Deployment

### 1. Environment Variables for Production

**Production `.env`:**
```env
# Brevo Production Configuration
BREVO_API_KEY=xkeys-your-production-api-key
BREVO_SENDER_EMAIL=verify@depanku.id
BREVO_SENDER_NAME=Depanku Verification

# Frontend URL
FRONTEND_URL=https://depanku.id

# Other production settings
FLASK_ENV=production
FLASK_DEBUG=False
```

### 2. Domain Authentication

1. **Add DNS Records:**
   ```
   Type: TXT
   Name: brevo._domainkey
   Value: [Brevo provided value]
   ```

2. **Verify in Brevo Dashboard:**
   - Go to Settings → Senders & IP
   - Click "Authenticate your domain"
   - Wait for verification (24-48 hours)

### 3. Monitor Email Delivery

**Brevo Dashboard:**
- Go to **Statistics** → **Transactional emails**
- Monitor delivery rates
- Check bounce rates
- Review spam complaints

---

## Best Practices

### 1. Email Security
- ✅ Always verify sender emails
- ✅ Use HTTPS for all links
- ✅ Implement rate limiting
- ✅ Validate email addresses
- ✅ Use secure tokens

### 2. Email Content
- ✅ Mobile-responsive templates
- ✅ Clear call-to-action buttons
- ✅ Professional branding
- ✅ Unsubscribe links (for marketing)
- ✅ Plain text alternatives

### 3. Performance
- ✅ Async email sending
- ✅ Queue system for high volume
- ✅ Error handling and retries
- ✅ Logging and monitoring

### 4. Compliance
- ✅ GDPR compliance
- ✅ CAN-SPAM Act compliance
- ✅ Clear unsubscribe options
- ✅ Privacy policy links

---

## Troubleshooting

### Common Issues

**1. "Invalid API Key" Error**
```bash
# Check API key format
echo $BREVO_API_KEY | head -c 10
# Should start with 'xkeys-'
```

**2. "Sender not verified" Error**
- Verify sender email in Brevo dashboard
- Check DNS records for domain authentication

**3. "Rate limit exceeded" Error**
- Implement exponential backoff
- Use queue system for high volume

**4. Emails going to spam**
- Configure SPF, DKIM, DMARC records
- Use authenticated domain
- Avoid spam trigger words

### Debug Commands

**Check Brevo API Status:**
```python
from config.settings import brevo_api_instance

try:
    # Test API connection
    result = brevo_api_instance.get_account()
    print(f"✅ Brevo API connected: {result.email}")
except Exception as e:
    print(f"❌ Brevo API error: {e}")
```

**Test Email Sending:**
```python
from services.email_service import EmailService

# Test with your actual email
success = EmailService.send_verification_email(
    email="your-email@example.com",
    name="Your Name",
    verification_link="https://depanku.id/verify-email?token=test123"
)
print(f"Email test: {'✅ Success' if success else '❌ Failed'}")
```

---

## 🎉 Conclusion

You now have a complete Brevo implementation for your DepankuId project! This includes:

- ✅ **Email verification system**
- ✅ **Welcome emails**
- ✅ **Password reset functionality**
- ✅ **Deadline reminders**
- ✅ **Professional HTML templates**
- ✅ **Production-ready configuration**
- ✅ **Comprehensive testing**
- ✅ **Best practices implementation**

**Next Steps:**
1. Set up your Brevo account
2. Configure environment variables
3. Test email functionality
4. Deploy to production
5. Monitor email delivery rates

**Need Help?**
- Check the [Brevo Documentation](https://developers.brevo.com/)
- Review your email logs in the Brevo dashboard
- Test with the provided test scripts

Happy emailing! 📧✨
