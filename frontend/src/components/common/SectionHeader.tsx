import React from 'react';
import { cn } from './Button';

interface SectionHeaderProps {
  title: string | React.ReactNode;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  badge?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  description, 
  align = 'center', 
  className,
  badge 
}) => {
  return (
    <div className={cn(
      'mb-12 space-y-4',
      align === 'center' ? 'text-center' : 'text-left',
      className
    )}>
      {badge && (
        <span className="inline-block px-3 py-1 rounded-full bg-accent-red/10 border border-accent-red/20 text-[10px] font-black uppercase tracking-widest text-accent-red mb-2">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
        {title}
      </h2>
      {description && (
        <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
