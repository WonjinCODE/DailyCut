import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, nickname }),
      });

      const result = await response.json();

      if (result.success) {
        alert("회원가입이 완료되었습니다! 로그인해주세요.");
        navigate('/login'); 
      } else {
        alert("회원가입 실패: " + result.error?.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
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
          <p className="text-slate-400 text-sm">새로운 계정을 만들어보세요!</p>
        </div>
        
        <form onSubmit={handleSignup} className="space-y-5">
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
              placeholder="8자 이상 입력"
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-accent-red focus:ring-1 focus:ring-accent-red transition-all"
              placeholder="사용할 닉네임"
              required
              minLength={2}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 font-bold text-white bg-accent-red rounded-lg hover:opacity-90 transition-opacity mt-4"
          >
            가입하기
          </button>
        </form>
        
        <p className="text-sm text-center text-slate-400">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-accent-red font-medium hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;