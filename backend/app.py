"""
Depanku.id Backend API - Modular Flask Application with ASGI Support
"""
from flask import Flask, jsonify, request
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
from routes.application_routes import application_bp
from routes.upload_routes import upload_bp

# Initialize Flask app
app = Flask(__name__)

# Set maximum request size (16 MB)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Additional Flask configuration for better request handling
app.config['JSON_SORT_KEYS'] = False
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False


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

# CORS handling - production infrastructure is not adding CORS headers
@app.after_request
def after_request(response):
    """Add CORS headers to all responses"""
    origin = request.headers.get('Origin')
    
    # Check if origin is in allowed list
    if origin in ALLOWED_ORIGINS:
        response.headers['Access-Control-Allow-Origin'] = origin
    else:
        # For development, allow localhost
        if origin and ('localhost' in origin or '127.0.0.1' in origin):
            response.headers['Access-Control-Allow-Origin'] = origin
    
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Accept, Origin'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Max-Age'] = '3600'
    
    return response

@app.before_request
def handle_preflight():
    """Handle preflight OPTIONS requests"""
    if request.method == 'OPTIONS':
        origin = request.headers.get('Origin')
        if origin in ALLOWED_ORIGINS:
            response = jsonify({'message': 'CORS preflight successful'})
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Accept, Origin'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Max-Age'] = '3600'
            return response
        else:
            return jsonify({'error': 'CORS policy violation'}), 403

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
app.register_blueprint(application_bp)
app.register_blueprint(upload_bp)
logger.info("All blueprints registered successfully")

# Debug: List all registered routes
logger.info("Registered routes:")
for rule in app.url_map.iter_rules():
    logger.info(f"  {rule.methods} {rule.rule}")
    if 'publish' in rule.rule:
        logger.info(f"    -> PUBLISH ROUTE FOUND: {rule.methods} {rule.rule}")

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "Depanku.id Backend"}), 200

# CORS test endpoint
@app.route('/api/test-cors', methods=['GET', 'POST', 'OPTIONS'])
def test_cors():
    """Test CORS functionality"""
    logger.info(f"CORS test endpoint called: {request.method}")
    logger.info(f"Origin: {request.headers.get('Origin')}")
    logger.info(f"Headers: {dict(request.headers)}")
    
    return jsonify({
        "message": "CORS test successful",
        "method": request.method,
        "origin": request.headers.get('Origin'),
        "allowed_origins": ALLOWED_ORIGINS
    }), 200

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
