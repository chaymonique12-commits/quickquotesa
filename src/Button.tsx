import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-150 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark disabled:opacity-50',
    secondary: 'bg-white text-primary border-2 border-primary hover:bg-orange-50 disabled:opacity-50',
    ghost: 'bg-transparent text-primary hover:bg-orange-50',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-touch',
    md: 'px-4 py-3 text-base min-h-touch',
    lg: 'px-6 py-4 text-lg min-h-touch',
  };

  return (
    <button
      className={baseStyles + ' ' + variants[variant] + ' ' + sizes[size] + ' ' + className}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="animate-pulse">Loading...</span> : children}
    </button>
  );
}