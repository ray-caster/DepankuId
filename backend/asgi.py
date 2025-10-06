"""
ASGI entry point for Depanku.id Backend API
Run with: uvicorn asgi:application --host 0.0.0.0 --port 5000 --reload
"""
from a2wsgi import ASGIMiddleware
from app import app
from utils.logging_config import logger

# Wrap Flask app with ASGI middleware
application = ASGIMiddleware(app)

logger.info("ASGI application initialized")
logger.info("Run with: uvicorn asgi:application --host 0.0.0.0 --port 5000 --reload")

