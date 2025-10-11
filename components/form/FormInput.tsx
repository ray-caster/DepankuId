'use client';

import { useState } from 'react';

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  type?: 'text' | 'email' | 'url' | 'date';
  maxLength?: number;
  minLength?: number;
  className?: string;
  helpText?: string;
}

export function FormInput({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  required,
  placeholder,
  type = 'text',
  maxLength,
  minLength,
  className = '',
  helpText,
}: FormInputProps) {
  const [touched, setTouched] = useState(false);
  const showError = touched && error;

  const handleBlur = () => {
    setTouched(true);
    onBlur?.();
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-foreground">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        minLength={minLength}
        required={required}
        className={`w-full px-4 py-3 bg-neutral-50 border-2 rounded-soft focus-ring transition-colors
          ${showError ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-primary-500'}
          ${className}`}
        aria-invalid={showError ? 'true' : 'false'}
        aria-describedby={showError ? `${name}-error` : helpText ? `${name}-help` : undefined}
      />

      <div className="flex items-center justify-between min-h-[20px]">
        <div className="flex-1">
          {showError ? (
            <p id={`${name}-error`} className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : helpText ? (
            <p id={`${name}-help`} className="text-sm text-neutral-600">
              {helpText}
            </p>
          ) : null}
        </div>
        
        {maxLength && (
          <span className={`text-xs tabular-nums ${
            value.length > maxLength * 0.9 ? 'text-amber-600 font-medium' : 'text-neutral-500'
          }`}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

