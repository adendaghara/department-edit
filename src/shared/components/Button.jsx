

import React from 'react';

const VARIANTS = {
  primary: {
    base:     'btn btn--primary',
    disabled: 'btn btn--primary btn--disabled',
  },
  danger: {
    base:     'btn btn--danger',
    disabled: 'btn btn--danger btn--disabled',
  },
  ghost: {
    base:     'btn btn--ghost',
    disabled: 'btn btn--ghost btn--disabled',
  },
  icon: {
    base:     'btn btn--icon',
    disabled: 'btn btn--icon btn--disabled',
  },
};

const SIZES = {
  sm: 'btn--sm',
  md: '',
  lg: 'btn--lg',
};

export function Button({
  children,
  variant  = 'primary',
  size     = 'md',
  disabled = false,
  loading  = false,
  onClick,
  type     = 'button',
  title,
  className = '',
}) {
  const variantClasses = VARIANTS[variant] ?? VARIANTS.primary;
  const sizeClass      = SIZES[size] ?? '';
  const stateClass     = disabled || loading ? variantClasses.disabled : variantClasses.base;
  const finalClass     = [stateClass, sizeClass, className].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={finalClass}
      disabled={disabled || loading}
      onClick={onClick}
      title={title}
      aria-disabled={disabled || loading}
    >
      {loading && <span className="btn-spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}

export default Button;
