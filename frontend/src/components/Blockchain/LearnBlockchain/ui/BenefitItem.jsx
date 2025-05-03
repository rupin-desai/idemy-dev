import React from "react";
import { CheckCircle } from "lucide-react";

const BenefitItem = ({ children }) => {
  return (
    <li className="flex items-start">
      <CheckCircle
        size={16}
        className="text-green-500 mt-1 mr-2 flex-shrink-0"
      />
      <span>{children}</span>
    </li>
  );
};

export default BenefitItem;
