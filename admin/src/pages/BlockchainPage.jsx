import React from 'react';
import { useBlockchain } from '../hooks/useBlockchain';
import { Link } from 'react-router-dom';

const BlockchainPage = () => {
  const { blockchain, loading, error, fetchBlockchain } = useBlockchain();

  if (loading) {
    return <div className="text-center py-10">Loading blockchain data...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
        <p>{error}</p>
        <button 
          className="mt-2 bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
          onClick={fetchBlockchain}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Blockchain Explorer</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Chain Information</h2>
        <p className="text-gray-700">Total Blocks: {blockchain.chain?.length || 0}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">All Blocks</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hash</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous Hash</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blockchain.chain?.map((block) => (
                <tr key={block.index}>
                  <td className="px-6 py-4 whitespace-nowrap">{block.index}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(block.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                    {block.hash.substring(0, 12)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                    {block.previousHash === "0" ? "Genesis Block" : `${block.previousHash.substring(0, 12)}...`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{block.transactions?.length || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      to={`/block/${block.index}`} 
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlockchainPage;