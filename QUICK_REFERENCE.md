# 🚀 Quick Reference Guide - Depanku.id v2.1

## 📋 Navigation Structure

### Main Navbar
```
[Logo] → [Home] → [Browse] → [AI Discovery] → [Features] → [About Us] → [✨ Make Your Own Opportunity!] → [Profile Dropdown or Sign In]
```

### Profile Dropdown (when logged in)
```
┌─────────────────────────┐
│ 👤 John Doe             │
│ john@example.com        │
├─────────────────────────┤
│ 📊 Dashboard            │
│ 👤 My Profile           │
│ ⚙️  Settings            │
├─────────────────────────┤
│ 🚪 Sign Out (red)       │
└─────────────────────────┘
```

## 🔗 Key Routes

### Frontend Pages
- `/` - Home (auto-redirects to `/dashboard` if logged in)
- `/dashboard` - User dashboard with bookmarks & timeline
- `/profile` - User profile page
- `/settings` - Settings with tabs (Profile, Notifications, Privacy, Account)
- `/opportunities` - Create opportunities (with templates)
- `/search` - Browse all opportunities
- `/ai` - AI discovery chat
- `/features` - Features page
- `/about` - About us page

### Backend API Endpoints

#### Authentication
```
POST /api/auth/signup              - Sign up new user
POST /api/auth/signin              - Check email verification
POST /api/auth/verify-email        - Verify email with token
```

#### Profile & Settings
```
GET  /api/profile                          - Get user profile
PUT  /api/profile                          - Update profile
GET  /api/profile/settings/notifications   - Get notification settings
PUT  /api/profile/settings/notifications   - Update notification settings
GET  /api/profile/settings/privacy         - Get privacy settings
PUT  /api/profile/settings/privacy         - Update privacy settings
```

#### Opportunities
```
GET  /api/opportunities                 - Get all opportunities
POST /api/opportunities                 - Create opportunity
GET  /api/opportunities/<id>            - Get single opportunity
GET  /api/opportunities/templates       - Get templates
GET  /api/opportunities/presets/*       - Get presets
```

#### Bookmarks
```
GET    /api/bookmarks                  - Get user bookmarks
POST   /api/bookmarks/<id>             - Add bookmark
DELETE /api/bookmarks/<id>             - Remove bookmark
```

#### Other
```
POST /api/ai/chat                      - AI chat
POST /api/sync/algolia                 - Sync to Algolia
GET  /health                           - Health check
```

## 🎨 Design System

### Colors (OKLCH)
- **Primary**: `oklch(65% 0.15 230)` - Calm teal-blue
- **Secondary**: `oklch(70% 0.12 160)` - Sage green
- **Accent**: `oklch(72% 0.14 50)` - Warm amber

### Key Classes
- `card` - Card container with shadow
- `btn-primary` - Primary button (blue)
- `btn-secondary` - Secondary button (gray)
- `focus-ring` - Focus state
- `rounded-soft` - Rounded corners

## 📱 Responsive Breakpoints
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px

## 🔐 Authentication Flow

### Sign Up
1. User enters email, password, name
2. Backend creates Firebase user
3. Sends verification email
4. User clicks link
5. **Immediately redirected to /dashboard**

### Sign In
1. User enters email, password
2. Backend checks if email is verified
3. If verified → Firebase auth → **Auto-redirect to /dashboard**
4. If not verified → Error message

### Protected Routes
All use `@require_auth` decorator:
- Dashboard
- Profile
- Settings
- Bookmarks
- Create Opportunity

## 🛠️ Development Commands

### Frontend
```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run lint         # Run linter
```

### Backend
```bash
cd backend
python app.py        # Start Flask server (http://localhost:5000)
python seed_data.py  # Seed database
```

## 📊 Database Structure

### Firestore Collections

#### `users/{userId}`
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "email_verified": true,
  "profile": {
    "displayName": "John Doe",
    "bio": "...",
    "website": "...",
    "location": "..."
  },
  "bookmarks": ["opp_id1", "opp_id2"],
  "notification_settings": {
    "emailNotifications": true,
    "deadlineReminders": true,
    "newOpportunities": false,
    "weeklyDigest": true
  },
  "privacy_settings": {
    "profileVisibility": "public",
    "showEmail": false,
    "showBookmarks": false
  }
}
```

#### `opportunities/{oppId}`
```json
{
  "title": "...",
  "description": "...",
  "type": "research|competition|youth-program|community",
  "organization": "...",
  "deadline": "2025-12-31" | "indefinite",
  "has_indefinite_deadline": false,
  "category": ["..."],
  "tags": ["..."],
  "social_media": {
    "website": "...",
    "twitter": "...",
    // ... other platforms
  },
  "requirements": "...",
  "benefits": "...",
  // ... other fields
}
```

## 🎯 User Flows

### First-Time User
```
Homepage → Sign Up → Email Verification → Dashboard → Browse → Bookmark → View in Dashboard
```

### Returning User
```
Homepage → (Auto-redirect) → Dashboard → View Bookmarks/Timeline
```

### Creating Opportunity
```
Profile Dropdown → Dashboard → "Make Your Own Opportunity!" → Choose Template → Fill Form → Submit
```

## 🔧 Common Tasks

### Add New Route
1. Create `app/[route]/page.tsx`
2. Add to navigation if needed
3. Add metadata file

### Add Backend Endpoint
1. Create/update file in `backend/routes/`
2. Import and register blueprint in `app.py`
3. Add service method if needed

### Protect Frontend Page
```tsx
const { user, loading } = useAuth();
if (!user) return <RedirectToLogin />;
```

### Protect Backend Endpoint
```python
@require_auth
def my_route():
    user_id = request.user_id  # Auto-injected
```

## 📚 Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Algolia InstantSearch
- Firebase Auth (client)

### Backend
- Flask (Python)
- Firebase Admin SDK
- Firestore
- Algolia (search)
- OpenRouter (AI)
- Brevo (email)

## 🐛 Common Issues & Solutions

### Issue: "Can't find module"
```bash
npm install  # Frontend
pip install -r requirements.txt  # Backend
```

### Issue: "CORS error"
- Check `CORS(app)` in backend/app.py
- Verify NEXT_PUBLIC_API_URL in .env.local

### Issue: "Auth not working"
- Check Firebase config in both frontend and backend
- Verify token in headers
- Check email is verified

### Issue: "Algolia not syncing"
```bash
curl -X POST http://localhost:5000/api/sync/algolia
```

## ✅ Testing Checklist

- [ ] Sign up flow works
- [ ] Email verification redirects to dashboard
- [ ] Home page auto-redirects when logged in
- [ ] Profile dropdown opens/closes
- [ ] Settings tabs work
- [ ] Profile page displays correctly
- [ ] Create opportunity works
- [ ] Bookmarks save and display
- [ ] Dashboard timeline renders
- [ ] Mobile navigation works
- [ ] All protected routes require auth

---

**Happy coding! 🚀**

