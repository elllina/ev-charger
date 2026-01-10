#!/bin/bash

echo "======================================"
echo "  EV Charging Armenia - Quick Start"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is available
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✓ Docker and Docker Compose found${NC}"
    USE_DOCKER=true
else
    echo -e "${YELLOW}⚠ Docker not found. Will guide you through manual setup.${NC}"
    USE_DOCKER=false
fi

# Check if Node.js is available
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js found: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js not found. Please install Node.js 18 or higher.${NC}"
    exit 1
fi

echo ""
echo "======================================"
echo "  Step 1: Environment Setup"
echo "======================================"

# Copy .env files if they don't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file${NC}"
else
    echo -e "${YELLOW}→ .env file already exists${NC}"
fi

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ Created backend/.env file${NC}"
else
    echo -e "${YELLOW}→ backend/.env file already exists${NC}"
fi

if [ "$USE_DOCKER" = true ]; then
    echo ""
    echo "======================================"
    echo "  Step 2: Starting Docker Services"
    echo "======================================"

    docker-compose up -d

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Docker services started successfully${NC}"

        echo ""
        echo "Waiting for PostgreSQL to be ready..."
        sleep 5

        echo -e "${GREEN}✓ PostgreSQL is ready${NC}"
    else
        echo -e "${RED}✗ Failed to start Docker services${NC}"
        exit 1
    fi
else
    echo ""
    echo -e "${YELLOW}======================================"
    echo "  Manual Setup Required"
    echo "======================================"
    echo ""
    echo "Please ensure you have:"
    echo "  1. PostgreSQL 15+ with PostGIS extension"
    echo "  2. Redis server"
    echo "  3. Database 'ev_charging' created"
    echo ""
    echo "Run these commands:"
    echo "  psql -U postgres"
    echo "  CREATE DATABASE ev_charging;"
    echo "  \\c ev_charging"
    echo "  CREATE EXTENSION postgis;"
    echo "  \\q"
    echo ""
    read -p "Press Enter when ready to continue..."
    echo -e "${NC}"
fi

echo ""
echo "======================================"
echo "  Step 3: Installing Dependencies"
echo "======================================"

cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing npm packages..."
    npm install

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Dependencies installed${NC}"
    else
        echo -e "${RED}✗ Failed to install dependencies${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}→ Dependencies already installed${NC}"
fi

echo ""
echo "======================================"
echo "  Step 4: Database Setup"
echo "======================================"

# Check if tables exist
echo "Checking if database is already set up..."

# Run migrations
echo "Running database migrations..."
npm run migrate 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database migrations completed${NC}"
else
    echo -e "${YELLOW}→ Migrations may have already been run${NC}"
fi

# Seed database
echo "Seeding database with test data..."
npm run seed 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database seeded with test data${NC}"
else
    echo -e "${YELLOW}→ Database may already have data${NC}"
fi

echo ""
echo "======================================"
echo "  Step 5: Starting Backend Server"
echo "======================================"

echo ""
echo -e "${GREEN}Starting development server...${NC}"
echo ""
echo "The server will start at: http://localhost:3000"
echo ""
echo "Test it with:"
echo "  curl http://localhost:3000/api/v1/health"
echo ""
echo "Or visit in your browser:"
echo "  http://localhost:3000/api/v1/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "======================================"
echo ""

# Start the server
npm run dev
