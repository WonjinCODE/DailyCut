import React from 'react';
import { SituationMode } from '../../types';
import { Bus, Moon, Coffee, Check } from 'lucide-react';

interface ModeOption {
  id: SituationMode;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const MODES: ModeOption[] = [
  { 
    id: 'commute', 
    label: '출퇴근 모드', 
    description: '이동 중에 가볍게 보기 좋아요', 
    icon: <Bus size={24} /> 
  },
  { 
    id: 'bed', 
    label: '자기 전 모드', 
    description: '잠들기 전 몰입하기 좋은 명작', 
    icon: <Moon size={24} /> 
  },
  { 
    id: 'free', 
    label: '자유 시청 모드', 
    description: '언제 어디서나 부담 없는 선택', 
    icon: <Coffee size={24} /> 
  },
];

interface SituationModeSelectorProps {
  selectedMode: SituationMode;
  onChange: (mode: SituationMode) => void;
}

const SituationModeSelector: React.FC<SituationModeSelectorProps> = ({ selectedMode, onChange }) => {
  return (
    <div className="w-full">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        어떤 상황에서 보실 건가요?
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {MODES.map((mode) => {
          const isSelected = selectedMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onChange(mode.id)}
              className={`
                relative flex flex-col items-start p-5 rounded-2xl border-2 transition-all duration-200 text-left group
                ${isSelected 
                  ? 'bg-accent-red/10 border-accent-red shadow-[0_0_20px_rgba(229,9,20,0.1)]' 
                  : 'bg-white/5 border-transparent hover:bg-white/10'
                }
              `}
            >
              <div className={`
                p-3 rounded-xl mb-4 transition-colors
                ${isSelected ? 'bg-accent-red text-white' : 'bg-white/5 text-slate-400 group-hover:text-white'}
              `}>
                {mode.icon}
              </div>
              
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {mode.label}
                </span>
                {isSelected && <Check size={14} className="text-accent-red animate-in zoom-in" />}
              </div>
              
              <p className="text-xs text-slate-500 leading-tight">
                {mode.description}
              </p>

              {/* Selection indicator bar at bottom */}
              <div className={`
                absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-accent-red transition-all duration-300 rounded-t-full
                ${isSelected ? 'w-1/3 opacity-100' : 'w-0 opacity-0'}
              `} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SituationModeSelector;
