import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import AdminPanel from './pages/AdminPanel';
import AdminMovieForm from './pages/AdminMovieForm';
import PrivateRoute from './utils/PrivateRoute';
import AdminRoute from './utils/AdminRoute';
import Navbar from './components/Navbar';
import { authService } from './services/authService';
import './App.css';

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for unauthorized events from axios interceptor
    const handleUnauthorized = () => {
      navigate('/login');
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, [navigate]);

  const isAuthenticated = authService.isAuthenticated();

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route 
          path="/login" 
          element={
            authService.isAuthenticated() ? <Navigate to="/movies" /> : <Login />
          } 
        />
        <Route 
          path="/register" 
          element={
            authService.isAuthenticated() ? <Navigate to="/movies" /> : <Register />
          } 
        />
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Navigate to="/movies" />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/movies" 
          element={
            <PrivateRoute>
              <Movies />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/movies/:id" 
          element={
            <PrivateRoute>
              <MovieDetail />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/movies/new" 
          element={
            <AdminRoute>
              <AdminMovieForm />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/movies/:id" 
          element={
            <AdminRoute>
              <AdminMovieForm />
            </AdminRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/movies" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
