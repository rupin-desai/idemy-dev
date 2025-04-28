import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Building,
  Info,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Globe,
  School,
  Calendar 
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNft } from "../hooks/useNft";
import * as institutionApi from "../api/institution.api";
import * as applicationApi from "../api/application.api";

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
    transition: {
      duration: 0.5,
    },
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

  useEffect(() => {
    // Check if user is a student
    if (!currentUser?.student?.studentId) {
      navigate("/create-student");
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
        const result = await applicationApi.getApplicationsByStudentId(studentId);
        
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

  const handleApply = async (institution) => {
    // Check if student has an NFT
    if (!userNfts || userNfts.length === 0) {
      alert("You need to create a digital ID card before applying to an institution");
      navigate("/create-id");
      return;
    }

    try {
      setApplyingTo(institution.institutionId);

      // Get the latest NFT
      const latestNft = userNfts
        .sort((a, b) => new Date(b.mintedAt) - new Date(a.mintedAt))
        .find((nft) => nft.isLatestVersion === true) || userNfts[0];

      // Create application data
      const applicationData = {
        studentId: currentUser.student.studentId,
        institutionId: institution.institutionId,
        programDetails: {
          program: "General Application",
          year: new Date().getFullYear()
        },
        nftTokenId: latestNft.tokenId,
        startDate: new Date().toISOString()
      };

      // Submit application
      const result = await applicationApi.createApplication(applicationData);

      if (result.success) {
        // Add the new application to the list
        setApplications([...applications, result.application]);
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

  // Check if student has applied to an institution
  const hasApplied = (institutionId) => {
    return applications.some(app => 
      app.institutionId === institutionId && 
      (app.status === "PENDING" || app.status === "APPROVED")
    );
  };

  // Get application status for an institution
  const getApplicationStatus = (institutionId) => {
    const app = applications.find(app => app.institutionId === institutionId);
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
        <motion.div
          variants={itemVariants}
          className="mb-6"
        >
          <button
            onClick={() => navigate("/")}
            className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center"
          >
            &larr; Back to Home
          </button>
          
          <h1 className="text-3xl font-bold">Apply to Institutions</h1>
          <p className="text-gray-600 mt-2">
            Apply to verified institutions with your blockchain-secured digital ID
          </p>
        </motion.div>

        {error && (
          <motion.div 
            variants={itemVariants}
            className="bg-red-50 border-l-4 border-red-500 p-4 mb-6"
          >
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading institutions...</p>
          </div>
        ) : institutions.length === 0 ? (
          <motion.div 
            variants={itemVariants}
            className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center"
          >
            <Info className="h-10 w-10 text-blue-500 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-blue-800">No Institutions Available</h2>
            <p className="text-blue-600">
              There are no verified institutions available for application at the moment.
            </p>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            <div className="grid gap-6">
              {institutions.map((institution) => {
                const applicationStatus = getApplicationStatus(institution.institutionId);
                const alreadyApplied = hasApplied(institution.institutionId);
                
                return (
                  <motion.div
                    key={institution.institutionId}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                    whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="p-6 border-b flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                          <Building className="mr-2" size={20} />
                          {institution.name}
                          {institution.nftTokenId && (
                            <span className="ml-2 bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full">
                              Verified
                            </span>
                          )}
                        </h3>
                        
                        <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <School className="mr-1" size={14} />
                            <span>{institution.institutionType || "Educational Institution"}</span>
                          </div>
                          
                          {institution.location && (
                            <div className="flex items-center">
                              <MapPin className="mr-1" size={14} />
                              <span>{institution.location}</span>
                            </div>
                          )}
                          
                          {institution.foundingYear && (
                            <div className="flex items-center">
                              <Calendar className="mr-1" size={14} />
                              <span>Est. {institution.foundingYear}</span>
                            </div>
                          )}
                          
                          {institution.website && (
                            <div className="flex items-center">
                              <Globe className="mr-1" size={14} />
                              <a 
                                href={institution.website.startsWith('http') ? institution.website : `https://${institution.website}`} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline"
                              >
                                Website
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        {applicationStatus ? (
                          <div className={`
                            px-4 py-2 rounded-md text-sm font-medium flex items-center
                            ${applicationStatus === 'APPROVED' ? 'bg-green-100 text-green-800' : ''}
                            ${applicationStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${applicationStatus === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
                          `}>
                            {applicationStatus === 'APPROVED' && <CheckCircle2 size={16} className="mr-1" />}
                            {applicationStatus === 'PENDING' && <Clock size={16} className="mr-1" />}
                            {applicationStatus === 'REJECTED' && <AlertCircle size={16} className="mr-1" />}
                            {applicationStatus === 'APPROVED' ? 'Application Approved' : ''}
                            {applicationStatus === 'PENDING' ? 'Application Pending' : ''}
                            {applicationStatus === 'REJECTED' ? 'Application Rejected' : ''}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleApply(institution)}
                            disabled={applyingTo === institution.institutionId}
                            className={`
                              bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md
                              flex items-center transition-colors
                              ${applyingTo === institution.institutionId ? 'opacity-70 cursor-wait' : ''}
                            `}
                          >
                            {applyingTo === institution.institutionId ? (
                              <>
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Applying...
                              </>
                            ) : (
                              <>Apply Now</>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {applicationStatus && (
                      <div className="px-6 py-3 bg-gray-50">
                        <p className="text-sm text-gray-600">
                          {applicationStatus === 'APPROVED' && 'Your application has been approved. Check your digital ID for verification status.'}
                          {applicationStatus === 'PENDING' && 'Your application is pending review. You will be notified when it is processed.'}
                          {applicationStatus === 'REJECTED' && 'Your application was not approved. You may contact the institution for more information.'}
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ApplyToInstitutionPage;