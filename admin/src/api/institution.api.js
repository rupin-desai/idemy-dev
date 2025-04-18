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

// Helper function to handle API errors
const handleApiError = (error, action) => {
  console.error(`Institution API error (${action}):`, error);
  const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
  return {
    message: errorMessage,
    status: error.response?.status || 500,
    action
  };
};

const institutionApi = {
  // Get all institutions
  getAllInstitutions: async () => {
    const response = await axiosWithAuth().get(`${API_BASE_URL}/institutions?_t=${Date.now()}`);
    return response.data.institutions || [];
  },

  // Get active institutions
  getActiveInstitutions: async () => {
    const response = await axiosWithAuth().get(`${API_BASE_URL}/institutions/active?_t=${Date.now()}`);
    return response.data.institutions || [];
  },

  // Get institution by ID
  getInstitutionById: async (id) => {
    const response = await axiosWithAuth().get(`${API_BASE_URL}/institutions/${id}?_t=${Date.now()}`);
    return response.data.institution;
  },

  // Create new institution
  createInstitution: async (institutionData) => {
    const response = await axiosWithAuth().post(`${API_BASE_URL}/institutions`, institutionData);
    return response.data.institution;
  },

  // Update institution
  updateInstitution: async (id, updates) => {
    const response = await axiosWithAuth().put(`${API_BASE_URL}/institutions/${id}`, updates);
    return response.data.institution;
  },

  // Delete institution
  deleteInstitution: async (id) => {
    const response = await axiosWithAuth().delete(`${API_BASE_URL}/institutions/${id}`);
    return response.data;
  },

  // Mint NFT for institution
  mintInstitutionNFT: async (institutionId) => {
    try {
      const response = await axiosWithAuth().post(
        `${API_BASE_URL}/institutions/${institutionId}/mint-nft`
      );
      return response.data;
    } catch (error) {
      const errorData = handleApiError(error, 'mint-nft');
      throw errorData;
    }
  }
};

export default institutionApi;