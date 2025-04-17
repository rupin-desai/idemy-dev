import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Shield, ExternalLink } from 'lucide-react';
import { iconSizes } from '../../utils/animations';

const InstitutionCard = ({ institution }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Building size={iconSizes.sm} className="mr-2 text-blue-600" />
            {institution.name}
          </h3>
          <span 
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              institution.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
              institution.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}
          >
            {institution.status}
          </span>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          <p><span className="font-medium">Email:</span> {institution.email}</p>
          {institution.location && (
            <p><span className="font-medium">Location:</span> {institution.location}</p>
          )}
          {institution.institutionType && (
            <p><span className="font-medium">Type:</span> {institution.institutionType}</p>
          )}
          {institution.foundingYear && (
            <p><span className="font-medium">Founded:</span> {institution.foundingYear}</p>
          )}
        </div>

        {institution.website && (
          <a 
            href={institution.website.startsWith('http') ? institution.website : `https://${institution.website}`}
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline flex items-center text-sm mb-4"
          >
            <ExternalLink size={iconSizes.sm} className="mr-1" />
            Visit Website
          </a>
        )}

        {institution.nftTokenId && (
          <div className="flex items-center text-sm text-green-600 mb-4">
            <Shield size={iconSizes.sm} className="mr-1" />
            Verified with NFT
          </div>
        )}

        <div className="mt-5 flex justify-between items-center">
          <Link 
            to={`/institutions/${institution.institutionId}`} 
            className="text-blue-600 hover:text-blue-800"
          >
            View Details
          </Link>
          
          <Link 
            to={`/institutions/${institution.institutionId}/applications`} 
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            View Applications
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InstitutionCard;