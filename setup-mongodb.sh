#!/bin/bash

echo "🚀 MongoDB Setup for Inventory Management System"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if MongoDB is installed
echo "Checking MongoDB installation..."
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✓ MongoDB is installed${NC}"
    mongod --version | head -n 1
else
    echo -e "${YELLOW}⚠ MongoDB is not installed${NC}"
    echo ""
    echo "Installing MongoDB..."
    
    # Detect OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        echo "Detected macOS"
        if command -v brew &> /dev/null; then
            echo "Installing MongoDB using Homebrew..."
            brew tap mongodb/brew
            brew install mongodb-community@7.0
            echo -e "${GREEN}✓ MongoDB installed${NC}"
        else
            echo -e "${RED}✗ Homebrew is not installed. Please install Homebrew first:${NC}"
            echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        echo "Detected Linux"
        echo "Please install MongoDB manually:"
        echo "  Ubuntu/Debian: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/"
        echo "  CentOS/RHEL: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/"
        exit 1
    else
        echo -e "${RED}✗ Unsupported OS. Please install MongoDB manually.${NC}"
        echo "Download from: https://www.mongodb.com/try/download/community"
        exit 1
    fi
fi

# Start MongoDB
echo ""
echo "Starting MongoDB..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    brew services start mongodb-community@7.0
    sleep 2
    if brew services list | grep mongodb-community | grep started &> /dev/null; then
        echo -e "${GREEN}✓ MongoDB is running${NC}"
    else
        echo -e "${RED}✗ Failed to start MongoDB${NC}"
        exit 1
    fi
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    sudo systemctl start mongod
    sudo systemctl enable mongod
    echo -e "${GREEN}✓ MongoDB service started${NC}"
fi

# Test MongoDB connection
echo ""
echo "Testing MongoDB connection..."
if mongosh --eval "db.runCommand({ ping: 1 })" --quiet &> /dev/null; then
    echo -e "${GREEN}✓ MongoDB connection successful${NC}"
else
    echo -e "${RED}✗ Cannot connect to MongoDB${NC}"
    echo "Please check if MongoDB is running"
    exit 1
fi

# Check .env file
echo ""
echo "Checking environment configuration..."
if [ -f ".env" ]; then
    if grep -q "MONGODB_URI" .env; then
        echo -e "${GREEN}✓ .env file configured with MongoDB${NC}"
    else
        echo -e "${YELLOW}⚠ Updating .env file for MongoDB${NC}"
        # Backup existing .env
        cp .env .env.backup
        # Update DATABASE_URL to MONGODB_URI
        sed -i.bak 's/DATABASE_URL=.*/MONGODB_URI=mongodb:\/\/localhost:27017\/inventory_db/' .env
        echo -e "${GREEN}✓ .env updated (backup saved as .env.backup)${NC}"
    fi
else
    echo -e "${YELLOW}⚠ .env file not found, creating...${NC}"
    cat > .env << EOF
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
MONGODB_URI=mongodb://localhost:27017/inventory_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EOF
    echo -e "${GREEN}✓ .env file created${NC}"
fi

# Install Node dependencies
echo ""
echo "Installing Node.js dependencies..."
if npm install; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi

# Seed database
echo ""
echo "Seeding database with admin user..."
if npm run db:seed; then
    echo -e "${GREEN}✓ Database seeded successfully${NC}"
else
    echo -e "${YELLOW}⚠ Database seeding failed (admin user may already exist)${NC}"
fi

echo ""
echo -e "${GREEN}=========================================="
echo "✅ Setup completed successfully!"
echo "==========================================${NC}"
echo ""
echo -e "${BLUE}Default credentials:${NC}"
echo "  Username: admin"
echo "  Password: admin123"
echo ""
echo -e "${BLUE}To start the server:${NC}"
echo "  npm run dev"
echo ""
echo -e "${BLUE}Server will run on:${NC}"
echo "  http://localhost:3000"
echo ""
echo -e "${BLUE}API endpoints:${NC}"
echo "  http://localhost:3000/api/v1"
echo ""
echo -e "${BLUE}MongoDB shell:${NC}"
echo "  mongosh"
echo "  use inventory_db"
echo ""
