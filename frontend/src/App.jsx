import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import PrivateRoute from './utils/PrivateRoute';
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

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          authService.isAuthenticated() ? <Navigate to="/" /> : <Login />
        } 
      />
      <Route 
        path="/register" 
        element={
          authService.isAuthenticated() ? <Navigate to="/" /> : <Register />
        } 
      />
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
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
