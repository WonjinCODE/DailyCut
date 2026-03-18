# 🚀 DailyCut 백엔드(Backend) 10단계 초상세 개발 실행 계획

본 문서는 `backend-requirement.md` 스펙을 완벽하게 구현하기 위한 AI 어시스턴트(Gemini CLI) 전용 10단계 작업 지시서이다. 각 단계를 수행할 때 명시된 변수명, 파일 경로, 로직 흐름을 100% 준수하여 코드를 작성해야 한다.

---

### 1단계: 프로젝트 초기화 및 디렉토리 구조 뼈대 구축
- **Node.js 환경 초기화:** 루트 디렉토리에서 `npm init -y` 실행하여 `package.json` 생성.
- **필수 의존성 패키지 설치:** `npm install express axios cors dotenv` 실행.
- **개발용 의존성 패키지 설치:** `npm install -D nodemon` 실행.
- **폴더 구조 스캐폴딩 (관심사 분리):**
  - `config/` (외부 API 클라이언트 설정 폴더)
  - `controllers/` (비즈니스 핵심 로직 폴더)
  - `routes/` (API 엔드포인트 라우팅 폴더)
  - `utils/` (재사용 가능한 헬퍼 함수 및 매핑 상수 폴더)
- **실행 스크립트 추가:** `package.json`의 `"scripts"` 블록에 `"dev": "nodemon server.js"` 명령어 추가.

### 2단계: 환경 변수(.env) 및 깃(Git) 보안 설정
- **환경 변수 파일 생성:** 루트 디렉토리에 `.env` 파일 생성.
- **포트 및 API 키 설정:** `.env` 내부에 `PORT=5000` 및 `TMDB_API_KEY=여기에_발급받은_키_입력` 작성 (실제 키는 로컬에서 수동 입력).
- **Git 무시 파일 생성:** 루트 디렉토리에 `.gitignore` 파일 생성.
- **보안 철칙 적용:** `.gitignore` 내부에 `node_modules/`, `.env`, `.DS_Store` 등을 명시하여 민감한 정보의 깃허브 유출 원천 차단.

### 3단계: 진입점(server.js) 및 기본 미들웨어 / Health Check 구축
- **파일 생성:** 루트 디렉토리에 `server.js` 파일 생성.
- **모듈 로드 및 초기화:** 최상단에서 `require('dotenv').config()` 호출 후 `express` 모듈 로드.
- **전역 미들웨어 세팅:**
  - `app.use(express.json())`: 클라이언트의 JSON 요청 본문 파싱.
  - `app.use(cors({ origin: 'http://localhost:5173' }))`: 프론트엔드 출처만 명시적으로 허용하여 보안 강화.
- **Health Check API 라우터 작성:**
  - `GET /api/health` 경로 생성.
  - 응답 포맷: `{ success: true, message: "DailyCut API is running", timestamp: new Date().toISOString() }`
- **서버 리슨(Listen):** `process.env.PORT || 5000` 포트로 서버를 열고, 정상 구동 시 `console.log`로 포트 번호 출력.

### 4단계: TMDB 통신 전용 Axios 인스턴스(config/tmdb.js) 세팅
- **파일 생성:** `config/tmdb.js` 파일 생성.
- **Axios 인스턴스화:** `axios.create()`를 사용하여 `tmdbClient` 객체 생성.
- **Base URL 고정:** `baseURL: 'https://api.themoviedb.org/3'` 설정.
- **공통 Headers 주입:**
  - `accept: 'application/json'`
  - `Authorization: 'Bearer ' + process.env.TMDB_API_KEY` (템플릿 리터럴 적용)
- **모듈 내보내기:** `module.exports = tmdbClient;`를 통해 다른 파일에서 재사용할 수 있도록 Export.

### 5단계: 데이터 변환 딕셔너리 및 유틸리티(utils/mappings.js) 구현
- **파일 생성:** `utils/mappings.js` 파일 생성.
- **OTT 변환 상수 객체(`OTT_MAP`):** `{ netflix: 8, watcha: 97, wavve: 356, tving: 96, disney: 337, coupang: 564 }` 하드코딩.
- **Mode 변환 상수 객체(`MODE_MAP`):** `{ sleep: "99,18", commute: "35,16", meal: "10764,10751", free: "28,878,53" }` 하드코딩.
- **`parseOtts` 함수 구현:** `"netflix,tving"` 형태의 콤마 스트링을 인자로 받아, `.split(',')` 후 `OTT_MAP`에서 매칭되는 숫자 배열을 찾고, `.join('|')`를 사용해 `"8|96"` 형태의 OR 검색 파이프 스트링으로 반환하는 로직 작성. 매칭되지 않는 값은 필터링.
- **`parseMode` 함수 구현:** 문자열 키를 받아 `MODE_MAP`의 값을 반환, 매칭 안 되면 빈 문자열 `""` 반환.
- 두 함수를 `module.exports`로 내보내기.

