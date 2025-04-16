// src/context/NFTContext.jsx
import { createContext, useState, useCallback } from 'react';
import nftApi from '../api/nft.api';

export const NFTContext = createContext();

export function NFTProvider({ children }) {
  const [nfts, setNFTs] = useState([]);
  const [currentNFT, setCurrentNFT] = useState(null);
  const [studentNFTs, setStudentNFTs] = useState([]);
  const [idCard, setIDCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllNFTs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await nftApi.getAllNFTs();
      setNFTs(data.nfts || []);
      return data;
    } catch (err) {
      setError('Failed to fetch NFTs');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNFTByTokenId = useCallback(async (tokenId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await nftApi.getNFTByTokenId(tokenId);
      setCurrentNFT(data.nft);
      return data;
    } catch (err) {
      setError(`Failed to fetch NFT with token ID: ${tokenId}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNFTsByStudentId = useCallback(async (studentId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await nftApi.getNFTsByStudentId(studentId);
      setStudentNFTs(data.nfts || []);
      return data;
    } catch (err) {
      setError(`Failed to fetch NFTs for student with ID: ${studentId}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createIDCard = useCallback(async (studentId, cardData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await nftApi.createIDCard(studentId, cardData);
      setIDCard(data.idCard);
      return data;
    } catch (err) {
      setError(`Failed to create ID card for student with ID: ${studentId}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchIDCardByStudentId = useCallback(async (studentId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await nftApi.getIDCardByStudentId(studentId);
      setIDCard(data.idCard);
      return data;
    } catch (err) {
      setError(`Failed to fetch ID card for student with ID: ${studentId}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const mintNFT = useCallback(async (studentId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await nftApi.mintNFT(studentId);
      return data;
    } catch (err) {
      setError(`Failed to mint NFT for student with ID: ${studentId}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyNFT = useCallback(async (tokenId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await nftApi.verifyNFT(tokenId);
      return data;
    } catch (err) {
      setError(`Failed to verify NFT with token ID: ${tokenId}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const transferNFT = useCallback(async (tokenId, fromAddress, toAddress) => {
    setLoading(true);
    setError(null);
    try {
      const data = await nftApi.transferNFT(tokenId, fromAddress, toAddress);
      return data;
    } catch (err) {
      setError(`Failed to transfer NFT with token ID: ${tokenId}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    nfts,
    currentNFT,
    studentNFTs,
    idCard,
    loading,
    error,
    fetchAllNFTs,
    fetchNFTByTokenId,
    fetchNFTsByStudentId,
    createIDCard,
    fetchIDCardByStudentId,
    mintNFT,
    verifyNFT,
    transferNFT
  };

  return (
    <NFTContext.Provider value={value}>
      {children}
    </NFTContext.Provider>
  );
}