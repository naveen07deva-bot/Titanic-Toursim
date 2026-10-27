import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  icon = null,
  helperText,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="form-input-wrapper">
        {icon && <div className="form-input-icon">{icon}</div>}
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`form-input ${icon ? 'has-icon' : ''} ${error ? 'is-invalid' : ''}`}
          aria-invalid={!!error}
          {...props}
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
});

Input.displayName = 'Input';
