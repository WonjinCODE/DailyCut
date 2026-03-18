const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommend.ctrl');

/**
 * 시간 맞춤 콘텐츠 추천 API
 * GET /api/contents/recommend
 */
router.get('/', getRecommendations);

module.exports = router;
