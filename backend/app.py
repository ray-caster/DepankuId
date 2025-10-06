"""
Depanku.id Backend API - Modular Flask Application with ASGI Support
"""
from flask import Flask, jsonify
from flask_cors import CORS
import os
import dotenv

dotenv.load_dotenv()

# Import utilities
from utils.logging_config import logger
from utils.error_handlers import register_error_handlers
from utils.middleware import log_request_middleware

# Import route blueprints
from routes.ai_routes import ai_bp
from routes.opportunity_routes import opportunity_bp
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.bookmark_routes import bookmark_bp
from routes.sync_routes import sync_bp
from routes.profile_routes import profile_bp

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Setup logging and error handling
logger.info("Initializing Depanku.id Backend API v2.1")
log_request_middleware(app)
register_error_handlers(app)
logger.info("Logging and error handling configured")

# Register blueprints
logger.info("Registering blueprints...")
app.register_blueprint(ai_bp)
app.register_blueprint(opportunity_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(bookmark_bp)
app.register_blueprint(sync_bp)
app.register_blueprint(profile_bp)
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
            "ai": "/api/ai/*",
            "opportunities": "/api/opportunities/*",
            "auth": "/api/auth/*",
            "user": "/api/user/*",
            "bookmarks": "/api/bookmarks/*",
            "sync": "/api/sync/*",
            "profile": "/api/profile/*"
        }
        }), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    logger.info(f"Starting Flask development server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True)
