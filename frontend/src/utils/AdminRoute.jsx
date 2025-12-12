import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

function AdminRoute({ children }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  if (!authService.isAdmin()) {
    return <Navigate to="/movies" />;
  }
  
  return children;
}

export default AdminRoute;
