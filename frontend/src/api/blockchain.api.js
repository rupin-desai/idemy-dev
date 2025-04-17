import axios from 'axios';

const API_URL = 'http://localhost:3000/api/blockchain';

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
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    const errorData = handleApiError(error, 'get-blockchain');
    throw errorData;
  }
};

// Get blockchain info (chain length, difficulty, etc)
export const getBlockchainInfo = async () => {
  try {
    const response = await axios.get(`${API_URL}/info`);
    return response.data;
  } catch (error) {
    const errorData = handleApiError(error, 'get-blockchain-info');
    throw errorData;
  }
};

// Get user transactions by student ID
export const getUserTransactionsByStudentId = async (studentId) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/transactions/student/${studentId}`);
    return response.data;
  } catch (error) {
    // If the endpoint doesn't exist, try a different approach
    try {
      // Get all blockchain data and filter client-side
      const allData = await getBlockchainData();
      if (allData && allData.chain) {
        const userTransactions = [];
        
        // Search all blocks for relevant transactions
        allData.chain.forEach(block => {
          block.transactions.forEach(tx => {
            const isRelevantTransaction = 
              (tx.metadata?.studentId === studentId) ||
              (tx.metadata?.studentData?.studentId === studentId) ||
              (tx.fromAddress === studentId);
              
            if (isRelevantTransaction) {
              userTransactions.push({
                ...tx,
                blockIndex: block.index,
                blockHash: block.hash,
                confirmed: true
              });
            }
          });
        });
        
        // Also check pending transactions
        if (allData.pendingTransactions) {
          allData.pendingTransactions.forEach(tx => {
            const isRelevantTransaction = 
              (tx.metadata?.studentId === studentId) ||
              (tx.metadata?.studentData?.studentId === studentId) ||
              (tx.fromAddress === studentId);
              
            if (isRelevantTransaction) {
              userTransactions.push({
                ...tx,
                confirmed: false
              });
            }
          });
        }
        
        return {
          success: true,
          transactions: userTransactions
        };
      }
      return { success: false, transactions: [] };
    } catch (nestedError) {
      const errorData = handleApiError(nestedError, 'get-user-transactions');
      throw errorData;
    }
  }
};

// Get student info by email from blockchain
export const getStudentByEmail = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/student-by-email/${encodeURIComponent(email)}`);
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
    const response = await axios.get(`${API_URL}/transactions/user?${params.toString()}`);
    return response.data;
  } catch (error) {
    // If the API endpoint doesn't exist or fails, fall back to client-side filtering
    console.warn("API endpoint for user transactions failed, falling back to client-side filtering");
    
    try {
      const allData = await getBlockchainData();
      if (allData && allData.chain) {
        const userTransactions = [];
        
        // Search all blocks for relevant transactions
        allData.chain.forEach(block => {
          block.transactions.forEach(tx => {
            const isRelevantTransaction = 
              // Check studentId in various locations
              (studentId && tx.metadata?.studentId === studentId) ||
              (studentId && tx.metadata?.studentData?.studentId === studentId) ||
              (studentId && tx.fromAddress === studentId) ||
              // Check email in various locations
              (email && tx.metadata?.studentData?.email?.toLowerCase() === email.toLowerCase()) ||
              (email && tx.metadata?.email?.toLowerCase() === email.toLowerCase()) ||
              (email && tx.fromAddress?.toLowerCase() === email.toLowerCase()) ||
              (email && tx.data?.email?.toLowerCase() === email.toLowerCase());
              
            if (isRelevantTransaction) {
              userTransactions.push({
                ...tx,
                blockIndex: block.index,
                blockHash: block.hash,
                confirmed: true
              });
            }
          });
        });
        
        // Also check pending transactions
        if (allData.pendingTransactions) {
          allData.pendingTransactions.forEach(tx => {
            const isRelevantTransaction = 
              // Same checks as above
              (studentId && tx.metadata?.studentId === studentId) ||
              (studentId && tx.metadata?.studentData?.studentId === studentId) ||
              (studentId && tx.fromAddress === studentId) ||
              (email && tx.metadata?.studentData?.email?.toLowerCase() === email.toLowerCase()) ||
              (email && tx.metadata?.email?.toLowerCase() === email.toLowerCase()) ||
              (email && tx.fromAddress?.toLowerCase() === email.toLowerCase()) ||
              (email && tx.data?.email?.toLowerCase() === email.toLowerCase());
              
            if (isRelevantTransaction) {
              userTransactions.push({
                ...tx,
                confirmed: false
              });
            }
          });
        }
        
        // Sort transactions with newest first
        const sortedTransactions = userTransactions.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        return {
          success: true,
          transactions: sortedTransactions
        };
      }
      return { success: false, transactions: [] };
    } catch (nestedError) {
      const errorData = handleApiError(nestedError, 'get-user-transactions-client-side');
      throw errorData;
    }
  }
};