#!/usr/bin/env python3
"""
Simple Flask development server runner
Alternative to ASGI/Uvicorn for development
"""
import os
from app import app
from utils.logging_config import logger

if __name__ == "__main__":
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    logger.info(f"Starting Flask development server on port {port}")
    logger.info(f"Debug mode: {debug}")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug,
        threaded=True
    )