### 6단계: 공통 에러 핸들링 및 응답 래퍼(utils/responseHandler.js) 구현
- **파일 생성:** `utils/responseHandler.js` 파일 생성 (일관된 응답 규격을 위함).
- **성공 응답 생성 함수(`createSuccess`):** 인자로 `data`를 받아 `{ success: true, data: data, error: null }` 반환.
- **실패 응답 생성 함수(`createError`):** 인자로 `status`(HTTP 코드), `message`(에러 내용)를 받아 `{ success: false, data: null, error: { status, message } }` 반환.
- 두 함수를 Export 하여 컨트롤러에서 사용할 수 있도록 준비.

### 7단계: 추천 컨트롤러(1) - 파라미터 추출 및 유효성 검증
- **파일 생성:** `controllers/recommend.ctrl.js` 파일 생성.
- **모듈 임포트:** `tmdbClient`, `mappings.js`, `responseHandler.js` 모두 불러오기.
- **메인 비동기 함수 구조화:** `const getRecommendations = async (req, res) => { try { ... } catch (error) { ... } }` 형태로 작성.
- **파라미터 추출:** `const { time, otts, mode } = req.query;`
- **방어 로직 (Validation):** `if (!time || !otts)` 조건문 작성. 누락 시 `res.status(400).json(createError(400, "time과 otts 파라미터는 필수입니다."))` 즉시 반환(Early Return).
- **데이터 파싱:** `const providerIds = parseOtts(otts);`, `const genreIds = parseMode(mode);` 실행.

### 8단계: 추천 컨트롤러(2) - Promise.all 기반 TMDB 병렬 API 호출
- **공통 쿼리 파라미터 객체 조립:**
  ```javascript
  const baseParams = {
    language: 'ko-KR',
    watch_region: 'KR',
    sort_by: 'popularity.desc',
    'with_runtime.lte': time,
    with_watch_providers: providerIds
  };
  if (genreIds) baseParams.with_genres = genreIds;
병렬 호출 실행: Promise.all()을 사용하여 아래 두 요청을 동시에 실행(await)하고 각각 movieRes, tvRes 변수에 할당.

tmdbClient.get('/discover/movie', { params: baseParams })

tmdbClient.get('/discover/tv', { params: baseParams })

Catch 블록 에러 처리: 외부 API 호출 실패 시 res.status(500).json(createError(500, "TMDB API 호출 중 오류가 발생했습니다.")) 반환.

9단계: 추천 컨트롤러(3) - 데이터 정제(Refining), 병합, 정렬 로직 적용
타입 주입 (Map): movieRes.data.results 배열의 모든 요소에 type: 'movie' 추가. tvRes.data.results 배열에는 type: 'tv' 추가.

배열 병합: const combinedData = [...movieMovies, ...tvShows];

데이터 필터링 및 정제 체이닝 (.filter().map()):

.filter(item => item.poster_path !== null): 포스터 없는 데이터 제거.

.map(item => ({ ... })): 아래 속성만 남기도록 객체 재조립.

id: item.id

type: item.type

title: item.title || item.name (영화/TV 제목 통합)

posterUrl: 'https://image.tmdb.org/t/p/w500' + item.poster_path (절대 경로 합성)

overview: item.overview

popularity: item.popularity

정렬 및 자르기: 결과 배열에 .sort((a, b) => b.popularity - a.popularity) 적용 후 .slice(0, 20)으로 상위 20개 추출.

최종 응답: res.status(200).json(createSuccess(finalData)) 반환.

모듈 Export: module.exports = { getRecommendations };

10단계: 라우터 모듈화(routes/) 및 서버 최종 연동
추천 라우터 생성: routes/recommend.route.js 파일 생성.

express.Router() 인스턴스 생성.

router.get('/', getRecommendations) 컨트롤러 바인딩 및 Export.

통합 라우터 생성: routes/index.js 파일 생성.

express.Router() 인스턴스 생성.

router.use('/contents/recommend', require('./recommend.route'))로 하위 경로 매핑 및 Export.

server.js 최종 마운트: server.js로 돌아가 const apiRoutes = require('./routes/index'); 추가 후 app.use('/api', apiRoutes); 등록.