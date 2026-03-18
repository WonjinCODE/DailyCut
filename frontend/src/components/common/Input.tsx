import React from 'react';
import { cn } from './Button';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  suffix?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, suffix, error, icon, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
            {icon}
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            className={cn(
              'w-full h-14 bg-white/5 border-2 border-white/10 rounded-xl px-5 text-xl font-bold text-white transition-all',
              'focus:outline-none focus:border-accent-red focus:bg-white/[0.08]',
              'placeholder:text-slate-600',
              error && 'border-red-500/50 focus:border-red-500',
              suffix && 'pr-14',
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-medium pointer-events-none group-focus-within:text-slate-300 transition-colors">
              {suffix}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
