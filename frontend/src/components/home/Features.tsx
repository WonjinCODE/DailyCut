import { Timer, Tv, Zap, Layout } from 'lucide-react';

const features = [
  {
    icon: <Timer className="text-accent-red" size={32} />,
    title: "Time-Fit 추천",
    description: "단 1분의 낭비도 없도록 사용자의 가용 시간에 완벽히 부합하는 콘텐츠를 선별합니다."
  },
  {
    icon: <Tv className="text-accent-red" size={32} />,
    title: "구독 OTT 기반",
    description: "내가 결제한 플랫폼 내에서만 볼 수 있는 현실적인 시청 리스트를 제공합니다."
  },
  {
    icon: <Zap className="text-accent-red" size={32} />,
    title: "3초 퀵 서치",
    description: "복잡한 텍스트 입력 없이 몇 번의 터치만으로 즉각적인 결과를 도출합니다."
  },
  {
    icon: <Layout className="text-accent-red" size={32} />,
    title: "직관적인 시각화",
    description: "남은 시간과 콘텐츠 길이를 직관적인 뱃지로 비교하여 선택을 돕습니다."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-black/30">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">왜 DailyCut인가요?</h2>
          <p className="text-slate-400">넷플릭스 증후군을 해결하는 가장 스마트한 방법</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-accent-red/50 hover:bg-accent-red/5 transition-all duration-300 group"
            >
              <div className="mb-6 p-3 rounded-xl bg-white/5 inline-block group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
