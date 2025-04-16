// src/pages/WalletPage.jsx
import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';

const WalletPage = () => {
  const { getAddressBalance } = useTransactions();
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) return;
    
    setLoading(true);
    setError(null);
    setBalance(null);
    
    try {
      const result = await getAddressBalance(address);
      setBalance(result.balance);
    } catch (err) {
      setError('Failed to fetch balance for this address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Wallet Balance</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              Wallet Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="address"
              type="text"
              placeholder="Enter wallet address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          
          <div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Checking...' : 'Check Balance'}
            </button>
          </div>
        </form>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {balance !== null && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Balance for: {address}</h2>
          <div className="text-4xl font-bold text-green-600">{balance}</div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;