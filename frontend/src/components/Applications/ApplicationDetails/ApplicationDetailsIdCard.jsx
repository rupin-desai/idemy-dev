import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, Download, Eye, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ApplicationDetailsIdCard = ({
  studentData,
  application,
  idCard,
  nftData,
  itemVariants,
}) => {
  const navigate = useNavigate();
  const [imageLoading, setImageLoading] = useState(false);

  if (!studentData) return null;

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white shadow-md rounded-lg mb-6 overflow-hidden"
    >
      <div className="border-b px-6 py-4 bg-gray-50">
        <h2 className="text-xl font-semibold flex items-center">
          <Shield className="mr-2" size={20} />
          Student Digital ID Card
        </h2>
      </div>

      <div className="p-6">
        <div className="w-full max-w-md mx-auto">
          {/* NFT ID Card Image */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg mb-4">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4">
              <h3 className="font-bold text-lg flex items-center">
                <Shield size={20} className="mr-2" /> Student Digital ID
              </h3>
              <p className="text-xs opacity-80">
                Student ID: {studentData.studentId}
              </p>
            </div>

            {/* Actual NFT Image from API - direct URL */}
            <div className="relative bg-gray-50 p-4">
              {imageLoading ? (
                <div className="w-full h-64 flex items-center justify-center">
                  <Loader className="animate-spin h-8 w-8 text-indigo-600" />
                </div>
              ) : (
                <>
                  <img
                    src={`http://localhost:3000/api/nft/idcards/${
                      studentData.studentId
                    }/image?t=${Date.now()}`}
                    alt="Student ID Card"
                    className="w-full max-h-96 object-contain mx-auto"
                    onLoad={() => setImageLoading(false)}
                    onError={(e) => {
                      console.error("Failed to load image:", e.target.src);
                      setImageLoading(false);
                    }}
                  />
                </>
              )}
            </div>

            {/* Student info at the bottom */}
            <div className="p-4 border-t border-gray-200">
              <div className="text-center">
                <h3 className="font-bold text-lg">
                  {studentData.firstName} {studentData.lastName}
                </h3>
                <p className="text-gray-500 text-sm">{studentData.studentId}</p>
                <div className="mt-2 grid grid-cols-2 gap-x-4 text-sm">
                  <div>
                    <span className="text-gray-600">Program:</span>
                    <span className="font-medium ml-1">
                      {application.programDetails?.program || "General"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Year:</span>
                    <span className="font-medium ml-1">
                      {application.programDetails?.year ||
                        new Date().getFullYear()}
                    </span>
                  </div>
                </div>

                {idCard && idCard.verificationStatus === "VERIFIED" && (
                  <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-center text-green-600">
                    <CheckCircle2 size={16} className="mr-1" />
                    <span className="text-sm font-medium">
                      Verified by {idCard.verifiedInstitution}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => {
                fetch(
                  `http://localhost:3000/api/nft/idcards/${
                    studentData.studentId
                  }/image?t=${Date.now()}`
                )
                  .then((res) => res.blob())
                  .then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `ID_Card_${studentData.studentId}.png`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    a.remove();
                  })
                  .catch((err) => console.error("Download failed:", err));
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md flex items-center transition-colors"
            >
              <Download size={16} className="mr-2" />
              Download ID Card
            </button>
            {nftData && (
              <button
                onClick={() => navigate(`/nft/${nftData.tokenId}`)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center transition-colors"
              >
                <Eye className="mr-2" size={16} />
                View NFT Details
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ApplicationDetailsIdCard;
