# 🎬 DailyCut 백엔드(Backend) 상세 요구사항 명세서 (System Architecture & Requirements)

## 1. 시스템 개요 및 아키텍처 목적
본 문서는 프론트엔드(React/Vite)와 외부 API(TMDB) 사이를 중계하는 Node.js/Express 기반의 BFF(Backend For Frontend) 서버 구축을 위한 절대적인 요구사항 명세서이다.
AI 어시스턴트는 본 문서의 스펙, 데이터 타입, 매핑 규칙을 100% 준수하여 코드를 작성해야 한다.

**핵심 아키텍처 원칙:**
- **Stateless REST API:** 백엔드는 자체 DB를 가지지 않으며, 모든 요청은 TMDB API 실시간 호출로 처리된다.
- **Data Aggregation:** TMDB의 `/discover/movie`와 `/discover/tv` 엔드포인트를 병렬(`Promise.all`)로 호출하여 단일 배열로 병합한다.
- **Data Refining:** 프론트엔드 컴포넌트(`ContentCard`)에 즉시 주입 가능한 형태로 JSON 키(Key)와 값을 정제한다.

## 2. API 엔드포인트 상세 스펙

### [API 1] Health Check (서버 상태 확인)
- **Method & Path:** `GET /api/health`
- **Response Format:**
  ```json
  { "success": true, "message": "DailyCut API is running", "timestamp": "ISO-8601-String" }
[API 2] Time-Fit 콘텐츠 추천 (Core Engine)
Method & Path: GET /api/contents/recommend

Request Query Parameters (유효성 검사 필수):

time (Number, 필수): 최대 시청 가능 시간 (분). 미입력 시 400 에러 반환.

otts (String, 필수): 콤마(,)로 구분된 OTT 영문명 (예: netflix,tving,watcha). 미입력 시 400 에러.

mode (String, 선택): 시청 상황. sleep, commute, meal, free 중 택 1.

TMDB API 호출 타겟 (2개 동시 호출):

GET https://api.themoviedb.org/3/discover/movie

GET https://api.themoviedb.org/3/discover/tv

TMDB Request Params (필수 주입 속성):

language: 'ko-KR'

watch_region: 'KR'

sort_by: 'popularity.desc'

with_watch_providers: (프론트 파라미터를 변환한 ID 값, | 로 연결)

with_runtime.lte: req.query.time 값

with_genres: (mode 파라미터가 있을 경우 변환된 장르 ID)

3. 데이터 매핑 (Mapping) 딕셔너리
이 규칙은 하드코딩하지 말고 utils/mappings.js 등에 상수로 정의하여 참조할 것.

3.1 OTT Provider IDs (watch_region=KR 기준)

Netflix (netflix) : 8

Watcha (watcha) : 97

Wavve (wavve) : 356

TVING (tving) : 96

Disney Plus (disney) : 337

Coupang Play (coupang) : 564
(로직 요구사항: 프론트에서 netflix,tving 수신 시 ➔ TMDB 파라미터 8|96 형식으로 파싱)

3.2 시청 무드(Mode) Genre IDs

sleep ➔ 99 (Documentary), 18 (Drama)

commute ➔ 35 (Comedy), 16 (Animation)

meal ➔ 10764 (Reality), 10751 (Family)

free ➔ 28 (Action), 878 (Sci-Fi), 53 (Thriller)

4. 데이터 정제(Refining) 및 응답 스키마
TMDB API는 영화와 TV의 응답 속성명이 다르다. 백엔드 컨트롤러에서 이를 통합하여 프론트엔드용 스키마로 강제 변환해야 한다.

4.1 속성 통합 규칙 (매우 중요)

고유 ID & 타입: 원본 id 유지. 식별을 위해 type 속성(movie 또는 tv)을 수동으로 추가.

제목 (Title): 영화는 title, TV는 name 속성으로 들어온다. 응답 시 모두 title로 통일.

포스터 URL (Poster): 원본 poster_path (/xxx.jpg) 앞에 https://image.tmdb.org/t/p/w500를 결합하여 절대 경로인 posterUrl로 반환. poster_path가 null이면 해당 객체는 결과 배열에서 제외(filter)할 것.

러닝타임 (Runtime): 원본 데이터를 그대로 넘길 것.

정렬: Movie와 TV 배열을 합친 후 popularity 기준으로 내림차순 정렬하여 최대 20개만 반환.

4.2 최종 Response JSON 스키마 (프론트엔드 전달용)

JSON
{
  "success": true,
  "data": [
    {
      "id": 12345,
      "type": "movie",
      "title": "인셉션",
      "posterUrl": "[https://image.tmdb.org/t/p/w500/8Z8dptN9...jpg](https://image.tmdb.org/t/p/w500/8Z8dptN9...jpg)",
      "overview": "꿈속의 꿈으로 들어가...",
      "popularity": 85.3,
      "genre_ids": [28, 878]
    }
  ],
  "error": null
}
5. 예외 처리 (Error Handling) 규칙
안정성을 위해 모든 에러는 일관된 구조로 래핑하여 반환한다.

형식: { "success": false, "data": null, "error": { "status": HTTP코드, "message": "에러 내용" } }

400 에러: time 또는 otts 쿼리가 없을 경우, 외부 API를 호출하지 않고 즉시 400 반환.

500 에러: 모든 외부 Axios 통신은 try...catch로 감싸고, TMDB API 타임아웃 또는 키 오류 시 500 에러로 안전하게 처리. 서버가 중단(Crash)되어서는 안 된다.

6. 개발 환경 및 코딩 컨벤션
언어 및 모듈: Node.js, CommonJS (require 구문) 또는 ES Modules (선택 일관성 유지). Express 프레임워크 사용.

미들웨어:

cors: http://localhost:5173 출처만 명시적으로 허용. (보안)

express.json(): JSON 파싱.

dotenv: 최상단에서 .env 로드.

상태 및 환경 변수: PORT=5000, TMDB_API_KEY=your_key는 반드시 .env에서 관리.

파일 분리 원칙 (관심사 분리):

라우터(routes/contents.js)에는 경로만 지정.

실제 API 호출과 데이터 조작 로직은 controllers/contentsController.js에 작성.

외부 통신 설정은 config/tmdbClient.js에 Axios 인스턴스로 분리 (Base URL, Auth Header 사전 세팅).

7. 시스템 디렉토리 구조
AI는 코드 생성 시 다음 구조를 반드시 준수하여 파일을 분할 생성해야 한다.

Plaintext
backend/
 ┣ 📂 config/
 ┃ ┗ 📜 tmdb.js             # Axios 인스턴스 (Authorization 헤더 주입)
 ┣ 📂 controllers/
 ┃ ┗ 📜 recommend.ctrl.js   # 핵심 추천 비즈니스 로직 (병합, 정제)
 ┣ 📂 routes/
 ┃ ┣ 📜 index.js            # 라우터 엔트리 (api/ -> 각 라우터로 분배)
 ┃ ┗ 📜 recommend.route.js  # /recommend 경로 정의
 ┣ 📂 utils/
 ┃ ┣ 📜 mappings.js         # OTT, 장르 매핑 상수 및 헬퍼 함수
 ┃ ┗ 📜 errorHandler.js     # 공통 에러 응답 포맷터
 ┣ 📜 .env
 ┣ 📜 .gitignore
 ┣ 📜 package.json
 ┗ 📜 server.js             # Express 서버 진입점