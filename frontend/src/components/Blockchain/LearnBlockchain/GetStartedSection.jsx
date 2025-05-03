import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, AlertTriangle } from "lucide-react";

const GetStartedSection = () => {
  return (
    <div className="space-y-4">
      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
        <p className="mb-3">
          Now that you understand how blockchain powers our secure digital IDs,
          take the next step:
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700 transition-colors"
          >
            Create Your Digital ID
            <ChevronRight size={16} className="ml-1" />
          </Link>
          <Link
            to="/blockchain-data"
            className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-purple-700 transition-colors"
          >
            View Blockchain Activity
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>

      <div className="flex items-start bg-yellow-50 p-4 rounded-lg border border-yellow-100">
        <AlertTriangle
          size={20}
          className="text-yellow-600 mr-2 flex-shrink-0 mt-1"
        />
        <p className="text-sm">
          <span className="font-medium">Note:</span> To create and use a digital
          ID, you must be a verified student or affiliated with a recognized
          institution in our system.
        </p>
      </div>
    </div>
  );
};

export default GetStartedSection;
