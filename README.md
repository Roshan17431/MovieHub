# MovieHub

A full-stack movie application with Spring Boot backend and React frontend featuring JWT authentication.

## Project Structure

```
MovieHub/
├── src/                    # Spring Boot backend
│   └── main/
│       ├── java/          # Java source code
│       └── resources/     # Application configuration
├── frontend/              # React frontend (Vite)
│   ├── src/
│   │   ├── pages/        # React pages
│   │   ├── services/     # API services
│   │   └── utils/        # Utility components
│   └── package.json
└── pom.xml               # Maven configuration
```

## Features

### Backend (Spring Boot)
- RESTful API with Spring Boot 4.0.0
- JWT-based authentication
- MySQL database integration
- Spring Security
- User registration and login endpoints
- AWS S3 integration for movie posters

### Frontend (React + Vite)
- Modern React 19 application
- User registration and login pages
- JWT token management with localStorage
- Automatic token attachment to API requests via Axios interceptors
- Protected routes
- Responsive UI with gradient design

## Prerequisites

- Java 21
- Maven 3.x
- Node.js 16+ and npm
- MySQL 8.x
- AWS account (for S3 storage - optional)

## Backend Setup

1. **Configure MySQL Database**:
   ```sql
   CREATE DATABASE moviehub;
   ```

2. **Update Database Credentials**:
   Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/moviehub
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Build and Run**:
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

   The backend will start on `http://localhost:4040`

## Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

## API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Protected Endpoints
All other endpoints require the JWT token in the Authorization header:
```http
Authorization: Bearer <token>
```

## Usage

1. Start the backend server (port 4040)
2. Start the frontend development server (port 5173)
3. Open your browser to `http://localhost:5173`
4. Register a new account or login
5. Access protected resources after authentication

## Technologies Used

### Backend
- Spring Boot 4.0.0
- Spring Security
- Spring Data JPA
- MySQL
- JWT (jjwt 0.11.5)
- Lombok
- AWS SDK for S3

### Frontend
- React 19
- Vite
- React Router DOM
- Axios
- CSS3

## Development

### Backend
```bash
# Run tests
./mvnw test

# Package application
./mvnw package
```

### Frontend
```bash
# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Security Notes

- JWT tokens are stored in localStorage
- Tokens expire after 24 hours (configurable in application.properties)
- Passwords must be at least 8 characters
- All API requests automatically include the JWT token via Axios interceptors
- 401 responses automatically clear the token and redirect to login

## License

This project is for demonstration purposes.
