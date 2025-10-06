# 🚀 Quick Start Guide - Depanku.id v2.0

## Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Firebase project
- Algolia account
- OpenRouter API key
- Brevo API key (for emails)

## Step 1: Backend Setup

### Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Configure Environment
Create `backend/.env`:
```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
OPENROUTER_API_KEY=your_key
ALGOLIA_APP_ID=your_app_id
ALGOLIA_ADMIN_API_KEY=your_admin_key
BREVO_API_KEY=your_brevo_key
FRONTEND_URL=http://localhost:3000
FLASK_ENV=development
FLASK_DEBUG=True
```

### Seed Database
```bash
python seed_data.py
```

### Run Backend
```bash
python app.py
```

Backend running at: `http://localhost:5000`

## Step 2: Frontend Setup

### Install Dependencies
```bash
npm install
```

### Configure Environment
Create `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_APP_ID=your_algolia_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_algolia_search_key
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Run Frontend
```bash
npm run dev
```

Frontend running at: `http://localhost:3000`

## Step 3: Explore New Features

### 1. Dashboard (`/dashboard`)
- Sign in with Google or Email
- Browse bookmarked opportunities
- View deadline timeline
- Track upcoming deadlines

### 2. Opportunities (`/opportunities`)
- Create new opportunities
- Use templates for quick start
- Add social media links
- Set indefinite deadlines
- Fill comprehensive details

### 3. Admin Page Deprecation
- Visit `/admin` to see deprecation notice
- Auto-redirects to `/opportunities`

## Step 4: Test the API

### Health Check
```bash
curl http://localhost:5000/health
```

### Get Templates
```bash
curl http://localhost:5000/api/opportunities/templates
```

### Get Category Presets
```bash
curl http://localhost:5000/api/opportunities/presets/categories
```

### Get Tag Presets
```bash
curl http://localhost:5000/api/opportunities/presets/tags
```

## 📁 Project Structure

```
depanku-id/
├── app/                    # Next.js pages
│   ├── dashboard/         # Dashboard page ✨ NEW
│   ├── opportunities/     # Create opportunities ✨ NEW
│   ├── search/
│   ├── ai/
│   └── ...
├── backend/               # Flask API
│   ├── config/           # ✨ NEW modular structure
│   ├── models/           # ✨ NEW
│   ├── services/         # ✨ NEW
│   ├── routes/           # ✨ NEW
│   └── utils/            # ✨ NEW
├── components/           # React components
└── lib/                 # Utilities
```

## 🎯 Key Features to Try

### Dashboard
1. Bookmark opportunities from search
2. View them in dashboard
3. Toggle between grid and timeline view
4. See deadline indicators

### Opportunities
1. Click a template (Research, Competition, etc.)
2. Auto-filled form appears
3. Add categories from presets
4. Add tags from suggestions
5. Toggle indefinite deadline
6. Expand social media section
7. Submit to create

### Search & Discovery
1. Browse opportunities
2. Use AI discovery for personalized suggestions
3. Bookmark interesting opportunities
4. View them in dashboard

## 🔧 Troubleshooting

### Backend won't start
- Check `.env` file exists in `backend/`
- Verify Python dependencies installed
- Check port 5000 is available

### Frontend won't start
- Check `.env.local` exists in root
- Verify npm dependencies installed
- Check port 3000 is available

### Database empty
- Run `python backend/seed_data.py`
- Check Firebase credentials
- Verify Algolia connection

### API errors
- Check backend is running
- Verify CORS settings
- Check API URL in frontend config

## 📚 Documentation

- **Backend API**: See `backend/README.md`
- **Full Changelog**: See `CHANGELOG.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`

## 🎉 You're All Set!

Visit the following pages:
- 🏠 Home: `http://localhost:3000`
- 🔍 Browse: `http://localhost:3000/search`
- ✨ AI: `http://localhost:3000/ai`
- ➕ Opportunities: `http://localhost:3000/opportunities`
- 📊 Dashboard: `http://localhost:3000/dashboard`

Happy coding! 🚀

