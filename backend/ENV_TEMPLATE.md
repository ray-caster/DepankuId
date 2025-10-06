# Backend Environment Variables Template

Create a `.env` file in the `backend/` directory with these variables:

## Firebase Configuration
```env
# Firebase Service Account (JSON string)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}
```

## OpenRouter (AI)
```env
OPENROUTER_API_KEY=your_openrouter_api_key
```

## Algolia (Search)
```env
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_ADMIN_API_KEY=your_algolia_admin_key
```

## Brevo (Email Service)
```env
# Brevo API Key
BREVO_API_KEY=your_brevo_api_key

# Verified Sender Email (from Brevo dashboard)
BREVO_SENDER_EMAIL=verify@depanku.id

# Sender Name (displayed in emails)
BREVO_SENDER_NAME=Depanku Verification
```

## Application
```env
# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True

# Server Port
PORT=5000
```

## Production Example

For production (e.g., Railway, Heroku):
```env
FRONTEND_URL=https://depanku.id
FLASK_ENV=production
FLASK_DEBUG=False
PORT=5000
```

## Notes

1. **BREVO_SENDER_EMAIL**: Must be verified in Brevo dashboard
   - Go to Brevo → Settings → Senders
   - Add and verify `verify@depanku.id`
   - DKIM and DMARC should be configured

2. **FIREBASE_SERVICE_ACCOUNT_KEY**: Get from Firebase Console
   - Project Settings → Service Accounts
   - Generate New Private Key
   - Copy the entire JSON as a single-line string

3. **Security**: Never commit `.env` files to Git!
