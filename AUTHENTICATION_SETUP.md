# Authentication & Bookmark Feature Setup

This document explains the new email authentication system with Brevo email verification and bookmark functionality.

## 🚀 Features Added

### 1. Email Authentication with Brevo Verification
- ✅ Email/password signup and signin (replacing Google OAuth)
- ✅ Email verification using Brevo transactional emails
- ✅ Beautiful, persuasive verification emails with benefits
- ✅ Secure token-based email verification
- ✅ Email verification required before signin

### 2. Bookmark Functionality
- ✅ Users can bookmark opportunities
- ✅ Bookmarks are stored per user in Firestore
- ✅ Visual bookmark button on opportunity cards
- ✅ Real-time bookmark state updates

### 3. UI Improvements
- ✅ Fixed invisible "Depanku.id" logo in navbar
- ✅ Persuasive signup/signin modal with benefits
- ✅ Beautiful email verification page

## 📦 New Dependencies

### Backend (Python)
- `brevo-python>=2.0.0` - For sending transactional emails

### Frontend (Already included)
- Firebase Auth with email/password support
- Heroicons for bookmark icons

## 🔧 Environment Variables

### Backend (`backend/.env`)

Add these new environment variables:

```env
# Brevo Email Configuration (REQUIRED)
BREVO_API_KEY=your_brevo_api_key_here

# Frontend URL for email verification links
FRONTEND_URL=http://localhost:3000
# In production: FRONTEND_URL=https://depanku.id

# Firebase Web API Key (for email verification check)
FIREBASE_API_KEY=your_firebase_web_api_key_here
# Or use NEXT_PUBLIC_FIREBASE_API_KEY if already set
```

### Getting Your Brevo API Key

1. Go to [Brevo](https://app.brevo.com) and sign up for a free account
2. Navigate to **Settings** → **SMTP & API** → **API Keys**
3. Create a new API key with v3 permissions
4. Copy the key and add it to your `.env` file

**Note:** Brevo free tier includes:
- 300 emails per day
- All transactional email features
- Perfect for development and small applications

### Frontend (`.env.local`)

Your existing Firebase configuration should work. Ensure you have:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🗄️ Database Schema

### Firestore Collections

#### `users` collection
```javascript
{
  uid: string,                    // Firebase Auth UID
  email: string,
  name: string,
  verification_token: string,     // Temporary, deleted after verification
  email_verified: boolean,
  created_at: timestamp,
  verified_at: timestamp,
  bookmarks: [opportunityId1, opportunityId2, ...],  // Array of opportunity IDs
  preferences: {
    // ... existing preferences
  }
}
```

## 🎯 API Endpoints

### Authentication Endpoints

#### `POST /api/auth/signup`
Create a new user account and send verification email.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully. Please check your email to verify your account."
}
```

#### `POST /api/auth/signin`
Verify email verification status before signin.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified. Please proceed with sign in.",
  "emailVerified": true
}
```

#### `POST /api/auth/verify-email`
Verify user's email with token.

