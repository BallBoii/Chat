# Deployment Guide

This guide explains how to deploy the Chat Frontend application on a VM using PM2.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **pnpm** package manager
3. **PM2** process manager

### Install Prerequisites on VM

```bash
# Install Node.js (using nvm recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Install pnpm
npm install -g pnpm

# Install PM2 globally
npm install -g pm2
```

## Configuration

### 1. Update Environment Variables

Edit `.env.production` and replace `YOUR_VM_IP` with your actual VM IP address or domain:

```bash
NEXT_PUBLIC_API_BASE_URL=http://YOUR_VM_IP:8080
NEXT_PUBLIC_SOCKET_URL=http://YOUR_VM_IP:8080
```

### 2. Configure Firewall

Make sure ports are open:
```bash
# For Ubuntu/Debian
sudo ufw allow 3000/tcp
sudo ufw allow 8080/tcp

# For CentOS/RHEL
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

## Deployment Methods

### Method 1: Using Deploy Script (Recommended)

```bash
# Make the script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### Method 2: Manual Deployment

```bash
# 1. Install dependencies
pnpm install --frozen-lockfile

# 2. Build the application
pnpm run build

# 3. Create logs directory
mkdir -p logs

# 4. Start with PM2
pm2 start ecosystem.config.js --env production

# 5. Save PM2 process list
pm2 save

# 6. Setup PM2 to start on system boot
pm2 startup
# Follow the command output instructions
```

## PM2 Management Commands

### View Application Status
```bash
pm2 status
pm2 list
```

### View Logs
```bash
# View all logs
pm2 logs chat-frontend

# View only error logs
pm2 logs chat-frontend --err

# View only output logs
pm2 logs chat-frontend --out

# Clear logs
pm2 flush
```

### Restart Application
```bash
# Graceful restart
pm2 restart chat-frontend

# Reload (zero-downtime for cluster mode)
pm2 reload chat-frontend
```

### Stop/Delete Application
```bash
# Stop application
pm2 stop chat-frontend

# Delete from PM2
pm2 delete chat-frontend
```

### Monitor Application
```bash
# Real-time monitoring
pm2 monit

# Web-based monitoring (PM2 Plus)
pm2 plus
```

## Auto-Start on System Boot

To ensure the application starts automatically after server reboot:

```bash
# Generate startup script
pm2 startup

# After starting your app, save the process list
pm2 save
```

## Scaling (Optional)

If you need to run multiple instances:

```bash
# Start 4 instances
pm2 scale chat-frontend 4

# Or modify ecosystem.config.js:
# Change: instances: 1
# To: instances: 'max' (uses all CPU cores)
```

## Nginx Reverse Proxy (Recommended for Production)

Install and configure Nginx as a reverse proxy:

```bash
# Install Nginx
sudo apt install nginx  # Ubuntu/Debian
# or
sudo yum install nginx  # CentOS/RHEL
```

Create Nginx configuration:

```nginx
# /etc/nginx/sites-available/chat-frontend
server {
    listen 80;
    server_name your-domain.com;  # or VM IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support
    location /socket.io/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/chat-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Troubleshooting

### Check Application Logs
```bash
pm2 logs chat-frontend --lines 100
```

### Check Port Usage
```bash
# Check if port 3000 is in use
netstat -tulpn | grep 3000
# or
lsof -i :3000
```

### Restart PM2 Daemon
```bash
pm2 kill
pm2 resurrect
```

### Memory Issues
If the application is consuming too much memory:
```bash
# Modify max_memory_restart in ecosystem.config.js
# Then reload
pm2 reload ecosystem.config.js
```

## Health Check

Verify the application is running:
```bash
# From VM
curl http://localhost:3000

# From external
curl http://YOUR_VM_IP:3000
```

## Updates/Redeployment

When you need to deploy new changes:

```bash
# Pull latest code
git pull origin main

# Run deployment script
./deploy.sh
```

## Additional Resources

- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [PM2 Process Management](https://pm2.keymetrics.io/docs/usage/process-management/)
