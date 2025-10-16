"""
Depanku.id Backend API - Modular Flask Application with ASGI Support
"""
from flask import Flask, jsonify
from flask_cors import CORS
import os
import dotenv

dotenv.load_dotenv()

# Validate environment variables
from utils.env_validator import validate_environment
validate_environment()

# Import utilities
from utils.logging_config import logger
from utils.error_handlers import register_error_handlers
from utils.middleware import log_request_middleware

# Import route blueprints
from routes.opportunity_routes import opportunity_bp
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.bookmark_routes import bookmark_bp
from routes.sync_routes import sync_bp
from routes.profile_routes import profile_bp
from routes.ai_routes import ai_bp
from routes.publish_routes import publish_bp

# Initialize Flask app
app = Flask(__name__)

# Set maximum request size (16 MB)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Configure CORS with security settings
ALLOWED_ORIGINS = [
    'http://localhost:7550',
    'http://localhost:6550', 
    'https://www.depanku.id',
    'https://depanku.id'
]

# Add any additional origins from environment variable
env_origins = os.getenv('FRONTEND_URL', '').split(',')
for origin in env_origins:
    if origin.strip() and origin.strip() not in ALLOWED_ORIGINS:
        ALLOWED_ORIGINS.append(origin.strip())

CORS(app, 
     resources={r"/api/*": {"origins": ALLOWED_ORIGINS}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     expose_headers=["Content-Length", "X-Requested-With", "Accept", "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"]
)

# Log CORS configuration
logger.info(f"CORS configured for origins: {ALLOWED_ORIGINS}")

# Setup logging and error handling
logger.info("Initializing Depanku.id Backend API v2.1")
log_request_middleware(app)
register_error_handlers(app)
logger.info("Logging and error handling configured")

# Register blueprints
logger.info("Registering blueprints...")
app.register_blueprint(opportunity_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(bookmark_bp)
app.register_blueprint(sync_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(ai_bp)
app.register_blueprint(publish_bp)
logger.info("All blueprints registered successfully")

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "Depanku.id Backend"}), 200

# Root endpoint
@app.route('/', methods=['GET'])
def root():
    """Root endpoint with API information"""
    return jsonify({
        "service": "Depanku.id Backend API",
        "version": "2.0",
        "status": "operational",
        "endpoints": {
            "health": "/health",
            "opportunities": "/api/opportunities/*",
            "auth": "/api/auth/*",
            "user": "/api/user/*",
            "bookmarks": "/api/bookmarks/*",
            "sync": "/api/sync/*",
            "profile": "/api/profile/*",
            "ai": "/api/ai/*"
        }
        }), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    logger.info(f"Starting Flask development server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True)
