#!/bin/bash

# Deployment Script for Separate Express.js & Next.js
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo "Please create .env file with required variables."
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 not found. Installing PM2...${NC}"
    npm install -g pm2
fi

# Install dependencies
echo -e "${GREEN}📦 Installing dependencies...${NC}"
npm install

# Build Next.js
echo -e "${GREEN}🔨 Building Next.js application...${NC}"
npm run build

# Create logs directory
mkdir -p logs

# Stop existing PM2 processes if running
echo -e "${GREEN}🛑 Stopping existing PM2 processes...${NC}"
pm2 delete ecosystem.config.js 2>/dev/null || true

# Start with PM2
echo -e "${GREEN}🚀 Starting applications with PM2...${NC}"
pm2 start ecosystem.config.js

# Save PM2 configuration
echo -e "${GREEN}💾 Saving PM2 configuration...${NC}"
pm2 save

# Show status
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "📝 Useful commands:"
echo "  pm2 logs              # View logs"
echo "  pm2 monit             # Monitor apps"
echo "  pm2 restart ecosystem.config.js  # Restart both apps"
echo ""
echo "🌐 Applications:"
echo "  API:      http://localhost:6210"
echo "  Frontend: http://localhost:6211"
echo ""

