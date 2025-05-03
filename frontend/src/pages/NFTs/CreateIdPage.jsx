// src/pages/CreateIdPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, IdCard, Check, Loader } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNft } from "../../hooks/useNft";
import axios from "axios";

// Add this utility function at the top of your file (after imports, before component)
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  // If it's already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // Otherwise, try to convert to proper format
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Invalid date
    
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  } catch (err) {
    console.error("Error formatting date:", err);
    return '';
  }
};

const CreateIdPage = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { createIdCardAndMintNft, loading, error } = useNft();
  
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    idType: "STUDENT"
  });
  const [success, setSuccess] = useState(false);
  const [blockchainInfo, setBlockchainInfo] = useState(null);
  const [loadingBlockchain, setLoadingBlockchain] = useState(true);
  const [blockchainError, setBlockchainError] = useState(null);

  // Fetch student info from blockchain
  useEffect(() => {
    const fetchBlockchainStudentInfo = async () => {
      if (!currentUser?.email) return;
      
      setLoadingBlockchain(true);
      try {
        const encodedEmail = encodeURIComponent(currentUser.email);
        const response = await axios.get(
          `http://localhost:3000/api/blockchain/student-by-email/${encodedEmail}`
        );
        
        if (response.data.success) {
          setBlockchainInfo(response.data.studentInfo);
          
          // Update form data with formatted date of birth
          if (currentUser?.student?.dateOfBirth) {
            setFormData(prev => ({
              ...prev,
              dateOfBirth: formatDateForInput(currentUser.student.dateOfBirth)
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching blockchain student info:', err);
        setBlockchainError('Could not retrieve student information from blockchain');
      } finally {
        setLoadingBlockchain(false);
      }
    };
    
    if (isAuthenticated && currentUser?.email) {
      fetchBlockchainStudentInfo();
    }
  }, [currentUser, isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser?.student?.studentId) {
      alert("You need to be registered as a student to create an ID card");
      return;
    }
    
    const studentId = currentUser.student.studentId;
    // Use full name from blockchain if available, otherwise use from user profile
    const fullName = blockchainInfo?.firstName && blockchainInfo?.lastName 
      ? `${blockchainInfo.firstName} ${blockchainInfo.lastName}`
      : `${currentUser.firstName || ''} ${currentUser.lastName || ''}`;
    
    const formDataWithDefaults = {
      ...formData,
      fullName,
      email: currentUser.email,
      institution: blockchainInfo?.institution || currentUser.student?.institution || '',
      department: blockchainInfo?.department || currentUser.student?.department || '',
    };
    
    try {
      await createIdCardAndMintNft(studentId, formDataWithDefaults);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error("Failed to create ID:", err);
    }
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="max-w-2xl mx-auto bg-green-50 p-8 rounded-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-700 mb-2">Success!</h1>
          <p className="text-green-600 mb-6">Your digital ID card has been created and an NFT has been minted successfully.</p>
          <p className="text-slate-500 text-sm">Redirecting to home page...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="mb-5 text-indigo-600 flex items-center"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Home
        </button>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-6">
            <h1 className="text-2xl font-bold flex items-center">
              <IdCard size={24} className="mr-2" />
              Create Your Digital ID
            </h1>
            <p className="opacity-80 mt-1">
              Fill in your details to create a blockchain-secured ID card
            </p>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            
            {loadingBlockchain ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader className="animate-spin h-8 w-8 text-indigo-600 mb-3" />
                <p className="text-slate-500">Loading your student information...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Display the name from blockchain (read-only) */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name (from blockchain)
                  </label>
                  <input
                    type="text"
                    value={blockchainInfo ? 
                      `${blockchainInfo.firstName || ''} ${blockchainInfo.lastName || ''}` : 
                      `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`
                    }
                    className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-700"
                    disabled
                    readOnly
                  />
                  <p className="text-xs text-slate-500 mt-1">This information is retrieved from blockchain</p>
                </div>
                
                {/* Institution info from blockchain */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={blockchainInfo?.institution || currentUser?.student?.institution || ''}
                    className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-700"
                    disabled
                    readOnly
                  />
                </div>
                
                {/* Date of birth is now read-only */}
                <div className="mb-6">
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-700"
                    disabled
                    readOnly
                  />
                  {formData.dateOfBirth && (
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(formData.dateOfBirth).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">This information is retrieved from your student registration</p>
                </div>
                
                {/* Hidden field for ID type */}
                <input type="hidden" name="idType" value="STUDENT" />
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading || blockchainError}
                    className={`bg-indigo-600 text-white px-6 py-3 rounded-md transition-colors flex items-center ${
                      (loading || blockchainError) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Create and Mint NFT
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateIdPage;