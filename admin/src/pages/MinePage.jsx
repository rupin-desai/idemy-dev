// src/pages/MinePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlockchain } from '../hooks/useBlockchain';
import { useTransactions } from '../hooks/useTransactions';

const MinePage = () => {
  const { mineTransactions } = useBlockchain();
  const { pendingTransactions, fetchPendingTransactions } = useTransactions();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    miningRewardAddress: '',
    metadata: {
      note: 'Block mined via admin panel'
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchPendingTransactions();
  }, [fetchPendingTransactions]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('metadata.')) {
      const metadataField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [metadataField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const result = await mineTransactions(formData.miningRewardAddress, formData.metadata);
      
      // Refresh blockchain and transaction data after mining
      await fetchPendingTransactions();
      await fetchBlockchain();
      await fetchBlockchainInfo();
      
      alert(`Block successfully mined! Block index: ${result.block.index}`);
      navigate(`/block/${result.block.index}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mine transactions');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Mine Transactions</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Pending Transactions ({pendingTransactions?.length || 0})</h2>
        
        {pendingTransactions && pendingTransactions.length > 0 ? (
          <div className="mb-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingTransactions.map((tx, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tx.fromAddress || 'Mining Reward'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tx.toAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tx.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <p>No pending transactions to mine. Create some transactions first.</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="miningRewardAddress">
              Mining Reward Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="miningRewardAddress"
              name="miningRewardAddress"
              type="text"
              placeholder="Address to receive mining reward"
              value={formData.miningRewardAddress}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="note">
              Mining Note (Metadata)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="note"
              name="metadata.note"
              type="text"
              placeholder="Note for this mining operation"
              value={formData.metadata.note}
              onChange={handleChange}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading || pendingTransactions?.length === 0}
            >
              {loading ? 'Mining...' : 'Mine Transactions'}
            </button>
          </div>
        </form>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default MinePage;