const axios = require('axios');

/**
 * TMDB API 통신 전용 Axios 인스턴스
 * - Base URL: TMDB v3 API 주소
 * - Authorization: .env에 저장된 API 키를 Bearer 토큰 형식으로 주입
 */
const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    accept: 'application/json'
  },
  params: {
    api_key: process.env.TMDB_API_KEY
  }
});

module.exports = tmdbClient;
