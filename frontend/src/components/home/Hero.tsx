import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent-red/10 via-transparent to-transparent opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-red/20 rounded-full blur-[120px] animate-pulse" />
      
      <div className="container-custom relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm animate-bounce">
          <span className="flex h-2 w-2 rounded-full bg-accent-red" />
          <span className="text-sm font-medium text-slate-300 tracking-wide uppercase">지금 가용 시간을 알려주세요</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
          고르다 끝나는 휴식 시간,<br />
          <span className="text-accent-red">이제 그만.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          지금 가진 여유 시간과 구독 중인 OTT를 알려주세요.<br className="hidden md:block" />
          고민 없이 바로 시작할 수 있는 최적의 콘텐츠를 찾아드립니다.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="xl" 
            className="w-full sm:w-auto"
            onClick={() => navigate('/recommend')}
          >
            내 시간에 딱 맞는 영상 찾기
          </Button>
          <Button 
            variant="outline" 
            size="xl" 
            className="w-full sm:w-auto"
            onClick={() => {
              const element = document.getElementById('features');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            서비스 소개 더보기
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
