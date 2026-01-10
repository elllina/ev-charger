# EV Charging Armenia - API Documentation

Complete API reference for the EV Charging Armenia platform.

## Base URL

```
Production: https://api.evcharging.am/v1
Development: http://localhost:3000/api/v1
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```http
Authorization: Bearer <access_token>
```

Tokens expire after 15 minutes. Use refresh token to get a new access token.

---

## Authentication Endpoints

### Register New User

Creates a new user account and sends OTP verification code.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "phone": "+37494123456",
  "password": "securepassword123",
  "firstName": "Արման",
  "lastName": "Հարությունյան",
  "preferredLanguage": "hy"
}
```

**Parameters:**
- `phone` (required) - Armenian phone number (+374XXXXXXXX)
- `password` (required) - Minimum 6 characters
- `firstName` (optional) - User's first name
- `lastName` (optional) - User's last name
- `preferredLanguage` (optional) - hy | ru | en (default: hy)

**Response:** `201 Created`
```json
{
  "message": "User registered successfully. Please verify your phone number.",
  "userId": "uuid",
  "phone": "+37494123456"
}
```

**Errors:**
- `400` - Invalid phone number format or password too short
- `409` - User with this phone already exists

---

### Verify OTP

Verifies the OTP code sent via SMS.

**Endpoint:** `POST /auth/verify-otp`

**Request Body:**
```json
{
  "phone": "+37494123456",
  "code": "123456"
}
```

**Response:** `200 OK`
```json
{
  "message": "Phone number verified successfully"
}
```

**Errors:**
- `400` - Invalid or expired verification code
- `404` - User not found

---

### Login

Authenticates user and returns JWT tokens.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "phone": "+37494123456",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "phone": "+37494123456",
    "firstName": "Արման",
    "lastName": "Հարությունյան",
    "walletBalance": 5000,
    "preferredLanguage": "hy"
  }
}
```

**Errors:**
- `401` - Invalid credentials
- `403` - Phone not verified

---

### Refresh Token

Gets a new access token using refresh token.

**Endpoint:** `POST /auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token"
}
```

---

### Get Profile

Get current user's profile information.

**Endpoint:** `GET /auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "phone": "+37494123456",
  "email": "user@example.com",
  "firstName": "Արման",
  "lastName": "Հարությունյան",
  "walletBalance": 5000,
  "preferredLanguage": "hy",
  "isVerified": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Update Profile

Update user profile information.

**Endpoint:** `PATCH /auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "Արման",
  "lastName": "Հարությունյան",
  "email": "new@example.com",
  "preferredLanguage": "en"
}
```

**Response:** `200 OK`
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

## Charging Stations

### Get Nearby Stations

Find charging stations near a location.

**Endpoint:** `GET /stations`

**Query Parameters:**
- `lat` (required) - Latitude (e.g., 40.1792)
- `lng` (required) - Longitude (e.g., 44.4991)
- `radius` (optional) - Search radius in km (default: 10, max: 100)
- `network` (optional) - Filter by networks (comma-separated: evan,ecocars)
- `connectorType` (optional) - Filter by connector types (CCS2,Type2,CHAdeMO)
- `minPower` (optional) - Minimum power in kW
- `available` (optional) - Only available connectors (true/false)
- `is24Hours` (optional) - Only 24-hour stations (true/false)
- `amenities` (optional) - Required amenities (wifi,cafe,parking)

**Example Request:**
```http
GET /stations?lat=40.1792&lng=44.4991&radius=5&network=evan&connectorType=CCS2&available=true
```

**Response:** `200 OK`
```json
{
  "count": 3,
  "stations": [
    {
      "id": "uuid",
      "name": "EVAN Dalma Garden Mall",
      "address": "Dalma Garden Mall, Tsitsernakaberd Hwy, Yerevan",
      "city": "Yerevan",
      "latitude": 40.1548,
      "longitude": 44.4867,
      "distance": 2.5,
      "isPublic": true,
      "is24Hours": true,
      "amenities": ["wifi", "cafe", "parking", "restroom"],
      "rating": 4.5,
      "totalRatings": 120,
      "network": {
        "id": "uuid",
        "name": "EVAN",
        "slug": "evan",
        "logoUrl": "https://...",
        "color": "#00A859"
      },
      "connectors": [
        {
          "id": "uuid",
          "connectorNumber": 1,
          "connectorType": "CCS2",
          "powerKw": 120,
          "currentType": "DC",
          "status": "available",
          "pricePerKwh": 120,
          "startFee": 200
        }
      ]
    }
  ]
}
```

---

### Get Station Details

Get detailed information about a specific station.

