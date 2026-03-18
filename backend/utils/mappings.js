/**
 * OTT 서비스 영문명과 TMDB Provider ID 매핑 (watch_region=KR 기준)
 */
const OTT_MAP = {
  netflix: 8,
  watcha: 97,
  wavve: 356,
  tving: 96,
  disney: 337,
  coupang: 564
};

/**
 * 시청 상황(Mode)과 TMDB 장르 ID 매핑
 */
const MODE_MAP = {
  sleep: "99,18",      // Documentary, Drama
  commute: "35,16",    // Comedy, Animation
  meal: "10764,10751", // Reality, Family
  free: "28,878,53"    // Action, Sci-Fi, Thriller
};

/**
 * 프론트엔드의 콤마(,) 구분 OTT 문자열을 TMDB용 파이프(|) 구분 ID 문자열로 변환
 * @param {string} otts - 예: "netflix,tving"
 * @returns {string} - 예: "8|96"
 */
const parseOtts = (otts) => {
  if (!otts) return "";
  
  return otts
    .split(',')
    .map(name => OTT_MAP[name.trim().toLowerCase()])
    .filter(id => id !== undefined)
    .join('|');
};

/**
 * 시청 상황 키워드를 TMDB 장르 ID 문자열로 변환
 * @param {string} mode - 예: "sleep"
 * @returns {string} - 예: "99,18"
 */
const parseMode = (mode) => {
  if (!mode) return "";
  return MODE_MAP[mode.toLowerCase()] || "";
};

module.exports = {
  OTT_MAP,
  MODE_MAP,
  parseOtts,
  parseMode
};
