#!/bin/bash

# Quick Vercel Deployment Script
# This script automates the Vercel deployment process

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Vercel Deployment Helper Script     ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo ""

# Step 1: Check if Vercel CLI is installed
echo -e "${YELLOW}📦 Step 1: Checking Vercel CLI...${NC}"
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI installed successfully${NC}"
else
    echo -e "${GREEN}✅ Vercel CLI is already installed${NC}"
    vercel --version
fi
echo ""

# Step 2: Check if logged in to Vercel
echo -e "${YELLOW}🔐 Step 2: Checking Vercel authentication...${NC}"
if vercel whoami &> /dev/null; then
    VERCEL_USER=$(vercel whoami)
    echo -e "${GREEN}✅ Logged in as: ${VERCEL_USER}${NC}"
else
    echo -e "${YELLOW}⚠️  Not logged in to Vercel${NC}"
    echo -e "${BLUE}Opening browser for authentication...${NC}"
    vercel login
    echo -e "${GREEN}✅ Successfully logged in${NC}"
fi
echo ""

# Step 3: Build Next.js
echo -e "${YELLOW}🔨 Step 3: Building Next.js application...${NC}"
echo -e "${BLUE}Running: npm run build${NC}"
npm run build
echo -e "${GREEN}✅ Build completed successfully${NC}"
echo ""

# Step 4: Deploy to Vercel
echo -e "${YELLOW}🚀 Step 4: Deploying to Vercel...${NC}"
echo ""
echo -e "${BLUE}Choose deployment type:${NC}"
echo "  1. Preview deployment (for testing)"
echo "  2. Production deployment (live)"
echo ""
read -p "Enter your choice (1 or 2): " DEPLOY_CHOICE

if [ "$DEPLOY_CHOICE" = "1" ]; then
    echo -e "${BLUE}Deploying preview version...${NC}"
    vercel
elif [ "$DEPLOY_CHOICE" = "2" ]; then
    echo -e "${BLUE}Deploying to production...${NC}"
    vercel --prod
else
    echo -e "${RED}❌ Invalid choice. Defaulting to preview deployment${NC}"
    vercel
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║      Deployment Completed! 🎉          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📝 Next Steps:${NC}"
echo ""
echo "1. Copy your deployment URL from above"
echo ""
echo "2. Add environment variables in Vercel Dashboard:"
echo "   → Go to: https://vercel.com/dashboard"
echo "   → Click your project → Settings → Environment Variables"
echo ""
echo "   Required variables:"
echo "   ✓ MONGODB_URI (your MongoDB connection string)"
echo "   ✓ JWT_SECRET (your secret key)"
echo "   ✓ NODE_ENV (set to 'production')"
echo "   ✓ NEXT_PUBLIC_API_URL (https://your-url.vercel.app/api/v1)"
echo "   ✓ FRONTEND_URL (https://your-url.vercel.app)"
echo ""
echo "3. After adding environment variables, redeploy:"
echo "   $ vercel --prod"
echo ""
echo "4. Configure MongoDB Atlas Network Access:"
echo "   → Go to MongoDB Atlas → Network Access"
echo "   → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)"
echo ""
echo "5. Test your deployment:"
echo "   → Visit your Vercel URL"
echo "   → Try logging in (admin / admin123)"
echo ""
echo -e "${YELLOW}📚 For detailed guide, see: VERCEL_DEPLOYMENT_GUIDE.md${NC}"
echo ""
