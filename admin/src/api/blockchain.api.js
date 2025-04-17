import axios from "axios";
import { getAuthToken } from "./auth.api";

const API_URL = "http://localhost:3000/api/blockchain";

// Create axios instance with auth headers
const axiosWithAuth = () => {
  const token = getAuthToken();
  return axios.create({
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });
};

// Helper function to handle API errors
const handleApiError = (error, action) => {
  console.error(`Blockchain API error (${action}):`, error);
  const errorMessage =
    error.response?.data?.message || error.message || "Unknown error";
  return {
    message: errorMessage,
    status: error.response?.status || 500,
    action,
  };
};

// Get all blockchain data
export const getBlockchainData = async () => {
  try {
    const response = await axiosWithAuth().get(API_URL);
    return response.data;
  } catch (error) {
    const errorData = handleApiError(error, "get-blockchain");
    throw errorData;
  }
};

// Get blockchain info (chain length, difficulty, etc)
export const getBlockchainInfo = async () => {
  try {
    const response = await axiosWithAuth().get(`${API_URL}/info`);
    return response.data;
  } catch (error) {
    const errorData = handleApiError(error, "get-blockchain-info");
    throw errorData;
  }
};

// Get user transactions by student ID
export const getUserTransactionsByStudentId = async (studentId) => {
  try {
    const response = await axiosWithAuth().get(
      `http://localhost:3000/api/transactions/student/${studentId}`
    );
    return response.data;
  } catch (error) {
    // If the endpoint doesn't exist, try a different approach
    try {
      // Get all blockchain data and filter client-side
      const allData = await getBlockchainData();

      // Filter transactions for this student
      const studentTransactions = [];

      if (allData && allData.chain) {
        allData.chain.forEach((block) => {
          block.transactions.forEach((tx) => {
            if (
              (tx.metadata &&
                (tx.metadata.studentId === studentId ||
                  (tx.metadata.studentData &&
                    tx.metadata.studentData.studentId === studentId))) ||
              tx.fromAddress === studentId ||
              tx.toAddress === studentId
            ) {
              studentTransactions.push({
                ...tx,
                blockIndex: block.index,
                confirmed: true,
              });
            }
          });
        });
      }

      return studentTransactions;
    } catch (nestedError) {
      const errorData = handleApiError(
        nestedError,
        "get-user-transactions-by-studentId"
      );
      throw errorData;
    }
  }
};

// Get user transactions by email
export const getUserTransactionsByEmail = async (email) => {
  try {
    const response = await axiosWithAuth().get(
      `http://localhost:3000/api/transactions/user?email=${encodeURIComponent(
        email
      )}`
    );
    return response.data;
  } catch (error) {
    // If the endpoint doesn't exist, try a different approach
    try {
      // Get all blockchain data and filter client-side
      const allData = await getBlockchainData();

      // Filter transactions for this email
      const userTransactions = [];

      if (allData && allData.chain) {
        allData.chain.forEach((block) => {
          block.transactions.forEach((tx) => {
            if (
              (tx.metadata &&
                ((tx.metadata.studentData &&
                  tx.metadata.studentData.email === email) ||
                  tx.metadata.email === email)) ||
              (email && (tx.fromAddress === email || tx.toAddress === email))
            ) {
              userTransactions.push({
                ...tx,
                blockIndex: block.index,
                confirmed: true,
              });
            }
          });
        });
      }

      return userTransactions;
    } catch (nestedError) {
      const errorData = handleApiError(
        nestedError,
        "get-user-transactions-by-email"
      );
      throw errorData;
    }
  }
};

// Mine new block with pending transactions
export const mineTransactions = async (rewardAddress, metadata = {}) => {
  try {
    // Fix: Change parameter name from rewardAddress to miningRewardAddress
    const response = await axiosWithAuth().post(`${API_URL}/mine`, {
      miningRewardAddress: rewardAddress, // This parameter name needs to match what the backend expects
      metadata,
    });
    return response.data;
  } catch (error) {
    const errorData = handleApiError(error, "mine-transactions");
    throw errorData;
  }
};

// Save blockchain state
export const saveBlockchain = async () => {
  try {
    const response = await axiosWithAuth().post(`${API_URL}/save`);
    return response.data;
  } catch (error) {
    const errorData = handleApiError(error, "save-blockchain");
    throw errorData;
  }
};

// Mine student transactions
export const mineStudentTransactions = async () => {
  try {
    const response = await axiosWithAuth().post(
      `${API_URL}/mine-student-transactions`
    );
    return response.data;
  } catch (error) {
    const errorData = handleApiError(error, "mine-student-transactions");
    throw errorData;
  }
};

// Get block by index
export const getBlockByIndex = async (index) => {
  try {
    const response = await axiosWithAuth().get(`${API_URL}/block/${index}`);
    return response.data;
  } catch (error) {
    // Try to handle errors gracefully
    if (error.response && error.response.status === 404) {
      return { success: false, message: `Block #${index} not found` };
    }
    const errorData = handleApiError(error, "get-block-by-index");
    throw errorData;
  }
};

// Default export combining all functions for compatibility
const blockchainApi = {
  getBlockchainData,
  getBlockchainInfo,
  getUserTransactionsByStudentId,
  getUserTransactionsByEmail,
  mineTransactions,
  saveBlockchain,
  mineStudentTransactions,
  getBlockByIndex,
};

export default blockchainApi;
