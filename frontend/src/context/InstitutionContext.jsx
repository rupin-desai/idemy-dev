import React, { createContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import * as institutionApi from "../api/institution.api";

export const InstitutionContext = createContext();

export function InstitutionProvider({ children }) {
  const [institutions, setInstitutions] = useState([]);
  const [currentInstitution, setCurrentInstitution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isAuthenticated, currentUser } = useAuth();

  // Check if the current user is associated with an institution
  useEffect(() => {
    const fetchUserInstitution = async () => {
      if (!isAuthenticated || !currentUser) return;

      setLoading(true);
      try {
        const result = await institutionApi.getCurrentUserInstitution();
        if (result.success) {
          setCurrentInstitution(result.institution);
        } else {
          // If not found, that's expected sometimes
          if (!result.notFound) {
            console.error("Error fetching user institution:", result.error);
          }
          setCurrentInstitution(null);
        }
      } catch (err) {
        console.error("Failed to fetch user institution data", err);
        setCurrentInstitution(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInstitution();
  }, [isAuthenticated, currentUser]);

  const getAllInstitutions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await institutionApi.getAllInstitutions();
      if (result.success) {
        setInstitutions(result.institutions);
      } else {
        setError(result.error?.message || "Failed to fetch institutions");
      }
      return result;
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch institutions";
      setError(errorMsg);
      console.error(err);
      return { success: false, error: { message: errorMsg } };
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
      } else {
        setError(
          result.error?.message ||
            `Failed to fetch institution with ID: ${institutionId}`
        );
      }
      return result;
    } catch (err) {
      const errorMsg =
        err.message || `Failed to fetch institution with ID: ${institutionId}`;
      setError(errorMsg);
      console.error(err);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  }, []);

  const createInstitution = useCallback(async (institutionData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await institutionApi.createInstitution(institutionData);
      if (result.success) {
        setCurrentInstitution(result.institution);
      } else {
        setError(result.error?.message || "Failed to create institution");
      }
      return result;
    } catch (err) {
      const errorMsg = err.message || "Failed to create institution";
      setError(errorMsg);
      console.error(err);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    institutions,
    currentInstitution,
    loading,
    error,
    getAllInstitutions,
    getInstitutionById,
    createInstitution,
  };

  return (
    <InstitutionContext.Provider value={value}>
      {children}
    </InstitutionContext.Provider>
  );
}