**Endpoint:** `GET /stations/:id`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "EVAN Dalma Garden Mall",
  "address": "Dalma Garden Mall, Yerevan",
  "latitude": 40.1548,
  "longitude": 44.4867,
  "description": "Fast charging station at Dalma Garden Mall",
  "photos": ["url1", "url2"],
  "amenities": ["wifi", "cafe"],
  "network": { ... },
  "connectors": [ ... ]
}
```

**Errors:**
- `404` - Station not found

---

### Get Station Connectors

Get all connectors for a station.

**Endpoint:** `GET /stations/:id/connectors`

**Response:** `200 OK`
```json
{
  "stationId": "uuid",
  "connectors": [
    {
      "id": "uuid",
      "connectorNumber": 1,
      "connectorType": "CCS2",
      "powerKw": 120,
      "currentType": "DC",
      "status": "available",
      "pricePerKwh": 120,
      "pricePerMinute": 0,
      "startFee": 200,
      "lastStatusUpdate": "2024-01-10T12:00:00.000Z"
    }
  ]
}
```

---

## Charging Networks

### Get All Networks

Get list of all charging networks.

**Endpoint:** `GET /networks`

**Response:** `200 OK`
```json
{
  "count": 4,
  "networks": [
    {
      "id": "uuid",
      "name": "EVAN",
      "slug": "evan",
      "logoUrl": "https://...",
      "website": "https://evan.network",
      "supportPhone": "+37410123456",
      "supportEmail": "support@evan.network",
      "integrationStatus": "active",
      "color": "#00A859"
    }
  ]
}
```

---

### Get Network by Slug

**Endpoint:** `GET /networks/:slug`

**Example:** `GET /networks/evan`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "EVAN",
  "slug": "evan",
  "logoUrl": "https://...",
  "website": "https://evan.network",
  "supportPhone": "+37410123456",
  "integrationStatus": "active"
}
```

---

## Charging Sessions

All session endpoints require authentication.

### Start Charging Session

Initiate a new charging session.

**Endpoint:** `POST /sessions/start`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "connectorId": "uuid",
  "maxAmount": 5000
}
```

**Parameters:**
- `connectorId` (required) - Connector UUID
- `maxAmount` (optional) - Maximum amount in AMD to spend

**Response:** `201 Created`
```json
{
  "message": "Charging session started",
  "session": {
    "id": "uuid",
    "userId": "uuid",
    "connectorId": "uuid",
    "stationId": "uuid",
    "sessionStatus": "pending",
    "energyDeliveredKwh": 0,
    "totalCostAmd": 0,
    "createdAt": "2024-01-10T12:00:00.000Z"
  }
}
```

**Errors:**
- `400` - Already have active session, connector not available, or insufficient balance
- `404` - Connector not found

---

### Get Active Session

Get user's currently active charging session.

**Endpoint:** `GET /sessions/active`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "session": {
    "id": "uuid",
    "sessionStatus": "active",
    "startTime": "2024-01-10T12:00:00.000Z",
    "energyDeliveredKwh": 12.5,
    "maxPowerKw": 48,
    "currentCost": 1250,
    "station": {
      "name": "EVAN Dalma",
      "address": "..."
    },
    "connector": {
      "connectorType": "CCS2",
      "powerKw": 50,
      "pricePerKwh": 100
    }
  }
}
```

Returns `{ "session": null }` if no active session.

---

### Stop Charging Session

Stop an active charging session.

**Endpoint:** `POST /sessions/:id/stop`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "message": "Charging session stopped",
  "session": {
    "id": "uuid",
    "sessionStatus": "completed",
    "startTime": "2024-01-10T12:00:00.000Z",
    "endTime": "2024-01-10T12:30:00.000Z",
    "energyDeliveredKwh": 15.5,
    "totalCostAmd": 1550,
    "energyCostAmd": 1550,
    "timeCostAmd": 0,
    "startFeeCostAmd": 200
  }
}
```

---

### Get Session History

Get user's past charging sessions.

**Endpoint:** `GET /sessions/history`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit` (optional) - Number of records (default: 50)
- `offset` (optional) - Pagination offset (default: 0)

**Response:** `200 OK`
```json
{
  "total": 25,
  "count": 10,
  "sessions": [
    {
      "id": "uuid",
      "sessionStatus": "completed",
      "startTime": "2024-01-10T12:00:00.000Z",
      "endTime": "2024-01-10T12:30:00.000Z",
      "energyDeliveredKwh": 15.5,
      "totalCostAmd": 1550,
      "station": { ... },
      "connector": { ... }
    }
  ]
}
```

---

### Get Session by ID

