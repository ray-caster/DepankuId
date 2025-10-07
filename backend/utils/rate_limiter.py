"""Simple in-memory rate limiting"""
import time
from collections import defaultdict
from functools import wraps
from flask import request, jsonify
from typing import Dict, Tuple

class RateLimiter:
    """Simple in-memory rate limiter"""
    
    def __init__(self):
        # Store: {ip: [(timestamp, count)]}
        self.requests: Dict[str, list] = defaultdict(list)
        self.cleanup_interval = 60  # Clean old entries every 60 seconds
        self.last_cleanup = time.time()
    
    def _get_client_ip(self) -> str:
        """Get client IP address"""
        # Check for proxy headers
        if request.headers.get('X-Forwarded-For'):
            return request.headers.get('X-Forwarded-For').split(',')[0].strip()
        elif request.headers.get('X-Real-IP'):
            return request.headers.get('X-Real-IP')
        return request.remote_addr or 'unknown'
    
    def _cleanup_old_entries(self):
        """Remove old entries to prevent memory leak"""
        current_time = time.time()
        
        # Only cleanup periodically
        if current_time - self.last_cleanup < self.cleanup_interval:
            return
        
        self.last_cleanup = current_time
        
        # Remove entries older than 24 hours
        cutoff = current_time - (24 * 60 * 60)
        
        for ip in list(self.requests.keys()):
            self.requests[ip] = [
                (ts, count) for ts, count in self.requests[ip]
                if ts > cutoff
            ]
            
            # Remove empty entries
            if not self.requests[ip]:
                del self.requests[ip]
    
    def is_rate_limited(self, limit: int, window: int) -> Tuple[bool, int]:
        """
        Check if request should be rate limited
        
        Args:
            limit: Maximum number of requests
            window: Time window in seconds
        
        Returns:
            (is_limited, retry_after_seconds)
        """
        self._cleanup_old_entries()
        
        client_ip = self._get_client_ip()
        current_time = time.time()
        window_start = current_time - window
        
        # Get requests in current window
        recent_requests = [
            (ts, count) for ts, count in self.requests[client_ip]
            if ts > window_start
        ]
        
        # Count total requests
        total_requests = sum(count for _, count in recent_requests)
        
        if total_requests >= limit:
            # Calculate retry after (time until oldest request expires)
            if recent_requests:
                oldest_request_time = min(ts for ts, _ in recent_requests)
                retry_after = int(window - (current_time - oldest_request_time)) + 1
                return True, retry_after
            return True, window
        
        # Add current request
        self.requests[client_ip].append((current_time, 1))
        return False, 0

# Global rate limiter instance
limiter = RateLimiter()

def rate_limit(limit: int = 100, window: int = 60):
    """
    Decorator for rate limiting endpoints
    
    Args:
        limit: Maximum number of requests
        window: Time window in seconds
    
    Example:
        @rate_limit(limit=10, window=60)  # 10 requests per minute
        def my_endpoint():
            return jsonify({"message": "success"})
    """
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            is_limited, retry_after = limiter.is_rate_limited(limit, window)
            
            if is_limited:
                return jsonify({
                    "success": False,
                    "message": f"Rate limit exceeded. Try again in {retry_after} seconds.",
                    "retry_after": retry_after
                }), 429
            
            return f(*args, **kwargs)
        return wrapped
    return decorator

