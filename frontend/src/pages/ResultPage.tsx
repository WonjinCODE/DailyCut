import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ContentCard from '../components/common/ContentCard';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import SectionHeader from '../components/common/SectionHeader';
import { Content } from '../types';
import { getRecommendations } from '../services/apiService';
import { ArrowLeft, Filter, Tag, AlertCircle } from 'lucide-react';

const GENRE_LABELS: Record<number, string> = {
  0: '상관없음',
  28: '액션',
  35: '코미디',
  10749: '로맨스',
  53: '스릴러',
  27: '공포',
  16: '애니메이션',
  878: 'SF',
  14: '판타지',
};

const ResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [contents, setContents] = useState<Content[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const time = parseInt(searchParams.get('time') || '0');
  const ottsString = searchParams.get('otts') || '';
  const otts = ottsString ? ottsString.split(',') : [];
  const genreParam = searchParams.get('genre');
  const genres = useMemo(() => {
    if (!genreParam) return [0];
    return genreParam.split(',').map(id => parseInt(id));
  }, [genreParam]);

  useEffect(() => {
    const fetchContents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getRecommendations(time, otts, genres.includes(0) ? undefined : genres);
        if (response.success) {
          // 백엔드 데이터를 프론트엔드 Content 인터페이스로 변환
          const mappedContents: Content[] = response.data.map(item => ({
            id: String(item.id),
            title: item.title,
            posterUrl: item.posterUrl,
            // 백엔드에서 runtime 정보가 없으므로 요청한 시간(time)을 기준으로 대략 할당
            runtime: item.type === 'movie' ? Math.min(time, 120) : 30, 
            platforms: otts.length > 0 ? otts : ['netflix'], // 선택한 OTT가 있으면 표시
            type: item.type === 'movie' ? 'movie' : 'drama',
            // popularity를 0-10 사이의 rating으로 대략 변환 (임시)
            rating: Math.min(9.9, Math.max(1.0, (item.popularity / 1000) * 10)).toFixed(1) as any,
            summary: item.overview
          }));
          setContents(mappedContents);
        } else {
          setError('추천 데이터를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('API Error:', err);
        setError('서버와 통신 중 오류가 발생했습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    if (time > 0) {
      fetchContents();
    }
    window.scrollTo(0, 0);
  }, [time, ottsString, genres]);

  const genreDisplayLabel = useMemo(() => {
    if (genres.includes(0)) return '전체 장르';
    if (genres.length === 1) return GENRE_LABELS[genres[0]] || '전체';
    if (genres.length > 1) return `${GENRE_LABELS[genres[0]]} 외 ${genres.length - 1}개`;
    return '전체';
  }, [genres]);

  if (isLoading) return <MainLayout><Loading fullScreen message={`선택하신 ${time}분에 딱 맞는 명작을 찾는 중...`} /></MainLayout>;

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <AlertCircle size={48} className="text-accent-red mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-white mb-2">연결 오류</h2>
          <p className="text-slate-400 mb-8 max-w-md">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all"
          >
            다시 시도하기
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="py-12 md:py-20 min-h-[80vh]">
        <div className="container-custom">
          {/* Result Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div className="flex-grow">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-6 group font-bold text-sm"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span>검색 조건 수정하기</span>
              </button>
              <SectionHeader 
                title={<span className="text-gradient">당신만을 위한 추천 리스트</span>}
                align="left"
                className="mb-0"
                badge="Result"
              />
            </div>

            {/* Filter Badges Summary */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold flex items-center gap-3 text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Filter size={14} className="text-accent-red" />
                  <span>{time}분</span>
                </div>
                <div className="w-px h-3 bg-white/20" />
                <span>{otts.length === 0 ? '전체 OTT' : `${otts.length}개 OTT`}</span>
              </div>
              <div className="px-5 py-2.5 rounded-2xl bg-accent-red/10 border border-accent-red/20 text-sm font-bold flex items-center gap-2 text-accent-red shadow-lg shadow-accent-red/5" title={genres.filter(g => g !== 0).map(g => GENRE_LABELS[g]).join(', ')}>
                <Tag size={14} />
                <span>{genreDisplayLabel}</span>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {contents.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
              {contents.map((content) => (
                <ContentCard 
                  key={content.id} 
                  content={content} 
                  availableTime={time} 
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="조건에 맞는 영상을 찾지 못했어요"
              description="시간을 조금 늘려보거나 다른 OTT 플랫폼을 추가로 선택하시면 더 많은 인생작을 추천해 드릴 수 있습니다."
              actionLabel="시간/OTT 변경하러 가기"
              onAction={() => navigate('/')}
            />
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default ResultPage;
