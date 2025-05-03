import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useNft } from "../../hooks/useNft";
import * as institutionApi from "../../api/institution.api";
import * as applicationApi from "../../api/application.api";

// Import components
import {
  ApplyToInstitutionHeader,
  ApplyToInstitutionError,
  ApplyToInstitutionLoading,
  ApplyToInstitutionEmpty,
  ApplyToInstitutionList,
  ApplyToInstitutionForm,
} from "../../components/Applications/ApplyToInstitution";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const ApplyToInstitutionPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { userNfts } = useNft();
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [applyingTo, setApplyingTo] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [applicationFormData, setApplicationFormData] = useState({
    program: "",
    department: "",
    year: new Date().getFullYear(),
    additionalNotes: "",
  });

  useEffect(() => {
    // Check if user is a student
    if (!currentUser?.student?.studentId) {
      navigate("/create-student");
      return;
    }

    // Check if student has a current institution
    if (currentUser?.student?.currentInstitution) {
      navigate(
        `/institution-details/${currentUser.student.currentInstitution.institutionId}`
      );
      return;
    }

    // Fetch active institutions
    const fetchInstitutions = async () => {
      try {
        setLoading(true);
        const result = await institutionApi.getActiveInstitutions();
        if (result.success) {
          setInstitutions(result.institutions);
        } else {
          setError("Failed to load institutions");
        }
      } catch (err) {
        console.error("Error fetching institutions:", err);
        setError("Failed to load institutions");
      } finally {
        setLoading(false);
      }
    };

    // Fetch student's existing applications
    const fetchApplications = async () => {
      try {
        const studentId = currentUser.student.studentId;
        const result = await applicationApi.getApplicationsByStudentId(
          studentId
        );

        if (result.success) {
          setApplications(result.applications);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };

    fetchInstitutions();
    fetchApplications();
  }, [currentUser, navigate]);

  const handleOpenApplicationForm = (institution) => {
    setSelectedInstitution(institution);
    setShowApplicationForm(true);
  };

  const handleCloseApplicationForm = () => {
    setShowApplicationForm(false);
    setSelectedInstitution(null);
    setApplicationFormData({
      program: "",
      department: "",
      year: new Date().getFullYear(),
      additionalNotes: "",
    });
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!selectedInstitution) return;

    // Check if student has an NFT
    if (!userNfts || userNfts.length === 0) {
      alert(
        "You need to create a digital ID card before applying to an institution"
      );
      navigate("/create-id");
      return;
    }

    try {
      setApplyingTo(selectedInstitution.institutionId);

      // Get the latest NFT
      const latestNft =
        userNfts
          .sort((a, b) => new Date(b.mintedAt) - new Date(a.mintedAt))
          .find((nft) => nft.isLatestVersion === true) || userNfts[0];

      // Create application data
      const applicationData = {
        studentId: currentUser.student.studentId,
        institutionId: selectedInstitution.institutionId,
        programDetails: {
          program: applicationFormData.program,
          department: applicationFormData.department,
          year: applicationFormData.year,
        },
        nftTokenId: latestNft.tokenId,
        startDate: new Date().toISOString(),
        additionalInfo: {
          notes: applicationFormData.additionalNotes,
        },
      };

      // Submit application
      const result = await applicationApi.createApplication(applicationData);

      if (result.success) {
        // Add the new application to the list
        setApplications([...applications, result.application]);
        handleCloseApplicationForm();
        alert("Application submitted successfully!");
      } else {
        alert(result.error?.message || "Failed to submit application");
      }
    } catch (err) {
      console.error("Application error:", err);
      alert("Failed to submit application");
    } finally {
      setApplyingTo(null);
    }
  };

  // Get application status for an institution
  const getApplicationStatus = (institutionId) => {
    const app = applications.find((app) => app.institutionId === institutionId);
    return app ? app.status : null;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-4xl mx-auto">
        <ApplyToInstitutionHeader
          navigate={navigate}
          itemVariants={itemVariants}
        />

        <ApplyToInstitutionError error={error} itemVariants={itemVariants} />

        {loading ? (
          <ApplyToInstitutionLoading />
        ) : institutions.length === 0 ? (
          <ApplyToInstitutionEmpty itemVariants={itemVariants} />
        ) : (
          <ApplyToInstitutionList
            institutions={institutions}
            getApplicationStatus={getApplicationStatus}
            onOpenApplicationForm={handleOpenApplicationForm}
            itemVariants={itemVariants}
          />
        )}
      </div>

      {showApplicationForm && (
        <ApplyToInstitutionForm
          selectedInstitution={selectedInstitution}
          applicationFormData={applicationFormData}
          handleFormInputChange={handleFormInputChange}
          handleSubmitApplication={handleSubmitApplication}
          handleCloseApplicationForm={handleCloseApplicationForm}
          applyingTo={applyingTo}
        />
      )}
    </motion.div>
  );
};

export default ApplyToInstitutionPage;
