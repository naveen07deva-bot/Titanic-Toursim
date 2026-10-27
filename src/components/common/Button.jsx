import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary', 'gold', 'outline', 'outline-gold', 'ghost', 'danger'
  size = 'md', // 'sm', 'md', 'lg'
  type = 'button',
  disabled = false,
  loading = false,
  icon = null,
  onClick,
  className = '',
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'gold': return 'btn-gold';
      case 'outline': return 'btn-outline';
      case 'outline-gold': return 'btn-outline-gold';
      case 'ghost': return 'btn-ghost';
      case 'danger': return 'btn-danger';
      case 'primary':
      default: return 'btn-primary';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'btn-sm';
      case 'lg': return 'btn-lg';
      default: return '';
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`btn ${getVariantClass()} ${getSizeClass()} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner" aria-label="Loading...">⏳</span>
      ) : (
        icon && <span className="btn-icon">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
