// src/context/BlockchainContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import blockchainApi from "../api/blockchain.api";

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
      const data = await blockchainApi.getChain();
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
        const data = await blockchainApi.minePendingTransactions(
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

  const validateBlockchain = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await blockchainApi.validateChain();
      return data;
    } catch (err) {
      setError("Validation failed");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveBlockchain = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await blockchainApi.saveBlockchain();
      return data;
    } catch (err) {
      setError("Save failed");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBlockByIndex = useCallback(async (index) => {
    setLoading(true);
    setError(null);
    try {
      const data = await blockchainApi.getBlockByIndex(index);
      return data;
    } catch (err) {
      setError(`Failed to get block with index ${index}`);
      console.error(err);
      throw err;
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
    getBlockByIndex,
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
}
