const tmdbClient = require('../config/tmdb');
const { parseOtts, parseMode } = require('../utils/mappings');
const { createSuccess, createError } = require('../utils/responseHandler');

/**
 * 시간 맞춤형 콘텐츠 추천 컨트롤러
 * GET /api/contents/recommend
 */
const getRecommendations = async (req, res) => {
  try {
    // 1. 파라미터 추출
    const { time, otts, mode } = req.query;

    // 2. 필수 파라미터 유효성 검증 (Validation)
    if (!time || !otts) {
      return res.status(400).json(
        createError(400, "time과 otts 파라미터는 필수입니다.")
      );
    }

    // 3. 데이터 파싱 (TMDB용 파라미터로 변환)
    const providerIds = parseOtts(otts);
    const genreIds = parseMode(mode);

    // 4. TMDB 공통 쿼리 파라미터 조립
    const baseParams = {
      language: 'ko-KR',
      watch_region: 'KR',
      sort_by: 'popularity.desc',
      'with_runtime.lte': time,
      with_watch_providers: providerIds
    };

    // 장르 ID가 있을 경우에만 추가
    if (genreIds) {
      baseParams.with_genres = genreIds;
    }

    // 5. Promise.all 기반 병렬 API 호출
    const [movieRes, tvRes] = await Promise.all([
      tmdbClient.get('/discover/movie', { params: baseParams }),
      tmdbClient.get('/discover/tv', { params: baseParams })
    ]);

    // 6. 데이터 정제 및 병합 (Refining & Merging)
    const movieMovies = movieRes.data.results.map(item => ({ ...item, type: 'movie' }));
    const tvShows = tvRes.data.results.map(item => ({ ...item, type: 'tv' }));

    const combinedData = [...movieMovies, ...tvShows];

    // 7. 필터링, 정제, 정렬 체이닝
    const finalData = combinedData
      .filter(item => item.poster_path !== null) // 포스터 없는 데이터 제거
      .map(item => ({
        id: item.id,
        type: item.type,
        title: item.title || item.name, // 영화는 title, TV는 name 사용
        posterUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`, // 절대 경로 합성
        overview: item.overview,
        popularity: item.popularity,
        genre_ids: item.genre_ids
      }))
      .sort((a, b) => b.popularity - a.popularity) // 인기도 내림차순 정렬
      .slice(0, 100); // 상위 100개 추출

    // 8. 최종 응답 반환
    res.status(200).json(createSuccess(finalData));

  } catch (error) {
    console.error('TMDB API Call Error:', error.message);
    
    // 외부 API 호출 실패 시 500 에러 반환
    const status = error.response ? error.response.status : 500;
    const message = "TMDB API 호출 중 오류가 발생했습니다.";
    
    res.status(status).json(createError(status, message));
  }
};

module.exports = {
  getRecommendations
};
