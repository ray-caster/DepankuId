# 🚀 Production Deployment Fix Guide

## Issues Fixed

### 1. **500 Server Error** ✅
- **Problem**: Supervisor was trying to run `server.js` which doesn't exist
- **Solution**: Updated supervisor config to use `npm start` command
- **File**: `scripts/supervisor/depanku-frontend.conf`

### 2. **MIME Type Issues** ✅
- **Problem**: Static assets were being served with wrong MIME types
- **Solution**: Added proper Content-Type headers for different asset types
- **File**: `next.config.mjs`

### 3. **Deployment Configuration** ✅
- **Problem**: Missing proper deployment script and configuration
- **Solution**: Created deployment script and updated supervisor config

## Updated Files

### `scripts/supervisor/depanku-frontend.conf`
```ini
[program:depanku-frontend]
command=/usr/bin/npm start
directory=/opt/depanku
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/supervisor/depanku-frontend.log
environment=NODE_ENV="production",PORT="6550"
```

### `next.config.mjs` - Added MIME Type Headers
```javascript
async headers() {
  return [
    {
      source: '/_next/static/chunks/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        },
        {
          key: 'Content-Type',
          value: 'application/javascript; charset=utf-8'
        }
      ],
    },
    // ... other headers
  ];
}
```

## Deployment Steps

1. **Update Supervisor Configuration**:
   ```bash
   sudo cp scripts/supervisor/depanku-frontend.conf /etc/supervisor/conf.d/
   sudo supervisorctl reread
   sudo supervisorctl update
   ```

2. **Deploy Application**:
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   ```

3. **Restart Services**:
   ```bash
   sudo supervisorctl restart depanku-frontend
   sudo supervisorctl status depanku-frontend
   ```

## Verification

After deployment, check:
- ✅ Static assets load with correct MIME types
- ✅ No 500 server errors
- ✅ JavaScript files execute properly
- ✅ CSS files load correctly

## Troubleshooting

If issues persist:
1. Check supervisor logs: `sudo tail -f /var/log/supervisor/depanku-frontend.log`
2. Verify build: `npm run build`
3. Test locally: `npm run start`
4. Check permissions: `ls -la .next/`
