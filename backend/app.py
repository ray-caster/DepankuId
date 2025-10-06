from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore, auth
import requests
from algoliasearch.search.client import SearchClientSync
import json
from brevo import Brevo
from brevo.models import SendSmtpEmail
from brevo.models import SendSmtpEmailTo
from brevo.models import SendSmtpEmailSender
import secrets
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin
firebase_service_account = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY")

if not firebase_admin._apps:
    if firebase_service_account:
        # Parse JSON string from environment variable
        import json
        firebase_config = json.loads(firebase_service_account)
        cred = credentials.Certificate(firebase_config)
        firebase_admin.initialize_app(cred)
    else:
        print("Warning: FIREBASE_SERVICE_ACCOUNT_KEY not found in environment")

db = firestore.client()

# Initialize Algolia (using sync client)
algolia_client = SearchClientSync(
    os.getenv("ALGOLIA_APP_ID"),
    os.getenv("ALGOLIA_ADMIN_API_KEY")
)
ALGOLIA_INDEX_NAME = 'opportunities'

# OpenRouter configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# Brevo configuration
BREVO_API_KEY = os.getenv("BREVO_API_KEY")
brevo_client = Brevo(api_key=BREVO_API_KEY)


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "Depanku.id Backend"}), 200


@app.route('/api/ai/chat', methods=['POST'])
def ai_chat():
    """
    AI Socratic discovery endpoint
    Handles conversational AI interactions using OpenRouter
    """
    try:
        data = request.json
        user_message = data.get('message', '')
        conversation_history = data.get('history', [])
        
        # System prompt for Socratic questioning
        system_prompt = """You are a thoughtful guide for Depanku.id, helping users discover opportunities that match their interests and goals. 

Your role is to:
1. Ask reflective, open-ended questions to understand the user's interests, skills, and aspirations
2. Be warm, encouraging, and conversational
3. Guide users toward clarity about what they're looking for
4. Ask one question at a time
5. Keep responses concise (2-3 sentences max)

Example questions:
- "What kind of problems do you love solving?"
- "Do you enjoy working with people or ideas?"
- "What topics make you lose track of time when you're learning about them?"
- "Are you looking to build skills, meet like-minded people, or explore new fields?"

Based on their answers, help narrow down whether they'd be interested in research programs, competitions, communities, or youth programs."""

        # Prepare messages for OpenRouter
        messages = [
            {"role": "system", "content": system_prompt}
        ]
        
        # Add conversation history
        for msg in conversation_history:
            messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", "")
            })
        
        # Add current user message
        messages.append({
            "role": "user",
            "content": user_message
        })

        # Call OpenRouter API
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://depanku.id",
            "X-Title": "Depanku.id"
        }

        payload = {
            "model": "anthropic/claude-3.5-sonnet",  # You can change this to any OpenRouter model
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 300
        }

        response = requests.post(OPENROUTER_URL, json=payload, headers=headers)
        response.raise_for_status()
        
        ai_response = response.json()
        assistant_message = ai_response['choices'][0]['message']['content']

        return jsonify({
            "success": True,
            "message": assistant_message,
            "conversation_id": data.get('conversation_id', None)
        }), 200

    except Exception as e:
        print(f"Error in AI chat: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/opportunities', methods=['GET'])
def get_opportunities():
    """Get all opportunities from Firestore"""
    try:
        opportunities_ref = db.collection('opportunities')
        docs = opportunities_ref.stream()
        
        opportunities = []
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            opportunities.append(data)
        
        return jsonify({
            "success": True,
            "data": opportunities
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/opportunities', methods=['POST'])
def create_opportunity():
    """Create a new opportunity"""
    try:
        data = request.json
        
        # Add to Firestore
        doc_ref = db.collection('opportunities').document()
        doc_ref.set(data)
        
        # Add to Algolia
        data['objectID'] = doc_ref.id
        algolia_client.save_objects(
            index_name=ALGOLIA_INDEX_NAME,
            objects=[data]
        )
        
        return jsonify({
            "success": True,
            "id": doc_ref.id,
            "data": data
        }), 201
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/opportunities/<opportunity_id>', methods=['GET'])
def get_opportunity(opportunity_id):
    """Get a single opportunity by ID"""
    try:
        doc_ref = db.collection('opportunities').document(opportunity_id)
        doc = doc_ref.get()
        
        if doc.exists:
            data = doc.to_dict()
            data['id'] = doc.id
            return jsonify({
                "success": True,
                "data": data
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": "Opportunity not found"
            }), 404
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/user/preferences', methods=['POST'])
def save_user_preferences():
    """Save user preferences and conversation data"""
    try:
        data = request.json
        user_id = data.get('user_id')
        preferences = data.get('preferences', {})
        
        if not user_id:
            return jsonify({
                "success": False,
                "error": "user_id is required"
            }), 400
        
        # Save to Firestore
        user_ref = db.collection('users').document(user_id)
        user_ref.set({
            'preferences': preferences,
            'updated_at': firestore.SERVER_TIMESTAMP
        }, merge=True)
        
        return jsonify({
            "success": True,
            "message": "Preferences saved successfully"
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/user/preferences/<user_id>', methods=['GET'])
def get_user_preferences(user_id):
    """Get user preferences"""
    try:
        user_ref = db.collection('users').document(user_id)
        doc = user_ref.get()
        
        if doc.exists:
            return jsonify({
                "success": True,
                "data": doc.to_dict()
            }), 200
        else:
            return jsonify({
                "success": True,
                "data": {"preferences": {}}
            }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/sync-algolia', methods=['POST'])
def sync_algolia():
    """Sync all Firestore opportunities to Algolia"""
    try:
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
        
        return jsonify({
            "success": True,
            "message": f"Synced {len(records)} opportunities to Algolia"
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """Sign up a new user with email verification"""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        
        if not email or not password or not name:
            return jsonify({
                "success": False,
                "message": "Email, password, and name are required"
            }), 400
        
        # Create user in Firebase Auth
        try:
            user = auth.create_user(
                email=email,
                password=password,
                display_name=name,
                email_verified=False
            )
        except Exception as e:
            return jsonify({
                "success": False,
                "message": f"Failed to create user: {str(e)}"
            }), 400
        
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
        
        # Send verification email via Brevo
        verification_link = f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/verify-email?token={verification_token}&uid={user.uid}"
        
        send_smtp_email = SendSmtpEmail(
            to=[SendSmtpEmailTo(email=email, name=name)],
            sender=SendSmtpEmailSender(email="noreply@depanku.id", name="Depanku.id"),
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
                    
                    <div style="margin-top: 30px; padding: 20px; background: white; border-radius: 8px;">
                        <h3 style="color: #374151; margin-top: 0;">What's Next?</h3>
                        <ul style="color: #6b7280; line-height: 1.8;">
                            <li>🔖 Bookmark your favorite opportunities</li>
                            <li>🎯 Get personalized recommendations</li>
                            <li>📧 Receive deadline reminders</li>
                            <li>✨ Access AI-powered discovery</li>
                        </ul>
                    </div>
                    
                    <p style="font-size: 14px; color: #9ca3af; margin-top: 30px;">
                        If you didn't create this account, you can safely ignore this email.
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 14px;">
                    <p>Made with ❤️ by Depanku.id</p>
                </div>
            </body>
            </html>
            """
        )
        
        try:
            brevo_client.send_transactional_email(send_smtp_email)
        except Exception as e:
            print(f"Error sending email: {str(e)}")
            # Don't fail the signup if email fails
        
        return jsonify({
            "success": True,
            "message": "Account created successfully. Please check your email to verify your account."
        }), 201
    
    except Exception as e:
        print(f"Error in signup: {str(e)}")
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@app.route('/api/auth/verify-email', methods=['POST'])
def verify_email():
    """Verify user email with token"""
    try:
        data = request.json
        token = data.get('token')
        uid = data.get('uid')
        
        if not token or not uid:
            return jsonify({
                "success": False,
                "message": "Token and UID are required"
            }), 400
        
        # Get user from Firestore
        user_ref = db.collection('users').document(uid)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404
        
        user_data = user_doc.to_dict()
        
        if user_data.get('verification_token') != token:
            return jsonify({
                "success": False,
                "message": "Invalid verification token"
            }), 400
        
        # Update user as verified
        user_ref.update({
            'email_verified': True,
            'verification_token': firestore.DELETE_FIELD,
            'verified_at': firestore.SERVER_TIMESTAMP
        })
        
        # Update Firebase Auth
        auth.update_user(uid, email_verified=True)
        
        return jsonify({
            "success": True,
            "message": "Email verified successfully"
        }), 200
    
    except Exception as e:
        print(f"Error in verify_email: {str(e)}")
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@app.route('/api/auth/signin', methods=['POST'])
def signin():
    """Sign in a user - Frontend will handle Firebase authentication directly"""
    try:
        data = request.json
        email = data.get('email')
        
        if not email:
            return jsonify({
                "success": False,
                "message": "Email is required"
            }), 400
        
        # Get user from Firebase to check verification status
        try:
            user = auth.get_user_by_email(email)
        except Exception as e:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404
        
        if not user.email_verified:
            return jsonify({
                "success": False,
                "message": "Please verify your email before signing in. Check your inbox for the verification link."
            }), 400
        
        # Return success - frontend will handle actual authentication
        return jsonify({
            "success": True,
            "message": "Email verified. Please proceed with sign in.",
            "emailVerified": True
        }), 200
    
    except Exception as e:
        print(f"Error in signin: {str(e)}")
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@app.route('/api/bookmarks', methods=['GET'])
def get_bookmarks():
    """Get user's bookmarked opportunities"""
    try:
        # Get user ID from authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({
                "success": False,
                "message": "Unauthorized"
            }), 401
        
        id_token = auth_header.split('Bearer ')[1]
        decoded_token = auth.verify_id_token(id_token)
        user_id = decoded_token['uid']
        
        # Get bookmarks from Firestore
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return jsonify({
                "success": True,
                "data": []
            }), 200
        
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
        
        return jsonify({
            "success": True,
            "data": opportunities
        }), 200
    
    except Exception as e:
        print(f"Error in get_bookmarks: {str(e)}")
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@app.route('/api/bookmarks/<opportunity_id>', methods=['POST'])
def add_bookmark(opportunity_id):
    """Add an opportunity to user's bookmarks"""
    try:
        # Get user ID from authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({
                "success": False,
                "message": "Unauthorized"
            }), 401
        
        id_token = auth_header.split('Bearer ')[1]
        decoded_token = auth.verify_id_token(id_token)
        user_id = decoded_token['uid']
        
        # Add bookmark
        user_ref = db.collection('users').document(user_id)
        user_ref.set({
            'bookmarks': firestore.ArrayUnion([opportunity_id])
        }, merge=True)
        
        return jsonify({
            "success": True,
            "message": "Bookmark added successfully"
        }), 200
    
    except Exception as e:
        print(f"Error in add_bookmark: {str(e)}")
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@app.route('/api/bookmarks/<opportunity_id>', methods=['DELETE'])
def remove_bookmark(opportunity_id):
    """Remove an opportunity from user's bookmarks"""
    try:
        # Get user ID from authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({
                "success": False,
                "message": "Unauthorized"
            }), 401
        
        id_token = auth_header.split('Bearer ')[1]
        decoded_token = auth.verify_id_token(id_token)
        user_id = decoded_token['uid']
        
        # Remove bookmark
        user_ref = db.collection('users').document(user_id)
        user_ref.update({
            'bookmarks': firestore.ArrayRemove([opportunity_id])
        })
        
        return jsonify({
            "success": True,
            "message": "Bookmark removed successfully"
        }), 200
    
    except Exception as e:
        print(f"Error in remove_bookmark: {str(e)}")
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

