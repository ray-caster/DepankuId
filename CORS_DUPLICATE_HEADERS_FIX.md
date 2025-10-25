# CORS Duplicate Headers Fix - Production Deployment Guide

## Problem Identified

The CORS errors are caused by **duplicate `Access-Control-Allow-Origin` headers** being sent by the production server:

```
access-control-allow-origin: https://www.depanku.id, https://www.depanku.id
```

This happens when multiple layers add CORS headers:
1. Our Flask application (manual CORS implementation)
2. Production infrastructure (reverse proxy, CDN, load balancer, etc.)

## Root Cause

The production server at `https://api.depanku.id` likely has:
- **Cloudflare** or another CDN adding CORS headers
- **Nginx** reverse proxy with CORS configuration
- **Load balancer** with CORS settings
- **Multiple application instances** each adding headers

## Solution

### Option 1: Remove CORS from Application Layer (Recommended)

Since the production infrastructure is already handling CORS, remove our manual CORS implementation:

```python
# Remove these lines from backend/app.py:
@app.after_request
def after_request(response):
    # ... CORS code ...

@app.before_request  
def handle_preflight():
    # ... CORS code ...
```

### Option 2: Configure Production Infrastructure

If you control the production infrastructure, ensure only ONE layer handles CORS:

**For Cloudflare:**
- Go to Cloudflare Dashboard → Rules → Transform Rules
- Remove any CORS headers from Page Rules or Transform Rules

**For Nginx:**
```nginx
# Remove or comment out CORS headers in nginx config
# add_header Access-Control-Allow-Origin *;
```

**For Load Balancer:**
- Check load balancer configuration for CORS settings
- Ensure only one instance adds CORS headers

### Option 3: Use Environment-Based CORS

Configure CORS based on environment:

```python
# In backend/app.py
import os

if os.getenv('ENVIRONMENT') == 'production':
    # Production: Let infrastructure handle CORS
    pass
else:
    # Development: Use manual CORS
    @app.after_request
    def after_request(response):
        # ... CORS code ...
```

## Immediate Fix

For immediate resolution, **remove the manual CORS implementation** from the Flask application since the production infrastructure is already handling it.

## Files to Update

1. **`backend/app.py`** - Remove manual CORS handlers
2. **Deploy to production** - Test with browser
3. **Verify** - Check browser console for CORS errors

## Testing

After deployment, test with:
```bash
# Test CORS headers
curl -X OPTIONS -H "Origin: https://www.depanku.id" -v https://api.depanku.id/api/test-cors

# Should show single Access-Control-Allow-Origin header
```

## Verification

✅ **Success indicators:**
- Single `Access-Control-Allow-Origin` header
- No CORS errors in browser console
- API requests work from frontend

❌ **Failure indicators:**
- Multiple `Access-Control-Allow-Origin` values
- CORS policy errors in browser
- Failed API requests

## Next Steps

1. Remove manual CORS from Flask app
2. Deploy to production
3. Test frontend functionality
4. Monitor for CORS errors
5. If issues persist, investigate production infrastructure

