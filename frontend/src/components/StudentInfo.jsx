import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Loader } from 'lucide-react';
import axios from 'axios';

const StudentInfo = ({ currentUser }) => {
  const [blockchainInfo, setBlockchainInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlockchainStudentInfo = async () => {
      if (!currentUser?.email) return;
      
      setLoading(true);
      try {
        // Encode email for URL safety
        const encodedEmail = encodeURIComponent(currentUser.email);
        const response = await axios.get(
          `http://localhost:3000/api/blockchain/student-by-email/${encodedEmail}`
        );
        
        if (response.data.success) {
          setBlockchainInfo(response.data.studentInfo);
        }
      } catch (err) {
        console.error('Error fetching blockchain student info:', err);
        // Don't show error in UI - blockchain verification is optional
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlockchainStudentInfo();
  }, [currentUser?.email]);
  
  if (!currentUser?.student?.studentId && !blockchainInfo) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100"
    >
      <h3 className="font-medium text-lg flex items-center text-indigo-700">
        <GraduationCap size={20} className="mr-2" />
        Student Information
      </h3>
      
      {loading ? (
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <Loader size={14} className="animate-spin mr-2" />
          Loading blockchain data...
        </div>
      ) : (
        <div className="mt-2 space-y-2">
          {currentUser?.student?.studentId && (
            <div>
              <p className="text-sm text-gray-500">System Student ID:</p>
              <p className="font-medium">{currentUser.student.studentId}</p>
            </div>
          )}
          
          {blockchainInfo && (
            <div>
              <p className="text-sm text-gray-500">Blockchain Verified ID:</p>
              <p className="font-medium">{blockchainInfo.studentId}</p>
              <p className="text-xs text-gray-500 mt-1">
                Registered on {new Date(blockchainInfo.timestamp).toLocaleDateString()}
              </p>
            </div>
          )}
          
          {currentUser?.student?.institution && (
            <div>
              <p className="text-sm text-gray-500">Institution:</p>
              <p>{currentUser.student.institution}</p>
            </div>
          )}
          
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </div>
      )}
    </motion.div>
  );
};

export default StudentInfo;