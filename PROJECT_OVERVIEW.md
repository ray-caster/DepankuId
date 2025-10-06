# 📋 Depanku.id - Project Overview

## 🎯 Vision

Depanku.id is a **thoughtful digital companion** helping Indonesians discover meaningful opportunities for personal and professional growth. Unlike traditional search platforms, we guide users through a reflective journey to find what truly resonates with them.

## 🌟 Core Philosophy

### User Experience Principles

1. **Gentle Guidance** - The platform feels like a wise friend, not a cold search engine
2. **Curiosity-Driven** - We inspire exploration through thoughtful prompts and questions
3. **Clarity Through Reflection** - AI-powered Socratic questioning helps users understand their own goals
4. **Beauty in Simplicity** - Clean, warm design that feels inviting and calm

### Design Language

- **OKLCH Color System** - Perceptually uniform colors for natural, consistent shades
- **Depth-Based Shadows** - Two-part shadow system (key + ambient) for realistic depth
- **Smooth Interactions** - Framer Motion animations with 300ms ease-out transitions
- **Warm Typography** - Inter font with optimized ligatures and smooth rendering

## 🏗️ Architecture

### Frontend Stack
```
Next.js 14 (App Router)
├── TypeScript - Type safety
├── Tailwind CSS - OKLCH-based styling
├── Framer Motion - Smooth animations
├── Algolia InstantSearch - Real-time search
└── Firebase Auth - User authentication
```

### Backend Stack
```
Flask (Python)
├── Firebase Admin SDK - Server-side operations
├── Firestore - NoSQL database
├── OpenRouter API - AI conversations
└── Algolia Admin - Search indexing
```

### Data Flow
```
User Input → Algolia Search → Results Display
                ↓
User Login → Firebase Auth → Firestore Preferences
                ↓
AI Chat → OpenRouter → Socratic Guidance
                ↓
New Opportunity → Firestore → Algolia Sync
```

## 📁 Directory Structure

```
depanku-id/
│
├── 🎨 Frontend (Next.js)
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx             # Home page
│   │   ├── admin/               # Admin panel
│   │   └── globals.css          # Global styles
│   │
│   ├── components/
│   │   ├── SearchBar.tsx        # Algolia search input
│   │   ├── CuriosityTags.tsx    # Exploration tags
│   │   ├── SearchResults.tsx    # Results grid
│   │   ├── OpportunityCard.tsx  # Opportunity display
│   │   ├── AIDiscovery.tsx      # AI chat modal
│   │   ├── AuthProvider.tsx     # Auth context
│   │   └── Header.tsx           # Navigation
│   │
│   ├── lib/
│   │   ├── firebase.ts          # Firebase config
│   │   ├── algolia.ts           # Algolia client
│   │   └── api.ts               # API client
│   │
│   └── public/                  # Static assets
│
├── 🐍 Backend (Flask)
│   ├── app.py                   # Main Flask app
│   ├── seed_data.py             # Database seeder
│   ├── requirements.txt         # Dependencies
│   ├── Procfile                 # Deployment config
│   └── runtime.txt              # Python version
│
├── 📚 Documentation
│   ├── README.md                # Main documentation
│   ├── QUICKSTART.md            # 5-minute setup
│   ├── SETUP_GUIDE.md           # Detailed setup
│   ├── DEPLOYMENT.md            # Production deploy
│   ├── CONTRIBUTING.md          # Contribution guide
│   └── PROJECT_OVERVIEW.md      # This file
│
└── ⚙️ Configuration
    ├── package.json             # Node dependencies
    ├── tsconfig.json            # TypeScript config
    ├── tailwind.config.ts       # Tailwind + OKLCH
    ├── next.config.mjs          # Next.js config
    └── .env.local.example       # Environment template
```

## 🔑 Key Features

### 1. Intelligent Search (Algolia)
- **Real-time** - Results as you type
- **Typo-tolerant** - Fuzzy matching
- **Faceted** - Filter by type, category, tags
- **Ranked** - Most relevant results first

### 2. AI-Guided Discovery (OpenRouter + Claude)
- **Socratic Method** - Reflective questions
- **Conversational** - Natural dialogue
- **Personalized** - Adapts to user responses
- **Goal-Oriented** - Guides toward clarity

### 3. User Authentication (Firebase)
- **Google Sign-In** - Quick, secure login
- **Session Persistence** - Remember users
- **Profile Management** - Save preferences

### 4. Opportunity Management (Firestore)
- **CRUD Operations** - Create, read, update, delete
- **Real-time Sync** - Auto-sync to Algolia
- **Categorized** - Research, programs, communities, competitions
- **Rich Metadata** - Deadlines, locations, tags

### 5. Admin Panel
- **Authenticated Access** - Admin-only creation
- **Rich Forms** - All opportunity fields
- **Tag Management** - Dynamic tag/category addition
- **Instant Sync** - Auto-publish to search

## 🎨 Design System

### Color Palette (OKLCH)

| Color | OKLCH Value | Usage |
|-------|-------------|-------|
| Primary | `oklch(65% 0.15 230)` | Main brand, CTAs |
| Secondary | `oklch(70% 0.12 160)` | Accents, secondary actions |
| Accent | `oklch(72% 0.14 50)` | Highlights, badges |
| Neutral | `oklch(20-98% 0.01 90)` | Text, backgrounds |

### Shadow System

