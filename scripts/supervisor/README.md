# Supervisor Configuration Files

## Frontend Service (depanku-frontend.conf)
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

## Backend Service (depanku-backend.conf)
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

## Cloudflare Tunnel (cloudflare-tunnel.conf)
```ini
[program:cloudflare-tunnel]
command=/usr/local/bin/cloudflared tunnel --config /opt/depanku/tunnel-config.yml run
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/supervisor/cloudflare-tunnel.log
```

## Installation Commands
```bash
# Copy configs to supervisor
sudo cp depanku-frontend.conf /etc/supervisor/conf.d/
sudo cp depanku-backend.conf /etc/supervisor/conf.d/
sudo cp cloudflare-tunnel.conf /etc/supervisor/conf.d/

# Reload supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start all
```

