// src/pages/NFTDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNFTs } from '../hooks/useNFTs';

const NFTDetailPage = () => {
  const { tokenId } = useParams();
  const { currentNFT, loading, error, fetchNFTByTokenId, verifyNFT } = useNFTs();
  
  const [verification, setVerification] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [transferData, setTransferData] = useState({
    toAddress: ''
  });
  const [transferError, setTransferError] = useState(null);
  const [transferSuccess, setTransferSuccess] = useState(null);

  useEffect(() => {
    if (tokenId) {
      fetchNFTByTokenId(tokenId);
    }
  }, [tokenId, fetchNFTByTokenId]);

  const handleVerifyNFT = async () => {
    try {
      setVerifying(true);
      const result = await verifyNFT(tokenId);
      setVerification(result);
    } catch (err) {
      console.error('Verification failed:', err);
    } finally {
      setVerifying(false);
    }
  };

  const handleTransferChange = (e) => {
    setTransferData({
      ...transferData,
      [e.target.name]: e.target.value
    });
  };

  const handleTransferNFT = async (e) => {
    e.preventDefault();
    setTransferError(null);
    setTransferSuccess(null);
    
    try {
      await transferNFT(
        tokenId, 
        currentNFT.ownerAddress, 
        transferData.toAddress
      );
      
      setTransferSuccess('NFT transferred successfully!');
      // Refresh NFT data
      await fetchNFTByTokenId(tokenId);
      setTransferData({ toAddress: '' });
    } catch (err) {
      setTransferError(err.response?.data?.message || 'Failed to transfer NFT. Please try again.');
    }
  };

  if (loading && !currentNFT) {
    return <div className="text-center py-10">Loading NFT data...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
        <p>{error}</p>
        <Link to="/nfts" className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded">
          Back to NFTs
        </Link>
      </div>
    );
  }

  if (!currentNFT) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
        <p>NFT not found</p>
        <Link to="/nfts" className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded">
          Back to NFTs
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/nfts" className="text-blue-600 hover:text-blue-900">
            ← Back to NFTs
          </Link>
          <h1 className="text-3xl font-bold">NFT Details</h1>
        </div>
        <button
          onClick={handleVerifyNFT}
          disabled={verifying}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          {verifying ? 'Verifying...' : 'Verify NFT'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          NFT #{currentNFT.tokenId}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Token ID</p>
            <p className="font-mono">{currentNFT.tokenId}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Student ID</p>
            <Link to={`/students/${currentNFT.studentId}`} className="text-blue-600 hover:text-blue-900">
              {currentNFT.studentId}
            </Link>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Owner Address</p>
            <p className="font-mono">{currentNFT.ownerAddress}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Minted At</p>
            <p>{new Date(currentNFT.mintedAt).toLocaleString()}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
              currentNFT.status === 'MINTED' ? 'bg-green-100 text-green-800' : 
              currentNFT.status === 'TRANSFERRED' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}>
              {currentNFT.status}
            </span>
          </div>
          
          {currentNFT.lastTransferredAt && (
            <div>
              <p className="text-sm text-gray-500">Last Transferred</p>
              <p>{new Date(currentNFT.lastTransferredAt).toLocaleString()}</p>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <p className="text-sm text-gray-500">Metadata URI</p>
          <a 
            href={`http://localhost:3000${currentNFT.metadataUri}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-900"
          >
            {currentNFT.metadataUri}
          </a>
        </div>
        
        <div className="mt-6">
          <p className="text-sm text-gray-500">Transaction Hash</p>
          <p className="font-mono">{currentNFT.mintTxHash}</p>
        </div>
        
        <div className="mt-6">
          <p className="text-sm text-gray-500">Fingerprint</p>
          <p className="font-mono">{currentNFT.fingerprint}</p>
        </div>
      </div>

      {verification && (
        <div className={`bg-${verification.valid ? 'green' : 'red'}-100 border-l-4 border-${verification.valid ? 'green' : 'red'}-500 text-${verification.valid ? 'green' : 'red'}-700 p-6 mb-6 rounded-lg`}>
          <h2 className="text-lg font-bold mb-2">Verification Result</h2>
          {verification.valid ? (
            <p>✅ This NFT is valid and authentic!</p>
          ) : (
            <div>
              <p>❌ This NFT verification failed!</p>
              <p className="mt-2">Reason: {verification.reason}</p>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Transfer NFT</h2>
        
        {transferError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{transferError}</p>
          </div>
        )}
        
        {transferSuccess && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
            <p>{transferSuccess}</p>
          </div>
        )}
        
        <form onSubmit={handleTransferNFT}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="toAddress">
              Recipient Address
            </label>
            <input
              type="text"
              id="toAddress"
              name="toAddress"
              value={transferData.toAddress}
              onChange={handleTransferChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter recipient's address"
              required
            />
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Transfer NFT
          </button>
        </form>
      </div>
    </div>
  );
};

export default NFTDetailPage;