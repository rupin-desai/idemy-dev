import { createContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth.api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStudent, setIsStudent] = useState(false); // Add this state

  // Check if token exists and load user on mount
  useEffect(() => {
    const hasToken = authApi.loadToken();
    
    if (hasToken) {
      getUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const getUserProfile = async () => {
    try {
      const result = await authApi.getProfile();
      setCurrentUser(result.user);
      
      // Set isStudent based on user data
      setIsStudent(
        result.user.role === 'student' || 
        (result.user.student && result.user.student.studentId)
      );
      
      setIsAuthenticated(true);
    } catch (err) {
      authApi.setAuthToken(null);
      setError(err.response?.data?.message || 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const result = await authApi.register(userData);
      setCurrentUser(result.user);
      setIsAuthenticated(true);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const result = await authApi.login(email, password);
      setCurrentUser(result.user);
      setIsAuthenticated(true);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await authApi.logout();
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Logout failed');
    }
  };

  // Update the updateProfile method to properly handle student information
  const updateProfile = async (userData) => {
    setError(null);
    try {
      // Merge with current user data
      const updatedUser = {
        ...currentUser,
        ...userData
      };
      
      // Call API to update profile
      const result = await authApi.updateProfile(updatedUser);
      
      // Update state with new user data
      setCurrentUser(result.user);
      
      // Update student status
      setIsStudent(
        result.user.role === 'student' || 
        (result.user.student && result.user.student.studentId)
      );
      
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isStudent, // Add this to the context
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        getUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;