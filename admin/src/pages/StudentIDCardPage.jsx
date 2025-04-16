// src/pages/StudentIDCardPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNFTs } from '../hooks/useNFTs';
import { useStudents } from '../hooks/useStudents';
import IDCardForm from '../components/IDCardForm';

const StudentIDCardPage = () => {
  const { studentId } = useParams();
  const { currentStudent, fetchStudentById } = useStudents();
  const { 
    idCard, 
    studentNFTs, 
    loading, 
    error, 
    fetchIDCardByStudentId, 
    fetchNFTsByStudentId,
    createIDCard,
    mintNFT
  } = useNFTs();
  
  const [showIDCardForm, setShowIDCardForm] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [isMinting, setIsMinting] = useState(false);

  useEffect(() => {
    if (studentId) {
      fetchStudentById(studentId);
      loadStudentIDCardData();
    }
  }, [studentId, fetchStudentById]);

  const loadStudentIDCardData = async () => {
    try {
      await fetchNFTsByStudentId(studentId);
      try {
        await fetchIDCardByStudentId(studentId);
      } catch (err) {
        // ID card might not exist yet, that's OK
        console.log("ID card not found, may need to be created");
      }
    } catch (err) {
      console.error("Error loading student ID card data:", err);
    }
  };

  const handleCreateIDCard = async (formData) => {
    try {
      setActionError(null);
      await createIDCard(studentId, formData);
      setActionSuccess("ID card created successfully!");
      setShowIDCardForm(false);
      // Refresh data
      await loadStudentIDCardData();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to create ID card. Please try again.");
    }
  };

  const handleMintNFT = async () => {
    try {
      setActionError(null);
      setIsMinting(true);
      await mintNFT(studentId);
      setActionSuccess("NFT minted successfully!");
      // Refresh data
      await loadStudentIDCardData();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to mint NFT. Please try again.");
    } finally {
      setIsMinting(false);
    }
  };

  if (loading && !currentStudent) {
    return <div className="text-center py-10">Loading student data...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to={`/students/${studentId}`} className="text-blue-600 hover:text-blue-900">
          ← Back to Student
        </Link>
        <h1 className="text-3xl font-bold">Student ID Card</h1>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {actionError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{actionError}</p>
        </div>
      )}

      {actionSuccess && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
          <p>{actionSuccess}</p>
        </div>
      )}

      {currentStudent && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {currentStudent.firstName} {currentStudent.lastName} - {currentStudent.studentId}
          </h2>
          <p className="text-gray-500">Manage ID card and NFT for this student.</p>
        </div>
      )}

      {!idCard && !showIDCardForm ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">ID Card</h2>
            <button
              onClick={() => setShowIDCardForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Create ID Card
            </button>
          </div>
          <p className="mt-2 text-gray-500">This student does not have an ID card yet.</p>
        </div>
      ) : showIDCardForm ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create ID Card</h2>
          <IDCardForm onSubmit={handleCreateIDCard} />
          <button
            onClick={() => setShowIDCardForm(false)}
            className="mt-4 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-semibold">ID Card</h2>
            <div>
              {!studentNFTs.length && (
                <button
                  onClick={handleMintNFT}
                  disabled={isMinting}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  {isMinting ? 'Minting...' : 'Mint NFT'}
                </button>
              )}
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div>
                <p className="text-sm text-gray-500">Card Number</p>
                <p className="font-medium">{idCard.cardNumber}</p>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500">Card Type</p>
                <p className="font-medium">{idCard.cardType}</p>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500">Issue Date</p>
                <p className="font-medium">{new Date(idCard.issueDate).toLocaleDateString()}</p>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500">Expiry Date</p>
                <p className="font-medium">{new Date(idCard.expiryDate).toLocaleDateString()}</p>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500">Status</p>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  idCard.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {idCard.status}
                </span>
              </div>
              
              {idCard.nftTokenId && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">NFT Token ID</p>
                  <Link to={`/nfts/${idCard.nftTokenId}`} className="text-blue-600 hover:text-blue-900 font-mono">
                    {idCard.nftTokenId}
                  </Link>
                </div>
              )}
            </div>
            
            <div>
              {idCard.imageUri && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">ID Card Image</p>
                  <img 
                    src={`http://localhost:3000${idCard.imageUri}`} 
                    alt="ID Card" 
                    className="max-w-full h-auto border rounded-md shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {studentNFTs.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-xl font-semibold">NFT Details</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minted At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentNFTs.map((nft) => (
                  <tr key={nft.tokenId}>
                    <td className="px-6 py-4 whitespace-nowrap font-mono">
                      {nft.tokenId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {nft.ownerAddress.substring(0, 10)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(nft.mintedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        nft.status === 'MINTED' ? 'bg-green-100 text-green-800' : 
                        nft.status === 'TRANSFERRED' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {nft.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/nfts/${nft.tokenId}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        <Link
                          to={`/nfts/${nft.tokenId}/verify`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Verify
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentIDCardPage;