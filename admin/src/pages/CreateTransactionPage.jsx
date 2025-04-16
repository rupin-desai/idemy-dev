// src/pages/CreateTransactionPage.jsx
import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useBlockchain } from '../hooks/useBlockchain';

const CreateTransactionPage = () => {
  const { createTransaction, fetchPendingTransactions, loading } = useTransactions();
  const { fetchBlockchain, fetchBlockchainInfo } = useBlockchain();
  const [formData, setFormData] = useState({
    fromAddress: '',
    toAddress: '',
    amount: '',
    metadata: {
      studentId: '',
      note: ''
    }
  });
  const [transactionResult, setTransactionResult] = useState(null);
  const [error, setError] = useState(null);

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
    setTransactionResult(null);
    
    try {
      // Convert amount to number
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      const result = await createTransaction(transactionData);
      
      // Refresh data after transaction is created
      await fetchPendingTransactions();
      await fetchBlockchain();
      await fetchBlockchainInfo();
      
      setTransactionResult(result);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create transaction');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create Transaction</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fromAddress">
              From Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="fromAddress"
              name="fromAddress"
              type="text"
              placeholder="Sender's address"
              value={formData.fromAddress}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="toAddress">
              To Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="toAddress"
              name="toAddress"
              type="text"
              placeholder="Recipient's address"
              value={formData.toAddress}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              Amount
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="studentId">
              Student ID (Metadata)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="studentId"
              name="metadata.studentId"
              type="text"
              placeholder="STU12345678"
              value={formData.metadata.studentId}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="note">
              Note (Metadata)
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="note"
              name="metadata.note"
              placeholder="Additional transaction information"
              value={formData.metadata.note}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Transaction'}
            </button>
          </div>
        </form>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {transactionResult && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
          <p className="font-bold">Transaction Created Successfully!</p>
          <p className="mt-2">Transaction ID: {transactionResult.transaction.id}</p>
          <div className="mt-4">
            <p className="font-bold">Transaction Details:</p>
            <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto">
              {JSON.stringify(transactionResult.transaction, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTransactionPage;