**Request:**
```json
{
  "token": "verification_token_from_email",
  "uid": "firebase_user_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### Bookmark Endpoints

#### `GET /api/bookmarks`
Get user's bookmarked opportunities.

**Headers:**
```
Authorization: Bearer <firebase_id_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "opportunity_id",
      "title": "...",
      // ... full opportunity data
    }
  ]
}
```

#### `POST /api/bookmarks/<opportunity_id>`
Add an opportunity to bookmarks.

**Headers:**
```
Authorization: Bearer <firebase_id_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Bookmark added successfully"
}
```

#### `DELETE /api/bookmarks/<opportunity_id>`
Remove an opportunity from bookmarks.

**Headers:**
```
Authorization: Bearer <firebase_id_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Bookmark removed successfully"
}
```

## 🎨 Frontend Components

### Updated Components

1. **`Header.tsx`**
   - Fixed invisible logo (changed from `text-primary-700` to `text-primary-800`)
   - Removed Google sign-in reference

2. **`AuthProvider.tsx`**
   - Added `signInWithEmail` method
   - Added `signUpWithEmail` method
   - Added `idToken` state for API authentication
   - Added `refreshIdToken` method

3. **`AuthModal.tsx`**
   - Already using email auth methods
   - Persuasive UI with benefits list
   - Email verification confirmation screen

4. **`OpportunityCard.tsx`**
   - Added bookmark button
   - Real-time bookmark state
   - Visual feedback for bookmarked items
   - Authentication check before bookmarking

5. **`app/verify-email/page.tsx`** (NEW)
   - Email verification page
   - Handles verification token
   - Shows success/error states
   - Auto-redirects after verification

## 🚀 Setup Instructions

### 1. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create `backend/.env` and add:
- `BREVO_API_KEY` (required)
- `FRONTEND_URL` (for email links)
- `FIREBASE_API_KEY` (for verification checks)

### 3. Configure Brevo Sender Email

**Important:** You need to verify your sender email in Brevo:

1. Go to Brevo Dashboard → **Senders**
2. Add `noreply@depanku.id` or your custom email
3. Verify the email (check your inbox)
4. For development, you can use any verified email in Brevo

**Alternative for Development:**
Update `backend/app.py` line 364 to use your verified email:
```python
sender=SendSmtpEmailSender(email="your-verified-email@example.com", name="Depanku.id"),
```

### 4. Enable Email/Password Auth in Firebase

1. Go to Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Save changes

### 5. Run the Application

**Backend:**
```bash
cd backend
python app.py
```

**Frontend:**
```bash
npm run dev
```

## 📧 Email Verification Flow

1. User signs up with email/password/name
2. Backend creates Firebase user (unverified)
3. Backend generates verification token
4. Backend sends beautiful email via Brevo with verification link
5. User clicks link → redirected to `/verify-email?token=...&uid=...`
6. Frontend verifies token via API
7. Backend marks email as verified in Firebase & Firestore
8. User can now sign in

## 🔖 Bookmark Flow

1. User must be signed in
2. Click bookmark icon on opportunity card
3. Frontend sends request with Firebase ID token
4. Backend verifies token and adds/removes bookmark
5. UI updates in real-time
6. Bookmarks persist across sessions

## 🎨 Email Template

The verification email includes:
- Welcome message with user's name
- Clear call-to-action button
- Benefits list (bookmarks, AI discovery, etc.)
- Alternative plain text link
- Professional design with gradients
- Mobile-responsive layout

## 🔒 Security Features

- Email verification required before signin
- Password minimum 6 characters
- Firebase Auth security rules
- Secure token generation (`secrets.token_urlsafe`)
- Token-based authentication for API endpoints
- Tokens deleted after verification

## 🐛 Troubleshooting

### Email not sending?
- Check `BREVO_API_KEY` is correct
- Verify sender email in Brevo dashboard
- Check Brevo free tier limits (300 emails/day)
- Look at backend console for error messages

### Verification link not working?
- Check `FRONTEND_URL` is set correctly
- Ensure frontend is running on the correct port
- Verify token hasn't expired (you may want to add expiration logic)

### Bookmark not saving?
- User must be signed in
- Check Firebase ID token is valid
- Verify opportunity ID exists in Firestore
- Check browser console for errors

## 🎉 Testing

### Test Signup Flow
1. Visit http://localhost:3000
2. Click "Sign In"
3. Click "Don't have an account? Sign Up"
4. Fill in email, password, name
5. Check email for verification link
6. Click verification link
7. Sign in with email/password

### Test Bookmarks
1. Sign in
2. Browse opportunities
3. Click bookmark icon on any opportunity
4. Refresh page - bookmark should persist
5. Click again to remove bookmark

## 📝 Notes

- Google Sign-In has been removed (you can re-add if needed)
- All authentication now uses email/password
- Email verification is mandatory
- Bookmarks require authentication
- Free Brevo tier is sufficient for development and small apps

## 🔄 Migration from Google Auth

If you have existing Google-authenticated users:
1. They can continue using Google Sign-In (if you re-enable it)
2. Or they can create a new account with email/password
3. Consider adding account linking functionality in the future

## 🎯 Future Enhancements

Potential improvements:
- Password reset functionality
- Email change with re-verification
- Account deletion
- Bookmark collections/folders
- Share bookmarks with others
- Export bookmarks
- Bookmark notes/tags

