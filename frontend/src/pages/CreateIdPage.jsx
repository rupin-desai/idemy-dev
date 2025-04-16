// src/pages/CreateIdPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, IdCard, Upload, Check } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNft } from "../hooks/useNft";

const CreateIdPage = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { createIdCardAndMintNft, loading, error } = useNft();
  
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    idType: "STUDENT",
    expiryDate: ""
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser?.student?.studentId) {
      alert("You need to be registered as a student to create an ID card");
      return;
    }
    
    const studentId = currentUser.student.studentId;
    const formDataWithDefaults = {
      ...formData,
      fullName: formData.fullName || `${currentUser.firstName} ${currentUser.lastName}`,
      email: currentUser.email
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
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={`${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`}
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="text-xs text-slate-500 mt-1">Leave blank to use your account name</p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="idType" className="block text-sm font-medium text-slate-700 mb-1">
                  ID Type
                </label>
                <select
                  id="idType"
                  name="idType"
                  value={formData.idType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="STUDENT">Student ID</option>
                  <option value="FACULTY">Faculty ID</option>
                  <option value="STAFF">Staff ID</option>
                  <option value="VISITOR">Visitor ID</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="expiryDate" className="block text-sm font-medium text-slate-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="photo" className="block text-sm font-medium text-slate-700 mb-1">
                  Photo ID
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-slate-300 rounded-md">
                  <div className="space-y-1 text-center">
                    {photoPreview ? (
                      <div className="mb-3">
                        <img 
                          src={photoPreview} 
                          alt="ID Preview" 
                          className="h-32 mx-auto object-cover rounded" 
                        />
                      </div>
                    ) : (
                      <Upload size={36} className="mx-auto text-slate-300" />
                    )}
                    <div className="flex text-sm">
                      <label
                        htmlFor="photo"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input id="photo" name="photo" type="file" className="sr-only" onChange={handlePhotoChange} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-indigo-600 text-white px-6 py-3 rounded-md transition-colors flex items-center ${
                    loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
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
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateIdPage;