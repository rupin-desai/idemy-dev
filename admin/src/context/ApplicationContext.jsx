import React, { createContext, useState, useCallback } from "react";
import applicationApi from "../api/application.api";

export const ApplicationContext = createContext();

export function ApplicationProvider({ children }) {
  const [applications, setApplications] = useState([]);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await applicationApi.getAllApplications();
      setApplications(response || []);
      return response;
    } catch (err) {
      setError("Failed to fetch applications");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getApplicationById = useCallback(async (applicationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await applicationApi.getApplicationById(applicationId);
      setCurrentApplication(response);
      return response;
    } catch (err) {
      setError(`Failed to fetch application with ID: ${applicationId}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getApplicationsByStudent = useCallback(async (studentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await applicationApi.getApplicationsByStudent(studentId);
      return response || [];
    } catch (err) {
      setError(`Failed to fetch applications for student: ${studentId}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getApplicationsByInstitution = useCallback(async (institutionId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await applicationApi.getApplicationsByInstitution(
        institutionId
      );
      return response || [];
    } catch (err) {
      setError(
        `Failed to fetch applications for institution: ${institutionId}`
      );
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createApplication = useCallback(
    async (applicationData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await applicationApi.createApplication(
          applicationData
        );
        await fetchAllApplications(); // Refresh list after creation
        return response;
      } catch (err) {
        setError(`Failed to create application: ${err.message}`);
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAllApplications]
  );

  const updateApplicationStatus = useCallback(
    async (applicationId, status, verificationData = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response = await applicationApi.updateApplicationStatus(
          applicationId,
          status,
          verificationData
        );
        if (
          currentApplication &&
          currentApplication.applicationId === applicationId
        ) {
          setCurrentApplication(response);
        }
        return response;
      } catch (err) {
        setError(`Failed to update application status: ${err.message}`);
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentApplication]
  );

  const verifyApplication = useCallback(async (applicationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await applicationApi.verifyApplication(applicationId);
      return response;
    } catch (err) {
      setError(`Failed to verify application on blockchain: ${err.message}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    applications,
    currentApplication,
    loading,
    error,
    fetchAllApplications,
    getApplicationById,
    getApplicationsByStudent,
    getApplicationsByInstitution,
    createApplication,
    updateApplicationStatus,
    verifyApplication,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
}
