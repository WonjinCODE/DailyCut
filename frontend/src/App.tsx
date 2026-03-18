import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ResultPage from './pages/ResultPage';
import BingeCalcPage from './pages/BingeCalcPage';

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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
