import axios from "axios";

const API_URL = "http://localhost:3000/api/institutions";

// Handle API errors
const handleApiError = (error, operation) => {
  console.error(`Institution API Error (${operation}):`, error);
  const errorMsg =
    error.response?.data?.message || error.message || "Unknown error";
  return {
    message: errorMsg,
    status: error.response?.status || 500,
  };
};

// Get all institutions
export const getAllInstitutions = async () => {
  try {
    const token = localStorage.getItem("authToken");  // Use authToken instead of token
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      success: true,
      institutions: response.data.institutions,
    };
  } catch (error) {
    const errorData = handleApiError(error, "get-all-institutions");
    return {
      success: false,
      error: errorData,
    };
  }
};

// Get active institutions
export const getActiveInstitutions = async () => {
  try {
    const token = localStorage.getItem("authToken");  // Use authToken instead of token
    const response = await axios.get(`${API_URL}/active`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      success: true,
      institutions: response.data.institutions,
    };
  } catch (error) {
    const errorData = handleApiError(error, "get-active-institutions");
    return {
      success: false,
      error: errorData,
    };
  }
};

// Get institution by ID
export const getInstitutionById = async (institutionId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/${institutionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      success: true,
      institution: response.data.institution,
    };
  } catch (error) {
    const errorData = handleApiError(error, "get-institution-by-id");
    return {
      success: false,
      error: errorData,
    };
  }
};

// Create new institution
export const createInstitution = async (institutionData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(API_URL, institutionData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      success: true,
      institution: response.data.institution,
      message: response.data.message,
    };
  } catch (error) {
    const errorData = handleApiError(error, "create-institution");
    return {
      success: false,
      error: errorData,
    };
  }
};

// Update institution
export const updateInstitution = async (institutionId, updates) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(`${API_URL}/${institutionId}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      success: true,
      institution: response.data.institution,
      message: response.data.message,
    };
  } catch (error) {
    const errorData = handleApiError(error, "update-institution");
    return {
      success: false,
      error: errorData,
    };
  }
};

// Get institution for current user
export const getCurrentUserInstitution = async () => {
  try {
    // Use authToken instead of token - this is the key used in auth.api.js
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      console.warn("No authentication token found when checking for user institution");
      return {
        success: false,
        institution: null,
        notFound: true,
        error: { message: "No authentication token available" }
      };
    }
    
    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      success: true,
      institution: response.data.institution
    };
  } catch (error) {
    // If 404, it means the user doesn't have an institution (not an error)
    if (error.response?.status === 404) {
      return {
        success: false,
        institution: null,
        notFound: true,
      };
    }
    
    // For other errors
    const errorData = handleApiError(error, "get-current-user-institution");
    return {
      success: false,
      error: errorData,
      institution: null,
    };
  }
};

// Mint institution NFT
export const mintInstitutionNFT = async (institutionId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(`${API_URL}/${institutionId}/mint-nft`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      success: true,
      nft: response.data.nft,
      institution: response.data.institution,
      transaction: response.data.transaction,
      message: response.data.message,
    };
  } catch (error) {
    const errorData = handleApiError(error, "mint-institution-nft");
    return {
      success: false,
      error: errorData,
    };
  }
};

// Get institution applications
export const getInstitutionApplications = async (institutionId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/${institutionId}/applications`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      success: true,
      applications: response.data.applications,
      count: response.data.count,
    };
  } catch (error) {
    const errorData = handleApiError(error, "get-institution-applications");
    return {
      success: false,
      error: errorData,
    };
  }
};
