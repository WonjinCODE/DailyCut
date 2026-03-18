require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/index'); // 통합 라우터 임포트

const app = express();
const PORT = process.env.PORT || 5000;

// 전역 미들웨어 세팅
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173' // 프론트엔드 출처 명시적 허용
}));

// API 라우터 마운트 (/api 경로로 진입점 설정)
app.use('/api', apiRoutes);

// Health Check API (서버 상태 확인용)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: "DailyCut API is running",
    timestamp: new Date().toISOString()
  });
});

// 서버 리슨
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
