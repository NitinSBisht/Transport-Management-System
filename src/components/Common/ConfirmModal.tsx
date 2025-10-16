import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import Button from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: 'bg-red-100 text-red-600',
      button: 'danger' as const,
    },
    warning: {
      icon: 'bg-yellow-100 text-yellow-600',
      button: 'secondary' as const,
    },
    info: {
      icon: 'bg-blue-100 text-blue-600',
      button: 'primary' as const,
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4">
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentVariant.icon}`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 pb-6">
            <p className="text-gray-600 text-sm leading-relaxed ml-16">{message}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 px-6 py-4 bg-gray-50 rounded-b-lg">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              variant={currentVariant.button}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
