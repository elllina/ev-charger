# 🚀 Quick Start Guide - EV Charging Armenia

## Prerequisites

Before running the project, ensure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Docker & Docker Compose** (recommended) - [Download](https://www.docker.com/)
- **PostgreSQL 15+** with PostGIS (if not using Docker)
- **Redis** (if not using Docker)

---

## Option 1: Quick Start with Docker (Recommended) ⭐

This is the easiest way to get started!

### Step 1: Start all services

```bash
# From the project root directory
docker-compose up -d
```

This will start:
- PostgreSQL with PostGIS (port 5432)
- Redis (port 6379)
- Backend API (port 3000)
- pgAdmin (port 5050) - optional database management tool

### Step 2: Install backend dependencies

```bash
cd backend
npm install
```

### Step 3: Run database migrations

```bash
npm run migrate
```

### Step 4: Seed the database with test data

```bash
npm run seed
```

This will create:
- 4 charging networks (EVAN, EcoCars, iCharge, Amperion)
- 7 charging stations in Yerevan
- 11 connectors
- 3 test user accounts

### Step 5: Verify it's running

```bash
# Check API health
curl http://localhost:3000/api/v1/health

# Or visit in browser:
# http://localhost:3000/api/v1/health
```

**That's it! The API is running at http://localhost:3000** 🎉

---

## Option 2: Running Without Docker (Manual Setup)

If you don't have Docker, you can run everything manually.

### Step 1: Install PostgreSQL with PostGIS

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql-15 postgresql-15-postgis-3
sudo systemctl start postgresql
```

**On macOS:**
```bash
brew install postgresql@15 postgis
brew services start postgresql@15
```

**On Windows:**
Download and install from [PostgreSQL.org](https://www.postgresql.org/download/windows/)

### Step 2: Install Redis

**On Ubuntu/Debian:**
```bash
sudo apt install redis-server
sudo systemctl start redis
```

**On macOS:**
```bash
brew install redis
brew services start redis
```

**On Windows:**
Download from [Redis.io](https://redis.io/download)

### Step 3: Create the database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and enable PostGIS
CREATE DATABASE ev_charging;
\c ev_charging
CREATE EXTENSION postgis;
\q
```

### Step 4: Configure environment

The `.env` files are already created. Update if needed:

```bash
# Edit backend/.env if your database credentials are different
nano backend/.env
```

### Step 5: Install dependencies

```bash
cd backend
npm install
```

### Step 6: Run migrations

```bash
npm run migrate
```

### Step 7: Seed database

```bash
npm run seed
```

### Step 8: Start the backend server

```bash
# Development mode (with hot-reload)
npm run dev

# Or production mode
npm run build
npm start
```

**API is now running at http://localhost:3000** 🎉

---

## 🧪 Testing the API

### Test 1: Health Check

```bash
curl http://localhost:3000/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-10T12:00:00.000Z",
  "uptime": 10.5
}
```

### Test 2: Get Charging Networks

```bash
curl http://localhost:3000/api/v1/networks
```

### Test 3: Login with test account

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+37494123456",
    "password": "test123456"
  }'
```

You should get a JWT token in response.

### Test 4: Get nearby stations

```bash
# Yerevan city center coordinates
curl "http://localhost:3000/api/v1/stations?lat=40.1872&lng=44.5152&radius=10"
```

---

## 📊 Test Accounts

Use these accounts to test the API:

| Phone | Password | Language | Balance |
|-------|----------|----------|---------|
| +37494123456 | test123456 | Armenian | 5,000 AMD |
| +37494234567 | test123456 | Russian | 10,000 AMD |
| +37494345678 | test123456 | English | 2,000 AMD |

---

## 🔍 Viewing the Database

### Option 1: pgAdmin (if using Docker)

Open http://localhost:5050 in your browser

- Email: `admin@evcharging.am`
- Password: `admin`

Add server:
- Host: `postgres`
- Port: `5432`
- Database: `ev_charging`
- Username: `postgres`
- Password: `postgres`

### Option 2: Command line

```bash
# Using Docker
docker-compose exec postgres psql -U postgres -d ev_charging

# Or locally
psql -U postgres -d ev_charging

# Useful queries:
\dt                           # List all tables
SELECT * FROM charging_networks;
SELECT * FROM charging_stations;
SELECT * FROM connectors;
SELECT * FROM users;
```

---

## 📝 Available NPM Scripts (in backend/)

```bash
npm run dev          # Start development server with hot-reload
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
npm test             # Run tests
npm run lint         # Lint code
npm run format       # Format code with Prettier
npm run migrate      # Run database migrations
npm run migrate:undo # Rollback last migration
npm run seed         # Seed database with test data
```

---

## 🛑 Stopping the Project

### With Docker:

```bash
# Stop containers
docker-compose down

# Stop and remove all data (careful!)
docker-compose down -v
```

### Without Docker:

```bash
# Stop the backend (Ctrl+C in terminal)
# Then optionally stop services:

# Ubuntu/Debian
sudo systemctl stop postgresql
sudo systemctl stop redis

# macOS
brew services stop postgresql@15
brew services stop redis
```

---

## 🐛 Troubleshooting

### Port 3000 already in use

```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or change the port in backend/.env
PORT=3001
```

### Database connection error

```bash
# Check if PostgreSQL is running
docker-compose ps postgres
# or
sudo systemctl status postgresql

# Check connection
psql -h localhost -U postgres -d ev_charging
```

### Redis connection error

```bash
# Check if Redis is running
docker-compose ps redis
# or
redis-cli ping

# Should respond with: PONG
```

### Migration errors

```bash
# Drop and recreate database
docker-compose down -v
docker-compose up -d postgres
cd backend
npm run migrate
npm run seed
```

---

## 📚 Next Steps

Once the backend is running:

1. ✅ Explore the [API Documentation](../API_DOCUMENTATION.md)
2. ✅ Test endpoints with Postman or curl
3. ✅ Check the database with pgAdmin
4. 📱 Start building the mobile app (React Native)
5. 💻 Start building the admin panel (React)

---

## 🆘 Need Help?

- Check logs: `docker-compose logs -f backend`
- Check database: `docker-compose exec postgres psql -U postgres -d ev_charging`
- Check Redis: `docker-compose exec redis redis-cli ping`

---

**Happy coding! 🚗⚡**