**Endpoint:** `GET /sessions/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "sessionStatus": "completed",
  "startTime": "...",
  "endTime": "...",
  "energyDeliveredKwh": 15.5,
  "totalCostAmd": 1550,
  "station": { ... },
  "connector": { ... }
}
```

---

## Wallet

### Get Wallet Balance

**Endpoint:** `GET /user/wallet`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "balance": 5000,
  "currency": "AMD"
}
```

---

### Top Up Wallet

Add funds to wallet.

**Endpoint:** `POST /user/wallet/topup`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "amount": 10000,
  "paymentMethod": "card",
  "paymentReference": "optional-reference"
}
```

**Parameters:**
- `amount` (required) - Amount in AMD (minimum: 100)
- `paymentMethod` (required) - card | idram | telcell
- `paymentReference` (optional) - Payment system reference

**Response:** `200 OK`
```json
{
  "message": "Wallet topped up successfully",
  "transaction": {
    "id": "uuid",
    "type": "topup",
    "amount": 10000,
    "balanceBefore": 5000,
    "balanceAfter": 15000,
    "paymentMethod": "card",
    "createdAt": "2024-01-10T12:00:00.000Z"
  }
}
```

---

### Get Transaction History

**Endpoint:** `GET /user/wallet/transactions`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit` (optional) - Number of records (default: 50)
- `offset` (optional) - Pagination offset (default: 0)

**Response:** `200 OK`
```json
{
  "total": 15,
  "count": 10,
  "transactions": [
    {
      "id": "uuid",
      "type": "charge",
      "amount": 1550,
      "balanceBefore": 15000,
      "balanceAfter": 13450,
      "description": "Charging session payment",
      "createdAt": "2024-01-10T12:30:00.000Z"
    },
    {
      "id": "uuid",
      "type": "topup",
      "amount": 10000,
      "balanceBefore": 5000,
      "balanceAfter": 15000,
      "paymentMethod": "card",
      "createdAt": "2024-01-10T12:00:00.000Z"
    }
  ]
}
```

---

## Favorites

### Get Favorite Stations

**Endpoint:** `GET /favorites`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "count": 3,
  "favorites": [
    {
      "id": "uuid",
      "name": "EVAN Dalma",
      "address": "...",
      "network": { ... },
      "connectors": [ ... ]
    }
  ]
}
```

---

### Add to Favorites

**Endpoint:** `POST /favorites`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "stationId": "uuid"
}
```

**Response:** `201 Created`
```json
{
  "message": "Station added to favorites",
  "favorite": {
    "id": "uuid",
    "userId": "uuid",
    "stationId": "uuid",
    "createdAt": "2024-01-10T12:00:00.000Z"
  }
}
```

---

### Remove from Favorites

**Endpoint:** `DELETE /favorites/:stationId`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "message": "Station removed from favorites"
}
```

---

## WebSocket API

### Connection

Connect to WebSocket server with authentication:

```javascript
import io from 'socket.io-client';

const socket = io('wss://api.evcharging.am', {
  auth: {
    token: '<access_token>'
  }
});
```

### Events

#### Subscribe to Station Updates

```javascript
socket.emit('subscribe:station', 'station-uuid');
```

Receive connector status updates:
```javascript
socket.on('connector:status', (data) => {
  // {
  //   connectorId: 'uuid',
  //   status: 'available',
  //   timestamp: '2024-01-10T12:00:00.000Z'
  // }
});
```

#### Subscribe to Session Updates

```javascript
socket.emit('subscribe:session', 'session-uuid');
```

Receive real-time session updates:
```javascript
socket.on('session:update', (data) => {
  // {
  //   sessionId: 'uuid',
  //   energyDeliveredKwh: 12.5,
  //   maxPowerKw: 48,
  //   currentCost: 1250,
  //   timestamp: '2024-01-10T12:05:00.000Z'
  // }
});
```

Receive session completion:
```javascript
socket.on('session:completed', (data) => {
  // {
  //   sessionId: 'uuid',
  //   totalCostAmd: 1550,
  //   energyDeliveredKwh: 15.5,
  //   timestamp: '2024-01-10T12:30:00.000Z'
  // }
});
```

#### Unsubscribe

```javascript
socket.emit('unsubscribe:station', 'station-uuid');
socket.emit('unsubscribe:session', 'session-uuid');
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "status": "error"
}
```

### HTTP Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## Rate Limiting

API endpoints are rate-limited to:
- 100 requests per 15 minutes per IP

When rate limit is exceeded:
```json
{
  "error": "Too many requests from this IP, please try again later.",
  "status": "error"
}
```

---

## Postman Collection

Import the Postman collection for easy testing:
[Download Collection](./postman_collection.json)

---

## Support

For API support, contact: dev@evcharging.am
