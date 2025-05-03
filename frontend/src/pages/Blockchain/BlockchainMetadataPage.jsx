import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Database,
  FileText,
  User,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Info,
  FileCheck,
  UserPlus,
  UserCheck,
  Building,
  Clock,
  ArrowRight,
  ExternalLink,
  Shield
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import * as blockchainApi from '../../api/blockchain.api';

const BlockchainMetadataPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [filterType, setFilterType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Toggle metadata details visibility
  const toggleDetails = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  
  // Get the appropriate icon component
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'file-plus': return <FileCheck size={20} />;
      case 'refresh-cw': return <RefreshCw size={20} />;
      case 'user-plus': return <UserPlus size={20} />;
      case 'user-check': return <UserCheck size={20} />;
      case 'building': return <Building size={20} />;
      default: return <Database size={20} />;
    }
  };

  // Format date/time nicely
  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Filter metadata by type
  const getFilteredMetadata = () => {
    return metadata.filter(item => {
      // Apply type filter
      const typeMatch = filterType === 'ALL' || item.type === filterType;
      
      // Apply search filter
      const searchMatch = searchTerm.trim() === '' || 
        JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase());
      
      return typeMatch && searchMatch;
    });
  };
  
  // Get categories for filtering
  const getMetadataTypes = () => {
    const types = new Set(['ALL']);
    metadata.forEach(item => {
      if (item.type) types.add(item.type);
    });
    return Array.from(types);
  };

  useEffect(() => {
    const fetchUserMetadata = async () => {
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
          setMetadata(metadataResponse.metadata);
        } else {
          setError('Failed to load user metadata');
        }
      } catch (err) {
        console.error('Blockchain metadata fetch error:', err);
        setError(err.message || 'Failed to load blockchain metadata');
      } finally {
        setLoading(false);
      }
    };

    fetchUserMetadata();
  }, [isAuthenticated, currentUser]);

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
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
            <h1 className="text-2xl font-bold flex items-center">
              <Database size={24} className="mr-2" />
              Your Blockchain Data
            </h1>
            <p className="opacity-80 mt-1">
              Your complete history of digital identity records on the blockchain
            </p>
          </div>

          <div className="p-6">
            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search metadata..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="relative inline-block w-full md:w-auto">
                  <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                  >
                    {getMetadataTypes().map(type => (
                      <option key={type} value={type}>
                        {type === 'ALL' ? 'All Types' : type.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            
            {/* Metadata Content */}
            {loading ? (
              <div className="flex justify-center p-8">
                <Clock className="animate-spin h-8 w-8 text-indigo-600" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Error loading metadata</p>
                  <p className="mt-1 text-sm">{error}</p>
                </div>
              </div>
            ) : getFilteredMetadata().length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-100 text-yellow-700 p-4 rounded-lg flex items-center justify-center">
                <Info className="h-5 w-5 mr-2" />
                <p>No blockchain metadata found for your account</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getFilteredMetadata().map((item, index) => {
                  const isExpanded = expandedItems[item.transactionId] || false;
                  
                  // Determine background color based on metadata type
                  const getBgColor = () => {
                    switch(item.type) {
                      case 'ID_CREATION': return 'bg-green-50 border-green-100';
                      case 'ID_UPDATE': return 'bg-blue-50 border-blue-100';
                      case 'PROFILE_CREATED': return 'bg-purple-50 border-purple-100';
                      case 'PROFILE_UPDATED': return 'bg-indigo-50 border-indigo-100';
                      case 'INSTITUTION_VERIFIED': return 'bg-amber-50 border-amber-100';
                      case 'STUDENT_APPLICATION': return 'bg-teal-50 border-teal-100';
                      case 'APPLICATION_APPROVED': return 'bg-green-50 border-green-100';
                      case 'APPLICATION_BLOCKCHAIN_VERIFIED': return 'bg-purple-50 border-purple-100';
                      case 'ID_INSTITUTION_VERIFIED': return 'bg-indigo-50 border-indigo-200';
                      default: return 'bg-gray-50 border-gray-100';
                    }
                  };
                  
                  // Get icon color based on metadata type
                  const getIconColor = () => {
                    switch(item.type) {
                      case 'ID_CREATION': return 'text-green-600 bg-green-100';
                      case 'ID_UPDATE': return 'text-blue-600 bg-blue-100';
                      case 'PROFILE_CREATED': return 'text-purple-600 bg-purple-100';
                      case 'PROFILE_UPDATED': return 'text-indigo-600 bg-indigo-100';
                      case 'INSTITUTION_VERIFIED': return 'text-amber-600 bg-amber-100';
                      case 'STUDENT_APPLICATION': return 'text-teal-600 bg-teal-100';
                      case 'APPLICATION_APPROVED': return 'text-green-600 bg-green-100';
                      case 'APPLICATION_BLOCKCHAIN_VERIFIED': return 'text-purple-600 bg-purple-100';
                      case 'ID_INSTITUTION_VERIFIED': return 'text-indigo-600 bg-indigo-100';
                      default: return 'text-gray-600 bg-gray-100';
                    }
                  };
                  
                  return (
                    <div 
                      key={item.transactionId || index} 
                      className={`border rounded-lg overflow-hidden ${getBgColor()}`}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start">
                            <div className={`rounded-full p-2 mr-3 ${getIconColor()}`}>
                              {getIcon(item.icon)}
                            </div>
                            <div>
                              <h3 className="font-medium">{item.title}</h3>
                              <p className="text-sm text-gray-500">
                                {formatDateTime(item.timestamp)}
                              </p>
                              
                              {/* Display key details based on type */}
                              <div className="mt-2">
                                {item.type === 'ID_CREATION' && (
                                  <div className="text-sm">
                                    <p>ID Card Created: <span className="font-mono">{item.details.tokenId}</span></p>
                                  </div>
                                )}
                                
                                {item.type === 'ID_UPDATE' && (
                                  <div className="text-sm">
                                    <p>ID Card Updated to Version: {item.details.version}</p>
                                  </div>
                                )}
                                
                                {item.type === 'PROFILE_CREATED' && (
                                  <div className="text-sm">
                                    <p>Profile created for: {item.details.name}</p>
                                  </div>
                                )}
                                
                                {item.type === 'PROFILE_UPDATED' && (
                                  <div className="text-sm">
                                    <p>Profile updated for: {item.details.name}</p>
                                  </div>
                                )}
                                
                                {item.type === 'INSTITUTION_VERIFIED' && (
                                  <div className="text-sm">
                                    <p>Institution verified: {item.details.institutionName}</p>
                                  </div>
                                )}
                                
                                {item.type === 'STUDENT_APPLICATION' && (
                                  <div className="text-sm">
                                    <p>Application to: {item.details.institutionName}</p>
                                    <p>Program: {item.details.program}</p>
                                    <p>Status: <span className="font-medium">{item.details.status}</span></p>
                                  </div>
                                )}
                                
                                {item.type === 'APPLICATION_APPROVED' && (
                                  <div className="text-sm">
                                    <p>Application to: {item.details.institutionName}</p>
                                    <p>Program: {item.details.program}</p>
                                    <p>Status: <span className="font-medium text-green-600">APPROVED</span></p>
                                    <p>Verified by: {item.details.verifier}</p>
                                  </div>
                                )}

                                {item.type === 'APPLICATION_BLOCKCHAIN_VERIFIED' && (
                                  <div className="text-sm">
                                    <p>Application to: {item.details.institutionName}</p>
                                    <p>Program: {item.details.program}</p>
                                    <p>Status: <span className="font-medium text-purple-600">BLOCKCHAIN VERIFIED</span></p>
                                    <p>Verified by: {item.details.verifier}</p>
                                    <p className="mt-1 text-xs text-purple-500 flex items-center">
                                      <Shield size={12} className="mr-1" /> Secured on blockchain
                                    </p>
                                  </div>
                                )}

                                {item.type === 'ID_INSTITUTION_VERIFIED' && (
                                  <div className="text-sm">
                                    <p>ID Card verified by institution: {item.details.institution}</p>
                                    <p>Updated to version: {item.details.version}</p>
                                    <p className="flex items-center mt-1 text-xs text-indigo-600">
                                      <Shield size={12} className="mr-1" /> Institution Verified
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => toggleDetails(item.transactionId)}
                            className={`ml-2 px-2 py-1 rounded text-xs flex items-center ${
                              isExpanded ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {isExpanded ? (
                              <>Hide <ChevronUp size={14} className="ml-1" /></>
                            ) : (
                              <>Details <ChevronDown size={14} className="ml-1" /></>
                            )}
                          </button>
                        </div>
                        
                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-4">
                              <div>
                                <span className="text-gray-500 text-xs">Transaction ID:</span>
                                <div className="font-mono text-xs break-all">
                                  {item.transactionId}
                                </div>
                              </div>
                              
                              <div>
                                <span className="text-gray-500 text-xs">Block:</span>
                                <div className="text-xs">
                                  #{item.blockIndex}
                                </div>
                              </div>
                              
                              <div>
                                <span className="text-gray-500 text-xs">Block Hash:</span>
                                <div className="font-mono text-xs break-all">
                                  {item.blockHash?.substring(0, 16)}...
                                </div>
                              </div>
                              
                              <div>
                                <span className="text-gray-500 text-xs">Timestamp:</span>
                                <div className="text-xs">
                                  {formatDateTime(item.timestamp)}
                                </div>
                              </div>
                            </div>
                            
                            {/* Metadata details based on type */}
                            <div className="bg-white p-3 rounded-md border border-gray-200 mb-3">
                              <h4 className="text-sm font-medium mb-2">Details</h4>
                              <div className="grid grid-cols-1 gap-2">
                                {Object.entries(item.details).map(([key, value], idx) => (
                                  <div key={idx} className="flex">
                                    <span className="text-xs text-gray-500 min-w-[120px]">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                    <span className="text-xs ml-2">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Raw metadata (collapsible) */}
                            <details className="text-xs">
                              <summary className="cursor-pointer text-indigo-600 hover:text-indigo-800">
                                View Raw Metadata
                              </summary>
                              <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto mt-2 max-h-60 whitespace-pre-wrap">
                                {JSON.stringify(item.rawMetadata, null, 2)}
                              </pre>
                            </details>
                            
                            {/* Action links based on type - changed from <a> to <Link> */}
                            <div className="mt-4 flex flex-wrap gap-2">
                              {item.type === 'ID_CREATION' && (
                                <Link 
                                  to={`/nft/${item.details.tokenId}`}
                                  className="inline-flex items-center px-3 py-1 rounded-md bg-green-100 text-green-700 text-xs hover:bg-green-200 transition-colors"
                                >
                                  <FileCheck size={14} className="mr-1" />
                                  View ID Card
                                </Link>
                              )}
                              
                              {item.type === 'ID_UPDATE' && (
                                <Link 
                                  to={`/nft/${item.details.tokenId}?v=${item.details.version}`}
                                  className="inline-flex items-center px-3 py-1 rounded-md bg-blue-100 text-blue-700 text-xs hover:bg-blue-200 transition-colors"
                                >
                                  <FileCheck size={14} className="mr-1" />
                                  View Updated ID
                                </Link>
                              )}
                              
                              {(item.type === 'PROFILE_CREATED' || item.type === 'PROFILE_UPDATED') && (
                                <Link 
                                  to="/profile-data"
                                  className="inline-flex items-center px-3 py-1 rounded-md bg-purple-100 text-purple-700 text-xs hover:bg-purple-200 transition-colors"
                                >
                                  <User size={14} className="mr-1" />
                                  View Profile
                                </Link>
                              )}
                              
                              {item.type === 'STUDENT_APPLICATION' && (
                                <Link 
                                  to={`/institution-details/${item.details.institutionId}`}
                                  className="inline-flex items-center px-3 py-1 rounded-md bg-teal-100 text-teal-700 text-xs hover:bg-teal-200 transition-colors"
                                >
                                  <Building size={14} className="mr-1" />
                                  View Institution
                                </Link>
                              )}

                              {item.type === 'ID_INSTITUTION_VERIFIED' && (
                                <Link 
                                  to={`/nft/${item.details.tokenId}`}
                                  className="inline-flex items-center px-3 py-1 rounded-md bg-indigo-100 text-indigo-700 text-xs hover:bg-indigo-200 transition-colors"
                                >
                                  <Shield size={14} className="mr-1" />
                                  View Verified ID
                                </Link>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Blockchain Info - updated Link */}
            <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <FileText className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-700">
                    Understanding Your Blockchain Data
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    This page shows all your activities recorded on the IDEMY blockchain. 
                    Each record represents a transaction that created, updated, or verified 
                    your digital identity information. These records are immutable and 
                    cryptographically secure, ensuring your digital identity remains tamper-proof.
                  </p>
                  <Link 
                    to="/learn/blockchain" 
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mt-2 text-sm"
                  >
                    Learn more about blockchain technology
                    <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlockchainMetadataPage;