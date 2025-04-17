// src/api/nft.api.js
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

const nftApi = {
  // Get all NFTs
  getAllNFTs: async () => {
    const response = await axiosWithAuth().get(`${API_BASE_URL}/nft?_t=${Date.now()}`);
    return response.data;
  },
  
  // Get NFT by token ID
  getNFTByTokenId: async (tokenId) => {
    const response = await axiosWithAuth().get(`${API_BASE_URL}/nft/${tokenId}?_t=${Date.now()}`);
    return response.data;
  },
  
  // Get NFTs by student ID
  getNFTsByStudentId: async (studentId) => {
    const response = await axiosWithAuth().get(`${API_BASE_URL}/nft/student/${studentId}?_t=${Date.now()}`);
    return response.data;
  },
  
  // Create ID card for student
  createIDCard: async (studentId, cardData) => {
    const response = await axiosWithAuth().post(`${API_BASE_URL}/nft/idcards/${studentId}`, cardData);
    return response.data;
  },
  
  // Get ID card for student
  getIDCardByStudentId: async (studentId) => {
    const response = await axiosWithAuth().get(`${API_BASE_URL}/nft/idcards/${studentId}?_t=${Date.now()}`);
    return response.data;
  },
  
  // Mint NFT for student ID card
  mintNFT: async (studentId) => {
    const response = await axiosWithAuth().post(`${API_BASE_URL}/nft/mint/${studentId}`);
    return response.data;
  },
  
  // Verify NFT authenticity
  verifyNFT: async (tokenId) => {
    const response = await axiosWithAuth().get(`${API_BASE_URL}/nft/verify/${tokenId}?_t=${Date.now()}`);
    return response.data;
  },
  
  // Transfer NFT ownership
  transferNFT: async (tokenId, fromAddress, toAddress) => {
    const response = await axiosWithAuth().post(`${API_BASE_URL}/nft/transfer/${tokenId}`, {
      fromAddress,
      toAddress
    });
    return response.data;
  }
};

export default nftApi;