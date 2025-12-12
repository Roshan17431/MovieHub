# MovieHub React Frontend

This is the comprehensive React frontend application for MovieHub, built with Vite. It provides a full-featured movie browsing, review, and admin management interface that communicates with the MovieHub Spring Boot API.

## Features

### Authentication
- **User Registration**: Register new users with email and password (minimum 8 characters)
- **User Login**: Login existing users and receive JWT token with user ID and roles
- **JWT Token Management**: Automatically stores JWT in localStorage and attaches to API requests
- **Token Expiration**: Checks token expiration and auto-redirects to login when expired
- **Role-Based Access**: Admin and user roles with different permissions

### Movie Browsing
- **Movie List**: Browse all movies with pagination
- **Advanced Search**: Search by title with real-time updates
- **Filtering**: Filter by genre, minimum/maximum rating
- **Sorting**: Sort by release date, title, or rating in ascending/descending order
- **Movie Details**: View detailed information including poster, description, ratings, and reviews
- **Responsive Cards**: Beautiful movie cards with posters, genres, and ratings

### Review System
- **View Reviews**: See all reviews for a movie with ratings and comments
- **Create Reviews**: Write reviews with 1-5 star ratings and comments
- **Edit Reviews**: Edit your own reviews
- **Delete Reviews**: Delete your own reviews or any review as admin
- **Review Statistics**: View average ratings and review counts

### Admin Features
- **Movie Management**: Create, update, and delete movies
- **Poster Upload**: Upload movie posters (multipart file upload)
- **Admin Panel**: Table view of all movies with quick edit/delete actions
- **Protected Routes**: Admin-only pages with role verification

## Prerequisites

- Node.js 18+ and npm
- MovieHub backend running on `http://localhost:4040`
- MySQL database configured for the backend

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

### Authentication
- **POST** `/api/auth/register` - Register new user
  - Body: `{ email: string, password: string }`
  - Response: `{ token: string }`

- **POST** `/api/auth/login` - Login user
  - Body: `{ email: string, password: string }`
  - Response: `{ token: string }`

### Movies
- **GET** `/api/movies` - List movies with filters and pagination
  - Query params: `page`, `size`, `sortBy`, `direction`, `title`, `genres[]`, `minRating`, `maxRating`
  - Response: `Page<MovieResponse>`

- **GET** `/api/movies/{id}` - Get movie by ID
  - Response: `MovieResponse`

- **POST** `/api/movies` - Create movie (Admin only)
  - Body: `{ title, genre, rating, releaseDate, posterUrl?, description? }`
  - Response: `MovieResponse`

- **PUT** `/api/movies/{id}` - Update movie (Admin only)
  - Body: `{ title, genre, rating, releaseDate, posterUrl?, description? }`
  - Response: `MovieResponse`

- **DELETE** `/api/movies/{id}` - Delete movie (Admin only)

- **POST** `/api/movies/{id}/poster` - Upload poster (Admin only)
  - Body: multipart/form-data with file
  - Response: `MovieResponse`

### Reviews
- **GET** `/api/movies/{movieId}/reviews` - Get all reviews for a movie
  - Response: `List<ReviewResponse>`

- **POST** `/api/movies/{movieId}/reviews` - Create review (Authenticated)
  - Body: `{ rating: 1-5, comment: string }`
  - Response: `ReviewResponse`

- **PUT** `/api/movies/{movieId}/reviews/{reviewId}` - Update review (Owner only)
  - Body: `{ rating: 1-5, comment: string }`
  - Response: `ReviewResponse`

- **DELETE** `/api/movies/{movieId}/reviews/{reviewId}` - Delete review (Owner or Admin)

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx      # Navigation bar with search
│   │   ├── MovieCard.jsx   # Movie display card
│   │   ├── LoadingSpinner.jsx # Loading indicator
│   │   └── ErrorMessage.jsx   # Error display
│   ├── pages/              # Page components
│   │   ├── Login.jsx       # Login page
│   │   ├── Register.jsx    # Registration page
│   │   ├── Movies.jsx      # Movie listing with filters
│   │   ├── MovieDetail.jsx # Movie details with reviews
│   │   ├── AdminPanel.jsx  # Admin movie management
│   │   └── AdminMovieForm.jsx # Create/edit movie form
│   ├── services/           # API services
│   │   ├── api.js          # Axios instance with interceptors
│   │   ├── authService.js  # Authentication service
│   │   ├── movieService.js # Movie CRUD operations
│   │   └── reviewService.js # Review CRUD operations
│   ├── utils/              # Utility components
│   │   ├── PrivateRoute.jsx # Protected route wrapper
│   │   └── AdminRoute.jsx   # Admin-only route wrapper
│   ├── App.jsx             # Main app with routing
│   └── main.jsx            # Entry point with React Query
├── package.json
└── vite.config.js          # Vite config with proxy
```

## How It Works

### Authentication Flow

1. **Register/Login**: User submits credentials
2. **API Call**: Request sent to backend API
3. **Token Storage**: JWT token (with userId and roles) saved to localStorage
4. **Redirect**: User redirected to movies page
5. **Authenticated Requests**: Token automatically attached to future API calls
6. **Token Validation**: Token expiration checked on each auth verification

### Data Fetching with React Query

- Automatic caching and background refetching
- Optimistic updates for better UX
- Pagination support out of the box
- Loading and error states managed automatically
- Query invalidation on mutations

### Role-Based Access Control

- JWT contains `roles` claim with user roles (ROLE_USER, ROLE_ADMIN)
- Frontend decodes JWT to check roles client-side
- Backend enforces role checks on protected endpoints
- Admin routes redirect non-admin users to movies page

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory. Serve it with your preferred static file server.

## Linting

```bash
npm run lint
```

## Technologies Used

- **React 19** - Modern UI library with hooks
- **Vite 7** - Fast build tool and dev server
- **React Router DOM 7** - Client-side routing
- **React Query (TanStack Query) 5** - Data fetching and caching
- **Axios 1.13** - HTTP client with interceptors
- **jwt-decode 4** - JWT token parsing
- **Custom CSS** - Responsive styling without frameworks

## User Roles

### Regular Users (ROLE_USER)
- Browse movies
- View movie details
- Create reviews
- Edit/delete own reviews

### Admins (ROLE_ADMIN)
- All user permissions
- Create/edit/delete movies
- Upload movie posters
- Delete any review
- Access admin panel

## Development Tips

1. **Hot Module Replacement**: Vite provides instant updates during development
2. **React Query DevTools**: Add `@tanstack/react-query-devtools` for debugging
3. **API Proxy**: Development proxy configured to forward `/api` requests to `http://localhost:4040`
4. **Token Inspection**: Use jwt.io to decode and inspect JWT tokens
5. **Form Validation**: All forms include client-side validation before API calls

## Common Issues

### Backend Connection
If you see connection errors, ensure:
- Backend is running on `http://localhost:4040`
- Database is configured and running
- CORS is properly configured in backend

### Token Expiration
If you get logged out unexpectedly:
- Check token expiration (default 24 hours)
- Verify system time is correct
- Clear localStorage and login again

### Admin Access
To create an admin user, update the database directly:
```sql
INSERT INTO user_roles (user_id, role) VALUES (1, 'ROLE_ADMIN');
```
