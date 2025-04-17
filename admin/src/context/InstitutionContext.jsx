import React, { createContext, useState, useCallback } from "react";
import institutionApi from "../api/institution.api";

export const InstitutionContext = createContext();

export function InstitutionProvider({ children }) {
  const [institutions, setInstitutions] = useState([]);
  const [activeInstitutions, setActiveInstitutions] = useState([]);
  const [currentInstitution, setCurrentInstitution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllInstitutions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await institutionApi.getAllInstitutions();
      setInstitutions(response || []);
      return response;
    } catch (err) {
      setError("Failed to fetch institutions");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchActiveInstitutions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await institutionApi.getActiveInstitutions();
      setActiveInstitutions(response || []);
      return response;
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
      const response = await institutionApi.getInstitutionById(institutionId);
      setCurrentInstitution(response);
      return response;
    } catch (err) {
      setError(`Failed to fetch institution with ID: ${institutionId}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createInstitution = useCallback(
    async (institutionData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await institutionApi.createInstitution(
          institutionData
        );
        await fetchAllInstitutions(); // Refresh list after creation
        return response;
      } catch (err) {
        setError(`Failed to create institution: ${err.message}`);
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAllInstitutions]
  );

  const updateInstitution = useCallback(
    async (institutionId, updates) => {
      setLoading(true);
      setError(null);
      try {
        const response = await institutionApi.updateInstitution(
          institutionId,
          updates
        );
        if (
          currentInstitution &&
          currentInstitution.institutionId === institutionId
        ) {
          setCurrentInstitution(response);
        }
        await fetchAllInstitutions(); // Refresh list after update
        return response;
      } catch (err) {
        setError(`Failed to update institution with ID: ${institutionId}`);
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAllInstitutions, currentInstitution]
  );

  const deleteInstitution = useCallback(
    async (institutionId) => {
      setLoading(true);
      setError(null);
      try {
        const response = await institutionApi.deleteInstitution(institutionId);
        await fetchAllInstitutions(); // Refresh list after deletion
        if (
          currentInstitution &&
          currentInstitution.institutionId === institutionId
        ) {
          setCurrentInstitution(null);
        }
        return response;
      } catch (err) {
        setError(`Failed to delete institution with ID: ${institutionId}`);
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAllInstitutions, currentInstitution]
  );

  const mintInstitutionNFT = useCallback(
    async (institutionId) => {
      setLoading(true);
      setError(null);
      try {
        const response = await institutionApi.mintInstitutionNFT(institutionId);
        // Update the current institution if it's the one we just minted for
        if (
          currentInstitution &&
          currentInstitution.institutionId === institutionId
        ) {
          await getInstitutionById(institutionId);
        }
        await fetchAllInstitutions(); // Refresh list after minting
        return response;
      } catch (err) {
        setError(`Failed to mint NFT for institution: ${err.message}`);
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAllInstitutions, currentInstitution, getInstitutionById]
  );

  const value = {
    institutions,
    activeInstitutions,
    currentInstitution,
    loading,
    error,
    fetchAllInstitutions,
    fetchActiveInstitutions,
    getInstitutionById,
    createInstitution,
    updateInstitution,
    deleteInstitution,
    mintInstitutionNFT,
  };

  return (
    <InstitutionContext.Provider value={value}>
      {children}
    </InstitutionContext.Provider>
  );
}
