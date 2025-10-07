#!/bin/bash

# 🚀 Depanku.id Deployment Script
# This script handles the complete deployment process

set -e  # Exit on any error

echo "🚀 Starting Depanku.id deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
print_status "Node.js version: $NODE_VERSION"

# Install dependencies
print_status "Installing dependencies..."
npm ci --production=false

# Build the application
print_status "Building Next.js application..."
npm run build

# Check if build was successful
if [ ! -d ".next" ]; then
    print_error "Build failed - .next directory not found"
    exit 1
fi

print_status "Build completed successfully!"

# Set proper permissions
print_status "Setting permissions..."
chmod +x scripts/deploy.sh
chown -R www-data:www-data .next
chown -R www-data:www-data public

# Restart services
print_status "Restarting services..."
sudo supervisorctl restart depanku-frontend

# Check service status
print_status "Checking service status..."
sudo supervisorctl status depanku-frontend

print_status "Deployment completed successfully! 🎉"
print_status "Application should be available at your configured domain."
