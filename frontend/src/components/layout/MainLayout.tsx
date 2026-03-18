import React from 'react';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] overflow-x-hidden">
      <Header />
      <main className="flex-grow pt-16 page-enter">
        {children}
      </main>
      <footer className="py-16 border-t border-white/5 bg-black/40">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="text-2xl font-black tracking-tighter">
                DAILY<span className="text-accent-red">CUT</span>
              </span>
              <p className="text-slate-500 text-sm max-w-xs text-center md:text-left leading-relaxed">
                당신의 소중한 휴식 시간을 완벽하게 만들어드리는 스마트 시청 가이드
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-4">
              <div className="flex gap-8 text-sm font-bold text-slate-400">
                <a href="#" className="hover:text-accent-red transition-colors">서비스 소개</a>
                <a href="#" className="hover:text-accent-red transition-colors">이용약관</a>
                <a href="#" className="hover:text-accent-red transition-colors">문의하기</a>
              </div>
              <span className="text-slate-600 text-[10px] uppercase tracking-widest font-black">© 2026 DailyCut. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
