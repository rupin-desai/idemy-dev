// src/api/auth.api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

// Helper function to set auth token in headers
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Load token from storage on refresh
export const loadToken = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    setAuthToken(token);
    return true;
  }
  return false;
};

// Register user
export const register = async (userData) => {
  try {
    console.log('Sending registration data:', userData);
    const response = await axios.post(`${API_URL}/register`, userData);
    console.log('Registration response:', response.data);
    
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

// Logout user
export const logout = async () => {
  try {
    await axios.post(`${API_URL}/logout`);
    setAuthToken(null);
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
    // Still remove token even if API call fails
    setAuthToken(null);
    throw error;
  }
};

// Get user profile
export const getProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`);
    return response.data;
  } catch (error) {
    console.error("Get profile error:", error.response?.data || error.message);
    throw error;
  }
};

// Request password reset
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    console.error("Password reset request error:", error.response?.data || error.message);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const response = await axios.put(`${API_URL}/profile`, userData);
    return response.data;
  } catch (error) {
    console.error("Update profile error:", error.response?.data || error.message);
    throw error;
  }
};