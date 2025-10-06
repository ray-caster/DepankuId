# Environment Variables Template

Create a `backend/.env` file with the following content:

```env
# Firebase Service Account Configuration
# Get your service account JSON from Firebase Console -> Project Settings -> Service Accounts
# Convert it to a single-line JSON string and wrap it in single quotes
# See FIREBASE_SETUP.md for detailed instructions
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}'

# Firebase Web API Key (for email/password authentication)
# Get this from Firebase Console -> Project Settings -> General -> Your apps -> Web app
FIREBASE_API_KEY=your_firebase_web_api_key_here
# Or use NEXT_PUBLIC_FIREBASE_API_KEY if already set in frontend

# Algolia Configuration
# Get these from Algolia Dashboard -> Settings -> API Keys
ALGOLIA_APP_ID=your_algolia_app_id_here
ALGOLIA_ADMIN_API_KEY=your_algolia_admin_api_key_here

# OpenRouter Configuration
# Get this from https://openrouter.ai/keys
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Brevo Email Configuration (for email verification)
# Get this from https://app.brevo.com/settings/keys/api
BREVO_API_KEY=your_brevo_api_key_here

# Frontend URL (for email verification links)
FRONTEND_URL=http://localhost:3000
# In production: FRONTEND_URL=https://depanku.id

# Server Configuration (optional)
PORT=5000
FLASK_ENV=development
```

## Quick Setup

1. Copy the above template to `backend/.env`
2. Follow `FIREBASE_SETUP.md` to get your Firebase service account key
3. Replace the placeholder values with your actual credentials
4. Run `python backend/seed_data.py` to seed initial data
5. Start the backend server with `python backend/app.py`

