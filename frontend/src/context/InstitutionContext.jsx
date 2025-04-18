import React, { createContext, useState, useCallback, useContext } from "react";
import * as institutionApi from "../api/institution.api";

export const InstitutionContext = createContext();

export function InstitutionProvider({ children }) {
  const [institutions, setInstitutions] = useState([]);
  const [currentInstitution, setCurrentInstitution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllInstitutions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await institutionApi.getAllInstitutions();
      if (result.success) {
        setInstitutions(result.institutions);
      }
      return result;
    } catch (err) {
      setError("Failed to fetch institutions");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getActiveInstitutions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await institutionApi.getActiveInstitutions();
      return result;
    } catch (err) {
      setError("Failed to fetch active institutions");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getInstitutionById = useCallback(async (institutionId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await institutionApi.getInstitutionById(institutionId);
      if (result.success) {
        setCurrentInstitution(result.institution);
      }
      return result;
    } catch (err) {
      setError(`Failed to fetch institution with ID: ${institutionId}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createInstitution = useCallback(async (institutionData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await institutionApi.createInstitution(institutionData);
      return result;
    } catch (err) {
      setError("Failed to create institution");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateInstitution = useCallback(
    async (institutionId, updates) => {
      setLoading(true);
      setError(null);
      try {
        const result = await institutionApi.updateInstitution(
          institutionId,
          updates
        );
        if (
          result.success &&
          currentInstitution?.institutionId === institutionId
        ) {
          setCurrentInstitution(result.institution);
        }
        return result;
      } catch (err) {
        setError(`Failed to update institution with ID: ${institutionId}`);
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentInstitution]
  );

  const mintInstitutionNFT = useCallback(
    async (institutionId) => {
      setLoading(true);
      setError(null);
      try {
        const result = await institutionApi.mintInstitutionNFT(institutionId);
        if (
          result.success &&
          currentInstitution?.institutionId === institutionId
        ) {
          setCurrentInstitution((prev) => ({
            ...prev,
            nftTokenId: result.nft.tokenId,
          }));
        }
        return result;
      } catch (err) {
        setError("Failed to mint NFT for institution");
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentInstitution]
  );

  const value = {
    institutions,
    currentInstitution,
    loading,
    error,
    getAllInstitutions,
    getActiveInstitutions,
    getInstitutionById,
    createInstitution,
    updateInstitution,
    mintInstitutionNFT,
  };

  return (
    <InstitutionContext.Provider value={value}>
      {children}
    </InstitutionContext.Provider>
  );
}
