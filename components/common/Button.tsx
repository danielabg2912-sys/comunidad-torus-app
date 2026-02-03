import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-accent-green text-white hover:bg-accent-green-light focus:ring-accent-green shadow-md hover:shadow-lg',
    secondary: 'bg-bg-tertiary text-text-primary hover:bg-border-light focus:ring-accent-green',
    outline: 'bg-transparent border-2 border-accent-green text-accent-green hover:bg-accent-green hover:text-white focus:ring-accent-green',
    danger: 'bg-accent-red text-white hover:opacity-90 focus:ring-accent-red shadow-md',
    link: 'bg-transparent text-accent-green hover:underline focus:ring-accent-green p-0',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const finalClassName = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={finalClassName} {...props}>
      {children}
    </button>
  );
};