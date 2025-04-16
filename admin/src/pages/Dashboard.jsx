import React from 'react';
import { useBlockchain } from '../hooks/useBlockchain';
import { useTransactions } from '../hooks/useTransactions';

const Dashboard = () => {
  const { blockchain, blockchainInfo, loading: blockchainLoading } = useBlockchain();
  const { pendingTransactions, loading: txLoading } = useTransactions();
  
  if (blockchainLoading || txLoading) {
    return <div className="text-center py-10">Loading dashboard data...</div>;
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Blockchain</h2>
          <div className="text-4xl font-bold">{blockchain.chain?.length || 0}</div>
          <div className="text-gray-500">Total Blocks</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Mining Difficulty</h2>
          <div className="text-4xl font-bold">{blockchainInfo?.difficulty || 0}</div>
          <div className="text-gray-500">Current Difficulty</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Pending Transactions</h2>
          <div className="text-4xl font-bold">{pendingTransactions?.length || 0}</div>
          <div className="text-gray-500">Waiting to be Mined</div>
        </div>
      </div>
      
      {blockchain.chain && blockchain.chain.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Latest Block</h2>
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
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">{blockchain.chain[blockchain.chain.length - 1]?.index}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(blockchain.chain[blockchain.chain.length - 1]?.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{blockchain.chain[blockchain.chain.length - 1]?.hash.substring(0, 20)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap">{blockchain.chain[blockchain.chain.length - 1]?.transactions?.length || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;