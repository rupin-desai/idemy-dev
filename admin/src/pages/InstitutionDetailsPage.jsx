import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building,
  ChevronLeft,
  Edit,
  Trash,
  AlertTriangle,
  Shield,
  RefreshCw,
  ClipboardList,
} from "lucide-react";
import { useInstitutions } from "../hooks/useInstitutions";
import Button from "../components/UI/Button";
import Alert from "../components/UI/Alert";
import { pageVariants, cardVariants, iconSizes } from "../utils/animations";

const InstitutionDetailsPage = () => {
  const { institutionId } = useParams();
  const navigate = useNavigate();
  const {
    getInstitutionById,
    deleteInstitution,
    mintInstitutionNFT,
    loading,
    error,
  } = useInstitutions();
  const [institution, setInstitution] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [mintingNFT, setMintingNFT] = useState(false);
  const [mintError, setMintError] = useState(null);
  const [mintSuccess, setMintSuccess] = useState(null);

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const data = await getInstitutionById(institutionId);
        setInstitution(data);
      } catch (err) {
        console.error("Failed to fetch institution:", err);
      }
    };

    fetchInstitution();
  }, [institutionId, getInstitutionById]);

  const handleDelete = async () => {
    if (deleteConfirm) {
      try {
        await deleteInstitution(institutionId);
        navigate("/institutions");
      } catch (err) {
        console.error("Failed to delete institution:", err);
      }
    } else {
      setDeleteConfirm(true);
    }
  };

  const handleMintNFT = async () => {
    try {
      setMintingNFT(true);
      setMintError(null);
      setMintSuccess(null);

      const result = await mintInstitutionNFT(institutionId);

      setMintSuccess(
        `NFT minted successfully! Token ID: ${result.nft.tokenId.substring(
          0,
          8
        )}...`
      );
      // Update institution to show new NFT
      const updatedInstitution = await getInstitutionById(institutionId);
      setInstitution(updatedInstitution);
    } catch (err) {
      console.error("Failed to mint NFT:", err);
      setMintError(err.message || "Failed to mint NFT");
    } finally {
      setMintingNFT(false);
    }
  };

  if (loading && !institution) {
    return (
      <div className="flex justify-center items-center py-20">
        <RefreshCw
          className="animate-spin text-blue-600 mr-2"
          size={iconSizes.lg}
        />
        <span className="text-lg">Loading institution data...</span>
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertTriangle size={iconSizes.xl} className="text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Institution Not Found</h2>
        <p className="text-gray-600 mb-6">
          The institution you're looking for doesn't exist or was deleted.
        </p>
        <Link to="/institutions" className="text-blue-600 hover:underline">
          Back to Institutions List
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="mb-6">
        <Link
          to="/institutions"
          className="text-blue-600 hover:underline flex items-center"
        >
          <ChevronLeft size={iconSizes.sm} className="mr-1" />
          Back to Institutions
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Building size={iconSizes.lg} className="mr-3 text-blue-600" />
          {institution.name}
        </h1>
        <div className="space-x-2">
          <Button
            onClick={() => navigate(`/institutions/${institutionId}/edit`)}
            color="primary"
            icon={<Edit size={iconSizes.sm} />}
          >
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            color="danger"
            icon={<Trash size={iconSizes.sm} />}
          >
            {deleteConfirm ? "Confirm Delete" : "Delete"}
          </Button>
        </div>
      </div>

      {deleteConfirm && (
        <Alert
          type="warning"
          message="Are you sure you want to delete this institution? This action cannot be undone."
          onClose={() => setDeleteConfirm(false)}
          show={true}
        />
      )}

      {error && (
        <Alert type="error" message={error} onClose={() => {}} show={true} />
      )}

      {mintError && (
        <Alert
          type="error"
          message={mintError}
          onClose={() => setMintError(null)}
          show={!!mintError}
        />
      )}

      {mintSuccess && (
        <Alert
          type="success"
          message={mintSuccess}
          onClose={() => setMintSuccess(null)}
          show={!!mintSuccess}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden col-span-2">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Institution Details</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium">{institution.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <p>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      institution.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : institution.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {institution.status}
                  </span>
                </p>
              </div>
              {institution.location && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="font-medium">{institution.location}</p>
                </div>
              )}
              {institution.institutionType && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Type</p>
                  <p className="font-medium">{institution.institutionType}</p>
                </div>
              )}
              {institution.foundingYear && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Founded</p>
                  <p className="font-medium">{institution.foundingYear}</p>
                </div>
              )}
              {institution.website && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Website</p>
                  <a
                    href={
                      institution.website.startsWith("http")
                        ? institution.website
                        : `https://${institution.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {institution.website}
                  </a>
                </div>
              )}
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Created At</p>
                <p className="font-medium">
                  {new Date(institution.createdAt).toLocaleString()}
                </p>
              </div>
              {institution.updatedAt && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                  <p className="font-medium">
                    {new Date(institution.updatedAt).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Contact Information */}
              {institution.contactInfo && (
                <div className="md:col-span-2 border-t pt-4 mt-4">
                  <h3 className="text-lg font-medium mb-3">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {institution.contactInfo.phone && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Phone</p>
                        <p className="font-medium">
                          {institution.contactInfo.phone}
                        </p>
                      </div>
                    )}
                    {institution.contactInfo.address && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500 mb-1">Address</p>
                        <p className="font-medium">
                          {institution.contactInfo.address}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold flex items-center">
              <Shield size={iconSizes.sm} className="mr-2" />
              Verification Status
            </h2>
          </div>
          <div className="p-6">
            {institution.nftTokenId ? (
              <div>
                <div className="flex items-center mb-4 px-3 py-2 bg-green-50 border border-green-100 rounded-md">
                  <Shield size={iconSizes.md} className="text-green-500 mr-3" />
                  <div>
                    <p className="text-green-700 font-semibold">
                      Verified Institution
                    </p>
                    <p className="text-sm text-green-600">
                      This institution has been verified with an NFT
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-1">NFT Token ID</p>
                <Link
                  to={`/nfts/${institution.nftTokenId}`}
                  className="text-blue-600 hover:underline font-mono text-sm"
                >
                  {institution.nftTokenId}
                </Link>

                <div className="mt-4">
                  <Link
                    to={`/institutions/${institutionId}/applications`}
                    className="flex items-center justify-center w-full bg-blue-100 text-blue-700 py-2 px-4 rounded hover:bg-blue-200 transition-colors"
                  >
                    <ClipboardList size={iconSizes.sm} className="mr-2" />
                    View Student Applications
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center mb-4 px-3 py-2 bg-yellow-50 border border-yellow-100 rounded-md">
                  <AlertTriangle
                    size={iconSizes.md}
                    className="text-yellow-500 mr-3"
                  />
                  <div>
                    <p className="text-yellow-700 font-semibold">
                      Not Verified
                    </p>
                    <p className="text-sm text-yellow-600">
                      This institution needs to be verified with an NFT
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleMintNFT}
                  color="success"
                  className="w-full"
                  icon={<Shield size={iconSizes.sm} />}
                  disabled={mintingNFT}
                >
                  {mintingNFT ? "Minting..." : "Mint Verification NFT"}
                </Button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  Minting an NFT verifies this institution on the blockchain and
                  allows it to verify student applications.
                </p>
              </div>
            )}

            {/* Add a section for student count if institution has verified students */}
            {institution.verifiedStudents &&
              institution.verifiedStudents.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <h3 className="font-medium mb-2">Verified Students</h3>
                  <p className="bg-blue-50 p-2 rounded text-sm flex items-center">
                    <User size={16} className="mr-2 text-blue-600" />
                    {institution.verifiedStudents.length} student(s) verified
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InstitutionDetailsPage;
