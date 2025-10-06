# ⚡ Quick Start Guide

Get Depanku.id running in **5 minutes**!

## Prerequisites

- Node.js 18+
- Python 3.9+
- Git

## Step 1: Clone & Install (2 min)

```bash
# Clone the repository
git clone https://github.com/yourusername/depanku-id.git
cd depanku-id

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

## Step 2: Get API Keys (2 min)

You'll need accounts for:

1. **Firebase** (free): [console.firebase.google.com](https://console.firebase.google.com)
2. **Algolia** (free tier): [www.algolia.com](https://www.algolia.com)
3. **OpenRouter** ($5 minimum): [openrouter.ai](https://openrouter.ai)

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions.

## Step 3: Configure Environment (30 sec)

Create `.env.local` in root:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_search_key
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Create `backend/.env`:
```env
FIREBASE_ADMIN_PROJECT_ID=your_project
FIREBASE_ADMIN_PRIVATE_KEY="your_private_key"
FIREBASE_ADMIN_CLIENT_EMAIL=your_email
OPENROUTER_API_KEY=your_key
ALGOLIA_APP_ID=your_app_id
ALGOLIA_ADMIN_API_KEY=your_admin_key
FLASK_ENV=development
```

## Step 4: Seed Database (30 sec)

```bash
cd backend
python seed_data.py
```

## Step 5: Run! (30 sec)

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

## What You Can Do Now

✅ **Search** - Type in the search bar (try "research")  
✅ **Browse** - Click curiosity tags like #stem  
✅ **Sign In** - Use Google authentication  
✅ **AI Chat** - Click "Guided Discovery" for AI assistance  
✅ **Admin** - Visit `/admin` to add opportunities  

## Next Steps

- [ ] Read [README.md](README.md) for full documentation
- [ ] See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup
- [ ] Check [DEPLOYMENT.md](DEPLOYMENT.md) to go live

## Troubleshooting

**Search not working?**
```bash
cd backend
python seed_data.py
```

**Backend won't start?**
- Check Python virtual environment is activated
- Verify all env vars in `backend/.env`

**Frontend errors?**
- Run `npm install` again
- Check `.env.local` exists with correct values

**AI chat fails?**
- Verify OpenRouter API key
- Ensure you have credits in OpenRouter account

## Need Help?

- 📖 Full docs: [README.md](README.md)
- 🔧 Setup guide: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- 🚀 Deploy: [DEPLOYMENT.md](DEPLOYMENT.md)
- 💬 Issues: Open a GitHub issue

---

Happy building! 🚀

