import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
}) => {
  const sizes = {
    sm: {
      switch: 'w-9 h-5',
      circle: 'w-4 h-4',
      translate: 'translate-x-4',
    },
    md: {
      switch: 'w-11 h-6',
      circle: 'w-5 h-5',
      translate: 'translate-x-5',
    },
    lg: {
      switch: 'w-14 h-7',
      circle: 'w-6 h-6',
      translate: 'translate-x-7',
    },
  };

  const currentSize = sizes[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`
        ${currentSize.switch}
        relative inline-flex items-center rounded-full
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${checked ? 'bg-green-500' : 'bg-gray-300'}
      `}
    >
      <span
        className={`
          ${currentSize.circle}
          inline-block rounded-full bg-white shadow-lg
          transform transition-transform duration-200 ease-in-out
          ${checked ? currentSize.translate : 'translate-x-0.5'}
        `}
      />
    </button>
  );
};

export default ToggleSwitch;
