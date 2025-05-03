import React from "react";
import { motion } from "framer-motion";
import {
  Building,
  School,
  MapPin,
  Calendar,
  Globe,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

const ApplyToInstitutionCard = ({
  institution,
  applicationStatus,
  onOpenApplicationForm,
}) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden"
      whileHover={{
        y: -2,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="p-6 border-b flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Building className="mr-2" size={20} />
            {institution.name}
            {institution.nftTokenId && (
              <span className="ml-2 bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full">
                Verified
              </span>
            )}
          </h3>

          <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600">
            <div className="flex items-center">
              <School className="mr-1" size={14} />
              <span>
                {institution.institutionType || "Educational Institution"}
              </span>
            </div>

            {institution.location && (
              <div className="flex items-center">
                <MapPin className="mr-1" size={14} />
                <span>{institution.location}</span>
              </div>
            )}

            {institution.foundingYear && (
              <div className="flex items-center">
                <Calendar className="mr-1" size={14} />
                <span>Est. {institution.foundingYear}</span>
              </div>
            )}

            {institution.website && (
              <div className="flex items-center">
                <Globe className="mr-1" size={14} />
                <a
                  href={
                    institution.website.startsWith("http")
                      ? institution.website
                      : `https://${institution.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  Website
                </a>
              </div>
            )}
          </div>
        </div>

        <div>
          {applicationStatus ? (
            <div
              className={`
                px-4 py-2 rounded-md text-sm font-medium flex items-center
                ${
                  applicationStatus === "APPROVED"
                    ? "bg-green-100 text-green-800"
                    : ""
                }
                ${
                  applicationStatus === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : ""
                }
                ${
                  applicationStatus === "REJECTED"
                    ? "bg-red-100 text-red-800"
                    : ""
                }
              `}
            >
              {applicationStatus === "APPROVED" && (
                <CheckCircle2 size={16} className="mr-1" />
              )}
              {applicationStatus === "PENDING" && (
                <Clock size={16} className="mr-1" />
              )}
              {applicationStatus === "REJECTED" && (
                <AlertCircle size={16} className="mr-1" />
              )}

              {applicationStatus === "APPROVED" ? "Application Approved" : ""}
              {applicationStatus === "PENDING" ? "Application Pending" : ""}
              {applicationStatus === "REJECTED" ? "Application Rejected" : ""}
            </div>
          ) : (
            <button
              onClick={() => onOpenApplicationForm(institution)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>

      {applicationStatus && (
        <div className="px-6 py-3 bg-gray-50">
          <p className="text-sm text-gray-600">
            {applicationStatus === "APPROVED" &&
              "Your application has been approved. Check your digital ID for verification status."}
            {applicationStatus === "PENDING" &&
              "Your application is pending review. You will be notified when it is processed."}
            {applicationStatus === "REJECTED" &&
              "Your application was not approved. You may contact the institution for more information."}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ApplyToInstitutionCard;
