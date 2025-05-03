// frontend/src/context/ApplicationContext.jsx
import React, { createContext, useState, useCallback } from "react";
import * as applicationApi from "../api/application.api";

export const ApplicationContext = createContext();

export const ApplicationProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);

  const getApplicationDetailsWithRelations = useCallback(
    async (applicationId) => {
      setLoading(true);
      setError(null);

      try {
        const result = await applicationApi.getApplicationDetailsWithRelations(
          applicationId
        );

        if (!result.success) {
          setError(
            result.error?.message || "Failed to load application details"
          );
        }

        return result;
      } catch (err) {
        const errorMsg = err.message || "An unexpected error occurred";
        setError(errorMsg);
        console.error("Application details fetch error:", err);
        return { success: false, error: { message: errorMsg } };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const approveApplication = useCallback(
    async (applicationId, verificationData) => {
      setProcessingAction(true);
      setError(null);

      try {
        const result = await applicationApi.updateApplicationStatus(
          applicationId,
          "APPROVED",
          verificationData
        );

        return result;
      } catch (err) {
        const errorMsg = err.message || "Failed to approve application";
        setError(errorMsg);
        console.error("Application approval error:", err);
        return { success: false, error: { message: errorMsg } };
      } finally {
        setProcessingAction(false);
      }
    },
    []
  );

  const rejectApplication = useCallback(async (applicationId) => {
    setProcessingAction(true);
    setError(null);

    try {
      const result = await applicationApi.updateApplicationStatus(
        applicationId,
        "REJECTED"
      );

      return result;
    } catch (err) {
      const errorMsg = err.message || "Failed to reject application";
      setError(errorMsg);
      console.error("Application rejection error:", err);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setProcessingAction(false);
    }
  }, []);

  const verifyApplicationOnBlockchain = useCallback(async (applicationId) => {
    setProcessingAction(true);
    setError(null);

    try {
      const result = await applicationApi.verifyApplication(applicationId);
      return result;
    } catch (err) {
      const errorMsg =
        err.message || "Failed to verify application on blockchain";
      setError(errorMsg);
      console.error("Application blockchain verification error:", err);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setProcessingAction(false);
    }
  }, []);

  return (
    <ApplicationContext.Provider
      value={{
        loading,
        error,
        processingAction,
        getApplicationDetailsWithRelations,
        approveApplication,
        rejectApplication,
        verifyApplicationOnBlockchain,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
