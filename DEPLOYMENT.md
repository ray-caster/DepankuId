# 🚀 Deployment Guide for Depanku.id

This guide covers deploying Depanku.id to production.

## Architecture Overview

- **Frontend**: Next.js app → Deployed to Vercel
- **Backend**: Flask API → Deployed to Railway/Render/Heroku
- **Database**: Firebase Firestore (managed service)
- **Search**: Algolia (managed service)
- **AI**: OpenRouter API (managed service)

## Frontend Deployment (Vercel)

### 1. Prepare Repository

Ensure your code is pushed to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/depanku-id.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

### 3. Add Environment Variables

In Vercel project settings → Environment Variables, add:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_search_key
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### 4. Deploy

Click "Deploy" and Vercel will build and deploy your app!

Your app will be available at: `https://your-project.vercel.app`

## Backend Deployment (Railway)

Railway is recommended for its simplicity and generous free tier.

### 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Login to Railway

```bash
railway login
```

### 3. Initialize Project

```bash
cd backend
railway init
```

### 4. Add Environment Variables

```bash
railway variables set FIREBASE_ADMIN_PROJECT_ID=your_project
railway variables set FIREBASE_ADMIN_PRIVATE_KEY="your_key"
railway variables set FIREBASE_ADMIN_CLIENT_EMAIL=your_email
railway variables set OPENROUTER_API_KEY=your_key
railway variables set ALGOLIA_APP_ID=your_app_id
railway variables set ALGOLIA_ADMIN_API_KEY=your_admin_key
railway variables set FLASK_ENV=production
```

### 5. Deploy

```bash
railway up
```

Railway will automatically detect the Python app and deploy it!

Your API will be available at: `https://your-project.up.railway.app`

### 6. Update Frontend Environment

Update `NEXT_PUBLIC_API_URL` in Vercel to your Railway URL.

## Alternative Backend Deployment (Render)

### 1. Create Web Service

1. Go to [Render](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: depanku-backend
   - **Root Directory**: backend
   - **Environment**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`

### 2. Add Environment Variables

In Render dashboard, add all backend environment variables.

### 3. Deploy

Click "Create Web Service" and Render will deploy your app!

## Alternative Backend Deployment (Heroku)

### 1. Install Heroku CLI

Download from [Heroku](https://devcenter.heroku.com/articles/heroku-cli)

### 2. Create App

```bash
cd backend
heroku create depanku-backend
```

### 3. Add Config Vars

```bash
heroku config:set FIREBASE_ADMIN_PROJECT_ID=your_project
heroku config:set FIREBASE_ADMIN_PRIVATE_KEY="your_key"
heroku config:set FIREBASE_ADMIN_CLIENT_EMAIL=your_email
heroku config:set OPENROUTER_API_KEY=your_key
heroku config:set ALGOLIA_APP_ID=your_app_id
heroku config:set ALGOLIA_ADMIN_API_KEY=your_admin_key
```

### 4. Deploy

```bash
git push heroku main
```

## Post-Deployment Checklist

### Frontend
- [ ] Visit deployed URL and verify it loads
- [ ] Test search functionality
- [ ] Test authentication (Google Sign-In)
- [ ] Test responsive design on mobile
- [ ] Check browser console for errors

### Backend
- [ ] Visit `/health` endpoint - should return `{"status": "healthy"}`
- [ ] Test AI chat endpoint
- [ ] Verify Firestore connection
- [ ] Verify Algolia sync works
- [ ] Check logs for errors

### Firebase
- [ ] Add production domain to Firebase Auth authorized domains
  - Go to Firebase Console → Authentication → Settings
  - Add your Vercel domain (e.g., `depanku-id.vercel.app`)

### Security
- [ ] Firestore rules are properly configured
- [ ] Firebase Auth domain restrictions are set
- [ ] API keys are not exposed in client code
- [ ] CORS is configured correctly

## Firestore Security Rules

Update your Firestore rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Opportunities - read public, write authenticated
    match /opportunities/{opportunityId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Users - read/write own data only
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Monitoring and Maintenance

### Vercel
- Monitor deployments in Vercel Dashboard
- View analytics and web vitals
- Check function logs

### Railway/Render/Heroku
- Monitor app health in dashboard
- View application logs
- Set up uptime monitoring (e.g., UptimeRobot)

### Firebase
- Monitor usage in Firebase Console
- Set up budget alerts
- Review Firestore usage

### Algolia
- Monitor search analytics
- Review query performance
- Check API usage

## Scaling Considerations

### When Traffic Grows:

**Frontend (Vercel)**
- Automatically scales with traffic
- Consider upgrading to Pro plan for higher limits

**Backend (Railway/Render)**
- Upgrade to paid plan
- Add more instances if needed
- Consider caching with Redis

**Database (Firestore)**
- Optimize queries
- Add indexes for common queries
- Consider Firestore bundle for read-heavy operations

**Search (Algolia)**
- Upgrade plan as needed
- Optimize indexing strategy
- Use query suggestions to reduce API calls

## Troubleshooting

### Frontend Build Fails
- Check all dependencies are in `package.json`
- Verify TypeScript has no errors: `npm run build` locally
- Check Vercel build logs

### Backend Won't Start
- Verify all environment variables are set
- Check Python version matches `runtime.txt`
- Review application logs

### CORS Errors
- Ensure backend has `Flask-CORS` installed
- Verify frontend URL is allowed in CORS config
- Check that API_URL environment variable is correct

### Firebase Auth Issues
- Verify domain is in authorized domains list
- Check API keys are correct
- Ensure Firebase project is in production mode

## Rollback Procedure

### Vercel
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Railway
```bash
railway rollback
```

### Render/Heroku
Redeploy previous commit through their dashboards.

## Domain Setup (Optional)

### Custom Domain on Vercel

1. Go to Vercel project → Settings → Domains
2. Add your custom domain (e.g., `depanku.id`)
3. Configure DNS records as instructed
4. Update Firebase authorized domains

### Custom Domain on Railway

1. Go to Railway project → Settings
2. Add custom domain
3. Configure DNS CNAME record
4. Update frontend `NEXT_PUBLIC_API_URL`

---

Your app is now live! 🎉

For questions or issues, refer to:
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Firebase Docs](https://firebase.google.com/docs)
- [Algolia Docs](https://www.algolia.com/doc)

