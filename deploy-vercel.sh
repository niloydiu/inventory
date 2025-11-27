#!/bin/bash

echo "🚀 Deploying to Vercel"
echo "====================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠ Vercel CLI not found. Installing...${NC}"
    npm i -g vercel
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠ Warning: .env file not found${NC}"
    echo "Make sure to set environment variables in Vercel dashboard!"
fi

echo -e "${BLUE}Starting deployment...${NC}"
echo ""

# Deploy to Vercel
vercel --prod

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📝 Next steps:"
echo "1. Go to Vercel dashboard"
echo "2. Add environment variables (if not already added):"
echo "   - MONGODB_URI"
echo "   - JWT_SECRET"
echo "   - NEXT_PUBLIC_API_URL"
echo "   - FRONTEND_URL"
echo "   - NODE_ENV"
echo "3. Seed your production database"
echo "4. Test your application"
echo ""
echo "📚 See VERCEL_DEPLOYMENT.md for detailed instructions"
