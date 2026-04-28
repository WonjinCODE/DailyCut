import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ResultPage from './pages/ResultPage';
import BingeCalcPage from './pages/BingeCalcPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
// 👇 1. MyPage 컴포넌트를 불러옵니다!
import MyPage from './pages/MyPage'; 

// 임시 컴포넌트
const NotFoundPage = () => <div className="p-20 text-center text-4xl font-bold text-white bg-dark min-h-screen">404 - 페이지를 찾을 수 없습니다.</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recommend" element={<HomePage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/calculator" element={<BingeCalcPage />} />
        
        {/* ⭐ 로그인 및 회원가입 라우트 추가 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* 👇 2. 마이페이지 라우트를 추가합니다! (반드시 * 라우트보다 위에 있어야 해요) */}
        <Route path="/mypage" element={<MyPage />} />
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;