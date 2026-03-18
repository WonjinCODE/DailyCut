import React from 'react';
import OttToggleBtn from './OttToggleBtn';
import { OttPlatform } from '../../types';

// 예시 OTT 목록 정의
export const OTT_PLATFORMS: OttPlatform[] = [
  { id: 'netflix', name: 'Netflix', color: '#E50914', logoText: 'N' },
  { id: 'disneyplus', name: 'Disney+', color: '#0063E5', logoText: 'D+' },
  { id: 'tving', name: 'TVING', color: '#FF153C', logoText: 'T' },
  { id: 'wavve', name: 'Wavve', color: '#1050FF', logoText: 'W' },
  { id: 'coupang', name: 'Coupang Play', color: '#00A1E0', logoText: 'CP' },
];

interface OttSelectorProps {
  selectedOtts: string[];
  onChange: (selected: string[]) => void;
}

const OttSelector: React.FC<OttSelectorProps> = ({ selectedOtts, onChange }) => {
  const handleToggle = (id: string) => {
    const isAlreadySelected = selectedOtts.includes(id);
    const newSelected = isAlreadySelected
      ? selectedOtts.filter(ottId => ottId !== id)
      : [...selectedOtts, id];
    
    onChange(newSelected);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          구독 중인 OTT를 알려주세요
          <span className="text-xs font-normal text-slate-500 uppercase tracking-widest">(중복 선택 가능)</span>
        </h3>
        <span className="text-sm text-accent-red font-medium">
          {selectedOtts.length}개 선택됨
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {OTT_PLATFORMS.map((platform) => (
          <OttToggleBtn
            key={platform.id}
            platform={platform}
            isSelected={selectedOtts.includes(platform.id)}
            onToggle={handleToggle}
          />
        ))}
      </div>
      
      {selectedOtts.length === 0 && (
        <p className="mt-4 text-sm text-slate-500 text-center animate-pulse">
          최소 한 개의 플랫폼을 선택해야 추천을 받을 수 있습니다.
        </p>
      )}
    </div>
  );
};

export default OttSelector;
