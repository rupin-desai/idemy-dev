// src/context/TransactionContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import transactionApi from "../api/transaction.api";

export const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPendingTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await transactionApi.getPendingTransactions();
      setPendingTransactions(data.transactions || []);
    } catch (err) {
      setError("Failed to fetch pending transactions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTransaction = useCallback(
    async (transaction) => {
      setLoading(true);
      setError(null);
      try {
        const data = await transactionApi.createTransaction(transaction);
        await fetchPendingTransactions();
        return data;
      } catch (err) {
        setError("Failed to create transaction");
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPendingTransactions]
  );

  const getAddressBalance = useCallback(async (address) => {
    setLoading(true);
    setError(null);
    try {
      const data = await transactionApi.getAddressBalance(address);
      return data;
    } catch (err) {
      setError(`Failed to get balance for address ${address}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingTransactions();
  }, [fetchPendingTransactions]);

  const value = {
    pendingTransactions,
    loading,
    error,
    fetchPendingTransactions,
    createTransaction,
    getAddressBalance,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
