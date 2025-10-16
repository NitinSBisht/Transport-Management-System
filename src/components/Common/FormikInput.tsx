import React from 'react';
import { useField, FieldHookConfig } from 'formik';
import { LucideIcon } from 'lucide-react';

interface FormikInputProps {
  label?: string;
  icon?: LucideIcon;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  variant?: 'dark' | 'light';
}

const FormikInput: React.FC<FormikInputProps & FieldHookConfig<string>> = ({
  label,
  icon: Icon,
  className = '',
  type = 'text',
  placeholder,
  disabled = false,
  variant = 'dark',
  ...props
}) => {
  const [field, meta] = useField(props);
  const hasError = meta.touched && meta.error;

  const isDark = variant === 'dark';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={props.name} className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
        )}
        <input
          type={type}
          id={props.name}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            block w-full rounded-lg border
            ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2
            ${hasError 
              ? 'border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50' 
              : isDark 
                ? 'border-white/20 focus:ring-primary-400 focus:border-primary-400 bg-white/10 backdrop-blur-sm' 
                : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-white'
            }
            ${disabled ? isDark ? 'bg-white/5 cursor-not-allowed opacity-50' : 'bg-gray-100 cursor-not-allowed opacity-50' : ''}
            ${isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}
            focus:outline-none focus:ring-2
            transition-all duration-200
          `}
          {...field}
        />
      </div>
      {hasError && (
        <p className={`mt-1 text-sm flex items-center ${isDark ? 'text-red-300' : 'text-red-600'}`}>
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {meta.error}
        </p>
      )}
    </div>
  );
};

export default FormikInput;
