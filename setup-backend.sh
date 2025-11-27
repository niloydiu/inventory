#!/bin/bash

echo "🚀 Inventory Management System - Backend Setup"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if PostgreSQL is installed
echo "Checking PostgreSQL installation..."
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✓ PostgreSQL is installed${NC}"
else
    echo -e "${RED}✗ PostgreSQL is not installed${NC}"
    echo "Install it with: brew install postgresql@16"
    exit 1
fi

# Check if PostgreSQL is running
echo "Checking PostgreSQL service..."
if pg_isready &> /dev/null; then
    echo -e "${GREEN}✓ PostgreSQL is running${NC}"
else
    echo -e "${YELLOW}⚠ PostgreSQL is not running${NC}"
    echo "Starting PostgreSQL..."
    brew services start postgresql@16
    sleep 2
    if pg_isready &> /dev/null; then
        echo -e "${GREEN}✓ PostgreSQL started successfully${NC}"
    else
        echo -e "${RED}✗ Failed to start PostgreSQL${NC}"
        exit 1
    fi
fi

# Create database
echo ""
echo "Creating database..."
DB_EXISTS=$(psql -U postgres -lqt | cut -d \| -f 1 | grep -w inventory_db)
if [ -z "$DB_EXISTS" ]; then
    createdb inventory_db 2>/dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Database 'inventory_db' created${NC}"
    else
        echo -e "${YELLOW}⚠ Database might already exist or check permissions${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Database 'inventory_db' already exists${NC}"
fi

# Run schema
echo ""
echo "Setting up database schema..."
if [ -f "server/config/db-schema.sql" ]; then
    psql -U postgres -d inventory_db -f server/config/db-schema.sql > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Database schema created successfully${NC}"
    else
        echo -e "${RED}✗ Failed to create schema${NC}"
        exit 1
    fi
else
    echo -e "${RED}✗ Schema file not found${NC}"
    exit 1
fi

# Check .env file
echo ""
echo "Checking environment configuration..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✓ .env file exists${NC}"
else
    echo -e "${YELLOW}⚠ .env file not found${NC}"
    echo "Creating .env file..."
    cat > .env << EOF
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# Database Configuration
DATABASE_URL=postgresql://localhost:5432/inventory_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EOF
    echo -e "${GREEN}✓ .env file created${NC}"
fi

echo ""
echo -e "${GREEN}=========================================="
echo "✅ Setup completed successfully!"
echo "==========================================${NC}"
echo ""
echo "Default credentials:"
echo "  Username: admin"
echo "  Password: admin123"
echo ""
echo "To start the server:"
echo "  npm run dev"
echo ""
echo "API will be available at:"
echo "  http://localhost:3000/api/v1"
echo ""
