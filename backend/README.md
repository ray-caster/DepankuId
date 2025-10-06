# Depanku.id Backend API

Flask-based backend for the Depanku.id platform.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables (create `.env` file):
```env
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key
FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email
OPENROUTER_API_KEY=your_openrouter_api_key
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_ADMIN_API_KEY=your_algolia_admin_key
```

4. Seed the database:
```bash
python seed_data.py
```

5. Run the server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Documentation

See the main README.md for complete API endpoint documentation.

## Deployment

For production deployment:

```bash
gunicorn app:app --bind 0.0.0.0:$PORT
```

