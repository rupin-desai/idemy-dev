// Page transition variants
export const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

// Card variants
export const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
  hover: {
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    y: -3,
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.98 },
};

// List item variants
export const listItemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  hover: {
    backgroundColor: "rgba(249, 250, 251, 1)",
    x: 5,
    transition: { duration: 0.2 },
  },
};

// Button variants
export const buttonVariants = {
  initial: { opacity: 0.9 },
  animate: { opacity: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

// Table row variants
export const tableRowVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  hover: { backgroundColor: "rgba(249, 250, 251, 1)" },
};

// Alert variants
export const alertVariants = {
  initial: { opacity: 0, height: 0, marginBottom: 0 },
  animate: {
    opacity: 1,
    height: "auto",
    marginBottom: "1.5rem",
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginBottom: 0,
    transition: { duration: 0.2 },
  },
};

// Icon size standards
export const iconSizes = {
  xs: 14,
  sm: 18,
  md: 20,
  lg: 24,
  xl: 32,
};
