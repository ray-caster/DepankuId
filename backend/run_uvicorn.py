"""
Uvicorn runner for development
"""
import uvicorn
import os

if __name__ == "__main__":
    port = int(os.getenv('PORT', 5000))
    
    uvicorn.run(
        "asgi:application",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info",
        access_log=True
    )

