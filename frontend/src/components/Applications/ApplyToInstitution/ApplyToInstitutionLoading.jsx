import React from "react";

const ApplyToInstitutionLoading = () => {
  return (
    <div className="text-center py-10">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
      <p className="mt-2 text-gray-600">Loading institutions...</p>
    </div>
  );
};

export default ApplyToInstitutionLoading;
