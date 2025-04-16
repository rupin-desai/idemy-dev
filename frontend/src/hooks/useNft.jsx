// src/hooks/useNft.js
import { useContext } from 'react';
import { NftContext } from '../context/NftContext';

export const useNft = () => {
  const context = useContext(NftContext);
  
  if (!context) {
    throw new Error('useNft must be used within an NftProvider');
  }
  
  return context;
};