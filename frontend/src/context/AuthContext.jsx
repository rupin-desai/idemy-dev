import { createContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth.api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStudent, setIsStudent] = useState(false); // Add this state
  const [profileLoaded, setProfileLoaded] = useState(false); // Add profileLoaded state

  // Check if token exists and load user on mount
  useEffect(() => {
    const hasToken = authApi.loadToken();
    
    if (hasToken) {
      getUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  // Update getUserProfile to be more robust
  const getUserProfile = async () => {
    try {
      setLoading(true);
      const result = await authApi.getProfile();
      
      // Check if user has student information
      let isStudentUser = false;
      
      if (result.user.student && result.user.student.studentId) {
        isStudentUser = true;
      } else if (result.user.role === 'student') {
        isStudentUser = true;
        
        // Try to fetch student details if role is student but no student object exists
        try {
          const studentResponse = await axios.get(`http://localhost:3000/api/students/by-email/${result.user.email}`);
          if (studentResponse.data.success && studentResponse.data.student) {
            // Update the user object with student info
            result.user.student = studentResponse.data.student;
          }
        } catch (studentErr) {
          console.warn('Could not fetch student details:', studentErr);
        }
      }
      
      setCurrentUser(result.user);
      setIsStudent(isStudentUser);
      setIsAuthenticated(true);
      setProfileLoaded(true); // Mark profile as loaded
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
        profileLoaded, // Add this to context
        register,
        login,
        logout,
        updateProfile,
        getUserProfile // Make this available to components
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;