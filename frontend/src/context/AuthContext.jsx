import { createContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth.api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authApi.loadToken()) {
          // If we have a token, validate it by getting the profile
          const result = await authApi.getProfile();
          if (result.success) {
            setCurrentUser(result.user);
          } else {
            // If token validation fails, log out
            authApi.setAuthToken(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        authApi.setAuthToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const register = async (userData) => {
    setError(null);
    try {
      const result = await authApi.register(userData);
      setCurrentUser(result.user);
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
    } catch (err) {
      setError(err.response?.data?.message || 'Logout failed');
    }
  };

  const forgotPassword = async (email) => {
    setError(null);
    try {
      return await authApi.forgotPassword(email);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset request failed');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        register,
        login,
        logout,
        forgotPassword,
        isAuthenticated: !!currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;