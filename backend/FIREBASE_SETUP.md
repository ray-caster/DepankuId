# Firebase Service Account Setup

## Step 1: Get Your Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ next to "Project Overview" → **Project settings**
4. Go to the **Service accounts** tab
5. Click **Generate new private key**
6. Download the JSON file (e.g., `serviceAccountKey.json`)

## Step 2: Convert JSON to Single-Line String

The Firebase service account key needs to be stored as a **single-line JSON string** in your `.env` file.

### Option A: Manual Conversion

1. Open the downloaded JSON file
2. Remove all newlines and extra spaces
3. The JSON should look like: `{"type":"service_account","project_id":"your-project",...}`

### Option B: Using Python

```python
import json

# Read the downloaded service account file
with open('path/to/serviceAccountKey.json', 'r') as f:
    data = json.load(f)

# Convert to single-line string
single_line = json.dumps(data)
print(single_line)
```

### Option C: Using PowerShell (Windows)

```powershell
(Get-Content serviceAccountKey.json -Raw) -replace "`r`n", "" -replace "`n", ""
```

### Option D: Using Bash (Linux/Mac)

```bash
cat serviceAccountKey.json | tr -d '\n'
```

## Step 3: Add to `.env` File

1. Copy the single-line JSON string
2. Open `backend/.env`
3. Set `FIREBASE_SERVICE_ACCOUNT_KEY` with the JSON string:

```env
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}'
```

**Important Notes:**
- Use **single quotes** `'...'` around the JSON string
- Keep the `\n` characters in the private key (don't replace them)
- The JSON should be on one line but the `\n` inside the private key should remain
- Make sure there are NO line breaks in your `.env` file entry

## Example

Your `backend/.env` should look like:

```env
# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"depanku-id","private_key_id":"abc123","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xyz@depanku-id.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs/firebase-adminsdk-xyz%40depanku-id.iam.gserviceaccount.com"}'

# Algolia Configuration
ALGOLIA_APP_ID=your_app_id_here
ALGOLIA_ADMIN_API_KEY=your_admin_api_key_here

# OpenRouter Configuration  
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## Troubleshooting

### Error: "MalformedFraming"
- This means the private key is not formatted correctly
- Make sure the `\n` characters are preserved in the private key
- The private key should look like: `"-----BEGIN PRIVATE KEY-----\nXXX...\n-----END PRIVATE KEY-----\n"`

### Error: "Missing fields token_uri"
- Make sure all required fields are present in the JSON
- Verify the JSON is valid using a JSON validator
- The JSON must include: `type`, `project_id`, `private_key_id`, `private_key`, `client_email`, `client_id`, `auth_uri`, `token_uri`

### Error: "Cannot parse JSON"
- Check that you're using single quotes around the JSON string
- Verify there are no unescaped quotes inside the JSON
- Make sure the entire JSON is on one line in the `.env` file

