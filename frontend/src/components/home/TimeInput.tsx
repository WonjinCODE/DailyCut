import React from 'react';
import { Timer, Plus } from 'lucide-react';

interface TimeInputProps {
  time: number;
  onChange: (newTime: number) => void;
}

const QuickTimeBtn: React.FC<{ label: string; value: number; onClick: (v: number) => void }> = ({ label, value, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(value)}
    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all text-sm font-medium text-slate-300 hover:text-white"
  >
    <Plus size={14} />
    {label}
  </button>
);

const TimeInput: React.FC<TimeInputProps> = ({ time, onChange }) => {
  const quickOptions = [
    { label: '30분', value: 30 },
    { label: '1시간', value: 60 },
    { label: '1시간 30분', value: 90 },
    { label: '2시간', value: 120 },
  ];

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    onChange(val);
  };

  const handleQuickAdd = (value: number) => {
    onChange(time + value);
  };

  const handleReset = () => onChange(0);

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Timer size={24} className="text-accent-red" />
        지금 얼마 동안 볼 수 있나요?
      </h3>

      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        {/* Direct Input */}
        <div className="relative w-full md:w-48 group">
          <input
            type="number"
            value={time === 0 ? '' : time}
            onChange={handleManualChange}
            placeholder="0"
            className="w-full h-16 bg-white/5 border-2 border-white/10 rounded-2xl px-6 text-3xl font-black text-white focus:outline-none focus:border-accent-red transition-all text-right pr-14"
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none">분</span>
        </div>

        {/* Quick Buttons Grid */}
        <div className="flex flex-wrap gap-2 flex-grow">
          {quickOptions.map((opt) => (
            <QuickTimeBtn 
              key={opt.label} 
              label={opt.label} 
              value={opt.value} 
              onClick={handleQuickAdd} 
            />
          ))}
          {time > 0 && (
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-accent-red hover:underline"
            >
              초기화
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeInput;
