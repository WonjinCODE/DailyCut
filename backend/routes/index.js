const express = require('express');
const router = express.Router();
const recommendRoute = require('./recommend.route');

/**
 * API 루트 라우터 (/api)
 * - /contents/recommend 하위 경로로 추천 라우터 매핑
 */
router.use('/contents/recommend', recommendRoute);

module.exports = router;
