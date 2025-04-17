// src/pages/MinePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBlockchain } from '../hooks/useBlockchain';
import { useTransactions } from '../hooks/useTransactions';
import { Pickaxe, RefreshCw, AlertCircle } from 'lucide-react';
import { pageVariants, buttonVariants, iconSizes } from '../utils/animations';

const MinePage = () => {
  const { mineTransactions } = useBlockchain();
  const { pendingTransactions, fetchPendingTransactions } = useTransactions();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchPendingTransactions();
    
    // Set up polling interval (every 10 seconds)
    const intervalId = setInterval(() => {
      fetchPendingTransactions();
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [fetchPendingTransactions]);
  
  const handleMineBlock = async () => {
    setError(null);
    setLoading(true);
    
    try {
      // Use a default mining address for all mining operations
      const result = await mineTransactions(
        "SYSTEM_MINING_REWARD", 
        { note: "Block mined via admin panel" }
      );
      
      // Refresh transaction data after mining
      await fetchPendingTransactions();
      
      // Navigate to the newly mined block details
      alert(`Block successfully mined! Block index: ${result.block.index}`);
      navigate(`/block/${result.block.index}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mine transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="container mx-auto px-4 py-6"
    >
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Pickaxe size={iconSizes.lg} className="mr-3 text-blue-600" />
        Mine Transactions
      </h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold">Pending Transactions ({pendingTransactions?.length || 0})</h2>
          <motion.button
            onClick={fetchPendingTransactions}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={iconSizes.sm} className={loading ? "animate-spin" : ""} />
          </motion.button>
        </div>
        
        <div className="p-6">
          {pendingTransactions && pendingTransactions.length > 0 ? (
            <div className="mb-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingTransactions.map((tx, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {tx.fromAddress ? 
                            `${tx.fromAddress.substring(0, 10)}...` : 
                            'Mining Reward'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {tx.toAddress.substring(0, 10)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {tx.amount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(tx.timestamp).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 flex items-start">
              <AlertCircle className="h-5 w-5 mt-0.5 mr-2" />
              <p>No pending transactions to mine. Create some transactions first.</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 flex items-start">
              <AlertCircle className="h-5 w-5 mt-0.5 mr-2" />
              <div>
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}
          
          <motion.button
            onClick={handleMineBlock}
            disabled={loading || pendingTransactions?.length === 0}
            className={`flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium 
              ${pendingTransactions?.length === 0 || loading ? 
                'bg-gray-400 cursor-not-allowed' : 
                'bg-blue-600 hover:bg-blue-700'} 
              transition-colors`}
            variants={buttonVariants}
            whileHover={pendingTransactions?.length > 0 && !loading ? "hover" : {}}
            whileTap={pendingTransactions?.length > 0 && !loading ? "tap" : {}}
          >
            {loading ? (
              <>
                <RefreshCw size={iconSizes.sm} className="mr-2 animate-spin" />
                Mining Transactions...
              </>
            ) : (
              <>
                <Pickaxe size={iconSizes.sm} className="mr-2" />
                Mine Block
              </>
            )}
          </motion.button>
        </div>
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg">
        <h3 className="font-bold mb-2">How Block Mining Works</h3>
        <p className="mb-2">
          Mining is the process of adding transaction records to the blockchain. This process:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Confirms all waiting transactions</li>
          <li>Creates a new block with a unique hash</li>
          <li>Secures the blockchain through proof-of-work</li>
          <li>Rewards the miner with newly created tokens</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default MinePage;