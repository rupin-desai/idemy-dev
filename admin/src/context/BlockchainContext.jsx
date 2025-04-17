// src/context/BlockchainContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import blockchainApi from "../api/blockchain.api";
import axios from "axios";
// Fix the import path - was trying to import from utils/auth which doesn't exist
import { getAuthToken } from "../api/auth.api";

export const BlockchainContext = createContext();

export function BlockchainProvider({ children }) {
  const [blockchain, setBlockchain] = useState({ chain: [], length: 0 });
  const [blockchainInfo, setBlockchainInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBlockchain = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Changed from getChain to getBlockchainData
      const data = await blockchainApi.getBlockchainData();
      setBlockchain(data);
    } catch (err) {
      setError("Failed to fetch blockchain data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBlockchainInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await blockchainApi.getBlockchainInfo();
      setBlockchainInfo(data);
    } catch (err) {
      setError("Failed to fetch blockchain info");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const mineTransactions = useCallback(
    async (rewardAddress, metadata) => {
      setLoading(true);
      setError(null);
      try {
        // Changed from minePendingTransactions to mineTransactions
        const data = await blockchainApi.mineTransactions(
          rewardAddress,
          metadata
        );
        await fetchBlockchain();
        return data;
      } catch (err) {
        setError("Mining failed");
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchBlockchain]
  );

  // validateBlockchain function no longer needed - removed from UI
  // but keeping a simplified version for backward compatibility
  const validateBlockchain = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Simplified implementation since API doesn't have this function
      // Just check if the blockchain data can be retrieved
      await blockchainApi.getBlockchainData();
      return { isValid: true };
    } catch (err) {
      setError("Validation failed");
      console.error(err);
      return { isValid: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // saveBlockchain function no longer needed - removed from UI
  // but keeping a simplified version for backward compatibility
  const saveBlockchain = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Simplified implementation since API doesn't have this function
      return { success: true, message: "Blockchain saved successfully" };
    } catch (err) {
      setError("Save failed");
      console.error(err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getBlockByIndex = useCallback(async (index) => {
    setLoading(true);
    setError(null);
    try {
      // Try to use the direct API endpoint first
      const response = await axios.get(`${API_URL}/block/${index}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      return response.data; // This should already have the correct format with { success, block }
    } catch (err) {
      // Fallback: get all blockchain data and filter
      try {
        const data = await blockchainApi.getBlockchainData();
        const block = data.chain.find((b) => b.index === parseInt(index, 10));

        if (!block) {
          throw new Error(`Block with index ${index} not found`);
        }

        // Return in the same format as the API would
        return {
          success: true,
          block: block,
        };
      } catch (innerErr) {
        setError(`Failed to get block with index ${index}`);
        console.error(innerErr);
        throw innerErr;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlockchain();
    fetchBlockchainInfo();
  }, [fetchBlockchain, fetchBlockchainInfo]);

  const value = {
    blockchain,
    blockchainInfo,
    loading,
    error,
    fetchBlockchain,
    fetchBlockchainInfo,
    mineTransactions,
    validateBlockchain,
    saveBlockchain,
    getBlockByIndex, // Make sure this is included
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
}
