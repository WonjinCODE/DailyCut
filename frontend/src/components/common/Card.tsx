import React from 'react';
import { cn } from './Button';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  hoverable = false, 
  padding = 'md' 
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6 md:p-8',
    lg: 'p-8 md:p-12',
  };

  return (
    <div className={cn(
      'bg-white/5 border border-white/10 rounded-3xl shadow-2xl transition-all duration-300',
      hoverable && 'hover:bg-white/[0.07] hover:border-white/20',
      paddings[padding],
      className
    )}>
      {children}
    </div>
  );
};

export default Card;
