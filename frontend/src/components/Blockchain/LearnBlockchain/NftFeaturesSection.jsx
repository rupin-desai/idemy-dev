import React from "react";
import {
  Cpu,
  UserCircle,
  School,
  History,
  Briefcase,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import NftFeatureCard from "./ui/NftFeatureCard";

const NftFeaturesSection = () => {
  return (
    <>
      <div>
        <h3 className="text-xl font-semibold flex items-center text-indigo-700">
          <Cpu className="mr-2" size={20} />
          NFT-Powered Digital IDs
        </h3>
        <p className="mt-2">
          IDEMY leverages Non-Fungible Tokens (NFTs) to represent digital
          identities and credentials. Unlike regular NFTs that often represent
          digital art, our NFTs contain secure, verifiable identity information
          with advanced features:
        </p>
      </div>

      <NftFeatureCard
        title="Student ID NFT Minting"
        icon={UserCircle}
        iconClass="bg-indigo-100"
        bgGradient="bg-gradient-to-r from-purple-50 to-indigo-50"
        borderClass="border border-indigo-100"
        titleClass="text-indigo-900"
      >
        <p className="text-sm">
          When a student's identity is verified by their institution, a digital
          ID is created and "minted" as an NFT on the IDEMY blockchain. This
          process:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
          <li>
            Creates a unique token ID that represents the student's identity
          </li>
          <li>Securely stores identity metadata with privacy controls</li>
          <li>
            Generates a visually appealing digital ID card with the student's
            information
          </li>
          <li>
            Records the minting transaction on the blockchain for future
            verification
          </li>
        </ul>

        <div className="bg-white p-3 rounded-lg shadow-sm mt-4">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            Technical Example: NFT Minting
          </div>
          <code className="text-xs bg-gray-50 p-2 rounded block overflow-auto">
            {`// NFT minted for student ID: STU_38f9a2c7
                tokenId: NFT_75e2d889c3b4f56a
                institution: Harvard University
                timestamp: 2025-04-15T14:32:18Z
                signature: 0xf82a67b3c59d5e9082b...
                blockchain transaction: 0x7c3a52e8...`}
          </code>
        </div>
      </NftFeatureCard>

      <NftFeatureCard
        title="Institution Verification NFTs"
        icon={School}
        iconClass="bg-green-100"
        bgGradient="bg-gradient-to-r from-emerald-50 to-green-50"
        borderClass="border border-green-100"
        titleClass="text-green-900"
      >
        <p className="text-sm">
          Educational institutions on IDEMY are also verified through NFT
          technology. Each institution:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
          <li>
            Receives a unique verification NFT that proves their authenticity
          </li>
          <li>
            Can digitally sign student credentials using their
            blockchain-verified identity
          </li>
          <li>
            Displays a verification badge on their profile visible to all users
          </li>
          <li>
            Can revoke or update credentials they've issued when necessary
          </li>
        </ul>
        <p className="text-sm mt-2 text-green-700 font-medium">
          This creates a chain of trust: verified institutions can issue
          verified student credentials.
        </p>

        <div className="bg-white p-3 rounded-lg shadow-sm mt-4">
          <div className="flex items-center mb-2">
            <ShieldCheck size={16} className="text-green-500 mr-2" />
            <span className="text-sm font-medium">
              Institution NFT Benefits
            </span>
          </div>
          <ul className="text-xs space-y-1 text-gray-700">
            <li>
              • Prevents impersonation of legitimate educational institutions
            </li>
            <li>
              • Establishes trusted relationships between institutions and
              students
            </li>
            <li>• Enables seamless verification of institutional authority</li>
            <li>
              • Creates a global, decentralized registry of verified educational
              providers
            </li>
          </ul>
        </div>
      </NftFeatureCard>

      <NftFeatureCard
        title="NFT Updates & Versioning System"
        icon={History}
        iconClass="bg-amber-100"
        bgGradient="bg-gradient-to-r from-amber-50 to-yellow-50"
        borderClass="border border-yellow-100"
        titleClass="text-amber-900"
      >
        <p className="text-sm">
          IDEMY's unique NFT versioning system allows student credentials to be
          updated while maintaining a complete history:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
          <li>
            When information changes (e.g., graduation status, new
            qualifications), new versions are created
          </li>
          <li>
            Each version is linked to previous versions, creating an immutable
            history trail
          </li>
          <li>
            Institutions can update credentials without invalidating the
            original issuance
          </li>
          <li>
            Students maintain access to all historical versions of their
            credentials
          </li>
        </ul>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-white p-2 rounded border border-gray-200 text-center text-xs">
            <div className="font-medium">Version 1</div>
            <div className="text-gray-500">Initial ID Card</div>
            <div className="text-gray-400">Jun 2023</div>
          </div>
          <div className="bg-white p-2 rounded border border-gray-200 text-center text-xs">
            <div className="font-medium">Version 2</div>
            <div className="text-gray-500">Bachelor's Degree Added</div>
            <div className="text-gray-400">May 2024</div>
          </div>
          <div className="bg-white p-2 rounded border border-indigo-200 text-center text-xs">
            <div className="font-medium">Version 3</div>
            <div className="text-gray-500">New Certification</div>
            <div className="text-gray-400">Apr 2025</div>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          Example of NFT version history
        </p>
      </NftFeatureCard>

      <NftFeatureCard
        title="Credential Verification & Authentication"
        icon={Briefcase}
        iconClass="bg-blue-100"
        bgGradient="bg-gradient-to-r from-blue-50 to-cyan-50"
        borderClass="border border-blue-100"
        titleClass="text-blue-900"
      >
        <p className="text-sm">
          Organizations and employers can easily verify credentials through
          IDEMY's verification system:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
          <li>
            Scan a QR code or enter a credential ID to verify authenticity
          </li>
          <li>Check if a credential was issued by a verified institution</li>
          <li>View the complete history of updates to a credential</li>
          <li>
            Verify the current status of a credential (active, revoked, expired)
          </li>
        </ul>

        <div className="mt-3 bg-white p-3 rounded border border-gray-200 flex items-center">
          <div className="bg-gradient-to-b from-green-400 to-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0">
            <CheckCircle size={16} />
          </div>
          <div className="text-xs">
            <div className="font-medium">Verified Status</div>
            <div className="text-gray-500">
              This credential was verified on the IDEMY blockchain and is
              authentic
            </div>
          </div>
        </div>
      </NftFeatureCard>
    </>
  );
};

export default NftFeaturesSection;
