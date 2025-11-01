#!/bin/bash

# Chat Frontend Deployment Script
# This script builds and deploys the Next.js application using PM2

set -e

echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Build the Next.js application
echo "🔨 Building Next.js application..."
pnpm run build

# Create logs directory if it doesn't exist
mkdir -p logs

# Stop existing PM2 process if running
echo "🛑 Stopping existing PM2 process..."
pm2 delete chat-frontend 2>/dev/null || echo "No existing process to stop"

# Start the application with PM2
echo "✅ Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 process list
echo "💾 Saving PM2 process list..."
pm2 save

# Display status
echo "📊 Application status:"
pm2 status

echo "✨ Deployment completed successfully!"
echo "🌐 Application should be running on port 3000"
echo ""
echo "Useful PM2 commands:"
echo "  pm2 logs chat-frontend    - View logs"
echo "  pm2 restart chat-frontend - Restart application"
echo "  pm2 stop chat-frontend    - Stop application"
echo "  pm2 monit                 - Monitor application"
