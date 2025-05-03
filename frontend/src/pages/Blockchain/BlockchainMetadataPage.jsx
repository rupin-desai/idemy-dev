import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import * as blockchainApi from '../../api/blockchain.api';

// Import components
import {
  BlockchainMetadataHeader,
  BlockchainMetadataFilters,
  BlockchainMetadataItem,
  BlockchainMetadataLoading,
  BlockchainMetadataError,
  BlockchainMetadataEmpty,
  BlockchainMetadataInfo
} from '../../components/Blockchain/BlockchainMetadata';

const BlockchainMetadataPage = () => {
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
        <BlockchainMetadataHeader />

        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            {/* Filters and Search */}
            <BlockchainMetadataFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterType={filterType}
              setFilterType={setFilterType}
              metadataTypes={getMetadataTypes()}
            />
            
            {/* Metadata Content */}
            {loading ? (
              <BlockchainMetadataLoading />
            ) : error ? (
              <BlockchainMetadataError error={error} />
            ) : getFilteredMetadata().length === 0 ? (
              <BlockchainMetadataEmpty />
            ) : (
              <div className="space-y-4">
                {getFilteredMetadata().map((item, index) => (
                  <BlockchainMetadataItem 
                    key={item.transactionId || index}
                    item={item}
                    isExpanded={expandedItems[item.transactionId] || false}
                    toggleDetails={toggleDetails}
                    formatDateTime={formatDateTime}
                  />
                ))}
              </div>
            )}
            
            {/* Blockchain Info */}
            <BlockchainMetadataInfo />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlockchainMetadataPage;