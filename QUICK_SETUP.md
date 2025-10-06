# ⚡ Quick Setup - Depanku.id

## 🔥 Get Running in 3 Minutes

### Step 1: Install Dependencies (30 seconds)

```bash
# Frontend (already done)
npm install

# Backend
cd backend
pip install -r requirements.txt
```

### Step 2: Configure Firebase (1 minute)

**Get your Firebase Service Account JSON:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. **Settings** (⚙️) → **Service Accounts**
4. Click **"Generate new private key"**
5. Download the JSON file

**Add to backend/.env:**
```env
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your_project","private_key":"-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk@your_project.iam.gserviceaccount.com","token_uri":"https://oauth2.googleapis.com/token","auth_uri":"https://accounts.google.com/o/oauth2/auth","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40your_project.iam.gserviceaccount.com"}'
```

**💡 Tip:** Copy the entire JSON content from the downloaded file and wrap it in single quotes!

### Step 3: Add Other API Keys (30 seconds)

**In backend/.env:**
```env
FIREBASE_SERVICE_ACCOUNT_KEY='...'  # From Step 2

# OpenRouter (for AI)
OPENROUTER_API_KEY=your_openrouter_key

# Algolia (for search)
ALGOLIA_APP_ID=your_app_id
ALGOLIA_ADMIN_API_KEY=your_admin_key
```

**In .env.local (root):**
```env
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Algolia
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_search_key

# API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 4: Seed Database (30 seconds)

```bash
cd backend
python seed_data.py
```

You should see:
```
🌱 Starting database seeding...
✅ Added: MIT Research Science Institute
✅ Added: Google Code-in
...
🎉 Successfully seeded 12 opportunities!
```

### Step 5: Start Servers (30 seconds)

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Step 6: Open & Enjoy! 🎉

Visit: **http://localhost:3001** (or 3000)

---

## 🎯 What You Can Do Now

### 1. **Home Page** (`/`)
- ✅ Type in search box → see top 5 suggestions
- ✅ Click **"Search Opportunities"** → go to search page
- ✅ Click **"AI Guided Discovery"** → chat with AI
- ✅ Click curiosity tags → quick search

### 2. **Search Page** (`/search`)
- ✅ View all results for your query
- ✅ Refine search in real-time
- ✅ Click cards to open opportunities

### 3. **AI Discovery Page** (`/ai`)
- ✅ Chat with AI assistant
- ✅ Get personalized recommendations
- ✅ Socratic questioning flow

### 4. **Admin Panel** (`/admin`)
- ✅ Sign in with Google
- ✅ Create new opportunities
- ✅ Auto-sync to search

---

## 🔧 Troubleshooting

### Backend Won't Start
**Error:** `FIREBASE_SERVICE_ACCOUNT_KEY not found`

**Fix:** Make sure you:
1. Created `backend/.env` file
2. Added the full JSON string in quotes
3. JSON is valid (test at jsonlint.com)

### Search Shows No Results
**Issue:** Empty results

**Fix:** 
```bash
cd backend
python seed_data.py
```

### AI Not Responding
**Issue:** Connection error

**Fix:** 
1. Check OpenRouter API key in `backend/.env`
2. Ensure you have credits: https://openrouter.ai
3. Verify backend is running on port 5000

### Port Already in Use
**Issue:** Port 3000 or 3001 in use

**Fix:**
```bash
# Kill the process (Windows PowerShell)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3002 npm run dev
```

---

## 📱 Test Responsive Design

### Desktop (Default)
- Open: http://localhost:3001
- Full buttons, large text, spacious layout

### Tablet
- Open DevTools (F12)
- Toggle device toolbar
- Select iPad
- See medium-sized responsive layout

### Mobile
- Select iPhone SE or similar
- See compact, stacked layout
- Touch-friendly spacing

---

## 🚀 Next Steps

1. **Customize Design**
   - Edit colors in `tailwind.config.ts`
   - Adjust spacing, shadows, fonts

2. **Add Content**
   - Use `/admin` to add opportunities
   - Import your own dataset

3. **Deploy to Production**
   - See `DEPLOYMENT.md` for Vercel + Railway
   - Update environment variables
   - Go live!

---

## 📚 Full Documentation

- **Complete Setup**: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **All Features**: [IMPROVEMENTS_SUMMARY.md](IMPROVEMENTS_SUMMARY.md)
- **Design System**: [DESIGN_IMPROVEMENTS.md](DESIGN_IMPROVEMENTS.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md)

---

## ✨ You're All Set!

Your beautiful, responsive discovery platform is ready! 🎊

**Key Features Working:**
- ✅ Top 5 search suggestions
- ✅ Separate /search and /ai routes
- ✅ Action buttons on home page
- ✅ Fully responsive design
- ✅ Professional UI with depth
- ✅ Firebase integration

**Enjoy building with Depanku.id!** 🚀

