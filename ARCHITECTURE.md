# 🏗️ Depanku.id - Technical Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                                                                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │   Search   │  │ AI Chat    │  │   Auth     │                │
│  │   (Algolia)│  │ (OpenAI)   │  │ (Firebase) │                │
│  └────────────┘  └────────────┘  └────────────┘                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS FRONTEND (Vercel)                    │
│                                                                 │
│  📱 Pages              🧩 Components           📚 Libraries     │
│  ├── /                ├── SearchBar           ├── firebase.ts  │
│  └── /admin           ├── CuriosityTags       ├── algolia.ts   │
│                       ├── OpportunityCard     └── api.ts       │
│                       ├── AIDiscovery                          │
│                       ├── SearchResults                        │
│                       └── AuthProvider                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   FLASK BACKEND (Railway/Render)                │
│                                                                 │
│  🐍 Routes                                                      │
│  ├── GET  /health                                              │
│  ├── POST /api/ai/chat                                         │
│  ├── GET  /api/opportunities                                   │
│  ├── POST /api/opportunities                                   │
│  ├── GET  /api/opportunities/:id                               │
│  ├── POST /api/user/preferences                                │
│  ├── GET  /api/user/preferences/:id                            │
│  └── POST /api/sync-algolia                                    │
└─────────────────────────────────────────────────────────────────┘
            │                    │                    │
            ↓                    ↓                    ↓
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   FIRESTORE      │  │    ALGOLIA       │  │   OPENROUTER     │
│   (Database)     │  │    (Search)      │  │   (AI)           │
│                  │  │                  │  │                  │
│ • Opportunities  │  │ • Search Index   │  │ • Claude 3.5     │
│ • User Prefs     │  │ • Real-time      │  │ • Socratic AI    │
│ • Timestamps     │  │ • Faceted        │  │ • Conversations  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

## Data Flow Diagrams

### 1. Search Flow

```
User types "research"
       ↓
┌─────────────────┐
│  SearchBar      │ ← Algolia InstantSearch Hook
│  Component      │
└─────────────────┘
       ↓
┌─────────────────┐
│  Algolia API    │ ← Client-side search (no backend)
└─────────────────┘
       ↓
┌─────────────────┐
│  Search Results │
│  Component      │ ← Displays hits[]
└─────────────────┘
       ↓
   Opportunity Cards rendered
```

### 2. AI Discovery Flow

```
User clicks "Guided Discovery"
       ↓
┌─────────────────┐
│  AIDiscovery    │
│  Modal Opens    │
└─────────────────┘
       ↓
AI sends greeting message
       ↓
User types response
       ↓
┌─────────────────┐
│  POST           │
│  /api/ai/chat   │
└─────────────────┘
       ↓
┌─────────────────┐
│  Flask Backend  │
│  ├─ Build prompt│
│  ├─ Add history │
│  └─ Call OpenAI │
└─────────────────┘
       ↓
┌─────────────────┐
│  OpenRouter API │ ← Claude 3.5 Sonnet
│  (Socratic Q&A) │
└─────────────────┘
       ↓
Response shown in chat
```

### 3. Authentication Flow

```
User clicks "Sign In"
       ↓
┌─────────────────┐
│  AuthProvider   │
│  .signInGoogle()│
└─────────────────┘
       ↓
┌─────────────────┐
│  Firebase Auth  │ ← Google OAuth popup
│  (Client-side)  │
└─────────────────┘
       ↓
User authenticated
       ↓
Firebase user object stored in context
       ↓
Header shows user profile
```

### 4. Admin Create Opportunity Flow

```
Admin fills form at /admin
       ↓
┌─────────────────┐
│  Form Submit    │
└─────────────────┘
       ↓
┌─────────────────┐
│  POST           │
│  /api/opport... │
└─────────────────┘
       ↓
┌─────────────────┐
│  Flask Backend  │
│  ├─ Save to FS  │ → Firestore (opportunities collection)
│  └─ Index in A  │ → Algolia (opportunities index)
└─────────────────┘
       ↓
Opportunity immediately searchable
```

## Tech Stack Deep Dive

### Frontend Technologies

