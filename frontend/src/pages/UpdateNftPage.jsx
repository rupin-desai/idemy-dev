import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  RefreshCcw,
  AlertCircle,
  CalendarIcon,
  User,
  School,
  Shield,
} from "lucide-react";
import { useNft } from "../hooks/useNft";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

const UpdateNftPage = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { updateNftAndCreateVersion } = useNft();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [nft, setNft] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [idCard, setIdCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    status: "ACTIVE",
  });
  const [imageBase64, setImageBase64] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "";

    try {
      // Try to create a valid date
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn("Invalid date encountered:", dateString);
        return "";
      }

      // Format the date as YYYY-MM-DD for the date input
      return date.toISOString().split("T")[0];
    } catch (err) {
      console.error("Error formatting date:", err);
      return "";
    }
  };

  useEffect(() => {
    const loadNft = async () => {
      if (!isAuthenticated && !authLoading) {
        navigate("/login", { state: { from: `/update-nft/${tokenId}` } });
        return;
      }

      if (!isAuthenticated || authLoading) {
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/nft/${tokenId}`
        );

        if (response.data.success) {
          setNft(response.data.nft);

          // Also get the ID card data
          const idCardResponse = await axios.get(
            `http://localhost:3000/api/nft/idcards/${response.data.nft.studentId}`
          );

          if (idCardResponse.data.success) {
            setIdCard(idCardResponse.data.idCard);

            // Also get student data to get dateOfBirth
            const studentResponse = await axios.get(
              `http://localhost:3000/api/students/${response.data.nft.studentId}`
            );

            if (studentResponse.data.success) {
              setStudentData(studentResponse.data.student);

              // Set form data with the student's date of birth and card status
              setFormData({
                dateOfBirth: formatDate(
                  studentResponse.data.student.dateOfBirth || ""
                ),
                status: idCardResponse.data.idCard.status || "ACTIVE",
              });
            }
          }

          // Get current image for preview
          const imageUrl = `http://localhost:3000/api/nft/idcards/${response.data.nft.studentId}/image?v=${response.data.nft.version}`;
          setImagePreview(imageUrl);
        } else {
          setError("Failed to load NFT data");
        }
      } catch (err) {
        console.error("Error loading NFT:", err);
        setError(err.message || "Failed to load NFT details");
      } finally {
        setLoading(false);
      }
    };

    loadNft();
  }, [tokenId, navigate, isAuthenticated, authLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nft) return;

    try {
      setUpdating(true);
      setError(null);

      // Create update data that preserves institution verification if present
      const updateData = {
        ...formData,
        // Preserve card type from existing card
        cardType: idCard?.cardType || "STUDENT",
      };

      // If the card is institution-verified, preserve that data
      if (idCard?.verificationStatus === "VERIFIED") {
        console.log("Preserving institution verification data:", idCard);
        
        updateData.institution = idCard.verifiedInstitution;
        updateData.institutionId = idCard.verifiedInstitutionId;
        updateData.verificationDetails = idCard.verificationData;
        
        // Also explicitly set fields used by the ID card generator
        if (idCard.verificationData) {
          updateData.program = idCard.verificationData.program;
          if (idCard.verificationData.admissionDate) {
            updateData.enrollmentYear = new Date(idCard.verificationData.admissionDate).getFullYear();
          }
        }
      }

      // Always preserve cardType to avoid it getting overwritten
      updateData.cardType = idCard?.cardType || "STUDENT";

      console.log("Update data being sent:", updateData);

      const result = await updateNftAndCreateVersion(
        tokenId,
        updateData,
        imageBase64
      );

      if (result.success) {
        navigate(`/nft/${result.newVersion.tokenId}`);
      } else {
        setError(result.message || "Failed to update NFT");
      }
    } catch (err) {
      console.error("Error updating NFT:", err);
      setError(err.message || "Failed to update NFT");
    } finally {
      setUpdating(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <RefreshCcw className="animate-spin h-8 w-8 text-indigo-600 mr-2" />
        <span>Loading...</span>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          <AlertCircle className="h-8 w-8 mb-2" />
          <h2 className="text-xl font-bold mb-2">NFT Not Found</h2>
          <p>{error || "The requested NFT could not be found"}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <button
        onClick={() => navigate(`/nft/${tokenId}`)}
        className="mb-5 text-indigo-600 flex items-center"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to NFT Details
      </button>

      <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold">
            Update ID Card - Version {nft.version}
          </h1>
          <p className="opacity-80">TokenID: {tokenId}</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Student Info Summary */}
          <div className="mb-6 bg-gray-50 p-4 rounded-md">
            <h2 className="font-medium text-lg mb-2">Student Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm">
                  {studentData?.firstName} {studentData?.lastName}
                </span>
              </div>
              <div className="flex items-center">
                <School className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm">{studentData?.institution}</span>
              </div>
            </div>

            {/* Display institution verification info if present */}
            {idCard?.verificationStatus === "VERIFIED" && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-700">
                    Verified by {idCard.verifiedInstitution}
                  </span>
                </div>
                {idCard.verificationData?.program && (
                  <div className="mt-1 text-sm text-gray-600 pl-6">
                    Program: {idCard.verificationData.program}
                  </div>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Institution verification will be preserved in the new version
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-10"
                    required
                  />
                  <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="EXPIRED">Expired</option>
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Card Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {imagePreview && (
                  <div className="mt-2 border rounded-md overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="ID Preview"
                      className="w-full max-h-48 object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full flex justify-center items-center px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                >
                  {updating ? (
                    <>
                      <RefreshCcw className="animate-spin h-5 w-5 mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Create New Version
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default UpdateNftPage;
