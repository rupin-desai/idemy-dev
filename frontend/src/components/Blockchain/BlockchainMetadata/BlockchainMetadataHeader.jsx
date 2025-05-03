import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database } from 'lucide-react';

const BlockchainMetadataHeader = () => {
  const navigate = useNavigate();
  
  return (
    <>
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
      </div>
    </>
  );
};

export default BlockchainMetadataHeader;