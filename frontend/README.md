# MovieHub React Frontend

This is the React frontend application for MovieHub, built with Vite. It provides authentication pages that communicate with the MovieHub Spring Boot API.

## Features

- **User Registration**: Register new users with email and password (minimum 8 characters)
- **User Login**: Login existing users and receive JWT token
- **JWT Token Management**: Automatically stores JWT in localStorage and attaches to API requests
- **Protected Routes**: Home page is protected and requires authentication
- **Auto-redirect**: Redirects authenticated users away from login/register pages

## Prerequisites

- Node.js 16+ and npm
- MovieHub backend running on `http://localhost:4040`

## Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in terminal)

## API Endpoints Used

### Register
- **POST** `/api/auth/register`
- **Body**: `{ email: string, password: string }`
- **Response**: `{ token: string }`

### Login
- **POST** `/api/auth/login`
- **Body**: `{ email: string, password: string }`
- **Response**: `{ token: string }`

## Project Structure

```
frontend/
├── src/
│   ├── pages/           # Page components
│   │   ├── Login.jsx    # Login page
│   │   ├── Register.jsx # Registration page
│   │   ├── Home.jsx     # Protected home page
│   │   └── Auth.css     # Shared auth page styles
│   ├── services/        # API services
│   │   ├── api.js       # Axios instance with interceptors
│   │   └── authService.js # Authentication service functions
│   ├── utils/           # Utility components
│   │   └── PrivateRoute.jsx # Route protection component
│   ├── App.jsx          # Main app with routing
│   └── main.jsx         # Entry point
├── package.json
└── vite.config.js
```

## How It Works

### Authentication Flow

1. **Register/Login**: User submits credentials
2. **API Call**: Request sent to backend API
3. **Token Storage**: JWT token saved to localStorage
4. **Redirect**: User redirected to home page
5. **Authenticated Requests**: Token automatically attached to future API calls via axios interceptor

### Token Management

- Token stored in `localStorage` with key `token`
- Axios interceptor automatically adds `Authorization: Bearer <token>` header to all requests
- 401 responses automatically clear token and redirect to login

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Linting

```bash
npm run lint
```

## Technologies Used

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **CSS** - Styling
