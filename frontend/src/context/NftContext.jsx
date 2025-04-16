// src/context/NftContext.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
import * as nftApi from '../api/nft.api';
import { useAuth } from '../hooks/useAuth';

export const NftContext = createContext();

export const NftProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [userNfts, setUserNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  
  // Clear error
  const clearError = () => setError(null);

  const fetchUserNfts = useCallback(async () => {
    // Don't fetch if not authenticated
    if (!isAuthenticated || !currentUser) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Try to get NFTs using the fixed API call
      const result = await nftApi.getCurrentUserNfts();
      
      if (result.success === false) {
        if (result.error?.type === 'not_student') {
          setError({
            type: 'not_student',
            message: 'You need to be registered as a student to access NFTs'
          });
        } else {
          setError({
            type: 'data',
            message: result.error?.message || 'Failed to load NFTs'
          });
        }
        setUserNfts([]);
      } else {
        // Success case
        setUserNfts(result.nfts || []);
      }
    } catch (err) {
      // This would be an unexpected error
      setError({
        type: 'unknown',
        message: 'An unexpected error occurred'
      });
      setUserNfts([]);
    } finally {
      setFetchAttempted(true);
      setLoading(false);
    }
  }, [isAuthenticated, currentUser]);

  // Fetch NFTs when user is authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      fetchUserNfts();
    } else {
      setUserNfts([]);
      setFetchAttempted(false);
    }
  }, [isAuthenticated, currentUser, fetchUserNfts]);

  // Other methods with improved error handling
  const verifyUserNft = async (tokenId) => {
    try {
      return await nftApi.verifyNft(tokenId);
    } catch (err) {
      setError({
        type: 'verification',
        message: err.message || 'Failed to verify NFT'
      });
      throw err;
    }
  };

  const createIdCardAndMintNft = async (studentId, cardData) => {
    setLoading(true);
    setError(null);
    try {
      // Create ID card first
      await nftApi.createIdCard(studentId, cardData);
      
      // Then mint NFT based on this ID card
      const result = await nftApi.mintNft(studentId);
      
      // Refresh NFTs list
      await fetchUserNfts();
      
      return result;
    } catch (err) {
      setError({
        type: 'creation',
        message: err.message || 'Failed to create and mint NFT'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const transferUserNft = async (tokenId, recipientId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await nftApi.transferNft(tokenId, recipientId);
      
      // Refresh NFTs list
      await fetchUserNfts();
      
      return result;
    } catch (err) {
      setError({
        type: 'transfer',
        message: err.message || 'Failed to transfer NFT'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getNftDetails = async (tokenId) => {
    try {
      return await nftApi.getNftByTokenId(tokenId);
    } catch (err) {
      setError({
        type: 'details',
        message: err.message || 'Failed to get NFT details'
      });
      throw err;
    }
  };

  return (
    <NftContext.Provider
      value={{
        userNfts,
        loading,
        error,
        fetchAttempted,
        fetchUserNfts,
        clearError,
        verifyUserNft,
        transferUserNft,
        createIdCardAndMintNft,
        getNftDetails
      }}
    >
      {children}
    </NftContext.Provider>
  );
};

export default NftContext;