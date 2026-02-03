import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white/80 dark:bg-bg-secondary/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-border-light p-6 relative transition-all duration-300 hover:shadow-2xl ${className}`}>
      {children}
    </div>
  );
};