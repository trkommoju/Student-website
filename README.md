# School Admin Application

A Node.js REST API for school administration with user authentication and student management.

## Features

- User authentication (signup/login) with JWT
- Protected student CRUD operations
- PostgreSQL database
- Secure password hashing with bcrypt

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
createdb school_admin
```

Run the database schema:

```bash
psql -d school_admin -f database.sql
```

### 3. Configure Environment Variables

Update the `.env` file with your database credentials and JWT secret:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=school_admin
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_secure_random_secret_key
JWT_EXPIRES_IN=24h
```

### 4. Start the Server

```bash
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### Authentication

#### Signup
- **URL**: `/api/auth/signup`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "username": "username",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User created successfully",
    "data": {
      "id": 1,
      "email": "user@example.com",
      "username": "username",
      "created_at": "2025-12-20T10:00:00.000Z"
    }
  }
  ```

#### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "username",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": "24h",
      "user": {
        "id": 1,
        "username": "username",
        "email": "user@example.com"
      }
    }
  }
  ```

### Students (Protected Routes)

All student routes require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```

#### Get All Students
- **URL**: `/api/students`
- **Method**: `GET`

#### Get Student by ID
- **URL**: `/api/students/:id`
- **Method**: `GET`

#### Create Student
- **URL**: `/api/students`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "date_of_birth": "2010-05-15",
    "grade": "Grade 10"
  }
  ```

#### Update Student (Full Update)
- **URL**: `/api/students/:id`
- **Method**: `PUT`
- **Body**:
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "date_of_birth": "2010-05-15",
    "grade": "Grade 11"
  }
  ```

#### Update Student (Partial Update)
- **URL**: `/api/students/:id`
- **Method**: `PATCH`
- **Body**:
  ```json
  {
    "grade": "Grade 11"
  }
  ```

#### Delete Student
- **URL**: `/api/students/:id`
- **Method**: `DELETE`

## Project Structure

```
school-admin-app/
├── src/
│   ├── config/
│   │   ├── auth.js           # JWT and password utilities
│   │   └── database.js       # PostgreSQL connection
│   ├── controllers/
│   │   ├── authController.js # Authentication logic
│   │   └── studentController.js # Student CRUD logic
│   ├── middleware/
│   │   └── authMiddleware.js # JWT verification
│   └── routes/
│       ├── authRoutes.js     # Auth endpoints
│       └── studentRoutes.js  # Student endpoints
├── .env                      # Environment variables
├── .gitignore
├── database.sql              # Database schema
├── package.json
├── README.md
└── server.js                 # Application entry point
```

## Testing with cURL

### Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

### Create Student (with token)
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"first_name":"John","last_name":"Doe","email":"john@example.com","grade":"Grade 10"}'
```

## Security Features

- Passwords are hashed using bcrypt
- JWT tokens for stateless authentication
- Protected routes with authentication middleware
- SQL injection prevention with parameterized queries
