import axios from 'axios';
import { getAuthToken } from './auth.api';

const API_BASE_URL = 'http://localhost:3000/api';

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

const applicationApi = {
  // Get all applications
  getAllApplications: async () => {
    const response = await axiosWithAuth().get(`${API_BASE_URL}/applications?_t=${Date.now()}`);
    return response.data.applications || [];
  },

  // Get application by ID
  getApplicationById: async (id) => {
    const response = await axiosWithAuth().get(`${API_BASE_URL}/applications/${id}?_t=${Date.now()}`);
    return response.data.application;
  },

  // Get applications by student ID
  getApplicationsByStudent: async (studentId) => {
    const response = await axiosWithAuth().get(`${API_BASE_URL}/applications/student/${studentId}?_t=${Date.now()}`);
    return response.data.applications || [];
  },

  // Get applications by institution ID
  getApplicationsByInstitution: async (institutionId) => {
    const response = await axiosWithAuth().get(`${API_BASE_URL}/applications/institution/${institutionId}?_t=${Date.now()}`);
    return response.data.applications || [];
  },

  // Create new application
  createApplication: async (applicationData) => {
    const response = await axiosWithAuth().post(`${API_BASE_URL}/applications`, applicationData);
    return response.data.application;
  },

  // Update application status
  updateApplicationStatus: async (id, status, verificationData = {}) => {
    const response = await axiosWithAuth().put(`${API_BASE_URL}/applications/${id}/status`, { 
      status,
      verificationData 
    });
    return response.data.application;
  },

  // Verify application on blockchain
  verifyApplication: async (id) => {
    const response = await axiosWithAuth().post(`${API_BASE_URL}/applications/${id}/verify`);
    return response.data;
  }
};

export default applicationApi;