```
Next.js 14 (App Router)
├── React 18.3          ← Component library
├── TypeScript 5        ← Type safety
├── Tailwind CSS 3.4    ← Utility-first styling
│   └── OKLCH colors    ← Perceptual color space
├── Framer Motion 11    ← Smooth animations
├── Algolia InstantSearch ← Search UI
├── Firebase JS SDK     ← Auth & Firestore
└── Heroicons           ← Icon library
```

### Backend Technologies

```
Flask 3.0
├── Flask-CORS          ← Cross-origin requests
├── Firebase Admin      ← Server-side Firebase
├── Firestore           ← Database client
├── Requests            ← HTTP client
├── Algoliasearch       ← Index management
├── Python-dotenv       ← Environment vars
└── Gunicorn           ← Production server
```

### External Services

```
Firebase (Google Cloud)
├── Authentication      ← Google Sign-In
├── Firestore          ← NoSQL database
└── Cloud Functions    ← (Future: serverless)

Algolia (Search Platform)
├── Search API         ← Client queries
├── Admin API          ← Index management
└── InstantSearch      ← UI components

OpenRouter (AI Gateway)
├── Claude 3.5 Sonnet  ← Default model
├── GPT-4              ← Alternative
└── Other models       ← 100+ options
```

## Component Architecture

### Frontend Components Hierarchy

```
App Layout (app/layout.tsx)
│
├── Header
│   ├── Logo
│   └── Auth Button
│       ├── User Avatar (if logged in)
│       └── Sign In Button (if logged out)
│
├── Home Page (app/page.tsx)
│   ├── AuthProvider (Context)
│   │   └── Firebase Auth State
│   │
│   ├── InstantSearch (Algolia)
│   │   ├── SearchBar
│   │   │   └── Input with icon
│   │   │
│   │   ├── CuriosityTags
│   │   │   └── Tag buttons (8)
│   │   │
│   │   └── SearchResults
│   │       └── OpportunityCard[] (grid)
│   │           ├── Title & Type badge
│   │           ├── Description
│   │           ├── Meta (org, location, deadline)
│   │           └── Tags & Link
│   │
│   └── AIDiscovery (Modal)
│       ├── Trigger Button (fixed bottom-right)
│       └── Chat Window
│           ├── Header
│           ├── Messages (scrollable)
│           │   ├── AI messages (left, gray)
│           │   └── User messages (right, blue)
│           └── Input + Send button
│
└── Admin Page (app/admin/page.tsx)
    └── Admin Form
        ├── Text inputs
        ├── Dropdowns
        ├── Date picker
        ├── Tag/Category management
        └── Submit button
```

### Backend API Architecture

```
Flask App (app.py)
│
├── Initialization
│   ├── Firebase Admin SDK
│   ├── Firestore Client
│   └── Algolia Client
│
├── Routes
│   ├── Health Check
│   │   └── GET /health
│   │
│   ├── AI Routes
│   │   └── POST /api/ai/chat
│   │       ├── Build system prompt
│   │       ├── Add conversation history
│   │       ├── Call OpenRouter
│   │       └── Return AI response
│   │
│   ├── Opportunity Routes
│   │   ├── GET /api/opportunities
│   │   ├── POST /api/opportunities
│   │   │   ├── Save to Firestore
│   │   │   └── Index in Algolia
│   │   └── GET /api/opportunities/:id
│   │
│   ├── User Routes
│   │   ├── POST /api/user/preferences
│   │   └── GET /api/user/preferences/:id
│   │
│   └── Admin Routes
│       └── POST /api/sync-algolia
│           └── Batch sync Firestore → Algolia
│
└── Error Handling
    └── Try/Catch blocks with JSON errors
```

## Database Schema

### Firestore Collections

**opportunities** (main collection)
```javascript
{
  id: auto-generated,
  title: string,
  description: string,
  type: "research" | "youth-program" | "community" | "competition",
  category: string[],
  organization: string,
  location?: string,
  deadline?: ISO date string,
  url?: string,
  tags: string[],
  createdAt: Firestore Timestamp
}
```

