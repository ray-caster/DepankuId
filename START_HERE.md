# 🚀 Start Here - Depanku.id Quick Start

## ✅ What Was Just Fixed

1. **Signup Issue** - Page reloading problem fixed
2. **Error Handling** - Comprehensive logging everywhere
3. **ASGI Support** - Uvicorn for better performance

## 🏃 Quick Start (30 seconds)

### 1. Start Backend (Terminal 1)
```bash
cd backend
python run_uvicorn.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:5000
INFO:     Application startup complete.
```

### 2. Start Frontend (Terminal 2)
```bash
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

### 3. Test Signup
1. Visit http://localhost:3000
2. Click "Sign In" button
3. Switch to "Create Account" tab
4. Fill in: Name, Email, Password
5. Click "Create Account"
6. **Watch browser console (F12)** for debug logs
7. **Watch backend terminal** for request logs

## 🐛 Debugging

### If Signup Still Doesn't Work

#### Check Frontend Console (F12)
Look for:
```
Attempting signup... {email: "...", name: "..."}
Signup response: {success: true/false, message: "..."}
```

#### Check Backend Terminal
Look for:
```
[REQUEST] POST /api/auth/signup
[REQUEST BODY] {...}
[RESPONSE] POST /api/auth/signup - Status: 201 - Duration: 0.5s
```

#### Common Issues

**Issue: Connection refused**
```
Solution: Make sure backend is running on port 5000
→ python run_uvicorn.py
```

**Issue: CORS error**
```
Solution: Restart backend
→ Ctrl+C then python run_uvicorn.py
```

**Issue: Email already exists**
```
Solution: Use a different email or check Firebase Console
```

## 📊 New Logging Features

### Frontend (Browser Console)
- ✅ Signup attempts logged
- ✅ API responses logged
- ✅ Errors logged with details

### Backend (Terminal)
- ✅ All requests logged
- ✅ All responses with status & duration
- ✅ Errors with full tracebacks
- ✅ Sensitive data automatically masked

## 🎯 Expected Flow

### Successful Signup:
```
1. User fills form
2. Frontend logs: "Attempting signup..."
3. Backend logs: "[REQUEST] POST /api/auth/signup"
4. Backend logs: "[RESPONSE] ... Status: 201"
5. Frontend logs: "Signup response: {success: true}"
6. UI shows: "Check Your Email" message
7. User receives verification email
8. User clicks link → Redirected to dashboard
```

### Failed Signup:
```
1. User fills form
2. Frontend logs: "Attempting signup..."
3. Backend logs: "[REQUEST] POST /api/auth/signup"
4. Backend logs: "[ERROR] ..." (with details)
5. Backend logs: "[RESPONSE] ... Status: 400/500"
6. Frontend logs: "Signup failed: [error message]"
7. UI shows: Red error message
```

## 🔧 Advanced

### Run with Custom Port
```bash
# Backend
PORT=8000 python run_uvicorn.py

# Frontend (update .env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

### Production Mode
```bash
# Backend
uvicorn asgi:application --host 0.0.0.0 --port 5000 --workers 4

# Frontend
npm run build
npm start
```

### View All Logs
```bash
# Backend with debug level
uvicorn asgi:application --log-level debug

# Frontend with verbose
npm run dev -- --debug
```

## 📁 Files Changed

### Frontend
- `components/AuthModal.tsx` - Fixed to use AuthProvider
- Added console logging

### Backend
- `backend/app.py` - Added logging and error handling
- `backend/asgi.py` - **NEW** ASGI entry point
- `backend/run_uvicorn.py` - **NEW** Uvicorn runner
- `backend/utils/logging_config.py` - **NEW** Logging setup
- `backend/utils/error_handlers.py` - **NEW** Error handling
- `backend/utils/middleware.py` - **NEW** Request logging
- `backend/requirements.txt` - Added a2wsgi, uvicorn

## 🎉 You're All Set!

The signup issue is fixed, and you now have:
- ✅ Working signup/signin
- ✅ Comprehensive logging
- ✅ Better error messages
- ✅ ASGI support with Uvicorn
- ✅ Production-ready backend

## 🆘 Still Having Issues?

1. **Check both terminals** for error messages
2. **Check browser console (F12)** for frontend errors
3. **Verify .env files** are configured correctly
4. **Restart both servers** (Ctrl+C then restart)
5. **Try a different email** if "already exists" error

---

**Happy coding! 🚀**

