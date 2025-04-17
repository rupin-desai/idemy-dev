import React from 'react';
import { motion } from 'framer-motion';
import { cardVariants } from '../../utils/animations';

const Card = ({ 
  children, 
  className = '', 
  title, 
  titleClass = '', 
  interactive = true,
  onHeaderClick = null,
  headerRight = null,
  headerBgClass = 'bg-gray-50',
  bodyClass = 'p-6'
}) => {
  return (
    <motion.div 
      className={`bg-white rounded-lg shadow-md overflow-hidden mb-6 ${className}`}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={interactive ? "hover" : undefined}
      whileTap={interactive && onHeaderClick ? "tap" : undefined}
    >
      {title && (
        <div 
          className={`px-6 py-4 border-b ${headerBgClass} flex justify-between items-center ${onHeaderClick ? 'cursor-pointer' : ''}`}
          onClick={onHeaderClick}
        >
          <h2 className={`text-xl font-semibold ${titleClass}`}>{title}</h2>
          {headerRight}
        </div>
      )}
      <div className={bodyClass}>{children}</div>
    </motion.div>
  );
};

export default Card;