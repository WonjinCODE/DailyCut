import React, { useState, useMemo } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import SectionHeader from '../components/common/SectionHeader';
import ViewingPlanList from '../components/calculator/ViewingPlanList';
import ViewingCalendar from '../components/calculator/ViewingCalendar';
import { Tv, Clock, Calculator, CalendarRange, List, Calendar as CalendarIcon } from 'lucide-react';

const BingeCalcPage = () => {
  const [episodes, setEpisodes] = useState<number>(0);
  const [runtime, setRuntime] = useState<number>(0);
  const [dailyLimit, setDailyLimit] = useState<number>(0);
  const [showResult, setShowResult] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const totalMinutes = useMemo(() => episodes * runtime, [episodes, runtime]);

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const d = (minutes / (60 * 24)).toFixed(1);
    return { hours: h, mins: m, days: d };
  };

  const timeInfo = formatTime(totalMinutes);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (episodes > 0 && runtime > 0) {
      setShowResult(true);
      setShowPlan(false);
    }
  };

  const handleGeneratePlan = () => {
    if (dailyLimit > 0) {
      setShowPlan(true);
      setTimeout(() => {
        document.getElementById('plan-result')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <MainLayout>
      <section className="py-16 md:py-24 bg-dark min-h-[80vh]">
        <div className="container-custom max-w-2xl">
          <SectionHeader 
            title="몰아보기 시간 계산기"
            description="정주행을 시작하기 전, 필요한 총 시간을 미리 확인해보세요."
            badge="Calculator"
          />

          <Card padding="lg">
            <form onSubmit={handleCalculate} className="space-y-8">
              <div className="space-y-6">
                <Input 
                  label="총 에피소드 수"
                  icon={<Tv size={16} className="text-accent-red" />}
                  type="number"
                  value={episodes || ''}
                  onChange={(e) => {
                    setEpisodes(parseInt(e.target.value) || 0);
                    setShowResult(false);
                    setShowPlan(false);
                  }}
                  placeholder="예: 16"
                  suffix="화"
                />

                <Input 
                  label="에피소드당 평균 러닝타임"
                  icon={<Clock size={16} className="text-accent-red" />}
                  type="number"
                  value={runtime || ''}
                  onChange={(e) => {
                    setRuntime(parseInt(e.target.value) || 0);
                    setShowResult(false);
                    setShowPlan(false);
                  }}
                  placeholder="예: 60"
                  suffix="분"
                />
              </div>

              <Button
                type="submit"
                size="xl"
                className="w-full py-5 text-lg"
                disabled={!episodes || !runtime}
                leftIcon={<Calculator size={20} />}
              >
                총 시청 시간 계산하기
              </Button>
            </form>

            {showResult && (
              <div className="mt-12 pt-10 border-t border-white/10 animate-in fade-in slide-in-from-top-4">
                <div className="text-center mb-8">
                  <p className="text-slate-400 text-sm mb-2 font-black uppercase tracking-widest italic italic">Result</p>
                  <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                    {timeInfo.hours > 0 && <span>{timeInfo.hours}시간 </span>}
                    <span className="text-accent-red">{timeInfo.mins}분</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                  <Card padding="sm" className="bg-white/5 border-none flex flex-col items-center">
                    <span className="text-[10px] text-slate-500 mb-1 font-bold uppercase">Total Minutes</span>
                    <span className="text-xl font-black text-white">{totalMinutes.toLocaleString()}분</span>
                  </Card>
                  <Card padding="sm" className="bg-white/5 border-none flex flex-col items-center">
                    <span className="text-[10px] text-slate-500 mb-1 font-bold uppercase">Estimated Days</span>
                    <span className="text-xl font-black text-white">약 {timeInfo.days}일</span>
                  </Card>
                </div>

                <Card className="bg-accent-red/5 border-accent-red/10 overflow-visible" padding="md">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <CalendarRange className="text-accent-red" size={24} />
                      <h4 className="text-xl font-black text-white tracking-tighter">상세 시청 계획</h4>
                    </div>
                    
                    {showPlan && (
                      <div className="flex bg-dark/50 p-1 rounded-xl border border-white/10">
                        <button 
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-accent-red text-white' : 'text-slate-500'}`}
                        >
                          <List size={16} />
                        </button>
                        <button 
                          onClick={() => setViewMode('calendar')}
                          className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-accent-red text-white' : 'text-slate-500'}`}
                        >
                          <CalendarIcon size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    <Input 
                      label="하루 최대 시청 시간"
                      type="number"
                      value={dailyLimit || ''}
                      onChange={(e) => setDailyLimit(parseInt(e.target.value) || 0)}
                      placeholder="예: 120"
                      suffix="분"
                    />
                    <div className="flex flex-wrap gap-2">
                      {[60, 120, 180, 240].map(mins => (
                        <button
                          key={mins}
                          onClick={() => setDailyLimit(mins)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 hover:text-white hover:border-white/30 transition-all uppercase tracking-tighter"
                        >
                          {mins/60} Hours
                        </button>
                      ))}
                    </div>
                    <Button 
                      variant="secondary" 
                      onClick={handleGeneratePlan}
                      disabled={!dailyLimit}
                      className="w-full"
                    >
                      시청 일정 생성하기
                    </Button>
                  </div>

                  <div id="plan-result">
                    {showPlan && (
                      viewMode === 'list' ? (
                        <ViewingPlanList 
                          totalEpisodes={episodes} 
                          runtimePerEpisode={runtime} 
                          dailyTimeLimit={dailyLimit} 
                        />
                      ) : (
                        <ViewingCalendar 
                          totalEpisodes={episodes} 
                          runtimePerEpisode={runtime} 
                          dailyTimeLimit={dailyLimit} 
                        />
                      )
                    )}
                  </div>
                </Card>
              </div>
            )}
          </Card>
        </div>
      </section>
    </MainLayout>
  );
};

export default BingeCalcPage;
