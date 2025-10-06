# 🌐 Depanku.id - Discover Where You Belong

A beautiful, thoughtful digital hub helping Indonesians find meaningful opportunities in research, youth programs, communities, and competitions. Built with modern web technologies and a focus on user experience.

## ✨ Features

- **🔍 Intelligent Search** - Powered by Algolia InstantSearch for lightning-fast, relevant results
- **🤖 AI-Guided Discovery** - Socratic questioning system using OpenRouter to help users find their perfect fit
- **🎨 Beautiful UI** - Modern design with OKLCH color system, smooth animations, and depth-based shadows
- **🔐 User Authentication** - Firebase Authentication with Google Sign-In
- **💾 Persistent Data** - Firestore database for opportunities and user preferences
- **📱 Responsive Design** - Mobile-first approach with elegant transitions

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with OKLCH colors
- **Framer Motion** - Smooth animations and transitions
- **Algolia InstantSearch** - Powerful search UI components

### Backend
- **Flask** - Python web framework
- **Firebase Admin SDK** - Server-side Firebase integration
- **Firestore** - NoSQL database
- **OpenRouter API** - AI-powered conversational guidance
- **Algolia** - Search infrastructure

### Authentication & Storage
- **Firebase Authentication** - User management
- **Firebase Firestore** - Document database

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Firebase project
- Algolia account
- OpenRouter API key

### 1. Clone and Install

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Algolia Configuration
NEXT_PUBLIC_ALGOLIA_APP_ID=your_algolia_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_algolia_search_key

# API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Create a `backend/.env` file:

```env
# Firebase Admin SDK
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key
FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email

# OpenRouter API
OPENROUTER_API_KEY=your_openrouter_api_key

# Algolia Admin
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_ADMIN_API_KEY=your_algolia_admin_key

# Flask Config
FLASK_ENV=development
FLASK_DEBUG=True
```

### 3. Seed the Database

```bash
cd backend
python seed_data.py
```

### 4. Run the Development Servers

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
python app.py
```

Visit `http://localhost:3000` to see the application!

## 📂 Project Structure

```
depanku-id/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── AIDiscovery.tsx   # AI chat interface
│   ├── AuthProvider.tsx  # Authentication context
│   ├── CuriosityTags.tsx # Tag buttons
│   ├── Header.tsx        # Navigation header
│   ├── OpportunityCard.tsx # Opportunity display
│   ├── SearchBar.tsx     # Algolia search input
│   └── SearchResults.tsx # Results display
├── lib/                   # Utility libraries
│   ├── algolia.ts        # Algolia client config
│   ├── api.ts            # API client functions
│   └── firebase.ts       # Firebase config
├── backend/               # Flask backend
│   ├── app.py            # Main Flask application
│   ├── seed_data.py      # Database seeding script
│   └── requirements.txt  # Python dependencies
├── public/               # Static assets
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript config
└── package.json          # Node dependencies
```

## 🎨 Design System

### OKLCH Color Palette

The project uses OKLCH color space for perceptually uniform colors:

- **Primary** - Calm teal-blue (`oklch(65% 0.15 230)`)
- **Secondary** - Sage green (`oklch(70% 0.12 160)`)
- **Accent** - Warm amber (`oklch(72% 0.14 50)`)
- **Neutral** - Warm grays with subtle hues

### Shadow System

Two-part shadow system for depth:
- **Key shadow** - Short, dark, sharp
- **Ambient shadow** - Long, light, soft

Example: `shadow-card` = `0 2px 8px -2px oklch(0% 0 0 / 0.1), 0 4px 16px -4px oklch(0% 0 0 / 0.05)`

### Typography

- Font: Inter with fallback to system fonts
- Smooth font rendering with ligatures enabled

## 🔑 Key Features Explained

### AI-Guided Discovery

The AI assistant uses OpenRouter (with Claude 3.5 Sonnet) to ask thoughtful, Socratic questions that help users discover opportunities aligned with their interests and goals.

### Instant Search

Algolia powers the search with:
- Real-time results as you type
- Typo tolerance
- Faceted filtering by type, category, tags
- Relevance ranking

### User Preferences

Authenticated users can:
- Save conversation history
- Store discovered interests and preferences
- Get personalized recommendations

## 📱 API Endpoints

### Backend Flask API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/ai/chat` | POST | AI conversation |
| `/api/opportunities` | GET | Get all opportunities |
| `/api/opportunities` | POST | Create opportunity |
| `/api/opportunities/:id` | GET | Get single opportunity |
| `/api/user/preferences` | POST | Save user preferences |
| `/api/user/preferences/:id` | GET | Get user preferences |
| `/api/sync-algolia` | POST | Sync Firestore to Algolia |

## 🚢 Deployment

### Frontend (Vercel)

```bash
# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

### Backend (Railway/Render/Heroku)

```bash
cd backend
# Add Procfile: web: gunicorn app:app
gunicorn app:app
```

## 🧪 Development Tips

1. **Hot Reload**: Both Next.js and Flask support hot reload in development
2. **Type Safety**: Use TypeScript strictly for better DX
3. **Component Structure**: Keep components small and focused
4. **API Client**: Use the centralized `api.ts` client for all backend calls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is built for educational purposes as part of the Depanku.id initiative.

## 🙏 Acknowledgments

- Design inspired by modern SaaS interfaces
- Color system based on OKLCH perceptual color space
- AI guidance powered by OpenRouter and Anthropic Claude

---

Built with ❤️ for the Indonesian youth community

