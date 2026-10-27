import React from 'react';
import { Calendar } from 'lucide-react';

export const DatePicker = ({
  label,
  name,
  value,
  onChange,
  minDate,
  maxDate,
  required = false,
  error,
  helperText,
  disabled = false,
  className = ''
}) => {
  // Default minimum date to today
  const today = new Date().toISOString().split('T')[0];
  const effectiveMin = minDate || today;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="form-input-wrapper">
        <div className="form-input-icon">
          <Calendar size={18} />
        </div>
        <input
          id={name}
          name={name}
          type="date"
          value={value || ''}
          min={effectiveMin}
          max={maxDate}
          onChange={onChange}
          disabled={disabled}
          className={`form-input has-icon ${error ? 'is-invalid' : ''}`}
        />
      </div>
      {error && (
        <div className="form-error-msg">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
      {!error && helperText && (
        <small style={{ fontSize: '0.78rem', color: 'var(--color-text-light)', marginTop: '0.3rem', display: 'block' }}>
          {helperText}
        </small>
      )}
    </div>
  );
};
