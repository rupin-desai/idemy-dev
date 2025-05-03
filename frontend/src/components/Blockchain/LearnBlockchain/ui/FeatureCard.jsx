import React from "react";
import { LucideIcon } from "lucide-react";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  bgColorClass,
  borderColorClass,
}) => {
  return (
    <div
      className={`flex flex-col items-center text-center p-3 ${bgColorClass} rounded-lg ${borderColorClass}`}
    >
      <Icon className="h-8 w-8 text-blue-600 mb-2" />
      <h5 className="font-medium">{title}</h5>
      <p className="text-sm mt-1">{description}</p>
    </div>
  );
};

export default FeatureCard;
