import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import HowToUse from '../components/home/HowToUse';
import OttSelector from '../components/home/OttSelector';
import TimeInput from '../components/home/TimeInput';
import GenreSelector from '../components/home/GenreSelector';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import SectionHeader from '../components/common/SectionHeader';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedOtts, setSelectedOtts] = useState<string[]>([]);
  const [time, setTime] = useState<number>(0);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([0]);

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

export default HomePage;
