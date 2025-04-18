import axios from 'axios';

const API_URL = 'http://localhost:3000/api/institutions';

// Helper function to handle API errors consistently
const handleApiError = (error, operation) => {
  // Create a standardized error response
  const errorResponse = {
    status: error.response?.status,
    message: error.response?.data?.message || error.message,
    operation,
    timestamp: new Date().toISOString()
  };
  
  console.error(`Institution API Error (${operation}):`, errorResponse);
  return errorResponse;
};

// Get all institutions
export const getAllInstitutions = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return {
      success: true,
      institutions: response.data.institutions
    };
  } catch (error) {
    const errorData = handleApiError(error, 'get-all-institutions');
    return { 
      success: false, 
      error: errorData,
      institutions: [] 
    };
  }
};

// Get active institutions
export const getActiveInstitutions = async () => {
  try {
    const response = await axios.get(`${API_URL}/active`);
    return {
      success: true,
      institutions: response.data.institutions
    };
  } catch (error) {
    const errorData = handleApiError(error, 'get-active-institutions');
    return { 
      success: false, 
      error: errorData,
      institutions: [] 
    };
  }
};

// Get institution by ID
export const getInstitutionById = async (institutionId) => {
  try {
    const response = await axios.get(`${API_URL}/${institutionId}`);
    return {
      success: true,
      institution: response.data.institution
    };
  } catch (error) {
    const errorData = handleApiError(error, 'get-institution-by-id');
    return { 
      success: false, 
      error: errorData 
    };
  }
};

// Register a new institution
export const createInstitution = async (institutionData) => {
  try {
    const response = await axios.post(API_URL, institutionData);
    return {
      success: true,
      institution: response.data.institution
    };
  } catch (error) {
    const errorData = handleApiError(error, 'create-institution');
    return { 
      success: false, 
      error: errorData 
    };
  }
};

// Update an institution
export const updateInstitution = async (institutionId, updates) => {
  try {
    const response = await axios.put(`${API_URL}/${institutionId}`, updates);
    return {
      success: true,
      institution: response.data.institution
    };
  } catch (error) {
    const errorData = handleApiError(error, 'update-institution');
    return { 
      success: false, 
      error: errorData 
    };
  }
};

// Mint NFT for an institution
export const mintInstitutionNFT = async (institutionId) => {
  try {
    const response = await axios.post(`${API_URL}/${institutionId}/mint-nft`);
    return {
      success: true,
      nft: response.data.nft,
      institution: response.data.institution,
      transaction: response.data.transaction
    };
  } catch (error) {
    const errorData = handleApiError(error, 'mint-institution-nft');
    return { 
      success: false, 
      error: errorData 
    };
  }
};

// Get applications for an institution
export const getInstitutionApplications = async (institutionId) => {
  try {
    const response = await axios.get(`${API_URL}/${institutionId}/applications`);
    return {
      success: true,
      applications: response.data.applications
    };
  } catch (error) {
    const errorData = handleApiError(error, 'get-institution-applications');
    return { 
      success: false, 
      error: errorData,
      applications: [] 
    };
  }
};