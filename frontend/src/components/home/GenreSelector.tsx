import React from 'react';
import { HelpCircle, Swords, Laugh, Heart, Ghost, Skull, Tv, Rocket, Sparkles, Check } from 'lucide-react';

interface GenreOption {
  id: number;
  label: string;
  icon: React.ReactNode;
}

const GENRES: GenreOption[] = [
  { id: 0, label: '상관없음', icon: <HelpCircle size={20} /> },
  { id: 28, label: '액션', icon: <Swords size={20} /> },
  { id: 35, label: '코미디', icon: <Laugh size={20} /> },
  { id: 10749, label: '로맨스', icon: <Heart size={20} /> },
  { id: 53, label: '스릴러', icon: <Ghost size={20} /> },
  { id: 27, label: '공포', icon: <Skull size={20} /> },
  { id: 16, label: '애니메이션', icon: <Tv size={20} /> },
  { id: 878, label: 'SF', icon: <Rocket size={20} /> },
  { id: 14, label: '판타지', icon: <Sparkles size={20} /> },
];

interface GenreSelectorProps {
  selectedGenres: number[];
  onChange: (genreIds: number[]) => void;
}

const GenreSelector: React.FC<GenreSelectorProps> = ({ selectedGenres, onChange }) => {
  const handleToggle = (id: number) => {
    if (id === 0) {
      onChange([0]);
      return;
    }

    let newSelected = selectedGenres.filter(g => g !== 0);
    if (newSelected.includes(id)) {
      newSelected = newSelected.filter(g => g !== id);
    } else {
      newSelected = [...newSelected, id];
    }

    if (newSelected.length === 0) {
      onChange([0]);
    } else {
      onChange(newSelected);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        선호하는 장르가 있나요? <span className="text-xs font-normal text-slate-500">(중복 선택 가능)</span>
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {GENRES.map((genre) => {
          const isSelected = selectedGenres.includes(genre.id);
          return (
            <button
              key={genre.id}
              type="button"
              onClick={() => handleToggle(genre.id)}
              className={`
                relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left
                ${isSelected 
                  ? 'bg-accent-red/10 border-accent-red shadow-[0_0_15px_rgba(229,9,20,0.1)]' 
                  : 'bg-white/5 border-transparent hover:bg-white/10'
                }
              `}
            >
              <div className={`
                p-2 rounded-lg transition-colors
                ${isSelected ? 'bg-accent-red text-white' : 'bg-white/5 text-slate-400'}
              `}>
                {genre.icon}
              </div>
              
              <div className="flex flex-col">
                <span className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {genre.label}
                </span>
                {isSelected && (
                  <Check size={12} className="text-accent-red absolute top-2 right-2 animate-in zoom-in" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GenreSelector;
