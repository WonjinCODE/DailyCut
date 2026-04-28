import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  // 로그인 상태와 닉네임을 저장할 공간 (state)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');

  // 화면이 렌더링될 때 브라우저 금고(localStorage)를 확인하는 함수
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedNickname = localStorage.getItem('nickname');
    
    if (token) {
      setIsLoggedIn(true);
      setNickname(storedNickname || '사용자');
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // 로그아웃 버튼을 눌렀을 때 실행될 함수
  const handleLogout = () => {
    // 1. 브라우저 금고에서 출입증과 정보 싹 지우기
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('nickname');
    
    // 2. 로그인 상태를 false로 변경
    setIsLoggedIn(false);
    alert('로그아웃 되었습니다.');
    
    // 3. 메인 화면으로 이동 후 새로고침 (상태 완벽 동기화를 위해)
    window.location.href = '/'; 
  };

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

        {/* ⭐ 로그인 상태에 따라 다르게 보여주는 영역 */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            // 로그인 상태일 때 보여줄 UI
            <>
              <span className="text-sm font-medium text-white hidden md:inline-block">
                <span className="text-accent-red font-bold">{nickname}</span>님 환영합니다
              </span>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-bold text-white bg-slate-700 rounded-md hover:bg-slate-600 transition-colors"
              >
                로그아웃
              </button>
            </>
          ) : (
            // 로그아웃 상태일 때 보여줄 UI (기존)
            <>
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                로그인
              </Link>
              <Link to="/signup" className="px-4 py-2 text-sm font-bold text-white bg-accent-red rounded-md hover:opacity-90 transition-opacity">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;