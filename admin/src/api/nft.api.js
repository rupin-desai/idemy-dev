// src/api/nft.api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const nftApi = {
  // Get all NFTs
  getAllNFTs: async () => {
    const response = await axios.get(`${API_BASE_URL}/nft?_t=${Date.now()}`);
    return response.data;
  },
  
  // Get NFT by token ID
  getNFTByTokenId: async (tokenId) => {
    const response = await axios.get(`${API_BASE_URL}/nft/${tokenId}?_t=${Date.now()}`);
    return response.data;
  },
  
  // Get NFTs by student ID
  getNFTsByStudentId: async (studentId) => {
    const response = await axios.get(`${API_BASE_URL}/nft/student/${studentId}?_t=${Date.now()}`);
    return response.data;
  },
  
  // Create ID card for student
  createIDCard: async (studentId, cardData) => {
    const response = await axios.post(`${API_BASE_URL}/nft/idcards/${studentId}`, cardData);
    return response.data;
  },
  
  // Get ID card for student
  getIDCardByStudentId: async (studentId) => {
    const response = await axios.get(`${API_BASE_URL}/nft/idcards/${studentId}?_t=${Date.now()}`);
    return response.data;
  },
  
  // Mint NFT for student ID card
  mintNFT: async (studentId) => {
    const response = await axios.post(`${API_BASE_URL}/nft/mint/${studentId}`);
    return response.data;
  },
  
  // Verify NFT authenticity
  verifyNFT: async (tokenId) => {
    const response = await axios.get(`${API_BASE_URL}/nft/verify/${tokenId}?_t=${Date.now()}`);
    return response.data;
  },
  
  // Transfer NFT ownership
  transferNFT: async (tokenId, fromAddress, toAddress) => {
    const response = await axios.post(`${API_BASE_URL}/nft/transfer/${tokenId}`, {
      fromAddress,
      toAddress
    });
    return response.data;
  }
};

export default nftApi;