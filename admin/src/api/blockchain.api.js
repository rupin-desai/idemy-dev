// src/api/blockchain.api.js
import axios from 'axios';
import { getAuthToken } from './auth.api';

const API_URL = 'http://localhost:3000/api/blockchain';

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
  console.error(`Blockchain API error (${action}):`, error);
  const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
  return {
    message: errorMessage,
    status: error.response?.status || 500,
    action
  };
};

// Get all blockchain data
export const getBlockchainData = async () => {
  try {
    const response = await axiosWithAuth().get(API_URL);
    return response.data;
  } catch (error) {
    const errorData = handleApiError(error, 'get-blockchain');
    throw errorData;
  }
};

// Get blockchain info (chain length, difficulty, etc)
export const getBlockchainInfo = async () => {
  try {
    const response = await axiosWithAuth().get(`${API_URL}/info`);
    return response.data;
  } catch (error) {
    const errorData = handleApiError(error, 'get-blockchain-info');
    throw errorData;
  }
};

// Get user transactions by student ID
export const getUserTransactionsByStudentId = async (studentId) => {
  try {
    const response = await axiosWithAuth().get(`http://localhost:3000/api/transactions/student/${studentId}`);
    return response.data;
  } catch (error) {
    // If the endpoint doesn't exist, try a different approach
    try {
      // Get all blockchain data and filter client-side
      const allData = await getBlockchainData();
      
      // Filter transactions for this student
      const studentTransactions = [];
      
      if (allData && allData.chain) {
        allData.chain.forEach(block => {
          if (block.transactions && block.transactions.length > 0) {
            block.transactions.forEach(tx => {
              if (
                (tx.metadata && tx.metadata.studentId === studentId) ||
                tx.fromAddress === studentId ||
                tx.toAddress === studentId
              ) {
                studentTransactions.push({
                  ...tx,
                  blockIndex: block.index,
                  confirmed: true
                });
              }
            });
          }
        });
      }
      
      return studentTransactions;
    } catch (nestedError) {
      const errorData = handleApiError(nestedError, 'get-user-transactions');
      throw errorData;
    }
  }
};

// Get student info by email from blockchain
export const getStudentByEmail = async (email) => {
  try {
    const response = await axiosWithAuth().get(`${API_URL}/student-by-email/${encodeURIComponent(email)}`);
    return response.data;
  } catch (error) {
    const errorData = handleApiError(error, 'get-student-by-email');
    throw errorData;
  }
};

// Get user transactions by email or student ID
export const getUserTransactionsByEmailOrId = async (email, studentId = null) => {
  try {
    // Construct query params
    const params = new URLSearchParams();
    if (email) params.append('email', email);
    if (studentId) params.append('studentId', studentId);
    
    // API endpoint using query parameters
    const response = await axiosWithAuth().get(`${API_URL}/transactions/user?${params.toString()}`);
    return response.data;
  } catch (error) {
    // Fallback to client-side filtering
    try {
      const allData = await getBlockchainData();
      
      // Filter transactions for this user
      const userTransactions = [];
      
      if (allData && allData.chain) {
        allData.chain.forEach(block => {
          if (block.transactions && block.transactions.length > 0) {
            block.transactions.forEach(tx => {
              if (
                (tx.metadata && 
                 ((email && tx.metadata.email === email) || 
                  (studentId && tx.metadata.studentId === studentId))) ||
                (email && (tx.fromAddress === email || tx.toAddress === email)) ||
                (studentId && (tx.fromAddress === studentId || tx.toAddress === studentId))
              ) {
                userTransactions.push({
                  ...tx,
                  blockIndex: block.index,
                  confirmed: true
                });
              }
            });
          }
        });
      }
      
      return userTransactions;
    } catch (nestedError) {
      const errorData = handleApiError(nestedError, 'get-user-transactions-by-email');
      throw errorData;
    }
  }
};

// Mine new block with pending transactions
export const mineTransactions = async (rewardAddress, metadata = {}) => {
  try {
    const response = await axiosWithAuth().post(`${API_URL}/mine`, { 
      rewardAddress,
      metadata
    });
    return response.data;
  } catch (error) {
    const errorData = handleApiError(error, 'mine-transactions');
    throw errorData;
  }
};

// Default export combining all functions for compatibility
export default {
  getBlockchainData,
  getBlockchainInfo,
  getUserTransactionsByStudentId,
  getStudentByEmail,
  getUserTransactionsByEmailOrId,
  mineTransactions
};