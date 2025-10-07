"""
ASGI entry point for Depanku.id Backend API
Run with: uvicorn asgi:application --host 0.0.0.0 --port 5000 --reload
"""
from asgiref.wsgi import WsgiToAsgi
from app import app
from utils.logging_config import logger

# Convert Flask WSGI app to ASGI
application = WsgiToAsgi(app)

logger.info("ASGI application initialized")
logger.info("Run with: uvicorn asgi:application --host 0.0.0.0 --port 5000 --reload")

