# 🚀 VPS Deployment Guide - Depanku.id

## Overview

This guide covers deploying Depanku.id to a VPS using:
- **Supervisor** - Process management
- **Cloudflare Tunnel** - Secure tunneling (no port exposure)
- **Nginx** - Reverse proxy (optional)
- **PM2** - Node.js process manager (alternative)

## 📋 Prerequisites

### VPS Requirements
- Ubuntu 20.04+ or Debian 11+
- 2GB+ RAM
- 20GB+ storage
- Root/sudo access

### Domain Setup
- Domain pointed to Cloudflare
- Cloudflare Tunnel configured

## 🔧 Step 1: Server Setup

### Update System
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git nginx supervisor
```

### Install Node.js 18+
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### Install Python 3.11+
```bash
sudo apt install -y python3.11 python3.11-venv python3.11-dev python3-pip
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1
```

### Install Cloudflare Tunnel
```bash
# Download latest tunnel
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

## 📁 Step 2: Application Setup

### Create App Directory
```bash
sudo mkdir -p /opt/depanku
sudo chown $USER:$USER /opt/depanku
cd /opt/depanku
```

### Clone Repository
```bash
git clone https://github.com/yourusername/DepankuId.git .
# Or upload your code via SCP/SFTP
```

### Install Frontend Dependencies
```bash
cd /opt/depanku
npm install
npm run build
```

### Install Backend Dependencies
```bash
cd /opt/depanku/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 🔐 Step 3: Environment Configuration

### Create Environment Files
```bash
# Frontend (.env.local)
cat > /opt/depanku/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=https://api.depanku.id
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_ALGOLIA_APP_ID=your_algolia_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your_algolia_search_key
EOF

# Backend (.env)
cat > /opt/depanku/backend/.env << 'EOF'
# Firebase
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}

# OpenRouter
OPENROUTER_API_KEY=your_openrouter_api_key

# Algolia
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_ADMIN_API_KEY=your_algolia_admin_key

# Brevo
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=verify@depanku.id
BREVO_SENDER_NAME=Depanku Verification

# Application
FRONTEND_URL=https://depanku.id
FLASK_ENV=production
FLASK_DEBUG=False
PORT=5000
EOF
```

### Set Permissions
```bash
sudo chown -R $USER:$USER /opt/depanku
chmod 600 /opt/depanku/backend/.env
chmod 600 /opt/depanku/.env.local
```

## 🎯 Step 4: Supervisor Configuration

### Frontend Service (Next.js)
```bash
sudo tee /etc/supervisor/conf.d/depanku-frontend.conf << 'EOF'
[program:depanku-frontend]
command=/usr/bin/node server.js
directory=/opt/depanku
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/supervisor/depanku-frontend.log
environment=NODE_ENV="production"
EOF
```

### Backend Service (Flask/Uvicorn)
```bash
sudo tee /etc/supervisor/conf.d/depanku-backend.conf << 'EOF'
[program:depanku-backend]
command=/opt/depanku/backend/venv/bin/uvicorn asgi:application --host 127.0.0.1 --port 5000
directory=/opt/depanku/backend
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/supervisor/depanku-backend.log
environment=PATH="/opt/depanku/backend/venv/bin:%(ENV_PATH)s"
EOF
```

### Cloudflare Tunnel Service
```bash
sudo tee /etc/supervisor/conf.d/cloudflare-tunnel.conf << 'EOF'
[program:cloudflare-tunnel]
command=/usr/local/bin/cloudflared tunnel --config /opt/depanku/tunnel-config.yml run
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/supervisor/cloudflare-tunnel.log
EOF
```

## 🌐 Step 5: Cloudflare Tunnel Setup

### Create Tunnel
```bash
# Login to Cloudflare
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create depanku-tunnel

# Note the tunnel ID from output
```

### Configure Tunnel
```bash
cat > /opt/depanku/tunnel-config.yml << 'EOF'
tunnel: YOUR_TUNNEL_ID
credentials-file: /root/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: depanku.id
    service: http://127.0.0.1:3000
  - hostname: api.depanku.id
    service: http://127.0.0.1:5000
  - service: http_status:404
EOF
```

### Set DNS Records
```bash
# Add CNAME records in Cloudflare dashboard:
# depanku.id -> YOUR_TUNNEL_ID.cfargotunnel.com
# api.depanku.id -> YOUR_TUNNEL_ID.cfargotunnel.com
```

## 🔄 Step 6: Process Management

### Start Services
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start all
```

### Check Status
```bash
sudo supervisorctl status
```

### View Logs
```bash
sudo supervisorctl tail -f depanku-frontend
sudo supervisorctl tail -f depanku-backend
sudo supervisorctl tail -f cloudflare-tunnel
```

## 🛡️ Step 7: Security & Optimization

### Firewall Setup
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
# No need to open 3000/5000 - Cloudflare Tunnel handles it
```

### SSL/TLS
Cloudflare Tunnel automatically provides SSL. Configure in Cloudflare dashboard:
- SSL/TLS mode: "Full (strict)"
- Always Use HTTPS: On
- HSTS: On

### Performance Optimization
```bash
# Enable gzip compression in Nginx (if using)
sudo tee /etc/nginx/sites-available/depanku << 'EOF'
server {
    listen 80;
    server_name depanku.id api.depanku.id;
    
    # Proxy to Cloudflare Tunnel
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/depanku /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 📊 Step 8: Monitoring & Maintenance

### Health Checks
```bash
# Check if services are running
curl -f http://127.0.0.1:3000/health || echo "Frontend down"
curl -f http://127.0.0.1:5000/health || echo "Backend down"

# Check Cloudflare Tunnel
cloudflared tunnel info depanku-tunnel
```

### Log Rotation
```bash
sudo tee /etc/logrotate.d/depanku << 'EOF'
/var/log/supervisor/depanku-*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        supervisorctl restart depanku-frontend depanku-backend
    endscript
}
EOF
```

### Backup Script
```bash
cat > /opt/depanku/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
mkdir -p $BACKUP_DIR

# Backup application
tar -czf $BACKUP_DIR/depanku_$DATE.tar.gz -C /opt depanku

# Keep only last 7 days
find $BACKUP_DIR -name "depanku_*.tar.gz" -mtime +7 -delete
EOF

chmod +x /opt/depanku/backup.sh

# Add to crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/depanku/backup.sh") | crontab -
```

## 🚀 Step 9: Deployment Commands

### Deploy New Version
```bash
#!/bin/bash
# deploy.sh

cd /opt/depanku

# Pull latest changes
git pull origin main

# Update frontend
npm install
npm run build

# Update backend
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Restart services
sudo supervisorctl restart depanku-frontend depanku-backend

echo "Deployment complete!"
```

### Quick Commands
```bash
# Restart all services
sudo supervisorctl restart all

# Stop all services
sudo supervisorctl stop all

# Start all services
sudo supervisorctl start all

# View real-time logs
sudo supervisorctl tail -f depanku-frontend depanku-backend

# Check service status
sudo supervisorctl status
```

## 🔧 Step 10: Troubleshooting

### Common Issues

#### Services Won't Start
```bash
# Check logs
sudo supervisorctl tail -f depanku-frontend
sudo supervisorctl tail -f depanku-backend

# Check permissions
ls -la /opt/depanku/
sudo chown -R www-data:www-data /opt/depanku
```

#### Cloudflare Tunnel Issues
```bash
# Check tunnel status
cloudflared tunnel info depanku-tunnel

# Test tunnel locally
cloudflared tunnel --config /opt/depanku/tunnel-config.yml run

# Check DNS
nslookup depanku.id
```

#### Port Conflicts
```bash
# Check what's using ports
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :5000

# Kill processes if needed
sudo kill -9 $(sudo lsof -t -i:3000)
sudo kill -9 $(sudo lsof -t -i:5000)
```

#### Memory Issues
```bash
# Check memory usage
free -h
ps aux --sort=-%mem | head

# Restart services if needed
sudo supervisorctl restart all
```

## 📈 Step 11: Performance Monitoring

### System Monitoring
```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Monitor resources
htop                    # CPU/Memory
iotop                   # Disk I/O
nethogs                 # Network usage
```

### Application Monitoring
```bash
# Check application logs
tail -f /var/log/supervisor/depanku-frontend.log
tail -f /var/log/supervisor/depanku-backend.log

# Monitor Cloudflare analytics
# Visit Cloudflare dashboard -> Analytics
```

## 🎯 Step 12: Production Checklist

### Pre-Deployment
- [ ] All environment variables set
- [ ] SSL certificates configured
- [ ] Firewall rules applied
- [ ] Backup system in place
- [ ] Monitoring configured

### Post-Deployment
- [ ] Health checks passing
- [ ] SSL working (https://depanku.id)
- [ ] API endpoints responding
- [ ] Database connections working
- [ ] Email sending working
- [ ] Search functionality working

### Security Checklist
- [ ] No unnecessary ports open
- [ ] Strong passwords set
- [ ] SSH key authentication
- [ ] Regular security updates
- [ ] Log monitoring enabled

## 📞 Support Commands

### Emergency Restart
```bash
sudo supervisorctl restart all
sudo systemctl restart supervisor
```

### View All Logs
```bash
sudo journalctl -u supervisor -f
```

### Check System Resources
```bash
df -h                    # Disk space
free -h                  # Memory
uptime                   # System load
```

---

## 🎉 You're Live!

Your Depanku.id application should now be running at:
- **Frontend**: https://depanku.id
- **API**: https://api.depanku.id

### Next Steps
1. Test all functionality
2. Set up monitoring alerts
3. Configure automated backups
4. Set up CI/CD pipeline
5. Monitor performance metrics

**Happy deploying!** 🚀