**users** (user preferences)
```javascript
{
  id: userId (from Firebase Auth),
  preferences: {
    interests: string[],
    skills: string[],
    goals: string[],
    preferredTypes: string[],
    conversationSummary: string
  },
  updated_at: Firestore Timestamp
}
```

### Algolia Index Schema

**opportunities** (search index)
```javascript
{
  objectID: string (Firestore doc ID),
  title: string,           // searchable
  description: string,     // searchable
  tags: string[],          // searchable, facetable
  category: string[],      // searchable, facetable
  organization: string,    // searchable
  type: string,            // facetable
  location: string,        // facetable
  deadline: string,        // sortable, filterable
  url: string
}
```

## Security Model

### Frontend Security

```
✅ Environment variables (NEXT_PUBLIC_*)
✅ Firebase client SDK (user-scoped)
✅ Algolia search-only API key
✅ HTTPS enforced (Vercel)
✅ No sensitive data in client code
```

### Backend Security

```
✅ Environment variables (.env)
✅ Firebase Admin SDK (server auth)
✅ Algolia admin API key (server-only)
✅ OpenRouter API key (server-only)
✅ CORS configuration
✅ Input validation
```

### Firebase Security Rules

```javascript
// Firestore rules
service cloud.firestore {
  match /databases/{database}/documents {
    match /opportunities/{id} {
      allow read: if true;              // Public read
      allow write: if request.auth != null;  // Auth write
    }
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;  // Own data only
    }
  }
}
```

## Performance Optimizations

### Frontend

```
✅ Next.js App Router (React Server Components)
✅ Automatic code splitting
✅ Image optimization (next/image)
✅ Font optimization (next/font)
✅ Static generation where possible
✅ Client-side caching (React Query potential)
✅ Debounced search (Algolia built-in)
```

### Backend

```
✅ Lightweight Flask app
✅ Efficient Firestore queries
✅ Algolia handles search load
✅ Stateless API (horizontal scaling)
✅ Async operations (Python async potential)
```

### External Services

```
✅ Algolia CDN (global edge network)
✅ Firebase global infrastructure
✅ Vercel Edge Network
✅ OpenRouter load balancing
```

## Deployment Architecture

### Development Environment

```
┌──────────────┐     ┌──────────────┐
│ Next.js Dev  │     │  Flask Dev   │
│ localhost:   │────→│  localhost:  │
│   3000       │     │    5000      │
└──────────────┘     └──────────────┘
        │                    │
        └────────┬───────────┘
                 ↓
        ┌─────────────────┐
        │  Cloud Services │
        │  • Firebase     │
        │  • Algolia      │
        │  • OpenRouter   │
        └─────────────────┘
```

### Production Environment

```
┌──────────────┐     ┌──────────────┐
│  Vercel      │     │  Railway/    │
│  (Frontend)  │────→│  Render      │
│  Edge CDN    │     │  (Backend)   │
└──────────────┘     └──────────────┘
        │                    │
        └────────┬───────────┘
                 ↓
        ┌─────────────────┐
        │  Cloud Services │
        │  • Firebase     │
        │  • Algolia      │
        │  • OpenRouter   │
        └─────────────────┘
```

## Scaling Considerations

### Current Capacity

```
Firestore:     1M reads/day (free)
Algolia:       10k searches/month (free)
OpenRouter:    Pay-per-use ($0.003-0.015/1k tokens)
Vercel:        100GB bandwidth (free)
```

### Scaling Strategy

**Phase 1: 0-1,000 users**
- Current stack sufficient
- Monitor usage

**Phase 2: 1,000-10,000 users**
- Upgrade Algolia plan
- Add Redis caching
- Optimize queries

**Phase 3: 10,000+ users**
- Multiple backend instances
- CDN for static assets
- Advanced caching strategies

## Monitoring & Observability

### Metrics to Track

```
Frontend (Vercel Analytics)
├── Page load time
├── Core Web Vitals
├── Error rate
└── Traffic patterns

Backend (Railway/Render)
├── Response time
├── Error rate
├── Memory usage
└── CPU usage

Services
├── Firebase: Read/write operations
├── Algolia: Search operations, latency
└── OpenRouter: Token usage, costs
```

---

**Architecture designed for scalability, security, and delightful UX** 🚀

