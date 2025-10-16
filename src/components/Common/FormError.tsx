import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  error: string | string[];
  className?: string;
}

const FormError: React.FC<FormErrorProps> = ({ error, className = '' }) => {
  if (!error) return null;

  const errors = Array.isArray(error) ? error : [error];

  return (
    <div className={`bg-red-500/20 border border-red-400/50 rounded-lg p-3 backdrop-blur-sm ${className}`}>
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-red-300 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          {errors.length === 1 ? (
            <p className="text-sm text-red-200">{errors[0]}</p>
          ) : (
            <ul className="text-sm text-red-200 list-disc list-inside space-y-1">
              {errors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormError;
