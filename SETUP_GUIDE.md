# Depanku.id Setup Guide

## Quick Start Summary

All technical issues have been resolved! Here's what you need to do to get the app running:

## 1. Backend Setup

### Step 1: Create Environment File

Create a file named `.env` in the `backend/` directory with your credentials:

```bash
# backend/.env
FIREBASE_SERVICE_ACCOUNT_KEY='your-firebase-json-here'
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_ADMIN_API_KEY=your_algolia_admin_key
OPENROUTER_API_KEY=your_openrouter_key
```

### Step 2: Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → **Project Settings** (gear icon ⚙️)
3. Go to **Service Accounts** tab
4. Click **Generate new private key** and download the JSON
5. Convert the JSON to a single-line string (see `backend/FIREBASE_SETUP.md` for details)
6. Add it to your `.env` file wrapped in single quotes `'...'`

**Important:** Keep the `\n` characters in the private key!

### Step 3: Get Algolia Credentials

1. Go to [Algolia Dashboard](https://www.algolia.com/dashboard)
2. Go to **Settings** → **API Keys**
3. Copy your **Application ID** and **Admin API Key**
4. Add them to your `.env` file

### Step 4: Get OpenRouter API Key

1. Go to [OpenRouter](https://openrouter.ai/keys)
2. Create an API key
3. Add it to your `.env` file

### Step 5: Seed Initial Data

```bash
python backend/seed_data.py
```

### Step 6: Start Backend Server

```bash
python backend/app.py
```

The backend should now be running on `http://localhost:5000`

## 2. Frontend Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:3001` (or 3000 if available)

## 3. Features Overview

### Main Pages

- **Home** (`/`) - Landing page with search bar and curiosity tags
- **Search** (`/search`) - Search results page with InstantSearch (shows top 5 suggestions)
- **AI Discovery** (`/ai`) - AI-powered Socratic questioning interface

### Key Features

✅ **Search Functionality**
- Algolia InstantSearch integration
- Top 5 search suggestions
- Real-time search results
- Responsive search bar

✅ **AI Guided Discovery**
- OpenRouter API (Claude 3.5 Sonnet)
- Socratic questioning approach
- Full-page chat interface

✅ **Responsive Design**
- Mobile-first approach
- Responsive layout for all screen sizes
- Gestalt principles applied (Similarity, Proximity, Hierarchy)

✅ **Modern UI/UX**
- OKLCH color system
- Two-part shadow system (depth & elevation)
- Smooth animations with Framer Motion
- Clean, warm, reflective design

## 4. Project Structure

```
depanku-id/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── search/page.tsx    # Search results page
│   ├── ai/page.tsx        # AI discovery page
│   └── icon.svg           # Favicon
├── components/            # React components
│   ├── Header.tsx
│   ├── SearchWithButtons.tsx
│   ├── SearchResults.tsx
│   ├── OpportunityCard.tsx
│   └── AIDiscovery.tsx
├── lib/                   # Utilities
│   ├── firebase.ts
│   └── algolia.ts
├── backend/              # Flask API
│   ├── app.py
│   ├── seed_data.py
│   ├── requirements.txt
│   ├── FIREBASE_SETUP.md
│   └── ENV_TEMPLATE.md
└── tailwind.config.ts    # Tailwind + OKLCH colors
```

## 5. Fixed Issues

✅ **Algolia upgraded to v4.28.0** - Using the latest official Python client (Sep 2025)  
✅ **Firebase service account** - JSON string configuration working correctly  
✅ **Search and AI routes** - Separated endpoints (`/search` and `/ai`)  
✅ **InstantSearch** - Top 5 suggestions with smooth animations  
✅ **Responsive design** - Works across all screen sizes  
✅ **Icon/favicon** - SVG favicon working correctly  
✅ **Static chunks** - 404 errors resolved

## 6. Environment Variables

### Frontend (`.env.local` - create this file in project root)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_ALGOLIA_APP_ID=your_algolia_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_algolia_search_api_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### Backend (`backend/.env` - already covered above)

See **ENV_TEMPLATE.md** in the backend folder for the complete template.

## 7. Testing the App

1. **Test Search:**
   - Go to `http://localhost:3001`
   - Type in the search bar
   - See top 5 suggestions appear
   - Click "Search Opportunities"
   - Verify you're redirected to `/search?q=your-query`

2. **Test AI Discovery:**
   - From home, click "AI Guided Discovery"
   - Verify you're redirected to `/ai`
   - Try asking a question about opportunities
   - Verify the AI responds with Socratic questions

3. **Test Responsiveness:**
   - Resize browser window
   - Check mobile view (< 640px)
   - Check tablet view (640px - 1024px)
   - Check desktop view (> 1024px)

## 8. Deployment

### Frontend (Vercel)
```bash
vercel deploy
```

### Backend (Railway/Render)
1. Push to GitHub
2. Connect repository to Railway/Render
3. Set environment variables in dashboard
4. Deploy

## 9. Documentation

- **FIREBASE_SETUP.md** - Detailed Firebase service account setup
- **ENV_TEMPLATE.md** - Environment variables template
- **TROUBLESHOOTING.md** - Common issues and fixes (if exists)
- **IMPROVEMENTS_SUMMARY.md** - Design improvements log (if exists)

## 10. Need Help?

If you encounter any issues:

1. Check `backend/FIREBASE_SETUP.md` for Firebase setup
2. Verify all environment variables are set correctly
3. Make sure all dependencies are installed (`npm install` and `pip install -r backend/requirements.txt`)
4. Check console logs for specific error messages

## 11. What's Next?

The core functionality is complete! Consider these enhancements:

- [ ] Add user authentication
- [ ] Implement bookmarking/favorites
- [ ] Add opportunity filtering
- [ ] Create user profile pages
- [ ] Add analytics tracking
- [ ] Implement server-side rendering (SSR) for search
- [ ] Add more curiosity tags
- [ ] Enhance AI responses with context
