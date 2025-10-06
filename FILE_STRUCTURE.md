# 📁 Complete File Structure - Depanku.id v2.0

## 📂 Root Directory
```
depanku-id/
├── 📄 README.md                    # Main project documentation
├── 📄 CHANGELOG.md                 # ✨ NEW - Version history
├── 📄 QUICKSTART.md               # ✨ NEW - Quick setup guide
├── 📄 IMPLEMENTATION_SUMMARY.md   # ✨ NEW - Implementation details
├── 📄 FEATURES_OVERVIEW.md        # ✨ NEW - Features documentation
├── 📄 FILE_STRUCTURE.md           # ✨ NEW - This file
├── 📄 CONTRIBUTING.md             # Contribution guidelines
├── 📄 BREVO_SETUP.md             # Email setup guide
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 tailwind.config.ts
├── 📄 next.config.mjs
└── 📄 postcss.config.mjs
```

## 📱 Frontend (`/app`)
```
app/
├── 📄 layout.tsx                  # Root layout
├── 📄 page.tsx                    # Homepage
├── 📄 globals.css                 # Global styles
│
├── 📁 about/
│   └── 📄 page.tsx
│
├── 📁 admin/                      # ⚠️ DEPRECATED
│   └── 📄 page.tsx                # Shows deprecation notice
│
├── 📁 ai/
│   ├── 📄 page.tsx
│   └── 📄 metadata.ts
│
├── 📁 dashboard/                  # ✨ NEW
│   ├── 📄 page.tsx                # Dashboard with bookmarks & Gantt
│   └── 📄 metadata.ts
│
├── 📁 features/
│   └── 📄 page.tsx
│
├── 📁 opportunities/              # ✨ NEW
│   ├── 📄 page.tsx                # Create opportunities with templates
│   └── 📄 metadata.ts
│
├── 📁 search/
│   ├── 📄 page.tsx
│   └── 📄 metadata.ts
│
└── 📁 verify-email/
    └── 📄 page.tsx
```

## 🧩 Components (`/components`)
```
components/
├── 📄 AIDiscovery.tsx             # AI chat interface
├── 📄 AuthModal.tsx               # Authentication modal
├── 📄 AuthProvider.tsx            # Auth context (✨ Updated with getIdToken)
├── 📄 CuriosityTags.tsx          # Tag buttons
├── 📄 Footer.tsx                  # Footer component
├── 📄 Header.tsx                  # ✨ Updated - New nav items
├── 📄 OpportunityCard.tsx        # Opportunity display
├── 📄 ScrollToTop.tsx            # Scroll button
├── 📄 SearchBar.tsx              # Search input
├── 📄 SearchResults.tsx          # Search results
├── 📄 SearchSection.tsx          # Search section
└── 📄 SearchWithButtons.tsx      # Search with buttons
```

## 📚 Libraries (`/lib`)
```
lib/
├── 📄 algolia.ts                  # Algolia configuration
├── 📄 api.ts                      # ✨ Updated - New types & endpoints
├── 📄 firebase.ts                 # Firebase configuration
└── 📄 performance.ts              # Performance utilities
```

## 🔧 Backend (`/backend`) - ✨ COMPLETELY RESTRUCTURED

### Main Files
```
backend/
├── 📄 app.py                      # ✨ NEW - Clean entry point with blueprints
├── 📄 requirements.txt
├── 📄 runtime.txt
├── 📄 Procfile
├── 📄 seed_data.py
├── 📄 README.md                   # ✨ Updated - v2.0 documentation
├── 📄 ENV_TEMPLATE.md
└── 📁 __pycache__/
```

### Configuration (`/backend/config`) - ✨ NEW
```
backend/config/
├── 📄 __init__.py
└── 📄 settings.py                 # Centralized config for Firebase, Algolia, etc.
```

### Data Models (`/backend/models`) - ✨ NEW
```
backend/models/
├── 📄 __init__.py
└── 📄 opportunity.py              # Opportunity models, templates, presets
    ├── class SocialMediaLinks
    ├── class Opportunity
    ├── OPPORTUNITY_TEMPLATES
    ├── CATEGORY_PRESETS
    └── TAG_PRESETS
```

### Services (`/backend/services`) - ✨ NEW
```
backend/services/
├── 📄 __init__.py
├── 📄 ai_service.py               # AI chat logic
│   └── class AIService
├── 📄 auth_service.py             # Authentication operations
│   └── class AuthService
├── 📄 opportunity_service.py      # Opportunity CRUD
│   └── class OpportunityService
└── 📄 user_service.py             # User operations
    └── class UserService
```

### Routes (`/backend/routes`) - ✨ NEW
```
backend/routes/
├── 📄 __init__.py
├── 📄 ai_routes.py                # AI endpoints
│   └── Blueprint: ai_bp
├── 📄 auth_routes.py              # Auth endpoints
│   └── Blueprint: auth_bp
├── 📄 bookmark_routes.py          # Bookmark endpoints
│   └── Blueprint: bookmark_bp
├── 📄 opportunity_routes.py       # Opportunity endpoints
│   └── Blueprint: opportunity_bp
├── 📄 sync_routes.py              # Sync endpoints
│   └── Blueprint: sync_bp
└── 📄 user_routes.py              # User endpoints
    └── Blueprint: user_bp
```

### Utilities (`/backend/utils`) - ✨ NEW
```
backend/utils/
├── 📄 __init__.py
└── 📄 decorators.py               # Auth decorators
    └── @require_auth
```

## 🎨 Static Assets (`/public`)
```
public/
└── 📄 logo.svg
```

## 🛠️ Scripts (`/scripts`)
```
scripts/
└── 📄 dev.js
```

## 📊 Complete File Count

### Frontend
- **Pages**: 9 (2 new)
- **Components**: 10 (1 updated)
- **Libraries**: 4 (1 updated)

### Backend (Modular Structure)
- **Main files**: 6
- **Config files**: 2 ✨ NEW
- **Model files**: 2 ✨ NEW
- **Service files**: 5 ✨ NEW
- **Route files**: 7 ✨ NEW
- **Utility files**: 2 ✨ NEW

### Documentation
- **Root docs**: 6 (5 new)
- **Backend docs**: 2 (1 updated)

### Total New/Updated Files: **35+**

## 🔍 How to Find Things

### Need to...

#### Add a new API endpoint?
→ `backend/routes/` - Create or update route file

#### Change business logic?
→ `backend/services/` - Update service class

#### Add a data model?
→ `backend/models/` - Create or update model file

#### Configure a new service?
→ `backend/config/settings.py`

#### Create a new page?
→ `app/[page-name]/page.tsx`

#### Add a reusable component?
→ `components/ComponentName.tsx`

#### Update API types?
→ `lib/api.ts`

#### Add authentication?
→ Use `@require_auth` from `backend/utils/decorators.py`

## 📈 Architecture Benefits

### Before v2.0
- 1 massive file (670 lines)
- Everything mixed together
- Hard to maintain
- Difficult to scale

### After v2.0
- 35+ organized files
- Clear separation of concerns
- Easy to maintain
- Simple to scale

## 🎯 Key Directories

### Most Frequently Modified
1. `backend/routes/` - Adding endpoints
2. `backend/services/` - Business logic
3. `app/` - New pages
4. `components/` - UI components

### Configuration
1. `backend/config/` - Backend config
2. `lib/` - Frontend utilities
3. `.env.local` - Frontend env vars
4. `backend/.env` - Backend env vars

### Documentation
1. Root `*.md` files - Project docs
2. `backend/README.md` - API docs

---

**This structure provides a solid foundation for scaling Depanku.id with clean, maintainable code!** 🚀

