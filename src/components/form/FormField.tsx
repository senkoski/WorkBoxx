import React from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  formatter?: (value: string) => string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  helpText,
  formatter
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = formatter ? formatter(e.target.value) : e.target.value;
    onChange(newValue);
  };

  return (
    <div className="form-field">
      <label 
        htmlFor={id} 
        className={`form-label ${required ? 'form-label-required' : ''}`}
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={handleChange}
        className={`form-input ${error ? 'form-input-error' : ''}`}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
      />
      {error && (
        <div id={`${id}-error`} className="form-error" role="alert">
          {error}
        </div>
      )}
      {helpText && !error && (
        <div id={`${id}-help`} className="form-help-text">
          {helpText}
        </div>
      )}
    </div>
  );
};
