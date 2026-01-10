#!/bin/bash

echo "======================================"
echo "  Local Development Server (No Docker)"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node --version) found${NC}"

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    echo -e "${RED}✗ Please run this script from the project root directory${NC}"
    exit 1
fi

cd backend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo ""
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
fi

echo ""
echo -e "${BLUE}======================================"
echo "  Starting Development Server"
echo "======================================${NC}"
echo ""
echo "The backend will use SQLite (no PostgreSQL needed)"
echo "And in-memory storage (no Redis needed)"
echo ""
echo "Server will be available at:"
echo "  ${GREEN}http://localhost:3000${NC}"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Set development environment with SQLite
export NODE_ENV=development
export USE_SQLITE=true
export PORT=3000

# Start the server
npm run dev
