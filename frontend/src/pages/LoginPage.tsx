import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("accessToken", result.data.accessToken);
        localStorage.setItem("refreshToken", result.data.refreshToken);
        localStorage.setItem("nickname", result.data.nickname);

        alert(`${result.data.nickname}님 환영합니다!`);
        window.location.href = '/'; 
      } else {
        alert("로그인 실패: 이메일이나 비밀번호를 확인해주세요.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("서버와 연결할 수 없습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark px-4">
      {/* 유리 질감(Glassmorphism) 효과를 준 카드 UI */}
      <div className="w-full max-w-md p-8 space-y-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
        
        {/* 데일리컷 로고 영역 */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="bg-accent-red p-2 rounded-xl">
            <Play size={28} fill="white" stroke="white" />
          </div>
          <h2 className="text-2xl font-black tracking-tighter text-white mt-2">
            DAILY<span className="text-accent-red">CUT</span>
          </h2>
          <p className="text-slate-400 text-sm">다시 오신 것을 환영합니다!</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-accent-red focus:ring-1 focus:ring-accent-red transition-all"
              placeholder="example@dailycut.com"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-accent-red focus:ring-1 focus:ring-accent-red transition-all"
              placeholder="비밀번호 입력"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 font-bold text-white bg-accent-red rounded-lg hover:opacity-90 transition-opacity mt-4"
          >
            로그인
          </button>
        </form>
        
        <p className="text-sm text-center text-slate-400">
          아직 계정이 없으신가요?{' '}
          <Link to="/signup" className="text-accent-red font-medium hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
