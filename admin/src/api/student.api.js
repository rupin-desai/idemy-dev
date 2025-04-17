import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Get auth token from local storage
const getAuthToken = () => localStorage.getItem('authToken') || null;

// Create axios instance with auth headers
const axiosWithAuth = () => {
  const token = getAuthToken();
  return axios.create({
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    }
  });
};

const studentApi = {
  // Get all students
  getAllStudents: async () => {
    const response = await axiosWithAuth().get(`${API_BASE_URL}/students?_t=${Date.now()}`);
    return response.data;
  },

  // Get student by ID
  getStudentById: async (studentId) => {
    const response = await axiosWithAuth().get(`${API_BASE_URL}/students/${studentId}?_t=${Date.now()}`);
    return response.data;
  },

  // Create new student
  createStudent: async (studentData) => {
    const response = await axiosWithAuth().post(`${API_BASE_URL}/students`, studentData);
    return response.data;
  },

  // Update student
  updateStudent: async (studentId, updates) => {
    const response = await axiosWithAuth().put(`${API_BASE_URL}/students/${studentId}`, updates);
    return response.data;
  },

  // Delete student
  deleteStudent: async (studentId) => {
    const response = await axiosWithAuth().delete(`${API_BASE_URL}/students/${studentId}`);
    return response.data;
  },

  // Get student history
  getStudentHistory: async (studentId) => {
    const response = await axiosWithAuth().get(`${API_BASE_URL}/students/${studentId}/history?_t=${Date.now()}`);
    return response.data;
  }
};

export default studentApi;