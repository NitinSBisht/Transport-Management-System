import React from 'react';
import { useField, FieldHookConfig } from 'formik';
import { LucideIcon } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface FormikSelectProps {
  label?: string;
  icon?: LucideIcon;
  className?: string;
  options: SelectOption[];
  disabled?: boolean;
  placeholder?: string;
  variant?: 'dark' | 'light';
}

const FormikSelect: React.FC<FormikSelectProps & FieldHookConfig<string>> = ({
  label,
  icon: Icon,
  className = '',
  options,
  disabled = false,
  placeholder,
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
          {props.required && <span className={isDark ? 'text-red-400 ml-1' : 'text-red-500 ml-1'}>*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <Icon className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
        )}
        <select
          id={props.name}
          disabled={disabled}
          className={`
            block w-full rounded-lg border
            ${Icon ? 'pl-10' : 'pl-3'} pr-10 py-2
            ${hasError 
              ? isDark 
                ? 'border-red-400/50 focus:ring-red-400 focus:border-red-400 bg-red-500/10' 
                : 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
              : isDark
                ? 'border-white/20 focus:ring-primary-400 focus:border-primary-400 bg-white/10 backdrop-blur-sm'
                : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-white'
            }
            ${disabled 
              ? isDark 
                ? 'bg-white/5 cursor-not-allowed opacity-50' 
                : 'bg-gray-100 cursor-not-allowed opacity-50'
              : 'cursor-pointer'
            }
            ${isDark ? 'text-white' : 'text-gray-900'}
            focus:outline-none focus:ring-2
            transition-all duration-200
            appearance-none
          `}
          {...field}
        >
          {placeholder && (
            <option value="" disabled className={isDark ? 'bg-gray-800' : 'bg-white'}>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} className={isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
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

export default FormikSelect;
