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

// Get user metadata from blockchain
export const getUserMetadata = async (userId, email) => {
  try {
    // First try to get transactions by user ID
    const response = await axios.get(`${API_URL}/metadata?userId=${userId}&email=${email}`);
    return {
      success: true,
      metadata: response.data.metadata
    };
  } catch (error) {
    // If endpoint doesn't exist, fetch all blockchain data and filter client-side
    try {
      const allData = await getBlockchainData();
      if (allData && allData.chain) {
        // Extract and transform relevant metadata
        const userMetadata = extractUserMetadata(allData.chain, userId, email);
        
        return {
          success: true,
          metadata: userMetadata
        };
      }
      throw new Error('Could not retrieve blockchain data');
    } catch (nestedError) {
      const errorData = handleApiError(nestedError, 'get-user-metadata');
      return { 
        success: false, 
        error: errorData,
        metadata: []
      };
    }
  }
};

// Helper function to extract user metadata from blockchain
function extractUserMetadata(chain, userId, email) {
  const metadata = [];
  
  // Process each block in the chain
  chain.forEach(block => {
    block.transactions.forEach(tx => {
      // Check if transaction is related to the user
      if (isUserTransaction(tx, userId, email)) {
        const processedMetadata = processTransactionMetadata(tx, block);
        if (processedMetadata) {
          metadata.push({
            ...processedMetadata,
            blockIndex: block.index,
            blockHash: block.hash,
            timestamp: tx.timestamp,
            transactionId: tx.id
          });
        }
      }
    });
  });
  
  // Sort by timestamp (newest first)
  return metadata.sort((a, b) => b.timestamp - a.timestamp);
}

// Check if a transaction belongs to the user
function isUserTransaction(tx, userId, email) {
  return (
    (tx.metadata?.studentId === userId) ||
    (tx.metadata?.studentData?.studentId === userId) ||
    (tx.metadata?.studentData?.email === email) ||
    (tx.fromAddress === userId) ||
    (tx.fromAddress === email) ||
    (tx.toAddress === userId)
  );
}

// Process transaction metadata into a user-friendly format
function processTransactionMetadata(tx, block) {
  // Skip empty metadata
  if (!tx.metadata || Object.keys(tx.metadata).length === 0) {
    return null;
  }
  
  // Determine the type of metadata
  let type = 'UNKNOWN';
  let title = 'Blockchain Transaction';
  let details = {};
  let icon = 'database';
  
  // Process different metadata types
  if (tx.metadata.action === 'MINT_NFT' || tx.metadata.type === 'ID_CARD') {
    type = 'ID_CREATION';
    title = 'Digital ID Created';
    icon = 'file-plus';
    details = {
      tokenId: tx.metadata.tokenId || 'Unknown',
      studentId: tx.metadata.studentId || tx.metadata.studentData?.studentId || 'Unknown',
      createdAt: new Date(tx.timestamp).toISOString(),
      status: 'ACTIVE'
    };
  } 
  else if (tx.metadata.action === 'UPDATE_NFT') {
    type = 'ID_UPDATE';
    title = 'Digital ID Updated';
    icon = 'refresh-cw';
    details = {
      tokenId: tx.metadata.tokenId || 'Unknown',
      version: tx.metadata.version || 'Unknown',
      previousVersion: tx.metadata.previousVersionId || 'Unknown',
      updatedAt: new Date(tx.timestamp).toISOString()
    };
  }
  else if (tx.metadata.action === 'CREATE' && tx.metadata.studentData) {
    type = 'PROFILE_CREATED';
    title = 'Student Profile Created';
    icon = 'user-plus';
    details = {
      studentId: tx.metadata.studentId || 'Unknown',
      name: `${tx.metadata.studentData.firstName || ''} ${tx.metadata.studentData.lastName || ''}`.trim(),
      email: tx.metadata.studentData.email || 'Unknown',
      createdAt: new Date(tx.timestamp).toISOString()
    };
  }
  else if (tx.metadata.action === 'UPDATE' && tx.metadata.studentData) {
    type = 'PROFILE_UPDATED';
    title = 'Student Profile Updated';
    icon = 'user-check';
    details = {
      studentId: tx.metadata.studentId || 'Unknown',
      name: `${tx.metadata.studentData.firstName || ''} ${tx.metadata.studentData.lastName || ''}`.trim(),
      email: tx.metadata.studentData.email || 'Unknown',
      updatedAt: new Date(tx.timestamp).toISOString()
    };
  }
  else if (tx.metadata.type === 'INSTITUTION_NFT_MINT') {
    type = 'INSTITUTION_VERIFIED';
    title = 'Institution Verification';
    icon = 'building';
    details = {
      institutionId: tx.metadata.institutionId || 'Unknown',
      institutionName: tx.metadata.institutionName || 'Unknown',
      nftTokenId: tx.metadata.nftTokenId || 'Unknown',
      verifiedAt: new Date(tx.timestamp).toISOString()
    };
  }
  
  return {
    type,
    title,
    icon,
    details,
    rawMetadata: tx.metadata
  };
}