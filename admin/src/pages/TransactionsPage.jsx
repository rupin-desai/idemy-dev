import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTransactions } from '../hooks/useTransactions';
import { FileText, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { pageVariants, cardVariants, tableRowVariants, iconSizes } from '../utils/animations';
import Button from '../components/UI/Button';
import Alert from '../components/UI/Alert';

const TransactionsPage = () => {
  const { pendingTransactions, loading, error, fetchPendingTransactions } = useTransactions();

  // Add polling for auto-refresh
  useEffect(() => {
    fetchPendingTransactions();
    
    const intervalId = setInterval(() => {
      fetchPendingTransactions();
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [fetchPendingTransactions]);

  if (loading && !pendingTransactions) {
    return (
      <div className="flex justify-center items-center py-20">
        <RefreshCw className="animate-spin text-blue-600 mr-2" size={iconSizes.lg} />
        <span className="text-lg">Loading transaction data...</span>
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <FileText size={iconSizes.lg} className="mr-3 text-blue-600" />
          Pending Transactions
          {/* <img src="/logo_icon_blue.png" alt="IDEMY" className="h-8 ml-3" /> */}
        </h1>
        <Button
          onClick={fetchPendingTransactions}
          color="primary"
          icon={<RefreshCw size={iconSizes.sm} />}
        >
          Refresh
        </Button>
      </div>
      
      {error && (
        <Alert
          type="error"
          message={error}
          show={true}
          details={
            <Button
              onClick={fetchPendingTransactions}
              color="danger"
              size="sm"
              className="mt-2"
            >
              Retry
            </Button>
          }
        />
      )}
      
      <motion.div 
        className="bg-white rounded-lg shadow-md overflow-hidden"
        variants={cardVariants}
      >
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            <Clock size={iconSizes.md} className="mr-2 text-amber-600" />
            <h2 className="text-xl font-semibold">Transactions waiting to be mined</h2>
          </div>
          <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
            {pendingTransactions?.length || 0} Pending
          </span>
        </div>
        
        {pendingTransactions && pendingTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingTransactions.map((tx) => (
                  <motion.tr 
                    key={tx.id}
                    className="hover:bg-gray-50"
                    variants={tableRowVariants}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      {tx.id.substring(0, 10)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tx.fromAddress ? `${tx.fromAddress.substring(0, 10)}...` : 'Mining Reward'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tx.toAddress.substring(0, 10)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {tx.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 items-center">
                        <Clock size={12} className="mr-1" /> 
                        Pending
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle size={iconSizes.xl} className="text-green-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No Pending Transactions</h3>
            <p className="mt-2 text-gray-500">All transactions have been processed.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TransactionsPage;