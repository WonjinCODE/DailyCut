import React from 'react';
import { OttPlatform } from '../../types';
import { CheckCircle2 } from 'lucide-react';

interface OttToggleBtnProps {
  platform: OttPlatform;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const OttToggleBtn: React.FC<OttToggleBtnProps> = ({ platform, isSelected, onToggle }) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(platform.id)}
      aria-pressed={isSelected}
      className={`
        relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 group
        ${isSelected 
          ? `bg-white/10 border-white shadow-lg scale-105` 
          : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/20'
        }
      `}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 text-accent-red animate-in zoom-in-50">
          <CheckCircle2 size={18} fill="currentColor" className="text-white" />
        </div>
      )}

      {/* Platform Box (Logo Placeholder) */}
      <div 
        className={`
          w-16 h-16 rounded-xl flex items-center justify-center mb-3 text-xl font-black tracking-tighter transition-transform duration-200
          ${isSelected ? 'scale-110' : 'group-hover:scale-105'}
        `}
        style={{ backgroundColor: platform.color }}
      >
        {platform.logoText}
      </div>

      <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-400'}`}>
        {platform.name}
      </span>

      {/* Brand Color Glow on Selected */}
      {isSelected && (
        <div 
          className="absolute inset-0 rounded-2xl blur-xl -z-10 opacity-30 animate-pulse"
          style={{ backgroundColor: platform.color }}
        />
      )}
    </button>
  );
};

export default OttToggleBtn;
