import React from "react";
import {
  UserCheck,
  CheckCircle,
  FileCheck,
  RefreshCw,
  Shield,
  Award,
} from "lucide-react";
import BenefitItem from "./ui/BenefitItem";

const BlockchainForIdentitySection = () => {
  const idUsesBenefits = [
    "Self-sovereignty - You control your own identity data",
    "Privacy - You choose what to share and with whom",
    "Security - Cryptographic protection against tampering",
    "Verifiability - Easy validation without contacting the issuing institution",
  ];

  const idemyFeatures = [
    {
      icon: <FileCheck size={20} className="text-indigo-600" />,
      title: "Credential Issuance",
      description:
        "When your institution issues your digital ID, it's minted as an NFT (Non-Fungible Token) on the blockchain with a unique identifier",
    },
    {
      icon: <RefreshCw size={20} className="text-indigo-600" />,
      title: "Updates & Versioning",
      description:
        "Any updates to your ID are recorded as new versions, maintaining a complete history of changes",
    },
    {
      icon: <Shield size={20} className="text-indigo-600" />,
      title: "Verification",
      description:
        "Anyone you share your ID with can instantly verify its authenticity by checking the blockchain record",
    },
    {
      icon: <Award size={20} className="text-indigo-600" />,
      title: "Credential Management",
      description:
        "Your blockchain wallet contains all your verified credentials, making them easily accessible and shareable",
    },
  ];

  return (
    <>
      <div>
        <h3 className="text-xl font-semibold flex items-center text-indigo-700">
          <UserCheck className="mr-2" size={20} />
          Why Use Blockchain for Digital IDs?
        </h3>
        <p className="mt-2">
          Traditional ID systems are centralized and vulnerable to data
          breaches, fraud, and unauthorized access. Blockchain addresses these
          issues by providing:
        </p>
        <ul className="mt-2 space-y-2">
          {idUsesBenefits.map((benefit, index) => (
            <BenefitItem key={index}>{benefit}</BenefitItem>
          ))}
        </ul>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <h4 className="font-medium mb-3">How IDEMY Uses Blockchain</h4>
        <div className="space-y-3">
          {idemyFeatures.map((feature, index) => (
            <div key={index} className="flex items-start">
              <div className="bg-indigo-100 rounded-full p-2 mr-3 flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <h5 className="font-medium">{feature.title}</h5>
                <p className="text-sm mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BlockchainForIdentitySection;
