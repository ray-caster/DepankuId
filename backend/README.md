# Depanku.id Backend API - v2.0

A modular Flask-based backend for the Depanku.id platform with organized architecture and comprehensive features.

## 🏗️ Architecture

The backend follows a modular architecture with clear separation of concerns:

```
backend/
├── app.py                 # Main application entry point
├── config/               # Configuration and initialization
│   ├── __init__.py
│   └── settings.py       # App settings, Firebase, Algolia, Brevo config
├── models/               # Data models and schemas
│   ├── __init__.py
│   └── opportunity.py    # Opportunity models, templates, presets
├── services/             # Business logic layer
│   ├── __init__.py
│   ├── ai_service.py     # AI chat logic (Gemini)
│   ├── auth_service.py   # Authentication operations
│   ├── moderation_service.py  # Content moderation (Gemini)
│   ├── opportunity_service.py  # Opportunity CRUD operations
│   └── user_service.py   # User preferences and bookmarks
├── routes/               # API endpoints (controllers)
│   ├── __init__.py
│   ├── ai_routes.py      # AI chat endpoints
│   ├── auth_routes.py
│   ├── bookmark_routes.py
│   ├── opportunity_routes.py
│   ├── sync_routes.py
│   └── user_routes.py
└── utils/                # Utility functions
    ├── __init__.py
    └── decorators.py     # Auth decorators, etc.
```

## 🚀 Setup

### 1. Create a virtual environment:

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Unix/macOS
source venv/bin/activate
```

### 2. Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

Create a `.env` file in the `backend/` directory:

```env
# Firebase Admin SDK (JSON string)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Algolia
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_ADMIN_API_KEY=your_algolia_admin_key

# Brevo (Email Service)
BREVO_API_KEY=your_brevo_api_key

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Flask Config
FLASK_ENV=development
FLASK_DEBUG=True
```

### 4. Seed the database:

```bash
python seed_data.py
```

### 5. Run the server:

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## 📡 API Endpoints

### Health Check
- `GET /health` - Health check endpoint
- `GET /` - API information

### AI & Discovery
- `POST /api/ai/chat` - AI-guided Socratic discovery chat
- `POST /api/ai/discovery/start` - Start discovery session
- `POST /api/ai/suggestions` - Get opportunity suggestions
- `GET /api/ai/health` - AI service health check

### Opportunities
- `GET /api/opportunities` - Get all opportunities
- `POST /api/opportunities` - Create new opportunity
- `GET /api/opportunities/<id>` - Get single opportunity
- `PUT /api/opportunities/<id>` - Update opportunity
- `DELETE /api/opportunities/<id>` - Delete opportunity
- `GET /api/opportunities/templates` - Get opportunity templates
- `GET /api/opportunities/presets/categories` - Get category presets
- `GET /api/opportunities/presets/tags` - Get tag presets

### Authentication
- `POST /api/auth/signup` - Sign up new user with email verification
- `POST /api/auth/signin` - Check email verification status
- `POST /api/auth/verify-email` - Verify email with token

### User Management
- `POST /api/user/preferences` - Save user preferences (requires auth)
- `GET /api/user/preferences/<user_id>` - Get user preferences

### Bookmarks
- `GET /api/bookmarks` - Get user bookmarks (requires auth)
- `POST /api/bookmarks/<opportunity_id>` - Add bookmark (requires auth)
- `DELETE /api/bookmarks/<opportunity_id>` - Remove bookmark (requires auth)

### Sync
- `POST /api/sync/algolia` - Sync Firestore to Algolia

## 🔐 Authentication

The API uses Firebase Authentication with ID token verification.

### Protected Endpoints

Protected endpoints require an `Authorization` header:

```
Authorization: Bearer <firebase_id_token>
```

The `@require_auth` decorator automatically verifies tokens and injects `request.user_id`.

## 📦 Models

### Opportunity Model

```python
{
    "title": str,
    "description": str,
    "type": str,  # 'research', 'youth-program', 'community', 'competition'
    "category": List[str],
    "organization": str,
    "tags": List[str],
    "location": str (optional),
    "deadline": str (optional),  # ISO format or "indefinite"
    "url": str (optional),
    "social_media": {
        "website": str,
        "twitter": str,
        "instagram": str,
        "facebook": str,
        "linkedin": str,
        "youtube": str,
        "discord": str,
        "telegram": str
    } (optional),
    "requirements": str (optional),
    "benefits": str (optional),
    "eligibility": str (optional),
    "cost": str (optional),
    "duration": str (optional),
    "application_process": str (optional),
    "contact_email": str (optional),
    "has_indefinite_deadline": bool (default: false)
}
```

### Templates & Presets

The backend provides pre-built templates and presets for quick opportunity creation:

- **Templates**: Complete opportunity structures for research, competition, youth-program, and community
- **Category Presets**: Relevant categories for each opportunity type
- **Tag Presets**: 50+ popular tags for various fields and topics

## 🛠️ Services

### OpportunityService
Handles all opportunity CRUD operations, Firestore integration, and Algolia syncing.

### AIService
Manages AI chat interactions using OpenRouter (Claude 3.5 Sonnet).

### AuthService
Handles user signup, email verification, and authentication checks.

### UserService
Manages user preferences, bookmarks, and token verification.

## 🔧 Utilities

### Decorators

- `@require_auth` - Protects endpoints, verifies Firebase ID tokens, injects `request.user_id`

## 🌐 Integration

### Firebase
- **Firestore**: NoSQL database for opportunities and user data
- **Authentication**: User management and token verification

### Algolia
- **Search Index**: Real-time search with InstantSearch
- **Sync**: Automatic synchronization from Firestore

### Google Gemini
- **AI Chat**: Powered by Gemini 2.5 Flash
- **Socratic Questions**: Intelligent discovery guidance
- **Content Moderation**: AI-powered content review

### Brevo
- **Transactional Emails**: Email verification and notifications

## 🚢 Deployment

### Using Gunicorn (Production)

```bash
gunicorn app:app --bind 0.0.0.0:$PORT --workers 4
```

### Environment Variables for Production

Ensure all environment variables are properly set in your production environment.

### Procfile (for Heroku/Railway)

```
web: gunicorn app:app
```

## 🧪 Development

### Adding New Routes

1. Create route file in `routes/` directory
2. Define Blueprint and endpoints
3. Import and register in `app.py`

Example:
```python
# routes/my_routes.py
from flask import Blueprint, jsonify

my_bp = Blueprint('my_feature', __name__, url_prefix='/api/my-feature')

@my_bp.route('/endpoint', methods=['GET'])
def my_endpoint():
    return jsonify({"message": "Hello"}), 200

# app.py
from routes.my_routes import my_bp
app.register_blueprint(my_bp)
```

### Adding New Services

1. Create service file in `services/` directory
2. Define service class with static methods
3. Import and use in routes

## 📝 License

This project is part of Depanku.id platform.

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) in the root directory.

---

**Built with ❤️ for the Indonesian student community**
