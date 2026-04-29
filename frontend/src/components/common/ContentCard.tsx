import React, { useState, useEffect } from 'react';
import { Content } from '../../types';
import { OTT_PLATFORMS } from '../home/OttSelector';
import { normalizeOttProviderCode } from '../../utils/ottSearchLinks';
// ⭐ 평가용 아이콘(ThumbsUp, Eye, ThumbsDown) 추가
import { PlayCircle, Clock, Star, ThumbsUp, Eye, ThumbsDown } from 'lucide-react';
import { cn } from './Button';

interface ContentCardProps {
  content: Content;
  availableTime?: number;
  className?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, availableTime, className }) => {
  // ⭐ 로그인 상태를 확인하기 위한 state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 브라우저 금고에 토큰이 있는지 확인
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // ⭐ 평가 버튼을 클릭했을 때 실행되는 임시 함수
  const handleEvaluation = (e: React.MouseEvent, type: string) => {
    e.preventDefault(); // 카드 전체 클릭 방지
    e.stopPropagation(); 
    
    // 일단 화면에서 잘 눌리는지 확인하기 위한 알림창
    alert(`[${content.title}] 콘텐츠를 '${type}' 처리했습니다!\n(나중에 백엔드 API와 연결될 예정입니다.)`);
  };

  const handleOttSearchClick = (e: React.MouseEvent<HTMLButtonElement>, url: string) => {
    e.preventDefault();
    e.stopPropagation();

    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  // 여유 시간에 따른 뱃지 스타일 계산
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
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
          <PlayCircle size={48} className="text-white drop-shadow-2xl" />
        </div>
      </div>

      {/* Content Info */}
      <div className="p-4 flex-grow flex flex-col relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex -space-x-1">
            {content.platforms.map(pId => {
              const normalizedPlatformId = normalizeOttProviderCode(pId) ?? pId;
              const platform = OTT_PLATFORMS.find(p => p.id === normalizedPlatformId);
              return platform ? (
                <div 
                  key={`${content.id}-${normalizedPlatformId}`} 
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

        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            OTT에서 바로 검색
          </p>
          {content.watchLinks && content.watchLinks.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {content.watchLinks.map((watchLink) => (
                <button
                  key={`${content.id}-${watchLink.providerCode}`}
                  type="button"
                  onClick={(e) => handleOttSearchClick(e, watchLink.url)}
                  className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-[11px] font-semibold text-slate-200 hover:border-accent-red/40 hover:text-white hover:bg-accent-red/10 transition-colors"
                  title={`${watchLink.providerName}에서 ${content.title} 검색`}
                >
                  {watchLink.providerName}에서 보기
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-[11px] text-slate-500">
              선택한 OTT에서 검색 가능한 링크가 없습니다.
            </p>
          )}
        </div>

        {/* ⭐ 로그인한 유저에게만 보이는 평가 버튼 영역 */}
        {isLoggedIn && (
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
            <button 
              onClick={(e) => handleEvaluation(e, '볼거에요')} 
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-accent-red transition-colors group/btn"
              title="찜하기"
            >
              <ThumbsUp size={16} className="group-hover/btn:scale-110 transition-transform" />
              <span className="text-[10px] font-medium">볼거에요</span>
            </button>
            
            <button 
              onClick={(e) => handleEvaluation(e, '봤어요')} 
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors group/btn"
              title="이미 본 콘텐츠"
            >
              <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
              <span className="text-[10px] font-medium">봤어요</span>
            </button>

            <button 
              onClick={(e) => handleEvaluation(e, '별로에요')} 
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-300 transition-colors group/btn"
              title="추천 안 함"
            >
              <ThumbsDown size={16} className="group-hover/btn:scale-110 transition-transform" />
              <span className="text-[10px] font-medium">별로에요</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCard;
