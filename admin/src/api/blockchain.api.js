// src/api/blockchain.api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const blockchainApi = {
  // Blockchain endpoints
  getChain: async () => {
    const response = await axios.get(`${API_BASE_URL}/blockchain`);
    return response.data;
  },

  getBlockchainInfo: async () => {
    const response = await axios.get(`${API_BASE_URL}/blockchain/info`);
    return response.data;
  },

  getBlockByIndex: async (index) => {
    const response = await axios.get(`${API_BASE_URL}/blockchain/block/index/${index}`);
    return response.data;
  },

  getBlockByHash: async (hash) => {
    const response = await axios.get(`${API_BASE_URL}/blockchain/block/hash/${hash}`);
    return response.data;
  },

  validateChain: async () => {
    const response = await axios.get(`${API_BASE_URL}/blockchain/validate`);
    return response.data;
  },

  minePendingTransactions: async (miningRewardAddress, metadata) => {
    const response = await axios.post(`${API_BASE_URL}/blockchain/mine`, {
      miningRewardAddress,
      metadata
    });
    return response.data;
  },

  saveBlockchain: async () => {
    const response = await axios.post(`${API_BASE_URL}/blockchain/save`);
    return response.data;
  }
};

export default blockchainApi;