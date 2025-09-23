# Aquasentra Backend

A Node.js Express backend API for a hazard reporting system with JWT authentication and role-based access control.

## Features

- **User Authentication**: JWT-based authentication system
- **Role-Based Access**: Two user roles - `citizen` and `verifier`
- **Hazard Reporting**: Citizens can submit hazard reports
- **Report Management**: Verifiers can approve/reject pending reports
- **MongoDB Integration**: Persistent data storage with Mongoose ODM
- **Input Validation**: Comprehensive request validation
- **Security**: Password hashing, JWT tokens, CORS support

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## Installation

1. Clone the repository and navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory (copy from `env.example`):
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/hazard-reporting
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   ```

4. Make sure MongoDB is running on your system

5. Start the server:
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication Routes

#### POST /auth/register
Register a new user (default role: citizen)

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123",
  "role": "citizen" // optional, defaults to "citizen"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "role": "citizen"
  }
}
```

#### POST /auth/login
Login with username and password

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "role": "citizen"
  }
}
```

### Reports Routes

#### POST /reports
Submit a hazard report (Authentication required)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "address": "123 Main St, New York, NY",
  "hazardType": "Broken Glass",
  "severity": "medium",
  "description": "Broken glass on sidewalk near the intersection"
}
```

#### GET /reports
Get all approved hazard reports (Public access)

**Response:**
```json
{
  "message": "Approved hazard reports retrieved successfully",
  "reports": [
    {
      "_id": "report_id",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "address": "123 Main St, New York, NY",
      "hazardType": "Broken Glass",
      "severity": "medium",
      "description": "Broken glass on sidewalk",
      "status": "approved",
      "createdBy": {
        "_id": "user_id",
        "username": "john_doe"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### GET /reports/pending
Get all pending hazard reports (Verifier role required)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### PATCH /reports/:id/verify
Approve or reject a hazard report (Verifier role required)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "status": "approved" // or "rejected"
}
```

## Data Models

### User
```javascript
{
  username: String (required, unique, 3-30 chars),
  passwordHash: String (required, hashed),
  role: String (enum: ["citizen", "verifier"], default: "citizen"),
  createdAt: Date,
  updatedAt: Date
}
```

### HazardReport
```javascript
{
  latitude: Number (required, -90 to 90),
  longitude: Number (required, -180 to 180),
  address: String (required, max 500 chars),
  hazardType: String (required, max 100 chars),
  severity: String (enum: ["low", "medium", "high"], required),
  description: String (optional, max 1000 chars),
  status: String (enum: ["pending", "approved", "rejected"], default: "pending"),
  createdBy: ObjectId (ref: User, required),
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- **Password Hashing**: Uses bcryptjs with salt rounds
- **JWT Tokens**: Secure authentication with 7-day expiration
- **Input Validation**: Comprehensive validation for all endpoints
- **CORS**: Cross-origin resource sharing enabled
- **Role-Based Access**: Middleware to restrict routes by user role

## Development

### Project Structure
```
├── controllers/
│   ├── authController.js
│   └── reportsController.js
├── middleware/
│   ├── auth.js
│   ├── role.js
│   └── validation.js
├── models/
│   ├── User.js
│   └── HazardReport.js
├── routes/
│   ├── auth.js
│   └── reports.js
├── server.js
├── package.json
└── README.md
```

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC
