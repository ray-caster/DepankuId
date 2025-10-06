# Changelog

All notable changes to the Depanku.id project will be documented in this file.

## [2.0.0] - 2025-10-07

### 🎉 Major Update: Backend Modularization & Enhanced Features

### Added

#### Backend Architecture
- **Modular Backend Structure**: Complete restructuring of Flask backend into organized modules
  - `config/`: Centralized configuration and initialization
  - `models/`: Data models and schemas
  - `services/`: Business logic layer
  - `routes/`: API endpoints (controllers)
  - `utils/`: Utility functions and decorators
  
#### New Features
- **Dashboard Page** (`/dashboard`)
  - View all bookmarked opportunities
  - Gantt chart timeline for deadlines
  - Statistics cards (total bookmarks, upcoming deadlines, due this week)
  - Dual view: Bookmarks grid and Timeline chart
  
- **Opportunities Creation Page** (`/opportunities`)
  - Advanced form with comprehensive fields
  - **Templates System**: Pre-built templates for research, competition, youth-program, and community
  - **Presets**: Quick-add category and tag suggestions based on opportunity type
  - **Indefinite Deadlines**: Option to mark opportunities without deadlines
  - **Social Media Links**: Support for 8 platforms (Website, Twitter, Instagram, Facebook, LinkedIn, YouTube, Discord, Telegram)
  - Additional fields: Requirements, Benefits, Eligibility, Cost, Duration, Application Process, Contact Email

#### Enhanced Data Model
- Extended Opportunity schema with new fields:
  - `social_media`: Object containing social platform links
  - `requirements`: Detailed requirements text
  - `benefits`: Benefits description
  - `eligibility`: Eligibility criteria
  - `cost`: Cost/fee information
  - `duration`: Program duration
  - `application_process`: Step-by-step application guide
  - `contact_email`: Direct contact email
  - `has_indefinite_deadline`: Boolean flag for indefinite deadlines

#### API Enhancements
- New endpoints for templates and presets:
  - `GET /api/opportunities/templates`
  - `GET /api/opportunities/presets/categories`
  - `GET /api/opportunities/presets/tags`
- Updated opportunity CRUD to support new fields
- Enhanced type definitions in TypeScript

### Changed

#### Navigation & UX
- Updated Header navigation with new items:
  - "Opportunities" (replaces admin functionality)
  - "Dashboard" (new feature)
- Improved mobile navigation layout

#### Authentication
- Added `getIdToken()` method to AuthProvider for easier token retrieval

#### Admin Page
- Deprecated `/admin` page with clear migration notice
- Auto-redirect to new `/opportunities` page after 10 seconds
- Maintained backward compatibility for existing users

### Technical Improvements

#### Backend Services
- **OpportunityService**: Handles CRUD operations, Firestore integration, Algolia syncing
- **AIService**: Manages AI chat interactions
- **AuthService**: User signup, verification, authentication
- **UserService**: Preferences, bookmarks, token verification

#### Code Organization
- Separation of concerns with distinct layers
- Reusable decorators (`@require_auth`)
- Type-safe data models
- Centralized configuration management

#### Developer Experience
- Comprehensive backend documentation in `backend/README.md`
- Clear project structure
- Easy to extend with new features
- Better error handling and validation

### Documentation
- Updated `backend/README.md` with complete v2.0 documentation
- Architecture diagrams and examples
- API endpoint documentation
- Development guidelines

---

## [1.0.0] - Previous Version

### Features
- Basic opportunity browsing and search
- AI-guided discovery
- Firebase authentication
- Algolia search integration
- User preferences and bookmarks
- Email verification system
- Basic admin panel

---

**Note**: Version 2.0.0 represents a major architectural improvement while maintaining full backward compatibility with existing features and data.

