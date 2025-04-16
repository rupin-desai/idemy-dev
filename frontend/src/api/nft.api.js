import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const API_URL = 'http://localhost:3000/api/nft';

// Enhanced error handling helper
const handleApiError = (error, operation) => {
  // Create a standardized error response
  const errorResponse = {
    status: error.response?.status,
    message: error.response?.data?.message || error.message,
    operation,
    timestamp: new Date().toISOString()
  };
  
  console.error(`NFT API Error (${operation}):`, errorResponse);
  return errorResponse;
};

// Get all NFTs for current user - FIXED to use current authenticated user's student ID
export const getCurrentUserNfts = async () => {
  try {
    // First try to get student info for the current user
    const userResponse = await axios.get('http://localhost:3000/api/auth/profile');
    
    if (userResponse.data?.student?.studentId) {
      // Use the student ID to get NFTs
      const studentId = userResponse.data.student.studentId;
      const response = await axios.get(`${API_URL}/student/${studentId}`);
      return response.data;
    } else {
      // No student ID found for this user
      return { 
        success: false, 
        error: {
          message: 'No student ID associated with this account',
          type: 'not_student'
        }, 
        nfts: [] 
      };
    }
  } catch (error) {
    const errorData = handleApiError(error, 'fetch-user-nfts');
    return { 
      success: false, 
      error: errorData, 
      nfts: [] 
    };
  }
};

// Get NFTs by student ID with enhanced error handling
export const getNftsByStudentId = async (studentId) => {
  try {
    const response = await axios.get(`${API_URL}/student/${studentId}`);
    return response.data;
  } catch (error) {
    const errorData = handleApiError(error, 'fetch-student-nfts');
    return { 
      success: false, 
      error: errorData, 
      nfts: [] 
    };
  }
};

// Get NFT by token ID with enhanced error handling
export const getNftByTokenId = async (tokenId) => {
  try {
    const response = await axios.get(`${API_URL}/token/${tokenId}`);
    return response.data;
  } catch (error) {
    const errorData = handleApiError(error, 'fetch-nft-details');
    throw errorData; // Here we throw since UI needs to handle specific cases
  }
};

// Other methods with similar error handling pattern
// Create ID card for student
export const createIdCard = async (studentId, cardData) => {
  try {
    // Modified to match the simplified data structure
    const payload = {
      fullName: cardData.fullName,
      dateOfBirth: cardData.dateOfBirth,
      idType: cardData.idType || "STUDENT",
      institution: cardData.institution,
      department: cardData.department,
      email: cardData.email
    };
    
    const response = await axios.post(`${API_URL}/idcards/${studentId}`, payload);
    return response.data;
  } catch (error) {
    const errorData = handleApiError(error, 'create-id-card');
    throw errorData;
  }
};

export const mintNft = async (studentId) => {
  try {
    const response = await axios.post(`${API_URL}/mint/${studentId}`);
    return response.data;
  } catch (error) {
    const errorData = handleApiError(error, 'mint-nft');
    throw errorData;
  }
};

export const verifyNft = async (tokenId) => {
  try {
    const response = await axios.get(`${API_URL}/verify/${tokenId}`);
    return response.data;
  } catch (error) {
    const errorData = handleApiError(error, 'verify-nft');
    throw errorData;
  }
};

export const transferNft = async (tokenId, recipientId) => {
  try {
    const response = await axios.post(`${API_URL}/transfer/${tokenId}`, { recipientId });
    return response.data;
  } catch (error) {
    const errorData = handleApiError(error, 'transfer-nft');
    throw errorData;
  }
};