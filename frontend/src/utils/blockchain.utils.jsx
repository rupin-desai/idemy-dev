import React from "react";
import {
  FileCheck,
  User,
  Building,
  Shield,
  UserPlus,
  UserCheck,
  RefreshCw,
  Database,
} from "lucide-react";

/**
 * Get the icon component based on icon name
 * @param {string} iconName - The name of the icon
 * @returns {JSX.Element} The icon component
 */
export const getIconComponent = (iconName) => {
  switch (iconName) {
    case "file-plus":
      return <FileCheck size={20} />;
    case "refresh-cw":
      return <RefreshCw size={20} />;
    case "user-plus":
      return <UserPlus size={20} />;
    case "user-check":
      return <UserCheck size={20} />;
    case "building":
      return <Building size={20} />;
    case "shield":
      return <Shield size={20} />;
    default:
      return <Database size={20} />;
  }
};

/**
 * Configuration object for different metadata types
 */
export const METADATA_CONFIG = {
  ID_CREATION: {
    bgColor: "bg-green-50 border-green-100",
    iconColor: "text-green-600 bg-green-100",
    icon: "file-plus",
    detailComponent: (details) => (
      <div className="text-sm">
        <p>
          ID Card Created: <span className="font-mono">{details.tokenId}</span>
        </p>
      </div>
    ),
    actionLink: (details) => ({
      to: `/nft/${details.tokenId}`,
      bgColor: "bg-green-100 text-green-700 hover:bg-green-200",
      icon: <FileCheck size={14} className="mr-1" />,
      text: "View ID Card",
    }),
  },
  ID_UPDATE: {
    bgColor: "bg-blue-50 border-blue-100",
    iconColor: "text-blue-600 bg-blue-100",
    icon: "refresh-cw",
    detailComponent: (details) => (
      <div className="text-sm">
        <p>ID Card Updated to Version: {details.version}</p>
      </div>
    ),
    actionLink: (details) => ({
      to: `/nft/${details.tokenId}?v=${details.version}`,
      bgColor: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      icon: <FileCheck size={14} className="mr-1" />,
      text: "View Updated ID",
    }),
  },
  PROFILE_CREATED: {
    bgColor: "bg-purple-50 border-purple-100",
    iconColor: "text-purple-600 bg-purple-100",
    icon: "user-plus",
    detailComponent: (details) => (
      <div className="text-sm">
        <p>Profile created for: {details.name}</p>
      </div>
    ),
    actionLink: () => ({
      to: "/profile-data",
      bgColor: "bg-purple-100 text-purple-700 hover:bg-purple-200",
      icon: <User size={14} className="mr-1" />,
      text: "View Profile",
    }),
  },
  PROFILE_UPDATED: {
    bgColor: "bg-indigo-50 border-indigo-100",
    iconColor: "text-indigo-600 bg-indigo-100",
    icon: "user-check",
    detailComponent: (details) => (
      <div className="text-sm">
        <p>Profile updated for: {details.name}</p>
      </div>
    ),
    actionLink: () => ({
      to: "/profile-data",
      bgColor: "bg-purple-100 text-purple-700 hover:bg-purple-200",
      icon: <User size={14} className="mr-1" />,
      text: "View Profile",
    }),
  },
  INSTITUTION_VERIFIED: {
    bgColor: "bg-amber-50 border-amber-100",
    iconColor: "text-amber-600 bg-amber-100",
    icon: "building",
    detailComponent: (details) => (
      <div className="text-sm">
        <p>Institution verified: {details.institutionName}</p>
      </div>
    ),
  },
  STUDENT_APPLICATION: {
    bgColor: "bg-teal-50 border-teal-100",
    iconColor: "text-teal-600 bg-teal-100",
    icon: "file-plus",
    detailComponent: (details) => (
      <div className="text-sm">
        <p>Application to: {details.institutionName}</p>
        <p>Program: {details.program}</p>
        <p>
          Status: <span className="font-medium">{details.status}</span>
        </p>
      </div>
    ),
    actionLink: (details) => ({
      to: `/institution-details/${details.institutionId}`,
      bgColor: "bg-teal-100 text-teal-700 hover:bg-teal-200",
      icon: <Building size={14} className="mr-1" />,
      text: "View Institution",
    }),
  },
  APPLICATION_APPROVED: {
    bgColor: "bg-green-50 border-green-100",
    iconColor: "text-green-600 bg-green-100",
    icon: "check-circle",
    detailComponent: (details) => (
      <div className="text-sm">
        <p>Application to: {details.institutionName}</p>
        <p>Program: {details.program}</p>
        <p>
          Status: <span className="font-medium text-green-600">APPROVED</span>
        </p>
        <p>Verified by: {details.verifier}</p>
      </div>
    ),
  },
  APPLICATION_BLOCKCHAIN_VERIFIED: {
    bgColor: "bg-purple-50 border-purple-100",
    iconColor: "text-purple-600 bg-purple-100",
    icon: "shield",
    detailComponent: (details) => (
      <div className="text-sm">
        <p>Application to: {details.institutionName}</p>
        <p>Program: {details.program}</p>
        <p>
          Status:{" "}
          <span className="font-medium text-purple-600">
            BLOCKCHAIN VERIFIED
          </span>
        </p>
        <p>Verified by: {details.verifier}</p>
        <p className="mt-1 text-xs text-purple-500 flex items-center">
          <Shield size={12} className="mr-1" /> Secured on blockchain
        </p>
      </div>
    ),
  },
  ID_INSTITUTION_VERIFIED: {
    bgColor: "bg-indigo-50 border-indigo-200",
    iconColor: "text-indigo-600 bg-indigo-100",
    icon: "shield",
    detailComponent: (details) => (
      <div className="text-sm">
        <p>ID Card verified by institution: {details.institution}</p>
        <p>Updated to version: {details.version}</p>
        <p className="flex items-center mt-1 text-xs text-indigo-600">
          <Shield size={12} className="mr-1" /> Institution Verified
        </p>
      </div>
    ),
    actionLink: (details) => ({
      to: `/nft/${details.tokenId}`,
      bgColor: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
      icon: <Shield size={14} className="mr-1" />,
      text: "View Verified ID",
    }),
  },
  DEFAULT: {
    bgColor: "bg-gray-50 border-gray-100",
    iconColor: "text-gray-600 bg-gray-100",
    icon: "database",
    detailComponent: () => null,
  },
};
