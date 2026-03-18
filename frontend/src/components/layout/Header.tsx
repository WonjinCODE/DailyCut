import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-md border-b border-white/10">
      <div className="container-custom flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-accent-red p-1 rounded-md group-hover:scale-110 transition-transform">
            <Play size={20} fill="white" stroke="white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">
            DAILY<span className="text-accent-red">CUT</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">홈</Link>
          <button 
            onClick={() => {
              if (window.location.pathname === '/') {
                document.getElementById('recommend')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = '/#recommend';
              }
            }}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            콘텐츠 추천
          </button>
          <Link to="/calculator" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">시청 계산기</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors">로그인</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
