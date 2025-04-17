import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ClipboardCheck,
  Building,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Shield,
} from "lucide-react";
import { useApplications } from "../hooks/useApplications";
import { useStudents } from "../hooks/useStudents";
import { useInstitutions } from "../hooks/useInstitutions";
import { pageVariants, cardVariants, iconSizes } from "../utils/animations";
import Button from "../components/UI/Button";
import Alert from "../components/UI/Alert";

const ApplicationDetailsPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const {
    getApplicationById,
    updateApplicationStatus,
    verifyApplication,
    loading,
    error,
  } = useApplications();
  const { fetchStudentById } = useStudents();
  const { getInstitutionById } = useInstitutions();

  const [application, setApplication] = useState(null);
  const [student, setStudent] = useState(null);
  const [institution, setInstitution] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [verifyingOnBlockchain, setVerifyingOnBlockchain] = useState(false);
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [verificationData, setVerificationData] = useState({
    verifierNotes: "",
    programConfirmed: true,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    additionalDetails: {},
  });

  useEffect(() => {
    const loadApplicationData = async () => {
      try {
        const applicationData = await getApplicationById(applicationId);
        setApplication(applicationData);

        try {
          const studentData = await fetchStudentById(applicationData.studentId);
          setStudent(studentData);
        } catch (err) {
          console.error("Failed to load student data:", err);
        }

        try {
          const institutionData = await getInstitutionById(
            applicationData.institutionId
          );
          setInstitution(institutionData);
        } catch (err) {
          console.error("Failed to load institution data:", err);
        }
      } catch (err) {
        console.error("Failed to load application:", err);
      }
    };

    if (applicationId) {
      loadApplicationData();
    }
  }, [applicationId, getApplicationById, fetchStudentById, getInstitutionById]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setVerificationData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: inputValue,
        },
      }));
    } else {
      setVerificationData((prev) => ({
        ...prev,
        [name]: inputValue,
      }));
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      setActionError(null);
      setActionSuccess(null);

      // For rejections, we don't need verification data
      // For approvals, we need to use the form data
      const dataToUse = status === "APPROVED" ? verificationData : {};

      await updateApplicationStatus(applicationId, status, dataToUse);

      // Refresh application data
      const updatedApp = await getApplicationById(applicationId);
      setApplication(updatedApp);

      // Hide form if it was open
      setShowApproveForm(false);

      setActionSuccess(`Application ${status.toLowerCase()} successfully`);
    } catch (err) {
      setActionError(
        err.message || `Failed to ${status.toLowerCase()} application`
      );
    }
  };

  const handleVerifyOnBlockchain = async () => {
    try {
      setActionError(null);
      setActionSuccess(null);
      setVerifyingOnBlockchain(true);

      await verifyApplication(applicationId);

      // Refresh application data
      const updatedApp = await getApplicationById(applicationId);
      setApplication(updatedApp);

      setActionSuccess("Application verified on blockchain successfully");
    } catch (err) {
      setActionError(err.message || "Failed to verify on blockchain");
    } finally {
      setVerifyingOnBlockchain(false);
    }
  };

  // Status icon and colors helper
  const getStatusDisplay = (status) => {
    switch (status) {
      case "APPROVED":
        return {
          icon: <CheckCircle2 size={iconSizes.md} className="text-green-500" />,
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          label: "Approved",
        };
      case "REJECTED":
        return {
          icon: <XCircle size={iconSizes.md} className="text-red-500" />,
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          label: "Rejected",
        };
      default:
        return {
          icon: <Clock size={iconSizes.md} className="text-yellow-500" />,
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          label: "Pending",
        };
    }
  };

  if (loading && !application) {
    return (
      <div className="flex justify-center items-center py-20">
        <Clock
          className="animate-spin text-blue-600 mr-2"
          size={iconSizes.lg}
        />
        <span className="text-lg">Loading application data...</span>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center text-red-600 mb-4">
          <XCircle size={iconSizes.md} className="mr-2" />
          <h2 className="text-xl font-semibold">Application Not Found</h2>
        </div>
        <p className="mb-6 text-gray-600">
          The requested application could not be found.
        </p>
        <Link
          to="/applications"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <ChevronLeft size={iconSizes.sm} className="mr-1" />
          Back to Applications
        </Link>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay(application.status);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="mb-6">
        <Link
          to="/applications"
          className="text-blue-600 hover:underline flex items-center"
        >
          <ChevronLeft size={iconSizes.sm} className="mr-1" />
          Back to Applications
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <ClipboardCheck size={iconSizes.lg} className="mr-3 text-blue-600" />
          <h1 className="text-3xl font-bold">Application Details</h1>
        </div>
        <div className="flex items-center">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center ${statusDisplay.bgColor} ${statusDisplay.textColor}`}
          >
            {statusDisplay.icon}
            <span className="ml-1">{statusDisplay.label}</span>
          </span>
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => {}} show={true} />
      )}

      {actionError && (
        <Alert
          type="error"
          message={actionError}
          onClose={() => setActionError(null)}
          show={!!actionError}
        />
      )}

      {actionSuccess && (
        <Alert
          type="success"
          message={actionSuccess}
          onClose={() => setActionSuccess(null)}
          show={!!actionSuccess}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="bg-white shadow-md rounded-lg overflow-hidden col-span-2"
          variants={cardVariants}
        >
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Application Information</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Application ID</p>
                <p className="font-medium">{application.applicationId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Submitted</p>
                <p className="font-medium">
                  {new Date(application.submittedAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Building size={iconSizes.sm} className="mr-2 text-blue-600" />
                Institution
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="font-medium">{application.institutionName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">ID</p>
                  <Link
                    to={`/institutions/${application.institutionId}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {application.institutionId}
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <User size={iconSizes.sm} className="mr-2 text-blue-600" />
                Student
              </h3>
              {student ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Name</p>
                    <p className="font-medium">
                      {student.firstName} {student.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">ID</p>
                    <Link
                      to={`/students/${application.studentId}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {application.studentId}
                    </Link>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium">{student.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Loading student information...</p>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Calendar size={iconSizes.sm} className="mr-2 text-blue-600" />
                Program Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Program</p>
                  <p className="font-medium">
                    {application.programDetails?.program}
                  </p>
                </div>
                {application.programDetails?.level && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Level</p>
                    <p className="font-medium">
                      {application.programDetails.level}
                    </p>
                  </div>
                )}
                {application.programDetails?.department && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Department</p>
                    <p className="font-medium">
                      {application.programDetails.department}
                    </p>
                  </div>
                )}
                {application.startDate && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Expected Start</p>
                    <p className="font-medium">
                      {new Date(application.startDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {application.additionalInfo &&
              Object.keys(application.additionalInfo).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">
                    Additional Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {application.additionalInfo.notes && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Notes</p>
                        <p className="font-medium">
                          {application.additionalInfo.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {application.status === "APPROVED" &&
              application.verificationData && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center text-green-700">
                    <CheckCircle2
                      size={iconSizes.md}
                      className="mr-2 text-green-600"
                    />
                    Approval Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-green-50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Approved At</p>
                      <p className="font-medium">
                        {new Date(
                          application.verificationData.verifiedAt
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Program Confirmed
                      </p>
                      <p className="font-medium">
                        {application.verificationData.programConfirmed
                          ? "Yes"
                          : "No"}
                      </p>
                    </div>
                    {application.verificationData.startDate && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Start Date</p>
                        <p className="font-medium">
                          {new Date(
                            application.verificationData.startDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {application.verificationData.endDate && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Expected End Date
                        </p>
                        <p className="font-medium">
                          {new Date(
                            application.verificationData.endDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {application.verificationData.verifierNotes && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500 mb-1">
                          Verifier Notes
                        </p>
                        <p className="font-medium">
                          {application.verificationData.verifierNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>
        </motion.div>

        <motion.div
          className="bg-white shadow-md rounded-lg overflow-hidden"
          variants={cardVariants}
        >
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Actions</h2>
          </div>
          <div className="p-6">
            {application.status === "PENDING" && (
              <div>
                <div className="flex flex-col space-y-4">
                  <Button
                    onClick={() => setShowApproveForm(!showApproveForm)}
                    color="success"
                    className="w-full"
                    icon={<CheckCircle2 size={iconSizes.sm} />}
                  >
                    {showApproveForm
                      ? "Cancel Approval"
                      : "Approve Application"}
                  </Button>

                  <Button
                    onClick={() => handleStatusUpdate("REJECTED")}
                    color="danger"
                    className="w-full"
                    icon={<XCircle size={iconSizes.sm} />}
                  >
                    Reject Application
                  </Button>
                </div>

                {showApproveForm && (
                  <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-medium mb-4">
                      Approval Details
                    </h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleStatusUpdate("APPROVED");
                      }}
                    >
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Program Confirmation
                        </label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="programConfirmed"
                            checked={verificationData.programConfirmed}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-600">
                            I confirm the student is enrolled in{" "}
                            {application.programDetails?.program}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={verificationData.startDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expected End Date
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={verificationData.endDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Verifier Notes
                        </label>
                        <textarea
                          name="verifierNotes"
                          value={verificationData.verifierNotes}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Optional notes about this verification"
                        ></textarea>
                      </div>

                      <Button
                        type="submit"
                        color="success"
                        className="w-full"
                        icon={<CheckCircle2 size={iconSizes.sm} />}
                      >
                        Confirm Approval
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {application.status === "APPROVED" && (
              <div>
                {application.transactionId ? (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Shield
                        size={iconSizes.md}
                        className="text-green-600 mr-2"
                      />
                      <h3 className="text-green-800 font-medium">
                        Blockchain Verified
                      </h3>
                    </div>
                    <p className="text-sm text-green-700 mb-2">
                      This application has been verified on the blockchain.
                    </p>
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-1">
                        Transaction ID
                      </p>
                      <p className="bg-white p-2 rounded text-xs font-mono break-all border border-green-200">
                        {application.transactionId}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                      <div className="flex items-center">
                        <Shield
                          size={iconSizes.md}
                          className="text-yellow-600 mr-2"
                        />
                        <h3 className="text-yellow-800 font-medium">
                          Blockchain Verification Required
                        </h3>
                      </div>
                      <p className="text-sm text-yellow-700 mt-2">
                        This approved application needs to be verified on the
                        blockchain to create an immutable record.
                      </p>
                    </div>

                    <Button
                      onClick={handleVerifyOnBlockchain}
                      color="primary"
                      className="w-full"
                      icon={<Shield size={iconSizes.sm} />}
                      disabled={verifyingOnBlockchain}
                    >
                      {verifyingOnBlockchain
                        ? "Verifying..."
                        : "Verify on Blockchain"}
                    </Button>
                  </div>
                )}

                <div className="mt-6">
                  <Button
                    onClick={() =>
                      navigate(`/students/${application.studentId}/id-card`)
                    }
                    color="secondary"
                    className="w-full"
                  >
                    View Student ID Card
                  </Button>
                </div>
              </div>
            )}

            {application.status === "REJECTED" && (
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <XCircle size={iconSizes.md} className="text-red-600 mr-2" />
                  <h3 className="text-red-800 font-medium">
                    Application Rejected
                  </h3>
                </div>
                <p className="text-sm text-red-700">
                  This application has been rejected and cannot be approved or
                  verified.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ApplicationDetailsPage;
