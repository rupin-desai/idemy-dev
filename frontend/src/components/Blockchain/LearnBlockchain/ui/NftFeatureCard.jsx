import React from "react";

const NftFeatureCard = ({
  title,
  icon: Icon,
  iconClass,
  bgGradient,
  borderClass,
  titleClass,
  children,
}) => {
  return (
    <div className={`${bgGradient} p-5 rounded-lg ${borderClass} mb-5`}>
      <h4 className={`font-medium mb-4 ${titleClass}`}>{title}</h4>
      <div className="flex items-start mb-4">
        <div className={`${iconClass} rounded-full p-2 mr-3 flex-shrink-0`}>
          <Icon
            size={20}
            className={iconClass
              .replace("bg-", "text-")
              .replace("-100", "-600")}
          />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default NftFeatureCard;
