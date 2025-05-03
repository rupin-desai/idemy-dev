import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  AlertCircle,
  Building,
  School,
  MapPin,
  Globe,
  Phone,
  Mail,
  Calendar,
  FileText,
  Shield,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import * as institutionApi from "../../api/institution.api"; // Import the institution API service

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, translateY: 20 },
  visible: {
    opacity: 1,
    translateY: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const InstitutionRegistrationPage = () => {
  const { currentUser, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: currentUser?.email || "",
    location: "",
    institutionType: "University",
    foundingYear: new Date().getFullYear(),
    website: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.location) {
      setError("Name, email, and location are required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Prepare the request payload
      const institutionData = {
        name: formData.name,
        email: formData.email,
        location: formData.location,
        institutionType: formData.institutionType,
        foundingYear: parseInt(formData.foundingYear, 10),
        website: formData.website,
        contactInfo: {
          phone: formData.phone,
          address: formData.address,
        },
      };

      // Use the API service instead of directly calling axios
      const response = await institutionApi.createInstitution(institutionData);

      if (response.success && response.institution) {
        // Store generated institution ID
        setGeneratedId(response.institution.institutionId);

        // Update user profile with institution information if needed
        await updateProfile({
          ...currentUser,
          institution: {
            institutionId: response.institution.institutionId,
            name: response.institution.name,
          },
          role: "institution",
        });

        setSuccess(true);

        // Redirect after a delay
        setTimeout(() => {
          navigate(`/institution/${response.institution.institutionId}`);
        }, 3000);
      } else {
        // Handle error from API service
        setError(
          response.error?.message ||
            "Failed to register institution. Please try again."
        );
      }
    } catch (err) {
      console.error("Institution registration error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="inline-block p-3 bg-purple-100 rounded-full mb-4">
            <Building size={32} className="text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Institution Registration
          </h1>
          <p className="text-gray-600 mt-2">
            Register your educational institution to issue blockchain-verified
            credentials
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex items-center">
                <AlertCircle size={20} className="mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <CheckCircle size={20} className="mr-2" />
                  <span className="font-medium">
                    Institution registered successfully!
                  </span>
                </div>
                {generatedId && (
                  <div className="mt-2 ml-7">
                    <p>
                      Your institution ID:{" "}
                      <span className="font-medium text-purple-700">
                        {generatedId}
                      </span>
                    </p>
                    <p className="text-sm mt-1">
                      Please save this ID for your records.
                    </p>
                  </div>
                )}
                <p className="ml-7 mt-2 text-sm">
                  Redirecting to your institution dashboard...
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Institution Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <School size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    placeholder="e.g., Harvard University"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                      placeholder="university@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                      placeholder="e.g., Cambridge, MA"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="institutionType"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Institution Type
                  </label>
                  <select
                    id="institutionType"
                    name="institutionType"
                    value={formData.institutionType}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  >
                    <option value="University">University</option>
                    <option value="College">College</option>
                    <option value="School">School</option>
                    <option value="Technical Institute">
                      Technical Institute
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="foundingYear"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Founding Year
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="foundingYear"
                      name="foundingYear"
                      value={formData.foundingYear}
                      onChange={handleChange}
                      min="1000"
                      max={new Date().getFullYear()}
                      className="pl-10 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Website
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    placeholder="https://www.example.edu"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Contact Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    placeholder="+1 (123) 456-7890"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Physical Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  placeholder="Street address, City, State, Zip"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mt-6">
                <div className="flex">
                  <Shield className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-700 font-medium">
                      Verification Process
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      After registration, your institution will be in a pending
                      state. Once verified, your institution will receive a
                      blockchain-verified NFT that proves authenticity.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isSubmitting || success}
                className={`w-full flex justify-center items-center bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-4 rounded-md ${
                  isSubmitting || success ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Building size={18} className="mr-2" />
                    Register Institution
                  </span>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-start">
            <FileText className="h-5 w-5 text-gray-600 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium">
                Benefits of Institution Registration
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li>
                  • Issue blockchain-verified credentials to your students
                </li>
                <li>• Verify student applications through a secure portal</li>
                <li>
                  • Protect your institution's reputation with tamper-proof
                  verification
                </li>
                <li>• Enable seamless credential verification for employers</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InstitutionRegistrationPage;
