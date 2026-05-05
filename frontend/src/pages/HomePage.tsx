import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import HowToUse from '../components/home/HowToUse';
import OttSelector, { OTT_PLATFORMS } from '../components/home/OttSelector';
import TimeInput from '../components/home/TimeInput';
import GenreSelector from '../components/home/GenreSelector';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import SectionHeader from '../components/common/SectionHeader';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Clock, Plus, RotateCcw, Tags, Tv } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';

const MOBILE_GENRES = [
  { id: 0, label: '상관없음' },
  { id: 28, label: '액션' },
  { id: 35, label: '코미디' },
  { id: 10749, label: '로맨스' },
  { id: 53, label: '스릴러' },
  { id: 27, label: '공포' },
  { id: 16, label: '애니메이션' },
  { id: 878, label: 'SF' },
  { id: 14, label: '판타지' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedOtts, setSelectedOtts] = useState<string[]>([]);
  const [time, setTime] = useState<number>(0);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([0]);
  const isMobile = useMediaQuery('(max-width: 767px)');

  const handleStartRecommendation = () => {
    if (!isFormValid) return;
    const ottsParam = selectedOtts.join(',');
    let url = `/result?time=${time}&otts=${ottsParam}`;
    
    const actualGenres = selectedGenres.filter(g => g !== 0);
    if (actualGenres.length > 0) {
      url += `&genre=${actualGenres.join(',')}`;
    }
    navigate(url);
  };

  const isFormValid = selectedOtts.length > 0 && time > 0 && selectedGenres.length > 0;

  if (isMobile) {
    return (
      <MobileHomePage
        time={time}
        selectedOtts={selectedOtts}
        selectedGenres={selectedGenres}
        isFormValid={isFormValid}
        onTimeChange={setTime}
        onOttsChange={setSelectedOtts}
        onGenresChange={setSelectedGenres}
        onStartRecommendation={handleStartRecommendation}
      />
    );
  }

  return (
    <MainLayout>
      <Hero />

      {/* Input Section */}
      <section id="recommend" className="py-20 bg-white/[0.02] border-y border-white/5">
        <div className="container-custom max-w-4xl">
          <Card padding="lg">
            <SectionHeader 
              title="맞춤형 추천 시작하기"
              description="당신의 시청 환경을 알려주시면 최적의 결과를 찾아드립니다."
            />

            <div className="space-y-16">
              <GenreSelector selectedGenres={selectedGenres} onChange={setSelectedGenres} />
              <TimeInput time={time} onChange={setTime} />
              <OttSelector selectedOtts={selectedOtts} onChange={setSelectedOtts} />

              <div className="pt-8">
                <Button 
                  size="xl" 
                  className="w-full py-6 text-xl"
                  disabled={!isFormValid}
                  onClick={handleStartRecommendation}
                >
                  내 시간에 딱 맞는 영상 찾기
                </Button>
                {!isFormValid && (
                  <p className="text-center text-xs text-slate-500 mt-4 italic">
                    {selectedGenres.length === 0 ? '장르를 선택하고 ' : ''}
                    {time === 0 ? '시간을 입력하고 ' : ''}
                    {selectedOtts.length === 0 ? '플랫폼을 선택하면 ' : ''}
                    버튼이 활성화됩니다.
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Features />
      <HowToUse />

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-t from-accent-red/20 to-transparent">
        <div className="container-custom text-center">
          <SectionHeader 
            title={<>지금 바로 당신의 <span className="text-accent-red">인생작</span>을 만나보세요.</>}
            className="mb-10"
          />
          <Button 
            size="xl" 
            onClick={() => {
              document.getElementById('recommend')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            지금 시작하기
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

interface MobileHomePageProps {
  time: number;
  selectedOtts: string[];
  selectedGenres: number[];
  isFormValid: boolean;
  onTimeChange: (time: number) => void;
  onOttsChange: (otts: string[]) => void;
  onGenresChange: (genres: number[]) => void;
  onStartRecommendation: () => void;
}

const MobileHomePage = ({
  time,
  selectedOtts,
  selectedGenres,
  isFormValid,
  onTimeChange,
  onOttsChange,
  onGenresChange,
  onStartRecommendation,
}: MobileHomePageProps) => {
  const quickOptions = [
    { label: '30분', value: 30 },
    { label: '1시간', value: 60 },
    { label: '90분', value: 90 },
    { label: '2시간', value: 120 },
  ];

  const toggleOtt = (ottId: string) => {
    onOttsChange(
      selectedOtts.includes(ottId)
        ? selectedOtts.filter((currentOttId) => currentOttId !== ottId)
        : [...selectedOtts, ottId]
    );
  };

  const toggleGenre = (genreId: number) => {
    if (genreId === 0) {
      onGenresChange([0]);
      return;
    }

    let nextGenres = selectedGenres.filter((currentGenreId) => currentGenreId !== 0);
    nextGenres = nextGenres.includes(genreId)
      ? nextGenres.filter((currentGenreId) => currentGenreId !== genreId)
      : [...nextGenres, genreId];

    onGenresChange(nextGenres.length ? nextGenres : [0]);
  };

  return (
    <MainLayout>
      <section className="px-4 py-8 overflow-x-hidden">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-widest text-accent-red mb-3">
            DailyCut
          </p>
          <h1 className="text-3xl font-black leading-tight text-white">
            오늘 볼 콘텐츠를 빠르게 골라보세요
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            시간, OTT, 장르만 고르면 바로 추천해드릴게요.
          </p>
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-4 flex items-center gap-2 text-white">
              <Clock size={20} className="text-accent-red" />
              <h2 className="text-xl font-black">볼 수 있는 시간</h2>
            </div>
            <div className="relative">
              <input
                type="number"
                value={time === 0 ? '' : time}
                onChange={(event) => onTimeChange(parseInt(event.target.value) || 0)}
                placeholder="0"
                className="h-16 w-full rounded-2xl border-2 border-white/10 bg-black/30 px-5 pr-14 text-right text-3xl font-black text-white focus:border-accent-red focus:outline-none"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                분
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {quickOptions.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => onTimeChange(time + option.value)}
                  className="min-h-11 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-slate-200 active:scale-[0.98]"
                >
                  <Plus size={14} className="inline-block mr-1" />
                  {option.label}
                </button>
              ))}
            </div>
            {time > 0 && (
              <button
                type="button"
                onClick={() => onTimeChange(0)}
                className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-accent-red"
              >
                <RotateCcw size={15} />
                초기화
              </button>
            )}
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-white">
                <Tv size={20} className="text-accent-red" />
                <h2 className="text-xl font-black">이용 중인 OTT</h2>
              </div>
              <span className="text-xs font-bold text-accent-red">{selectedOtts.length}개</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {OTT_PLATFORMS.map((platform) => {
                const isSelected = selectedOtts.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => toggleOtt(platform.id)}
                    className={`min-h-12 rounded-xl border px-3 py-3 text-left text-sm font-black transition-colors ${
                      isSelected
                        ? 'border-accent-red bg-accent-red text-white'
                        : 'border-white/10 bg-white/5 text-slate-300'
                    }`}
                  >
                    <span
                      className="mr-2 inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1 text-[10px] font-black text-white"
                      style={{ backgroundColor: platform.color }}
                    >
                      {platform.logoText}
                    </span>
                    {platform.name}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-4 flex items-center gap-2 text-white">
              <Tags size={20} className="text-accent-red" />
              <h2 className="text-xl font-black">선호 장르</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {MOBILE_GENRES.map((genre) => {
                const isSelected = selectedGenres.includes(genre.id);
                return (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() => toggleGenre(genre.id)}
                    className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold ${
                      isSelected
                        ? 'border-accent-red bg-accent-red text-white'
                        : 'border-white/10 bg-white/5 text-slate-300'
                    }`}
                  >
                    {isSelected && <Check size={15} />}
                    {genre.label}
                  </button>
                );
              })}
            </div>
          </section>

          <button
            type="button"
            disabled={!isFormValid}
            onClick={onStartRecommendation}
            className="min-h-14 w-full rounded-2xl bg-accent-red px-5 py-4 text-lg font-black text-white shadow-lg shadow-accent-red/20 disabled:opacity-50"
          >
            추천받기
            <ArrowRight size={20} className="ml-2 inline-block" />
          </button>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
