#!/bin/bash

echo "🧹 Clearing Next.js cache and rebuilding..."

# Kill any running dev servers
echo "Stopping any running servers..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Remove Next.js cache directories
echo "Removing .next directory..."
rm -rf .next

# Remove node_modules/.cache
echo "Removing node_modules cache..."
rm -rf node_modules/.cache

# Remove turbopack cache
echo "Removing turbopack cache..."
rm -rf .turbo

echo "✅ Cache cleared!"
echo ""
echo "Now run: npm run dev"
