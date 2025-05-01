import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Calendar,
  Mail,
  School,
  FileCheck,
  Clock,
  AlertCircle,
  Shield,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Database
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import * as blockchainApi from '../api/blockchain.api';

const UserMetadataPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [verificationData, setVerificationData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !currentUser) return;

      try {
        setLoading(true);
        setError(null);
        
        // Get student ID if available
        let studentId = currentUser.studentId || null;
        
        try {
          if (!studentId) {
            const studentResponse = await blockchainApi.getStudentByEmail(currentUser.email);
            if (studentResponse.success && studentResponse.studentInfo) {
              studentId = studentResponse.studentInfo.studentId;
            }
          }
        } catch (studentError) {
          console.warn('Could not fetch student ID:', studentError);
        }
        
        // Get user metadata
        const metadataResponse = await blockchainApi.getUserMetadata(studentId, currentUser.email);
        
        if (metadataResponse.success) {
          // Extract latest values from the metadata
          const latestData = extractLatestMetadata(metadataResponse.metadata);
          setUserData(latestData);
          
          // Extract verification info
          if (metadataResponse.metadata.length > 0) {
            const latestTransaction = metadataResponse.metadata[0];
            setVerificationData({
              blockIndex: latestTransaction.blockIndex,
              blockHash: latestTransaction.blockHash,
              timestamp: latestTransaction.timestamp,
              transactionId: latestTransaction.transactionId,
              lastUpdated: new Date(latestTransaction.timestamp).toLocaleString()
            });
          }
        } else {
          setError('Failed to load user metadata');
        }
      } catch (err) {
        console.error('Metadata fetch error:', err);
        setError(err.message || 'Failed to load blockchain metadata');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, currentUser]);

  // Extract latest metadata values from transaction history
  const extractLatestMetadata = (metadata) => {
    if (!metadata || metadata.length === 0) return null;
    
    const profileData = {
      firstName: '',
      lastName: '',
      fullName: '',
      email: '',
      institution: '',
      dateOfBirth: '',
      studentId: '',
      department: '',
      enrollmentYear: '',
      graduationYear: '',
      degree: '',
      major: '',
      minor: '',
      gpa: '',
      hasValidIdCard: false,
      idCardTokenId: '',
      idCardStatus: '',
      idCardExpiryDate: '',
      cardType: ''
    };
    
    // First look for profile data
    for (const item of metadata) {
      // Student profile data
      if (item.type === 'PROFILE_CREATED' || item.type === 'PROFILE_UPDATED') {
        if (item.details.name) {
          const nameParts = item.details.name.split(' ');
          profileData.firstName = nameParts[0] || '';
          profileData.lastName = nameParts.slice(1).join(' ') || '';
          profileData.fullName = item.details.name;
        }
        
        if (item.details.email && !profileData.email) {
          profileData.email = item.details.email;
        }
        
        if (item.details.studentId && !profileData.studentId) {
          profileData.studentId = item.details.studentId;
        }
        
        if (item.rawMetadata?.studentData) {
          if (item.rawMetadata.studentData.institution && !profileData.institution) {
            profileData.institution = item.rawMetadata.studentData.institution;
          }
          
          if (item.rawMetadata.studentData.dateOfBirth && !profileData.dateOfBirth) {
            profileData.dateOfBirth = new Date(item.rawMetadata.studentData.dateOfBirth).toLocaleDateString();
          }
          
          if (item.rawMetadata.studentData.department && !profileData.department) {
            profileData.department = item.rawMetadata.studentData.department;
          }
          
          if (item.rawMetadata.studentData.enrollmentYear && !profileData.enrollmentYear) {
            profileData.enrollmentYear = item.rawMetadata.studentData.enrollmentYear;
          }
          
          if (item.rawMetadata.studentData.graduationYear && !profileData.graduationYear) {
            profileData.graduationYear = item.rawMetadata.studentData.graduationYear;
          }
          
          if (item.rawMetadata.studentData.degree && !profileData.degree) {
            profileData.degree = item.rawMetadata.studentData.degree;
          }
          
          if (item.rawMetadata.studentData.major && !profileData.major) {
            profileData.major = item.rawMetadata.studentData.major;
          }
          
          if (item.rawMetadata.studentData.minor && !profileData.minor) {
            profileData.minor = item.rawMetadata.studentData.minor;
          }
          
          if (item.rawMetadata.studentData.gpa && !profileData.gpa) {
            profileData.gpa = item.rawMetadata.studentData.gpa;
          }
        }
      }
      
      // ID Card data
      if (item.type === 'ID_CREATION' || item.type === 'ID_UPDATE') {
        profileData.hasValidIdCard = true;
        
        if (item.details.tokenId && !profileData.idCardTokenId) {
          profileData.idCardTokenId = item.details.tokenId;
        }
        
        if (item.details.status && !profileData.idCardStatus) {
          profileData.idCardStatus = item.details.status;
        }
        
        if (item.rawMetadata?.cardData) {
          if (item.rawMetadata.cardData.cardType && !profileData.cardType) {
            profileData.cardType = item.rawMetadata.cardData.cardType;
          }
          
          if (item.rawMetadata.cardData.expiryDate && !profileData.idCardExpiryDate) {
            profileData.idCardExpiryDate = new Date(item.rawMetadata.cardData.expiryDate).toLocaleDateString();
          }
        }
      }
    }
    
    // Fill from user context if data is missing
    if (!profileData.fullName && currentUser) {
      profileData.firstName = currentUser.firstName || '';
      profileData.lastName = currentUser.lastName || '';
      profileData.fullName = `${profileData.firstName} ${profileData.lastName}`.trim();
    }
    
    if (!profileData.email && currentUser) {
      profileData.email = currentUser.email || '';
    }
    
    return profileData;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-5 text-indigo-600 flex items-center"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Home
        </button>

        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <h1 className="text-2xl font-bold flex items-center">
              <User size={24} className="mr-2" />
              Your Blockchain Profile
            </h1>
            <p className="opacity-80 mt-1">
              View your verified personal information stored on the blockchain
            </p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center p-8">
                <Clock className="animate-spin h-8 w-8 text-indigo-600" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Error loading data</p>
                  <p className="mt-1 text-sm">{error}</p>
                </div>
              </div>
            ) : !userData ? (
              <div className="text-center py-8 text-gray-500">
                <User size={40} className="mx-auto mb-4 text-gray-400" />
                <p>No profile data found on the blockchain</p>
                <button
                  onClick={() => navigate('/create-id')}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Create Your Digital ID
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">{userData.fullName || 'User Profile'}</h2>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <Shield size={14} className="mr-1 text-green-600" />
                      Blockchain Verified
                    </p>
                  </div>
                  
                  {verificationData && (
                    <p className="text-xs text-gray-500">
                      Last updated: {verificationData.lastUpdated}
                    </p>
                  )}
                </div>
                
                {/* Main profile data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-700 mb-4 pb-2 border-b border-gray-200">Personal Information</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <User size={14} className="mr-2" />
                          Full Name
                        </div>
                        <p className="font-medium">{userData.fullName || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <Mail size={14} className="mr-2" />
                          Email
                        </div>
                        <p className="font-medium">{userData.email || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <Calendar size={14} className="mr-2" />
                          Date of Birth
                        </div>
                        <p className="font-medium">{userData.dateOfBirth || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <FileCheck size={14} className="mr-2" />
                          Student ID
                        </div>
                        <p className="font-medium font-mono">{userData.studentId || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-700 mb-4 pb-2 border-b border-gray-200">Academic Information</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <School size={14} className="mr-2" />
                          Institution
                        </div>
                        <p className="font-medium">{userData.institution || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <School size={14} className="mr-2" />
                          Department
                        </div>
                        <p className="font-medium">{userData.department || 'N/A'}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center text-sm text-gray-500 mb-1">
                            <Calendar size={14} className="mr-2" />
                            Enrollment Year
                          </div>
                          <p className="font-medium">{userData.enrollmentYear || 'N/A'}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-sm text-gray-500 mb-1">
                            <Calendar size={14} className="mr-2" />
                            Graduation Year
                          </div>
                          <p className="font-medium">{userData.graduationYear || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <FileCheck size={14} className="mr-2" />
                          Degree
                        </div>
                        <p className="font-medium">{userData.degree || 'N/A'}</p>
                        
                        {(userData.major || userData.minor) && (
                          <div className="mt-1 text-sm">
                            {userData.major && <span>Major: {userData.major}</span>}
                            {userData.major && userData.minor && <span> | </span>}
                            {userData.minor && <span>Minor: {userData.minor}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* ID Card Information */}
                {userData.hasValidIdCard && (
                  <div className="mt-6 bg-indigo-50 p-5 rounded-lg border border-indigo-100">
                    <h3 className="font-medium text-indigo-700 mb-4 pb-2 border-b border-indigo-200 flex items-center">
                      <FileCheck size={16} className="mr-2" />
                      Digital ID Card Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-indigo-600 mb-1">ID Card Type</div>
                        <p className="font-medium">{userData.cardType || 'STUDENT'}</p>
                      </div>
                      
                      <div>
                        <div className="text-sm text-indigo-600 mb-1">Status</div>
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {userData.idCardStatus || 'ACTIVE'}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-indigo-600 mb-1">Token ID</div>
                        <p className="font-mono text-sm">{userData.idCardTokenId}</p>
                      </div>
                      
                      <div>
                        <div className="text-sm text-indigo-600 mb-1">Expiry Date</div>
                        <p className="font-medium">{userData.idCardExpiryDate || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <a 
                        href={`/nft/${userData.idCardTokenId}`}
                        className="inline-flex items-center px-3 py-1.5 text-sm border border-indigo-300 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-md"
                      >
                        <FileCheck size={14} className="mr-1.5" />
                        View ID Card
                      </a>
                    </div>
                  </div>
                )}
                
                {/* Blockchain verification details */}
                {verificationData && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="w-full flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200 text-left"
                    >
                      <div className="flex items-center">
                        <Database size={16} className="text-gray-500 mr-2" />
                        <span className="font-medium">Blockchain Verification Details</span>
                      </div>
                      {showDetails ? (
                        <ChevronUp size={16} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-500" />
                      )}
                    </button>
                    
                    {showDetails && (
                      <div className="mt-3 p-4 bg-gray-50 rounded-md border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-gray-500 mb-0.5">Transaction ID</div>
                            <p className="font-mono text-xs break-all">{verificationData.transactionId}</p>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-500 mb-0.5">Verification Time</div>
                            <p className="text-sm">{verificationData.lastUpdated}</p>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-500 mb-0.5">Block #</div>
                            <p className="text-sm">{verificationData.blockIndex}</p>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-500 mb-0.5">Block Hash</div>
                            <p className="font-mono text-xs break-all">
                              {verificationData.blockHash?.substring(0, 20)}...
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <a 
                            href="/blockchain-data"
                            className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                          >
                            View all blockchain transactions
                            <ExternalLink size={12} className="ml-1" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Actions */}
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => navigate('/update-id')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Update Your Information
                  </button>
                  
                  <button
                    onClick={() => navigate('/blockchain-data')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
                  >
                    <Database size={16} className="mr-2" />
                    View Blockchain Activity
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserMetadataPage;