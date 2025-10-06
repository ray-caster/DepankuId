# 🚀 Quick VPS Setup Script

## One-Command Setup

Run this script on a fresh Ubuntu/Debian VPS:

```bash
curl -fsSL https://raw.githubusercontent.com/yourusername/DepankuId/main/scripts/vps-setup.sh | bash
```

## Manual Setup Commands

### 1. Install Dependencies
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git nginx supervisor python3.11 python3.11-venv python3.11-dev python3-pip
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

### 2. Setup Application
```bash
sudo mkdir -p /opt/depanku
sudo chown $USER:$USER /opt/depanku
cd /opt/depanku
git clone https://github.com/yourusername/DepankuId.git .
```

### 3. Install Dependencies
```bash
npm install
npm run build
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 4. Configure Environment
```bash
# Copy your .env files to:
# /opt/depanku/.env.local (frontend)
# /opt/depanku/backend/.env (backend)
```

### 5. Setup Supervisor
```bash
sudo cp scripts/supervisor/*.conf /etc/supervisor/conf.d/
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start all
```

### 6. Setup Cloudflare Tunnel
```bash
cloudflared tunnel login
cloudflared tunnel create depanku-tunnel
# Copy tunnel ID and configure tunnel-config.yml
```

## Environment Variables Template

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.depanku.id
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your_search_key
```

### Backend (.env)
```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
OPENROUTER_API_KEY=your_key
ALGOLIA_APP_ID=your_app_id
ALGOLIA_ADMIN_API_KEY=your_admin_key
BREVO_API_KEY=your_brevo_key
BREVO_SENDER_EMAIL=verify@depanku.id
BREVO_SENDER_NAME=Depanku Verification
FRONTEND_URL=https://depanku.id
FLASK_ENV=production
PORT=5000
```

## Supervisor Config Files

### Frontend (depanku-frontend.conf)
```ini
[program:depanku-frontend]
command=/usr/bin/node server.js
directory=/opt/depanku
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/supervisor/depanku-frontend.log
environment=NODE_ENV="production"
```

### Backend (depanku-backend.conf)
```ini
[program:depanku-backend]
command=/opt/depanku/backend/venv/bin/uvicorn asgi:application --host 127.0.0.1 --port 5000
directory=/opt/depanku/backend
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/supervisor/depanku-backend.log
environment=PATH="/opt/depanku/backend/venv/bin:%(ENV_PATH)s"
```

### Cloudflare Tunnel (cloudflare-tunnel.conf)
```ini
[program:cloudflare-tunnel]
command=/usr/local/bin/cloudflared tunnel --config /opt/depanku/tunnel-config.yml run
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/supervisor/cloudflare-tunnel.log
```

## Cloudflare Tunnel Config (tunnel-config.yml)
```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: /root/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: depanku.id
    service: http://127.0.0.1:3000
  - hostname: api.depanku.id
    service: http://127.0.0.1:5000
  - service: http_status:404
```

## Useful Commands

```bash
# Check status
sudo supervisorctl status

# Restart services
sudo supervisorctl restart all

# View logs
sudo supervisorctl tail -f depanku-frontend
sudo supervisorctl tail -f depanku-backend

# Deploy new version
cd /opt/depanku
git pull
npm run build
cd backend && source venv/bin/activate && pip install -r requirements.txt
sudo supervisorctl restart all
```

## Troubleshooting

```bash
# Check if ports are in use
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :5000

# Check logs
tail -f /var/log/supervisor/depanku-frontend.log
tail -f /var/log/supervisor/depanku-backend.log

# Test locally
curl http://127.0.0.1:3000
curl http://127.0.0.1:5000/health
```

---

**Your app will be live at https://depanku.id!** 🎉

