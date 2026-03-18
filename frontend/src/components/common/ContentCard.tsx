import React from 'react';
import { Content } from '../../types';
import { OTT_PLATFORMS } from '../home/OttSelector';
import { PlayCircle, Clock, Star } from 'lucide-react';
import { cn } from './Button';

interface ContentCardProps {
  content: Content;
  availableTime?: number;
  className?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, availableTime, className }) => {
  // 여유 시간에 따른 뱃지 스타일 계산 (가용 시간이 전달된 경우에만 표시)
  const renderTimeBadge = () => {
    if (availableTime === undefined) return null;
    
    const diff = availableTime - content.runtime;
    let badgeStyle = '';
    let badgeText = '';

    if (diff === 0) {
      badgeStyle = 'bg-green-500/20 text-green-400 border-green-500/30';
      badgeText = '딱 맞아요!';
    } else if (diff > 0) {
      badgeStyle = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      badgeText = `${diff}분 여유`;
    } else {
      badgeStyle = 'bg-red-500/20 text-red-400 border-red-500/30';
      badgeText = '조금 초과함';
    }

    return (
      <div className="absolute top-3 right-3 z-20">
        <span className={cn(
          'px-2 py-1 rounded-md text-[10px] font-black border backdrop-blur-md',
          badgeStyle
        )}>
          {badgeText}
        </span>
      </div>
    );
  };

  return (
    <div className={cn(
      'group relative flex flex-col bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-accent-red/30 transition-all duration-300 hover:-translate-y-1 shadow-xl',
      className
    )}>
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={content.posterUrl} 
          alt={`${content.title} 포스터`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {renderTimeBadge()}

        {/* Play Icon Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <PlayCircle size={48} className="text-white drop-shadow-2xl" />
        </div>
      </div>

      {/* Content Info */}
      <div className="p-4 flex-grow flex flex-col relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex -space-x-1">
            {content.platforms.map(pId => {
              const platform = OTT_PLATFORMS.find(p => p.id === pId);
              return platform ? (
                <div 
                  key={pId} 
                  className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black text-white border border-dark"
                  style={{ backgroundColor: platform.color }}
                  title={platform.name}
                >
                  {platform.logoText[0]}
                </div>
              ) : null;
            })}
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{content.type}</span>
        </div>

        <h4 className="text-sm font-bold text-white mb-auto line-clamp-2 leading-tight group-hover:text-accent-red transition-colors">
          {content.title}
        </h4>

        <div className="mt-3 flex items-center justify-between text-[10px] font-bold">
          <div className="flex items-center gap-1 text-slate-400">
            <Clock size={10} />
            <span>{content.runtime}분</span>
          </div>
          <div className="flex items-center gap-0.5 text-yellow-500">
            <Star size={10} fill="currentColor" />
            <span>{content.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
