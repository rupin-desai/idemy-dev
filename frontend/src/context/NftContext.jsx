// src/context/NftContext.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
import * as nftApi from '../api/nft.api';
import { useAuth } from '../hooks/useAuth';

export const NftContext = createContext();

export const NftProvider = ({ children }) => {
  const { currentUser, isAuthenticated, profileLoaded } = useAuth();
  const [userNfts, setUserNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  
  // Clear error
  const clearError = () => setError(null);

  const fetchUserNfts = useCallback(async (force = false) => {
    // Don't fetch if not authenticated or no forced fetch
    if (!isAuthenticated || !currentUser) {
      setUserNfts([]);
      setFetchAttempted(true);
      return;
    }
    
    // Don't re-fetch if already attempted, unless forced
    if (fetchAttempted && !force) {
      return;
    }
    
    // Don't fetch if user isn't a student
    if (!currentUser.student || !currentUser.student.studentId) {
      setError({
        type: 'not_student',
        message: 'You need to be registered as a student to access NFTs'
      });
      setUserNfts([]);
      setFetchAttempted(true);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Use the student ID directly if available
      const studentId = currentUser.student.studentId;
      const result = await nftApi.getNftsByStudentId(studentId);
      
      if (result.success === false) {
        setError({
          type: 'data',
          message: result.error?.message || 'Failed to load NFTs'
        });
        setUserNfts([]);
      } else {
        setUserNfts(result.nfts || []);
      }
    } catch (err) {
      console.error('Failed to fetch NFTs:', err);
      setError({
        type: 'unknown',
        message: 'An unexpected error occurred while fetching NFTs'
      });
      setUserNfts([]);
    } finally {
      setFetchAttempted(true);
      setLoading(false);
    }
  }, [isAuthenticated, currentUser]);
  
  // Key improvement: react to profileLoaded changes from auth context
  useEffect(() => {
    if (profileLoaded && isAuthenticated && currentUser) {
      console.log('Profile loaded, fetching NFTs');
      fetchUserNfts(true); // Force fetch when profile is loaded
    }
  }, [profileLoaded, isAuthenticated, currentUser, fetchUserNfts]);

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
