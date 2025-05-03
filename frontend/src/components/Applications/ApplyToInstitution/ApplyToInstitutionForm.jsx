import React from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

const ApplyToInstitutionForm = ({
  selectedInstitution,
  applicationFormData,
  handleFormInputChange,
  handleSubmitApplication,
  handleCloseApplicationForm,
  applyingTo,
}) => {
  if (!selectedInstitution) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <BookOpen size={20} className="mr-2" />
          Apply to {selectedInstitution.name}
        </h2>

        <form onSubmit={handleSubmitApplication}>
          <div className="mb-4">
            <label
              htmlFor="program"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Program <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="program"
              name="program"
              value={applicationFormData.program}
              onChange={handleFormInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Computer Science, Business Administration"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={applicationFormData.department}
              onChange={handleFormInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Engineering, Business School"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Year <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={applicationFormData.year}
              onChange={handleFormInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min={new Date().getFullYear()}
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="additionalNotes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Additional Notes
            </label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              value={applicationFormData.additionalNotes}
              onChange={handleFormInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Any additional information you'd like to share"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCloseApplicationForm}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={applyingTo === selectedInstitution.institutionId}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${
                applyingTo === selectedInstitution.institutionId
                  ? "opacity-70 cursor-wait"
                  : ""
              }`}
            >
              {applyingTo === selectedInstitution.institutionId ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ApplyToInstitutionForm;
