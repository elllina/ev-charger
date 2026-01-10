# EV Charging Armenia - Electric Vehicle Charging Station Aggregator

A comprehensive platform that aggregates multiple EV charging networks (EVAN, EcoCars, iCharge, Amperion, ChargeNet) into a unified mobile application for Armenia.

## Project Structure

```
ev-charging-armenia/
├── backend/              # Node.js/TypeScript API Server
│   ├── src/
│   │   ├── config/      # Database, Redis, Logger configuration
│   │   ├── models/      # Sequelize TypeScript models
│   │   ├── controllers/ # Request handlers
│   │   ├── services/    # Business logic
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth, validation, error handling
│   │   ├── integrations/# CPO adapters (OCPI, custom APIs)
│   │   ├── websocket/   # Real-time Socket.io server
│   │   └── utils/       # Helper functions
│   ├── seeders/         # Database test data
│   └── Dockerfile
├── mobile/              # React Native app (to be implemented)
├── admin/               # React admin panel (to be implemented)
├── docker-compose.yml   # Docker orchestration
└── README.md
```

## Features

### Backend API

- **Authentication & User Management**
  - Phone-based registration with OTP verification
  - JWT token authentication
  - User profiles with wallet system

- **Charging Station Discovery**
  - Location-based search with radius filtering
  - Filter by network, connector type, power, availability
  - Real-time connector status updates
  - Favorite stations

- **Charging Sessions**
  - Start/stop charging remotely
  - Real-time session monitoring via WebSocket
  - Session history and receipts
  - Cost calculation (energy + time + start fee)

- **Wallet System**
  - Top-up via card/iDram/Telcell
  - Transaction history
  - Automatic deduction for charging

- **CPO Integrations**
  - OCPI 2.2 support (EVAN)
  - Custom REST API adapters (EcoCars)
  - Mock implementations for development

- **Real-time Updates**
  - WebSocket for live connector status
  - Live charging session updates
  - Push notifications

## Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL 15 with PostGIS
- **Cache:** Redis 7
- **WebSocket:** Socket.io
- **ORM:** Sequelize with TypeScript decorators
- **Authentication:** JWT
- **Validation:** express-validator
- **Logging:** Winston

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Database Management:** pgAdmin (optional)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ev-charging-armenia
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL with PostGIS on port 5432
   - Redis on port 6379
   - Backend API on port 3000
   - pgAdmin on port 5050 (optional)

4. **Seed the database with test data**
   ```bash
   cd backend
   npm run seed
   ```

5. **API is now running at http://localhost:3000**

### Local Development (without Docker)

1. **Install PostgreSQL 15 with PostGIS extension**

2. **Install Redis**

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit with your local database credentials
   ```

5. **Create database**
   ```bash
   createdb ev_charging
   psql -d ev_charging -c "CREATE EXTENSION postgis;"
   ```

6. **Run database migrations** (if available)
   ```bash
   npm run migrate
   ```

7. **Seed test data**
   ```bash
   npm run seed
   ```

8. **Start development server**
   ```bash
   npm run dev
   ```

## API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication

#### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "phone": "+37494123456",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "preferredLanguage": "en"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "phone": "+37494123456",
  "password": "securepassword"
}

Response:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": { ... }
}
```

#### Verify OTP
```http
POST /api/v1/auth/verify-otp
Content-Type: application/json

{
  "phone": "+37494123456",
  "code": "123456"
}
```

### Charging Stations

#### Get Nearby Stations
```http
GET /api/v1/stations?lat=40.1792&lng=44.4991&radius=10&network=evan,ecocars&connectorType=CCS2&available=true

Response:
{
  "count": 5,
  "stations": [
    {
      "id": "uuid",
      "name": "EVAN Dalma Garden Mall",
      "address": "...",
      "latitude": 40.1548,
      "longitude": 44.4867,
      "distance": 2.5,
      "network": { ... },
      "connectors": [ ... ]
    }
  ]
}
```

#### Get Station Details
```http
GET /api/v1/stations/:id
```

### Charging Sessions

#### Start Session (requires auth)
```http
POST /api/v1/sessions/start
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "connectorId": "uuid",
  "maxAmount": 5000
}
```

