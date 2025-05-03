import React from "react";
import BenefitItem from "./ui/BenefitItem";

const BlockchainBenefitsSection = () => {
  const studentBenefits = [
    "Portable digital identity across institutions",
    "Easy sharing of verified credentials with employers",
    "Protection against identity theft",
    "Reduced paperwork for verification processes",
  ];

  const institutionBenefits = [
    "Reduced fraud through cryptographic verification",
    "Lower administrative costs for credential management",
    "Enhanced reputation through verified credentials",
    "Streamlined application verification processes",
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-medium text-lg mb-2">For Students</h3>
        <ul className="space-y-2">
          {studentBenefits.map((benefit, index) => (
            <BenefitItem key={index}>{benefit}</BenefitItem>
          ))}
        </ul>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
        <h3 className="font-medium text-lg mb-2">For Institutions</h3>
        <ul className="space-y-2">
          {institutionBenefits.map((benefit, index) => (
            <BenefitItem key={index}>{benefit}</BenefitItem>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BlockchainBenefitsSection;
