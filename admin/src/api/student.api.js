import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const studentApi = {
  // Get all students
  getAllStudents: async () => {
    const response = await axios.get(`${API_BASE_URL}/students?_t=${Date.now()}`);
    return response.data;
  },

  // Get student by ID
  getStudentById: async (studentId) => {
    const response = await axios.get(`${API_BASE_URL}/students/${studentId}?_t=${Date.now()}`);
    return response.data;
  },

  // Create new student
  createStudent: async (studentData) => {
    const response = await axios.post(`${API_BASE_URL}/students`, studentData);
    return response.data;
  },

  // Update student
  updateStudent: async (studentId, updates) => {
    const response = await axios.put(`${API_BASE_URL}/students/${studentId}`, updates);
    return response.data;
  },

  // Delete student
  deleteStudent: async (studentId) => {
    const response = await axios.delete(`${API_BASE_URL}/students/${studentId}`);
    return response.data;
  },

  // Get student history
  getStudentHistory: async (studentId) => {
    const response = await axios.get(`${API_BASE_URL}/students/${studentId}/history?_t=${Date.now()}`);
    return response.data;
  }
};

export default studentApi;