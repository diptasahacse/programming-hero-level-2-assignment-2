# Vehicle Rental Management System API

A comprehensive REST API for managing vehicle rentals, built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- User authentication and authorization (JWT-based)
- Vehicle management (CRUD operations)
- Booking management
- Role-based access control (Admin & Customer)
- Input validation and error handling

## Technology Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Development**: tsx (TypeScript execution)

## User Roles

- **Admin**: Can manage vehicles, view all users and bookings
- **Customer**: Can book vehicles, view and update their own profile and bookings

## API Endpoints

### Authentication APIs

#### 1. User Registration
- **Endpoint**: `POST /api/v1/auth/signup`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```
- **Success Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "customer"
  }
}
```
- **Error Responses**:
  - 400: Missing required fields
  - 400: Email already registered
  - 400: Password must be minimum 6 characters
  - 400: Email should be lowercase

#### 2. User Login
- **Endpoint**: `POST /api/v1/auth/signin`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "customer"
    }
  }
}
```
- **Error Responses**:
  - 400: Missing email or password
  - 404: Incorrect email or password

### Vehicle APIs

#### 3. Create Vehicle
- **Endpoint**: `POST /api/v1/vehicles/`
- **Access**: Admin only
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "vehicle_name": "Toyota Camry",
  "type": "car",
  "registration_number": "ABC123",
  "daily_rent_price": 50.00,
  "availability_status": "available"
}
```
- **Success Response** (201):
```json
{
  "success": true,
  "message": "Vehicle created successfully",
  "data": {
    "id": 1,
    "vehicle_name": "Toyota Camry",
    "type": "car",
    "registration_number": "ABC123",
    "daily_rent_price": 50.00,
    "availability_status": "available"
  }
}
```
- **Error Responses**:
  - 401: Unauthenticated
  - 403: Unauthorized (not admin)
  - 400: Missing required fields or invalid values

#### 4. Get All Vehicles
- **Endpoint**: `GET /api/v1/vehicles/`
- **Access**: Public
- **Success Response** (200):
```json
{
  "success": true,
  "message": "Vehicles retrieved successfully",
  "data": [
    {
      "id": 1,
      "vehicle_name": "Toyota Camry",
      "type": "car",
      "registration_number": "ABC123",
      "daily_rent_price": 50.00,
      "availability_status": "available"
    }
  ]
}
```

#### 5. Get Vehicle by ID
- **Endpoint**: `GET /api/v1/vehicles/:vehicleId`
- **Access**: Public
- **Success Response** (200):
```json
{
  "success": true,
  "message": "Vehicle retrieved successfully",
  "data": {
    "id": 1,
    "vehicle_name": "Toyota Camry",
    "type": "car",
    "registration_number": "ABC123",
    "daily_rent_price": 50.00,
    "availability_status": "available"
  }
}
```
- **Error Responses**:
  - 404: Vehicle not found

#### 6. Update Vehicle
- **Endpoint**: `PUT /api/v1/vehicles/:vehicleId`
- **Access**: Admin only
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "vehicle_name": "Toyota Camry 2024",
  "daily_rent_price": 55.00
}
```
- **Success Response** (200):
```json
{
  "success": true,
  "message": "Vehicle updated successfully",
  "data": {
    "id": 1,
    "vehicle_name": "Toyota Camry 2024",
    "type": "car",
    "registration_number": "ABC123",
    "daily_rent_price": 55.00,
    "availability_status": "available"
  }
}
```

#### 7. Delete Vehicle
- **Endpoint**: `DELETE /api/v1/vehicles/:vehicleId`
- **Access**: Admin only
- **Headers**: `Authorization: Bearer <token>`
- **Success Response** (200):
```json
{
  "success": true,
  "message": "Vehicle deleted successfully"
}
```

### User Management APIs

#### 8. Get All Users
- **Endpoint**: `GET /api/v1/users/`
- **Access**: Admin only
- **Headers**: `Authorization: Bearer <token>`
- **Success Response** (200):
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "customer"
    }
  ]
}
```

#### 9. Get User by ID
- **Endpoint**: `GET /api/v1/users/:userId`
- **Access**: Admin or Customer (own profile)
- **Headers**: `Authorization: Bearer <token>`
- **Success Response** (200):
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "customer"
  }
}
```

#### 10. Update User
- **Endpoint**: `PUT /api/v1/users/:userId`
- **Access**: Admin or Customer (own profile)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "name": "John Smith",
  "phone": "+1234567891"
}
```
- **Success Response** (200):
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1234567891",
    "role": "customer"
  }
}
```

### Booking APIs

#### 11. Create Booking
- **Endpoint**: `POST /api/v1/bookings/`
- **Access**: Admin or Customer
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "customer_id": 1,
  "vehicle_id": 1,
  "rent_start_date": "2024-12-15",
  "rent_end_date": "2024-12-20"
}
```
- **Success Response** (201):
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": 1,
    "customer_id": 1,
    "vehicle_id": 1,
    "rent_start_date": "2024-12-15",
    "rent_end_date": "2024-12-20",
    "total_price": 250.00,
    "status": "active",
    "vehicle": {
      "vehicle_name": "Toyota Camry",
      "daily_rent_price": 50.00
    }
  }
}
```
- **Error Responses**:
  - 400: Missing required fields
  - 400: Invalid date format
  - 400: End date must be greater than start date
  - 404: User or vehicle not found
  - 400: Vehicle already booked
  - 403: Unauthorized (customer can only book for themselves)

#### 12. Get All Bookings
- **Endpoint**: `GET /api/v1/bookings/`
- **Access**: Admin (all bookings) or Customer (own bookings)
- **Headers**: `Authorization: Bearer <token>`
- **Success Response** (200):
```json
{
  "success": true,
  "message": "Bookings retrieved successfully",
  "data": [
    {
      "id": 1,
      "customer_id": 1,
      "vehicle_id": 1,
      "rent_start_date": "2024-12-15",
      "rent_end_date": "2024-12-20",
      "total_price": 250.00,
      "status": "active",
      "customer": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "vehicle": {
        "vehicle_name": "Toyota Camry",
        "registration_number": "ABC123"
      }
    }
  ]
}
```

#### 13. Update Booking
- **Endpoint**: `PUT /api/v1/bookings/:bookingId`
- **Access**: Admin or Customer (own booking)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "status": "cancelled"
}
```
- **Success Response** (200):
```json
{
  "success": true,
  "message": "Booking updated successfully",
  "data": {
    "id": 1,
    "customer_id": 1,
    "vehicle_id": 1,
    "rent_start_date": "2024-12-15",
    "rent_end_date": "2024-12-20",
    "total_price": 250.00,
    "status": "cancelled"
  }
}
```

## Data Models

### Vehicle Types
- `car`
- `bike`
- `van`
- `SUV`

### Vehicle Status
- `available`
- `booked`

### Booking Status
- `active`
- `cancelled`
- `returned`

### User Roles
- `admin`
- `customer`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All endpoints return standardized error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": "Additional error details (if available)"
}
```

## Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthenticated
- `403`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

## Getting Started

1. Install dependencies: `npm install`
2. Set up environment variables
3. Initialize database
4. Run the application: `npm run dev`

The server will start on the configured port (default: 3000).