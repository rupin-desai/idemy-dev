import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Animation variants
const featureCardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
  hover: {
    scale: 1.03,
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: {
      duration: 0.2,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * FeatureMenu component for displaying a grid of feature cards
 *
 * @param {Object} props
 * @param {string} props.title - Title for the feature menu section
 * @param {Array<FeatureItem>} props.features - Array of feature items to display
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.animate - Whether to animate features (default: true)
 *
 * @typedef {Object} FeatureItem
 * @property {React.ReactNode} icon - Icon component to display
 * @property {string} title - Feature title
 * @property {string} description - Feature description
 * @property {string} path - Navigation path when clicked
 * @property {function} onClick - Optional click handler (if provided, overrides path navigation)
 * @property {string} bgColorClass - CSS class for gradient background
 * @property {string} borderColorClass - CSS class for border color
 * @property {string} iconBgClass - CSS class for icon background
 * @property {string} arrowColorClass - CSS class for arrow color
 */
const FeatureMenu = ({
  title = "Features",
  features = [],
  className = "",
  animate = true,
}) => {
  const navigate = useNavigate();

  const handleFeatureClick = (feature) => {
    if (feature.onClick) {
      feature.onClick();
    } else if (feature.path) {
      navigate(feature.path);
    }
  };

  return (
    <motion.div
      variants={animate ? containerVariants : {}}
      initial={animate ? "hidden" : false}
      animate={animate ? "visible" : false}
      className={`bg-white shadow-md rounded-lg p-6 ${className}`}
    >
      {title && (
        <h2 className="font-bold text-xl mb-4 text-gray-800">{title}</h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={animate ? featureCardVariants : {}}
            whileHover={animate ? "hover" : {}}
            className={`${
              feature.bgColorClass ||
              "bg-gradient-to-br from-gray-50 to-gray-100"
            } 
                       rounded-xl p-5 cursor-pointer 
                       ${feature.borderColorClass || "border border-gray-200"}`}
            onClick={() => handleFeatureClick(feature)}
          >
            <div className="flex items-center mb-3">
              <div
                className={`w-10 h-10 rounded-full ${
                  feature.iconBgClass || "bg-gray-600"
                } flex items-center justify-center mr-3`}
              >
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg">{feature.title}</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
            <div className="flex justify-end">
              <ArrowRight
                size={18}
                className={feature.arrowColorClass || "text-gray-600"}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FeatureMenu;
