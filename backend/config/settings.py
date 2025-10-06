"""Application configuration and initialization"""
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore, auth
from algoliasearch.search.client import SearchClientSync
import brevo_python
from brevo_python import TransactionalEmailsApi

# Load environment variables
load_dotenv()

# Firebase Configuration
firebase_service_account = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY")

if not firebase_admin._apps:
    if firebase_service_account:
        import json
        firebase_config = json.loads(firebase_service_account)
        cred = credentials.Certificate(firebase_config)
        firebase_admin.initialize_app(cred)
    else:
        print("Warning: FIREBASE_SERVICE_ACCOUNT_KEY not found in environment")

# Database client
db = firestore.client()

# Algolia Configuration
algolia_client = SearchClientSync(
    os.getenv("ALGOLIA_APP_ID"),
    os.getenv("ALGOLIA_ADMIN_API_KEY")
)
ALGOLIA_INDEX_NAME = 'opportunities'

# OpenRouter Configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# Brevo Configuration
BREVO_API_KEY = os.getenv("BREVO_API_KEY")
BREVO_SENDER_EMAIL = os.getenv("BREVO_SENDER_EMAIL", "verify@depanku.id")
BREVO_SENDER_NAME = os.getenv("BREVO_SENDER_NAME", "Depanku Verification")

brevo_configuration = brevo_python.Configuration()
brevo_configuration.api_key['api-key'] = BREVO_API_KEY
brevo_api_instance = TransactionalEmailsApi(brevo_python.ApiClient(brevo_configuration))

# App Configuration
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')

