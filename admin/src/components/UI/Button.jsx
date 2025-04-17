import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { buttonVariants, iconSizes } from '../../utils/animations';

const Button = ({ 
  children, 
  onClick, 
  type = 'button',
  color = 'primary', // primary, secondary, danger, success
  icon = null,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  fullWidth = false,
  size = 'md' // sm, md, lg
}) => {
  const colorClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  
  const iconSizeByButtonSize = {
    sm: iconSizes.xs,
    md: iconSizes.sm,
    lg: iconSizes.md,
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`rounded-md font-medium flex items-center justify-center transition-colors ${colorClasses[color]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      variants={buttonVariants}
      initial="initial"
      animate="animate"
      whileHover={!disabled && !loading ? "hover" : undefined}
      whileTap={!disabled && !loading ? "tap" : undefined}
    >
      {loading && (
        <RefreshCw className={iconPosition === 'left' ? 'mr-2 animate-spin' : 'ml-2 animate-spin'} size={iconSizeByButtonSize[size]} />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </motion.button>
  );
};

export default Button;