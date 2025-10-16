import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Button from './Button';

interface ImageUploadProps {
  label?: string;
  value?: string | File | null;
  onChange: (file: File | null, preview: string | null) => void;
  error?: string;
  disabled?: boolean;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
  className?: string;
  required?: boolean;
  variant?: 'dark' | 'light';
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  error,
  disabled = false,
  maxSize = 5, // 5MB default
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png'], // Only JPG, JPEG, PNG
  className = '',
  required = false,
  variant = 'dark',
}) => {
  const [preview, setPreview] = useState<string | null>(
    typeof value === 'string' ? value : null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDark = variant === 'dark';

  const handleFileChange = async (file: File | null) => {
    if (!file) {
      setPreview(null);
      onChange(null, null);
      return;
    }

    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      alert('Please upload only PNG, JPG, or JPEG images');
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    setIsLoading(true);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result as string;
      setPreview(previewUrl);
      onChange(file, previewUrl);
      setIsLoading(false);
    };
    reader.onerror = () => {
      alert('Failed to read file');
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files?.[0] || null;
    handleFileChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={`
          relative border-2 border-dashed rounded-lg transition-all duration-200
          ${isDragging 
            ? 'border-primary-500 bg-primary-50' 
            : error 
              ? 'border-red-400 bg-red-50' 
              : isDark 
                ? 'border-white/20 bg-white/5' 
                : 'border-gray-300 bg-white'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary-400'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-2" />
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Loading image...
            </p>
          </div>
        ) : preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-contain rounded-lg p-4"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
              <Button
                type="button"
                variant="danger"
                size="sm"
                icon={X}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              isDark ? 'bg-white/10' : 'bg-gray-100'
            }`}>
              <Upload className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Click to upload or drag and drop
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              PNG, JPG, JPEG up to {maxSize}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className={`mt-1 text-sm flex items-center ${isDark ? 'text-red-300' : 'text-red-600'}`}>
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
