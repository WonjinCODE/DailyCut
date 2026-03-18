import React, { useMemo } from 'react';
import { CalendarDays, CheckCircle2 } from 'lucide-react';

interface ViewingPlanListProps {
  totalEpisodes: number;
  runtimePerEpisode: number;
  dailyTimeLimit: number; // 분 단위
}

interface DailyPlan {
  day: number;
  episodes: number[];
  totalTime: number;
}

const ViewingPlanList: React.FC<ViewingPlanListProps> = ({ 
  totalEpisodes, 
  runtimePerEpisode, 
  dailyTimeLimit 
}) => {
  const plan = useMemo(() => {
    const dailyPlans: DailyPlan[] = [];
    let currentDay = 1;
    let currentEpisodes: number[] = [];
    let currentTimeInDay = 0;

    for (let i = 1; i <= totalEpisodes; i++) {
      // 만약 에피소드 하나가 하루 제한 시간보다 길면, 그냥 그날은 그 에피소드 하나만 봅니다.
      if (runtimePerEpisode > dailyTimeLimit && currentEpisodes.length === 0) {
        dailyPlans.push({ day: currentDay++, episodes: [i], totalTime: runtimePerEpisode });
        continue;
      }

      // 현재 에피소드를 추가했을 때 제한 시간을 넘는지 확인
      if (currentTimeInDay + runtimePerEpisode > dailyTimeLimit && currentEpisodes.length > 0) {
        dailyPlans.push({ day: currentDay++, episodes: currentEpisodes, totalTime: currentTimeInDay });
        currentEpisodes = [i];
        currentTimeInDay = runtimePerEpisode;
      } else {
        currentEpisodes.push(i);
        currentTimeInDay += runtimePerEpisode;
      }
    }

    // 남은 에피소드 처리
    if (currentEpisodes.length > 0) {
      dailyPlans.push({ day: currentDay, episodes: currentEpisodes, totalTime: currentTimeInDay });
    }

    return dailyPlans;
  }, [totalEpisodes, runtimePerEpisode, dailyTimeLimit]);

  return (
    <div className="mt-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="text-accent-red" size={20} />
        <h4 className="text-lg font-bold">생성된 시청 일정</h4>
      </div>

      <div className="relative space-y-4 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-accent-red/50 before:via-white/10 before:to-transparent">
        {plan.map((item) => (
          <div key={item.day} className="relative flex items-start gap-6 group">
            {/* Timeline Dot */}
            <div className="absolute left-0 mt-1.5 w-10 h-10 rounded-full bg-dark border-2 border-accent-red flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
              <span className="text-xs font-black text-accent-red">{item.day}</span>
            </div>

            <div className="ml-14 flex-grow p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-slate-200">{item.day}일차</span>
                <span className="text-[10px] px-2 py-1 rounded-md bg-white/5 text-slate-400 border border-white/5">
                  총 {item.totalTime}분 시청
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {item.episodes.map((ep) => (
                  <div key={ep} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-red/10 border border-accent-red/20 text-xs font-medium text-white">
                    <CheckCircle2 size={12} className="text-accent-red" />
                    {ep}화
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-xs text-center text-green-400">
        축하합니다! 총 <strong>{plan.length}일</strong> 만에 정주행을 완료할 수 있습니다. 🎬
      </div>
    </div>
  );
};

export default ViewingPlanList;
