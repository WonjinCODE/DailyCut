import React, { useState, useEffect } from 'react';
import type { Content, InteractionType } from '../../types';
import { OTT_PLATFORMS } from '../home/OttSelector';
import { normalizeOttProviderCode } from '../../utils/ottSearchLinks';
import { deleteEvaluation, evaluateContent } from '../../services/apiService';
// ⭐ 평가용 아이콘(ThumbsUp, Eye, ThumbsDown) 추가
import { PlayCircle, Clock, Star, ThumbsUp, Eye, ThumbsDown } from 'lucide-react';
import { cn } from './Button';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface ContentCardProps {
  content: Content;
  availableTime?: number;
  className?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, availableTime, className }) => {
  // ⭐ 로그인 상태를 확인하기 위한 state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pendingEvaluation, setPendingEvaluation] = useState<InteractionType | null>(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState<InteractionType | null>(
    content.currentInteractionType ?? null
  );
  const isMobile = useMediaQuery('(max-width: 767px)');

  useEffect(() => {
    // 브라우저 금고에 토큰이 있는지 확인
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    setSelectedEvaluation(content.currentInteractionType ?? null);
  }, [content.id, content.currentInteractionType]);

  // ⭐ 평가 버튼을 클릭했을 때 실행되는 임시 함수
  const handleEvaluation = async (e: React.MouseEvent, evaluationType: InteractionType) => {
    e.preventDefault(); // 카드 전체 클릭 방지
    e.stopPropagation(); 

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsLoggedIn(false);
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    try {
      setPendingEvaluation(evaluationType);
      const isSameEvaluation = selectedEvaluation === evaluationType;
      const message = isSameEvaluation
        ? await deleteEvaluation(content.id)
        : await evaluateContent(content.id, {
            evaluationType,
            title: content.title,
            type: content.sourceType ?? (content.type === 'movie' ? 'movie' : 'tv'),
            genreIds: content.genreIds ?? [],
            posterUrl: content.posterUrl,
            runtime: content.runtime,
          });

      setSelectedEvaluation(isSameEvaluation ? null : evaluationType);
      alert(message);
    } catch (error) {
      const message = error instanceof Error ? error.message : '반응 처리 중 오류가 발생했습니다.';
      alert(message);
    } finally {
      setPendingEvaluation(null);
    }
  };

  const getEvaluationTextClass = (evaluationType: InteractionType) => {
    return selectedEvaluation === evaluationType
      ? 'text-accent-red font-bold'
      : 'font-medium';
  };

  const getEvaluationIconClass = (evaluationType: InteractionType) => {
    return selectedEvaluation === evaluationType
      ? 'text-accent-red'
      : 'text-slate-400';
  };

  const handleOttSearchClick = (e: React.MouseEvent<HTMLButtonElement>, url: string) => {
    e.preventDefault();
    e.stopPropagation();

    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  if (isMobile) {
    return (
      <MobileContentCard
        content={content}
        isLoggedIn={isLoggedIn}
        pendingEvaluation={pendingEvaluation}
        selectedEvaluation={selectedEvaluation}
        getEvaluationTextClass={getEvaluationTextClass}
        getEvaluationIconClass={getEvaluationIconClass}
        onEvaluate={handleEvaluation}
        onOttSearch={handleOttSearchClick}
        className={className}
      />
    );
  }

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
              type="button"
              onClick={(e) => handleEvaluation(e, 'LIKE')} 
              disabled={pendingEvaluation !== null}
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-accent-red transition-colors group/btn disabled:opacity-50 disabled:cursor-not-allowed"
              title="찜하기"
            >
              <ThumbsUp size={16} className={cn('group-hover/btn:scale-110 transition-transform', getEvaluationIconClass('LIKE'))} />
              <span className={cn('text-[10px]', getEvaluationTextClass('LIKE'))}>볼거에요</span>
            </button>
            
            <button 
              type="button"
              onClick={(e) => handleEvaluation(e, 'WATCHED')} 
              disabled={pendingEvaluation !== null}
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors group/btn disabled:opacity-50 disabled:cursor-not-allowed"
              title="이미 본 콘텐츠"
            >
              <Eye size={16} className={cn('group-hover/btn:scale-110 transition-transform', getEvaluationIconClass('WATCHED'))} />
              <span className={cn('text-[10px]', getEvaluationTextClass('WATCHED'))}>봤어요</span>
            </button>

            <button 
              type="button"
              onClick={(e) => handleEvaluation(e, 'DISLIKE')} 
              disabled={pendingEvaluation !== null}
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-300 transition-colors group/btn disabled:opacity-50 disabled:cursor-not-allowed"
              title="추천 안 함"
            >
              <ThumbsDown size={16} className={cn('group-hover/btn:scale-110 transition-transform', getEvaluationIconClass('DISLIKE'))} />
              <span className={cn('text-[10px]', getEvaluationTextClass('DISLIKE'))}>별로에요</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface MobileContentCardProps {
  content: Content;
  isLoggedIn: boolean;
  pendingEvaluation: InteractionType | null;
  selectedEvaluation: InteractionType | null;
  getEvaluationTextClass: (evaluationType: InteractionType) => string;
  getEvaluationIconClass: (evaluationType: InteractionType) => string;
  onEvaluate: (e: React.MouseEvent, evaluationType: InteractionType) => void;
  onOttSearch: (e: React.MouseEvent<HTMLButtonElement>, url: string) => void;
  className?: string;
}

const MobileContentCard: React.FC<MobileContentCardProps> = ({
  content,
  isLoggedIn,
  pendingEvaluation,
  selectedEvaluation,
  getEvaluationTextClass,
  getEvaluationIconClass,
  onEvaluate,
  onOttSearch,
  className,
}) => (
  <article className={cn(
    'overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] shadow-xl',
    className
  )}>
    <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-4 p-4">
      <div className="aspect-[2/3] overflow-hidden rounded-xl bg-black/30">
        <img
          src={content.posterUrl}
          alt={`${content.title} 포스터`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-black uppercase text-slate-500">
          <span>{content.type}</span>
          <span className="h-1 w-1 rounded-full bg-slate-600" />
          <span className="inline-flex items-center gap-1">
            <Clock size={12} />
            {content.runtime}분
          </span>
          <span className="inline-flex items-center gap-1 text-yellow-500">
            <Star size={12} fill="currentColor" />
            {content.rating}
          </span>
        </div>
        <h4 className="text-lg font-black leading-tight text-white">
          {content.title}
        </h4>
        {content.summary && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-400">
            {content.summary}
          </p>
        )}
      </div>
    </div>

    <div className="space-y-3 border-t border-white/10 p-4">
      {content.watchLinks && content.watchLinks.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {content.watchLinks.map((watchLink) => (
            <button
              key={`${content.id}-${watchLink.providerCode}`}
              type="button"
              onClick={(event) => onOttSearch(event, watchLink.url)}
              className="min-h-11 flex-1 rounded-xl border border-accent-red/20 bg-accent-red/10 px-3 py-2 text-sm font-black text-white"
              title={`${watchLink.providerName}에서 ${content.title} 검색`}
            >
              {watchLink.providerName}에서 보기
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">선택한 OTT에서 검색 가능한 링크가 없습니다.</p>
      )}

      {isLoggedIn && (
        <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-3">
          <button
            type="button"
            onClick={(event) => onEvaluate(event, 'LIKE')}
            disabled={pendingEvaluation !== null}
            className="min-h-11 rounded-xl bg-white/5 px-2 py-2 text-xs text-slate-200 disabled:opacity-50"
            aria-pressed={selectedEvaluation === 'LIKE'}
          >
            <ThumbsUp size={16} className={cn('mx-auto mb-1', getEvaluationIconClass('LIKE'))} />
            <span className={getEvaluationTextClass('LIKE')}>볼거에요</span>
          </button>
          <button
            type="button"
            onClick={(event) => onEvaluate(event, 'WATCHED')}
            disabled={pendingEvaluation !== null}
            className="min-h-11 rounded-xl bg-white/5 px-2 py-2 text-xs text-slate-200 disabled:opacity-50"
            aria-pressed={selectedEvaluation === 'WATCHED'}
          >
            <Eye size={16} className={cn('mx-auto mb-1', getEvaluationIconClass('WATCHED'))} />
            <span className={getEvaluationTextClass('WATCHED')}>봤어요</span>
          </button>
          <button
            type="button"
            onClick={(event) => onEvaluate(event, 'DISLIKE')}
            disabled={pendingEvaluation !== null}
            className="min-h-11 rounded-xl bg-white/5 px-2 py-2 text-xs text-slate-200 disabled:opacity-50"
            aria-pressed={selectedEvaluation === 'DISLIKE'}
          >
            <ThumbsDown size={16} className={cn('mx-auto mb-1', getEvaluationIconClass('DISLIKE'))} />
            <span className={getEvaluationTextClass('DISLIKE')}>별로에요</span>
          </button>
        </div>
      )}
    </div>
  </article>
);

export default ContentCard;