#### Get Active Session
```http
GET /api/v1/sessions/active
Authorization: Bearer <access_token>
```

#### Stop Session
```http
POST /api/v1/sessions/:id/stop
Authorization: Bearer <access_token>
```

### Wallet

#### Get Balance
```http
GET /api/v1/user/wallet
Authorization: Bearer <access_token>

Response:
{
  "balance": 5000,
  "currency": "AMD"
}
```

#### Top Up
```http
POST /api/v1/user/wallet/topup
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "amount": 10000,
  "paymentMethod": "card"
}
```

### Favorites

#### Get Favorites
```http
GET /api/v1/favorites
Authorization: Bearer <access_token>
```

#### Add to Favorites
```http
POST /api/v1/favorites
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "stationId": "uuid"
}
```

## WebSocket Events

Connect to WebSocket server:
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: '<access_token>'
  }
});

// Subscribe to station updates
socket.emit('subscribe:station', 'station-id');

// Listen for connector status changes
socket.on('connector:status', (data) => {
  console.log('Connector status:', data);
});

// Subscribe to active session updates
socket.emit('subscribe:session', 'session-id');

// Listen for session updates
socket.on('session:update', (data) => {
  console.log('Session update:', data);
  // { sessionId, energyDeliveredKwh, maxPowerKw, currentCost, timestamp }
});

// Listen for session completion
socket.on('session:completed', (data) => {
  console.log('Session completed:', data);
});
```

## Test Data

After running seeders, you can use these test accounts:

| Phone | Password | Language | Balance |
|-------|----------|----------|---------|
| +37494123456 | test123456 | Armenian | 5,000 AMD |
| +37494234567 | test123456 | Russian | 10,000 AMD |
| +37494345678 | test123456 | English | 2,000 AMD |

Test stations are located around Yerevan:
- EVAN Dalma Garden Mall (120kW CCS2)
- EVAN Yerevan Mall (50kW CCS2)
- EcoCars Центр (50kW CCS2, 22kW Type2)
- EcoCars Northern Avenue (22kW Type2)
- And more...

## Database Schema

### Key Models

- **User** - User accounts with wallet balance
- **ChargingNetwork** - CPO networks (EVAN, EcoCars, etc.)
- **ChargingStation** - Charging station locations
- **Connector** - Individual charging connectors with pricing
- **ChargingSession** - Active and historical charging sessions
- **Transaction** - Wallet transactions (top-up, charge, refund)
- **Favorite** - User's favorite stations

## Development Scripts

```bash
# Backend
cd backend

# Development with hot-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Seed database
npm run seed
```

## Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend

# Rebuild backend
docker-compose build backend

# Start with pgAdmin
docker-compose --profile tools up -d

# Stop and remove all data
docker-compose down -v
```

## Environment Variables

See `.env.example` for all available configuration options.

### Critical Variables

- `JWT_SECRET` - Change in production!
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `NODE_ENV` - development | production | test

## Next Steps

### Mobile App (React Native)
- [ ] Initialize React Native project
- [ ] Implement navigation structure
- [ ] Create map screen with station markers
- [ ] Build charging session monitoring
- [ ] Integrate wallet and payments
- [ ] Add QR code scanning

### Admin Panel (React)
- [ ] Dashboard with analytics
- [ ] Station management CRUD
- [ ] User management
- [ ] Transaction monitoring
- [ ] Network integration status

### Backend Enhancements
- [ ] Integrate real OCPI endpoints
- [ ] Payment gateway integration (iDram)
- [ ] SMS provider for OTP (Twilio/local)
- [ ] Rate limiting per user
- [ ] API documentation (Swagger)
- [ ] Comprehensive test coverage
- [ ] Monitoring (Sentry, Prometheus)

### CPO Integrations
- [ ] Finalize EVAN OCPI integration
- [ ] EcoCars API integration
- [ ] iCharge integration
- [ ] Amperion integration

## License

Proprietary - All rights reserved

## Support

For issues and questions, please contact the development team.

---

**Built for Armenia's EV charging infrastructure** 🔌⚡🇦🇲
