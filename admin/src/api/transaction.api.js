// src/api/transaction.api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const transactionApi = {
  // Transaction endpoints
  createTransaction: async (transaction) => {
    const response = await axios.post(`${API_BASE_URL}/transactions`, transaction);
    return response.data;
  },

  addTransaction: async (transaction) => {
    const response = await axios.post(`${API_BASE_URL}/transactions/add`, { transaction });
    return response.data;
  },

  getPendingTransactions: async () => {
    const response = await axios.get(`${API_BASE_URL}/transactions/pending`);
    return response.data;
  },

  getTransactionById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/transactions/${id}`);
    return response.data;
  },

  getAddressBalance: async (address) => {
    const response = await axios.get(`${API_BASE_URL}/transactions/balance/${address}`);
    return response.data;
  },

  getTransactionsByStudentId: async (studentId) => {
    // Add timestamp to prevent caching
    const response = await axios.get(`${API_BASE_URL}/transactions/student/${studentId}?_t=${Date.now()}`);
    return response.data;
  }
};

export default transactionApi;