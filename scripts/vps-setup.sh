#!/bin/bash

# 🚀 Depanku.id VPS Setup Script
# This script sets up a complete VPS environment for Depanku.id

set -e  # Exit on any error

echo "🚀 Starting Depanku.id VPS Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Please run as a regular user with sudo access."
   exit 1
fi

# Check if sudo is available
if ! command -v sudo &> /dev/null; then
    print_error "sudo is required but not installed. Please install sudo first."
    exit 1
fi

print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

print_status "Installing system dependencies..."
sudo apt install -y curl wget git nginx supervisor python3.11 python3.11-venv python3.11-dev python3-pip build-essential

print_status "Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

print_status "Installing Cloudflare Tunnel..."
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
rm cloudflared-linux-amd64.deb

print_status "Creating application directory..."
sudo mkdir -p /opt/depanku
sudo chown $USER:$USER /opt/depanku

print_status "Setting up Python 3.11 as default..."
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1

print_status "Creating supervisor configuration files..."

# Frontend supervisor config
sudo tee /etc/supervisor/conf.d/depanku-frontend.conf > /dev/null << 'EOF'
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

# Backend supervisor config
sudo tee /etc/supervisor/conf.d/depanku-backend.conf > /dev/null << 'EOF'
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

# Cloudflare tunnel supervisor config
sudo tee /etc/supervisor/conf.d/cloudflare-tunnel.conf > /dev/null << 'EOF'
[program:cloudflare-tunnel]
command=/usr/local/bin/cloudflared tunnel --config /opt/depanku/tunnel-config.yml run
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/supervisor/cloudflare-tunnel.log
EOF

print_status "Setting up firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

print_status "Creating environment file templates..."

# Frontend environment template
cat > /opt/depanku/.env.local.template << 'EOF'
NEXT_PUBLIC_API_URL=https://api.depanku.id
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_ALGOLIA_APP_ID=your_algolia_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your_algolia_search_key
EOF

# Backend environment template
cat > /opt/depanku/backend/.env.template << 'EOF'
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

# Cloudflare tunnel config template
cat > /opt/depanku/tunnel-config.yml.template << 'EOF'
tunnel: YOUR_TUNNEL_ID
credentials-file: /root/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: depanku.id
    service: http://127.0.0.1:3000
  - hostname: api.depanku.id
    service: http://127.0.0.1:5000
  - service: http_status:404
EOF

print_status "Creating deployment script..."
cat > /opt/depanku/deploy.sh << 'EOF'
#!/bin/bash
echo "🚀 Deploying Depanku.id..."

cd /opt/depanku

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Update frontend
echo "🔧 Building frontend..."
npm install
npm run build

# Update backend
echo "🐍 Updating backend..."
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Restart services
echo "🔄 Restarting services..."
sudo supervisorctl restart depanku-frontend depanku-backend

echo "✅ Deployment complete!"
EOF

chmod +x /opt/depanku/deploy.sh

print_status "Creating backup script..."
cat > /opt/depanku/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
mkdir -p $BACKUP_DIR

# Backup application
tar -czf $BACKUP_DIR/depanku_$DATE.tar.gz -C /opt depanku

# Keep only last 7 days
find $BACKUP_DIR -name "depanku_*.tar.gz" -mtime +7 -delete

echo "✅ Backup created: $BACKUP_DIR/depanku_$DATE.tar.gz"
EOF

chmod +x /opt/depanku/backup.sh

print_status "Setting up log rotation..."
sudo tee /etc/logrotate.d/depanku > /dev/null << 'EOF'
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

print_status "Setting up cron jobs..."
# Add backup cron job
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/depanku/backup.sh") | crontab -

print_status "Creating useful aliases..."
cat >> ~/.bashrc << 'EOF'

# Depanku.id aliases
alias depanku-logs='sudo supervisorctl tail -f depanku-frontend depanku-backend'
alias depanku-status='sudo supervisorctl status'
alias depanku-restart='sudo supervisorctl restart all'
alias depanku-deploy='/opt/depanku/deploy.sh'
alias depanku-backup='/opt/depanku/backup.sh'
EOF

print_success "VPS setup complete! 🎉"
echo ""
print_status "Next steps:"
echo "1. Clone your repository: cd /opt/depanku && git clone YOUR_REPO_URL ."
echo "2. Install dependencies: npm install && cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
echo "3. Configure environment files:"
echo "   - Copy .env.local.template to .env.local and fill in values"
echo "   - Copy backend/.env.template to backend/.env and fill in values"
echo "4. Setup Cloudflare Tunnel:"
echo "   - Run: cloudflared tunnel login"
echo "   - Run: cloudflared tunnel create depanku-tunnel"
echo "   - Copy tunnel-config.yml.template to tunnel-config.yml and update tunnel ID"
echo "5. Start services: sudo supervisorctl start all"
echo ""
print_status "Useful commands:"
echo "- depanku-status    # Check service status"
echo "- depanku-logs      # View real-time logs"
echo "- depanku-restart   # Restart all services"
echo "- depanku-deploy    # Deploy new version"
echo "- depanku-backup    # Create backup"
echo ""
print_warning "Don't forget to:"
echo "- Configure your domain DNS in Cloudflare"
echo "- Set up SSL/TLS in Cloudflare dashboard"
echo "- Test your application after deployment"

