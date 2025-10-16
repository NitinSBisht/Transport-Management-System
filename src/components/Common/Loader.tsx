import React from 'react';
import { LoaderProps } from '../../types';

const Loader: React.FC<LoaderProps> = ({ size = 'md', fullScreen = false, text = '' }) => {
  const sizes: Record<string, string> = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  };

  const loader = (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizes[size]} border-primary-200 border-t-primary-600 rounded-full animate-spin`}
      ></div>
      {text && <p className="mt-4 text-gray-600 text-sm">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader;
