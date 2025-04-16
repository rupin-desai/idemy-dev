// src/hooks/useNft.js
import { useContext, useState } from 'react';
import { NftContext } from '../context/NftContext';
import * as nftApi from '../api/nft.api'; // Add this import

export const useNft = () => {
  const context = useContext(NftContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  if (!context) {
    throw new Error('useNft must be used within an NftProvider');
  }

  const getNftDetails = async (tokenId) => {
    setLoading(true);
    try {
      const response = await nftApi.getNftByTokenId(tokenId);
      setLoading(false);
      return response;
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to load NFT details');
      throw err;
    }
  };
  
  return { ...context, getNftDetails, loading, error };
};