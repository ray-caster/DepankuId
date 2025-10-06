# 🔧 Troubleshooting Guide - Depanku.id

## Common Issues & Solutions

### 1. Firebase Admin Credentials Error

**Error:**
```
ValueError: Failed to initialize a certificate credential. 
Caused by: "Service account info was not in the expected format, missing fields token_uri."
```

**Solution:**
This has been fixed in the codebase. The Firebase config now includes the required `token_uri` field:

```python
firebase_config = {
    "type": "service_account",
    "project_id": os.getenv("FIREBASE_ADMIN_PROJECT_ID"),
    "private_key": os.getenv("FIREBASE_ADMIN_PRIVATE_KEY", "").replace('\\n', '\n'),
    "client_email": os.getenv("FIREBASE_ADMIN_CLIENT_EMAIL"),
    "token_uri": "https://oauth2.googleapis.com/token",  # Added
}
```

If you still see this error:
1. Ensure all environment variables are set in `backend/.env`
2. Check that `FIREBASE_ADMIN_PRIVATE_KEY` includes actual newlines or `\n` characters
3. Verify `FIREBASE_ADMIN_CLIENT_EMAIL` is correct

---

### 2. Icon/Favicon Not Loading

**Error:**
```
GET http://localhost:3000/icon net::ERR_EMPTY_RESPONSE
```

**Solution:**
Changed from `icon.tsx` (ImageResponse) to `icon.svg` for better compatibility.

The app now uses a static SVG favicon which loads reliably across all browsers.

---

### 3. InstantSearch Warning (Development Only)

**Warning:**
```
[InstantSearch] We've detected you are using Next.js with the App Router.
We released a package called "react-instantsearch-nextjs" that makes SSR work with the App Router.
```

**Status:**
- This is a **development-only warning** (not shown in production)
- The app works correctly as-is
- For enhanced SSR support, we've added `react-instantsearch-nextjs` to dependencies

**To upgrade (optional):**
```bash
npm install
```

Then update `app/page.tsx`:
```tsx
import { InstantSearchNext } from 'react-instantsearch-nextjs';

// Replace InstantSearch with InstantSearchNext
<InstantSearchNext searchClient={searchClient} indexName={ALGOLIA_INDEX_NAME}>
  {/* ... */}
</InstantSearchNext>
```

---

### 4. Port Already in Use

**Issue:**
```
⚠ Port 3000 is in use, trying 3001 instead.
```

**Why this happens:**
- Another process is using port 3000
- Previous dev server didn't shut down properly

**Solutions:**

**Option 1: Use the alternate port**
```
Access the app at http://localhost:3001
```

**Option 2: Kill the process on port 3000**

**Windows:**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

**Option 3: Specify a different port**
```bash
PORT=3002 npm run dev
```

---

### 5. Backend Won't Start

**Error:**
```
ModuleNotFoundError: No module named 'flask'
```

**Solution:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

### 6. Algolia Search Returns No Results

**Issue:**
Search bar doesn't return any results

**Solutions:**

1. **Seed the database:**
```bash
cd backend
python seed_data.py
```

2. **Verify environment variables:**
Check `NEXT_PUBLIC_ALGOLIA_APP_ID` and `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY` in `.env.local`

3. **Check Algolia index:**
- Log into Algolia dashboard
- Verify the `opportunities` index exists
- Check that records are present

4. **Sync manually:**
```bash
curl -X POST http://localhost:5000/api/sync-algolia
```

---

### 7. AI Chat Not Working

**Error:**
AI doesn't respond or shows connection error

**Checklist:**

