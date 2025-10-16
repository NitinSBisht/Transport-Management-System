import React from 'react';
import { CardProps } from '../../types';

const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  subtitle,
  className = '',
  padding = 'default',
  hover = false 
}) => {
  const paddingClasses: Record<string, string> = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  };

  return (
    <div 
      className={`
        bg-white rounded-lg shadow-md border border-gray-200
        ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
