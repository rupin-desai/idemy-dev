// src/hooks/useNFTs.jsx
import { useContext } from 'react';
import { NFTContext } from '../context/NFTContext';

export function useNFTs() {
  const context = useContext(NFTContext);
  if (!context) {
    throw new Error('useNFTs must be used within an NFTProvider');
  }
  return context;
}