1. **Verify OpenRouter API key:**
   - Check `backend/.env` has `OPENROUTER_API_KEY`
   - Verify the key is valid at [openrouter.ai](https://openrouter.ai)

2. **Check backend is running:**
   ```bash
   curl http://localhost:5000/health
   # Should return: {"status": "healthy"}
   ```

3. **Verify API URL:**
   - Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
   - Default: `http://localhost:5000`

4. **Check OpenRouter credits:**
   - Log into OpenRouter
   - Ensure you have sufficient credits

---

### 8. Authentication Fails

**Issue:**
Google Sign-In doesn't work or shows error

**Solutions:**

1. **Check Firebase config:**
   - Verify all `NEXT_PUBLIC_FIREBASE_*` variables in `.env.local`

2. **Add authorized domain:**
   - Firebase Console → Authentication → Settings
   - Add `localhost` to authorized domains
   - For production, add your deployment domain

3. **Enable Google provider:**
   - Firebase Console → Authentication → Sign-in method
   - Enable Google provider
   - Add support email

---

### 9. Build Fails

**Error:**
```
Failed to compile
Type error: ...
```

**Solutions:**

1. **Clear Next.js cache:**
```bash
rm -rf .next
npm run build
```

2. **Reinstall dependencies:**
```bash
rm -rf node_modules package-lock.json
npm install
```

3. **Check TypeScript errors:**
```bash
npm run lint
```

---

### 10. Environment Variables Not Loading

**Issue:**
App can't read environment variables

**Solutions:**

1. **Restart dev server:**
   - Environment variables are loaded at startup
   - Stop and restart: `npm run dev`

2. **Check file names:**
   - Frontend: `.env.local` (NOT `.env`)
   - Backend: `.env` (in `backend/` folder)

3. **Verify variable names:**
   - Frontend vars must start with `NEXT_PUBLIC_`
   - Backend vars have no prefix requirement

4. **Check for typos:**
   - Compare with `.env.local.example`
   - Ensure no extra spaces

---

### 11. CORS Errors

**Error:**
```
Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Solution:**
Ensure Flask-CORS is installed and configured:

```bash
cd backend
pip install Flask-CORS
```

Check `backend/app.py` includes:
```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
```

---

### 12. Hydration Mismatch Warning

**Warning:**
```
Warning: Extra attributes from the server: cz-shortcut-listen
```

**Status:**
- This is caused by browser extensions (like Grammarly)
- **Not a bug in your code**
- Safe to ignore
- Won't appear in production

---

## 🆘 Still Having Issues?

### Debug Checklist

1. **Check all services are running:**
   ```bash
   # Frontend (should show Next.js)
   curl http://localhost:3000
   
   # Backend (should return "healthy")
   curl http://localhost:5000/health
   ```

2. **Verify environment setup:**
   ```bash
   # Check .env.local exists
   ls -la .env.local
   
   # Check backend/.env exists  
   ls -la backend/.env
   ```

3. **Check logs:**
   - Frontend: Browser console (F12)
   - Backend: Terminal where Flask is running

4. **Test each service independently:**
   - Test Algolia in their dashboard
   - Test Firebase in Firebase Console
   - Test OpenRouter with curl

### Getting Help

1. **Check documentation:**
   - [README.md](README.md)
   - [SETUP_GUIDE.md](SETUP_GUIDE.md)
   - [DEPLOYMENT.md](DEPLOYMENT.md)

2. **Review error messages:**
   - Read the full error, not just the first line
   - Google the error message
   - Check service-specific docs

3. **Open an issue:**
   - Include error messages
   - Include steps to reproduce
   - Include your environment (OS, Node version, Python version)

---

## 🎯 Quick Fixes Summary

| Issue | Quick Fix |
|-------|-----------|
| Firebase error | Add `token_uri` to config ✅ Fixed |
| Icon not loading | Using `icon.svg` now ✅ Fixed |
| Port in use | Use alternate port or kill process |
| No search results | Run `python backend/seed_data.py` |
| AI not responding | Check OpenRouter API key & credits |
| Auth fails | Check Firebase config & authorized domains |
| CORS errors | Ensure Flask-CORS is installed |
| Build fails | Clear `.next/` and rebuild |

---

**Most issues are environment/configuration related. Double-check your `.env` files!** ✨