```css
/* Soft interactive elements */
shadow-sm: key(short, dark) + ambient(long, light)

/* Elevated cards */
shadow-card: 0 2px 8px -2px / 0.1, 0 4px 16px -4px / 0.05

/* Hover states */
shadow-card-hover: 0 4px 12px -2px / 0.14, 0 8px 24px -4px / 0.08
```

### Component Styles

- **Buttons** - `btn-primary`, `btn-secondary`, `btn-ghost`
- **Cards** - `card` (rounded-gentle, shadow-card)
- **Tags** - `curiosity-tag` (rounded-full, hover transitions)
- **Focus** - `focus-ring` (2px ring, primary color)

## 🔄 User Flows

### Discovery Flow
```
1. User lands on homepage
2. Sees central search bar
3. Explores curiosity tags
4. Types search query
5. Views results in real-time
6. Clicks opportunity card
7. Visits external opportunity
```

### AI Guidance Flow
```
1. User clicks "Guided Discovery"
2. AI asks opening question
3. User responds
4. AI follows up with relevant questions
5. Conversation builds user profile
6. AI suggests opportunity types
7. User explores suggestions
```

### Admin Flow
```
1. Admin signs in
2. Navigates to /admin
3. Fills opportunity form
4. Adds categories & tags
5. Submits form
6. Data saved to Firestore
7. Auto-synced to Algolia
8. Immediately searchable
```

## 🔌 API Endpoints

### Backend API (`/api/...`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/ai/chat` | POST | AI conversation |
| `/api/opportunities` | GET | List all opportunities |
| `/api/opportunities` | POST | Create opportunity |
| `/api/opportunities/:id` | GET | Get single opportunity |
| `/api/user/preferences` | POST | Save user preferences |
| `/api/user/preferences/:id` | GET | Get user preferences |
| `/api/sync-algolia` | POST | Manual Algolia sync |

## 📊 Data Models

### Opportunity
```typescript
{
  id: string
  title: string
  description: string
  type: 'research' | 'youth-program' | 'community' | 'competition'
  category: string[]
  organization: string
  location?: string
  deadline?: string (ISO date)
  url?: string
  tags: string[]
  createdAt: Timestamp
}
```

### User Preferences
```typescript
{
  interests: string[]
  skills: string[]
  goals: string[]
  preferredTypes: string[]
  conversationSummary: string
}
```

### AI Message
```typescript
{
  role: 'user' | 'assistant'
  content: string
}
```

## 🚀 Deployment Architecture

### Production Setup
```
User Browser
    ↓
Vercel (Next.js Frontend)
    ↓
Railway/Render (Flask Backend)
    ↓ ↓ ↓
    ↓ Firestore (Database)
    ↓ Algolia (Search)
    ↓ OpenRouter (AI)
    ↓ Firebase Auth (Users)
```

### Environment Variables

**Frontend (.env.local)**
- Firebase client config
- Algolia client config
- Backend API URL

**Backend (.env)**
- Firebase admin credentials
- OpenRouter API key
- Algolia admin key

## 🧪 Testing Strategy

### Manual Testing Checklist
- [ ] Search returns relevant results
- [ ] Tags filter correctly
- [ ] Google sign-in works
- [ ] AI chat responds appropriately
- [ ] Admin can create opportunities
- [ ] Responsive on mobile
- [ ] No console errors

### Future Automated Testing
- Unit tests (Jest + React Testing Library)
- E2E tests (Playwright)
- API tests (pytest)
- Performance monitoring (Lighthouse)

## 📈 Scalability Considerations

### Current Limits
- Firestore: 1M documents free
- Algolia: 10k searches/month free
- OpenRouter: Pay per use
- Vercel: Generous free tier

### Scaling Path
1. **Phase 1** (0-1k users): Current stack sufficient
2. **Phase 2** (1-10k users): Upgrade Algolia, add caching
3. **Phase 3** (10k+ users): Consider edge functions, CDN optimization

### Performance Optimizations
- Image optimization (Next.js Image)
- Code splitting (automatic with Next.js)
- Search debouncing (300ms)
- Lazy loading (React.lazy for admin)

## 🔒 Security

### Implemented
- ✅ Environment variables for secrets
- ✅ Firebase security rules
- ✅ HTTPS only (enforced by Vercel)
- ✅ CORS configuration
- ✅ Input validation

### To Implement
- [ ] Rate limiting on API
- [ ] Advanced Firestore rules
- [ ] Admin role verification
- [ ] CSRF protection
- [ ] Content sanitization

## 🎯 Roadmap

### Phase 1: MVP ✅ (Current)
- [x] Search functionality
- [x] AI guidance
- [x] Authentication
- [x] Admin panel
- [x] Responsive design

### Phase 2: Enhancement
- [ ] User profiles & saved opportunities
- [ ] Email notifications
- [ ] Advanced filters (deadline, location)
- [ ] Recommendation system
- [ ] Analytics dashboard

### Phase 3: Community
- [ ] User reviews/ratings
- [ ] Discussion forums
- [ ] Mentorship matching
- [ ] Success stories
- [ ] Multi-language support

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Areas for Contribution
- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation
- 🎨 Design improvements
- 🧪 Testing
- 🌍 Internationalization

## 📞 Support

- 📖 **Documentation**: See README.md
- 🚀 **Quick Start**: See QUICKSTART.md
- 🔧 **Setup**: See SETUP_GUIDE.md
- 🌐 **Deploy**: See DEPLOYMENT.md
- 💬 **Issues**: GitHub Issues

## 📜 License

Built for educational purposes as part of the Depanku.id initiative to empower Indonesian youth.

---

**Built with ❤️ for discovery and growth**

