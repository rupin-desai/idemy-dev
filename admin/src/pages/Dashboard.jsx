import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBlockchain } from '../hooks/useBlockchain';
import { useTransactions } from '../hooks/useTransactions';
import { Database, Layers, Clock, RefreshCw, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { pageVariants, cardVariants, iconSizes } from '../utils/animations';
import Button from '../components/UI/Button';

const Dashboard = () => {
  const { blockchain, blockchainInfo, fetchBlockchain, fetchBlockchainInfo, loading: blockchainLoading } = useBlockchain();
  const { pendingTransactions, fetchPendingTransactions, loading: txLoading } = useTransactions();
  
  // Add polling for auto-refresh
  useEffect(() => {
    // Initial fetch is already handled by context providers
    
    // Set up polling interval (every 10 seconds)
    const intervalId = setInterval(() => {
      fetchBlockchain();
      fetchBlockchainInfo();
      fetchPendingTransactions();
    }, 10000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [fetchBlockchain, fetchBlockchainInfo, fetchPendingTransactions]);
  
  if (blockchainLoading || txLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <RefreshCw className="animate-spin text-blue-600 mr-2" size={iconSizes.lg} />
        <span className="text-lg">Loading dashboard data...</span>
      </div>
    );
  }
  
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <img src="/logo_icon_blue.png" alt="IDEMY" className="h-8 mr-3" />
          Blockchain Dashboard
        </h1>
        <Button
          onClick={() => {
            fetchBlockchain();
            fetchBlockchainInfo();
            fetchPendingTransactions();
          }}
          color="primary"
          icon={<RefreshCw size={iconSizes.sm} />}
        >
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md"
          variants={cardVariants}
        >
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <Database size={iconSizes.md} className="mr-2 text-blue-600" />
            Blockchain
          </h2>
          <div className="text-4xl font-bold">{blockchain.chain?.length || 0}</div>
          <div className="text-gray-500">Total Blocks</div>
        </motion.div>
        
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md"
          variants={cardVariants}
        >
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <Layers size={iconSizes.md} className="mr-2 text-purple-600" />
            Mining Difficulty
          </h2>
          <div className="text-4xl font-bold">{blockchainInfo?.difficulty || 0}</div>
          <div className="text-gray-500">Current Difficulty</div>
        </motion.div>
        
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md"
          variants={cardVariants}
        >
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <Clock size={iconSizes.md} className="mr-2 text-amber-600" />
            Pending Transactions
          </h2>
          <div className="text-4xl font-bold">{pendingTransactions?.length || 0}</div>
          <div className="text-gray-500">Waiting to be Mined</div>
          {pendingTransactions?.length > 0 && (
            <Link 
              to="/mine" 
              className="flex items-center mt-3 text-blue-600 hover:text-blue-800 text-sm"
            >
              Go to Mining
              <ChevronRight size={iconSizes.sm} className="ml-1" />
            </Link>
          )}
        </motion.div>
      </div>
      
      {blockchain.chain && blockchain.chain.length > 0 && (
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6"
          variants={cardVariants}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Database size={iconSizes.md} className="mr-2 text-blue-600" />
              Latest Block
            </h2>
            <Link 
              to="/blockchain" 
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
            >
              View All Blocks
              <ChevronRight size={iconSizes.sm} className="ml-1" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hash</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">{blockchain.chain[blockchain.chain.length - 1]?.index}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(blockchain.chain[blockchain.chain.length - 1]?.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{blockchain.chain[blockchain.chain.length - 1]?.hash.substring(0, 20)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap">{blockchain.chain[blockchain.chain.length - 1]?.transactions?.length || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;