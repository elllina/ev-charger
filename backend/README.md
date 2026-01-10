# EV Charging Armenia - Backend API

Node.js/TypeScript REST API server for EV charging station aggregator.

## Quick Start

### With Docker Compose (Recommended)

From the root directory:
```bash
docker-compose up -d
```

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start PostgreSQL and Redis

4. Run migrations (if any):
```bash
npm run migrate
```

5. Seed database:
```bash
npm run seed
```

6. Start dev server:
```bash
npm run dev
```

Server runs on http://localhost:3000

## Scripts

- `npm run dev` - Development server with hot-reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier
- `npm run seed` - Seed database with test data
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Rollback last migration

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database, Redis, Logger
│   ├── controllers/     # Route handlers
│   ├── services/        # Business logic
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, validation, errors
│   ├── integrations/    # CPO adapters
│   ├── websocket/       # Socket.io server
│   ├── utils/           # Helper functions
│   └── index.ts         # App entry point
├── seeders/             # Database seeders
├── migrations/          # Database migrations
├── tests/               # Unit & integration tests
├── logs/                # Log files
├── Dockerfile
├── tsconfig.json
└── package.json
```

## API Endpoints

See main README.md for full API documentation.

### Base URL
```
http://localhost:3000/api/v1
```

### Health Check
```http
GET /api/v1/health
```

## Database Models

- **User** - User accounts
- **ChargingNetwork** - CPO networks
- **ChargingStation** - Station locations
- **Connector** - Charging connectors
- **ChargingSession** - Charging sessions
- **Transaction** - Wallet transactions
- **Favorite** - Favorite stations

## Testing

Run tests:
```bash
npm test
```

Run with coverage:
```bash
npm run test:coverage
```

## Debugging

Enable debug logging:
```bash
LOG_LEVEL=debug npm run dev
```

View logs:
```bash
tail -f logs/combined.log
tail -f logs/error.log
```

## Security

- JWT authentication
- Rate limiting
- Helmet security headers
- Input validation
- SQL injection protection (Sequelize)
- CORS configuration

## Performance

- Redis caching for:
  - Connector status (30s TTL)
  - Station lists (5min TTL)
  - User profiles (10min TTL)
- Database connection pooling
- Response compression
- Efficient PostGIS queries

## Monitoring

Health check endpoint for monitoring:
```http
GET /api/v1/health

Response:
{
  "status": "ok",
  "timestamp": "2024-01-10T12:00:00.000Z",
  "uptime": 3600
}
```

## Environment Variables

See `.env.example` for all options.

Required:
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis connection
- `JWT_SECRET` - JWT signing key

Optional:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging level (info/debug/error)
- `CORS_ORIGIN` - Allowed origins

## Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check connection
psql -h localhost -U postgres -d ev_charging
```

### Redis Connection Error
```bash
# Check Redis is running
docker-compose ps redis

# Test connection
redis-cli ping
```

### Port Already in Use
```bash
# Change PORT in .env
PORT=3001
```

## Contributing

1. Create feature branch
2. Make changes
3. Run tests
4. Run linter
5. Submit PR

## License

Proprietary
