import axios from "axios";

const API_URL = "http://localhost:3000/api/applications";

// Handle API errors
const handleApiError = (error, operation) => {
  console.error(`Application API Error (${operation}):`, error);
  const errorMsg =
    error.response?.data?.message || error.message || "Unknown error";
  return {
    message: errorMsg,
    status: error.response?.status || 500,
  };
};

// Get all applications
export const getAllApplications = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      success: true,
      applications: response.data.applications,
      count: response.data.count,
    };
  } catch (error) {
    const errorData = handleApiError(error, "get-all-applications");
    return {
      success: false,
      error: errorData,
    };
  }
};

// Get applications by student ID
export const getApplicationsByStudentId = async (studentId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/student/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      success: true,
      applications: response.data.applications,
      count: response.data.count,
    };
  } catch (error) {
    const errorData = handleApiError(error, "get-student-applications");
    return {
      success: false,
      error: errorData,
      applications: [],
    };
  }
};

// Get applications by institution ID
export const getApplicationsByInstitutionId = async (institutionId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(
      `${API_URL}/institution/${institutionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return {
      success: true,
      applications: response.data.applications,
      count: response.data.count,
    };
  } catch (error) {
    const errorData = handleApiError(error, "get-institution-applications");
    return {
      success: false,
      error: errorData,
      applications: [],
    };
  }
};

// Create new application
export const createApplication = async (applicationData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(API_URL, applicationData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      success: true,
      application: response.data.application,
      message: response.data.message,
    };
  } catch (error) {
    const errorData = handleApiError(error, "create-application");
    return {
      success: false,
      error: errorData,
    };
  }
};

// Update application status
export const updateApplicationStatus = async (
  applicationId,
  status,
  verificationData = {}
) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(
      `${API_URL}/${applicationId}/status`,
      { status, verificationData },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return {
      success: true,
      application: response.data.application,
      message: response.data.message,
    };
  } catch (error) {
    const errorData = handleApiError(error, "update-application-status");
    return {
      success: false,
      error: errorData,
    };
  }
};

// Verify application on blockchain
export const verifyApplication = async (applicationId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(
      `${API_URL}/${applicationId}/verify`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return {
      success: true,
      application: response.data.application,
      message: response.data.message,
      transaction: response.data.transaction,
    };
  } catch (error) {
    const errorData = handleApiError(error, "verify-application");
    return {
      success: false,
      error: errorData,
    };
  }
};

// Add this method to get application details with all related data
export const getApplicationDetailsWithRelations = async (applicationId) => {
  try {
    const token = localStorage.getItem("authToken");
    
    // Get application data
    const appResponse = await axios.get(
      `${API_URL}/${applicationId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (!appResponse.data.success) {
      return {
        success: false,
        error: { message: "Failed to load application details" }
      };
    }
    
    const application = appResponse.data.application;
    let studentData = null;
    let idCard = null;
    let nftData = null;
    
    // Fetch student data
    try {
      const studentResponse = await axios.get(
        `http://localhost:3000/api/students/${application.studentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (studentResponse.data.success) {
        studentData = studentResponse.data.student;
        
        // Try to get ID card data
        try {
          const idCardResponse = await axios.get(
            `http://localhost:3000/api/nft/idcards/${application.studentId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          if (idCardResponse.data.success) {
            idCard = idCardResponse.data.idCard;
          }
        } catch (idCardError) {
          console.warn("Could not fetch ID card:", idCardError);
        }
      }
    } catch (studentError) {
      console.warn("Could not fetch student data:", studentError);
    }
    
    // Fetch NFT data if available
    if (application.nftTokenId) {
      try {
        const nftResponse = await axios.get(
          `http://localhost:3000/api/nft/${application.nftTokenId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (nftResponse.data.success) {
          nftData = nftResponse.data.nft;
        }
      } catch (nftError) {
        console.warn("Could not fetch NFT data:", nftError);
      }
    }
    
    return {
      success: true,
      application,
      studentData,
      idCard,
      nftData
    };
    
  } catch (error) {
    const errorData = handleApiError(error, "get-application-details-with-relations");
    return {
      success: false,
      error: errorData
    };
  }
};
