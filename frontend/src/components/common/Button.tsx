import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-accent-red text-white hover:bg-red-700 active:scale-95 shadow-lg shadow-accent-red/20',
      secondary: 'bg-white/10 text-white hover:bg-white/20 active:scale-95 border border-white/10',
      outline: 'border-2 border-white/20 bg-transparent hover:bg-white/5 text-white active:scale-95',
      ghost: 'bg-transparent hover:bg-white/5 text-slate-400 hover:text-white',
      accent: 'bg-accent-blue text-white hover:bg-blue-700 active:scale-95 shadow-lg shadow-accent-blue/20',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-2.5 text-base font-medium',
      lg: 'px-8 py-3.5 text-lg font-semibold',
      xl: 'px-10 py-4 text-xl font-bold rounded-xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed gap-2',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
