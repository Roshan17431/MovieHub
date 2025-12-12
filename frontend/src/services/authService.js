import api from './api';
import { jwtDecode } from 'jwt-decode';

export const authService = {
  // Register a new user
  register: async (email, password) => {
    try {
      const response = await api.post('/auth/register', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get current token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Decode JWT and get user info
  getUserInfo: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const decoded = jwtDecode(token);
      return {
        email: decoded.sub,
        exp: decoded.exp,
      };
    } catch {
      return null;
    }
  },

  // Check if user has admin role
  isAdmin: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      // The backend stores roles in the 'roles' claim as an array
      const roles = decoded.roles || [];
      return roles.includes('ROLE_ADMIN');
    } catch {
      return false;
    }
  },
};
