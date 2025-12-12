import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import PrivateRoute from './utils/PrivateRoute';
import { authService } from './services/authService';
import './App.css';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
