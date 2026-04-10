# 🎬 DailyCut 백엔드(Backend) 상세 요구사항 명세서 (Spring Boot System Architecture & Requirements)

## 1. 시스템 개요 및 아키텍처 목적
본 문서는 프론트엔드(React/Vite)와 외부 API(TMDB) 사이를 중계하는 **Java 17 / Spring Boot 3.x 기반의 BFF(Backend For Frontend) 서버** 구축을 위한 절대적인 요구사항 명세서이다.
AI 어시스턴트는 본 문서의 스펙, 데이터 타입, 매핑 규칙, 그리고 Spring Boot의 계층형 아키텍처(Layered Architecture)를 100% 준수하여 코드를 작성해야 한다.

**핵심 아키텍처 원칙:**
- **Stateless REST API:** 백엔드는 자체 DB를 가지지 않으며(MVP 기준), 모든 요청은 TMDB API 실시간 호출로 처리된다.
- **Data Aggregation & Fallback:** TMDB API 호출 시 러닝타임 기반 필터링을 최우선으로 하되, 러닝타임 데이터가 누락된(0 또는 null) 콘텐츠는 '장르(Mood)' 일치 여부를 기준으로 유연하게 포함시키는 Fallback 로직을 적용한다.
- **Data Refining:** 프론트엔드 컴포넌트(`ContentCard`)에 즉시 주입 가능한 형태로 DTO를 설계하여 JSON 키(Key)와 값을 엄격하게 정제한다.

---

## 2. API 엔드포인트 상세 스펙

### [API 1] Health Check (서버 상태 확인)
- **Method & Path:** `GET /api/v1/health`
- **Response Format:**
  ```json
  { "success": true, "message": "DailyCut Spring Boot API is running", "timestamp": "2026-04-10T14:00:00Z" }
[API 2] Time-Fit 콘텐츠 추천 (Core Engine)
Method & Path: GET /api/v1/contents/recommend

Request Query Parameters (유효성 검사 필수):

time (Integer, 필수): 최대 시청 가능 시간 (분). 미입력 시 400 에러.

otts (String, 필수): 콤마(,)로 구분된 OTT 영문명 (예: netflix,tving). 미입력 시 400 에러.

mode (String, 선택): 시청 상황 (sleep, commute, meal, free 중 택 1).

TMDB API 호출 타겟 (Service 계층에서 병렬 또는 순차 호출):

GET https://api.themoviedb.org/3/discover/movie

GET https://api.themoviedb.org/3/discover/tv

3. 데이터 매핑 (Mapping) 딕셔너리
이 규칙은 서비스 로직에 하드코딩하지 말고 utils 패키지 내부에 **Java Enum (예: OttProvider.java, MoodGenre.java)**으로 정의하여 참조할 것.

3.1 OTT Provider IDs (watch_region=KR 기준)
netflix ➔ 8, watcha ➔ 97, wavve ➔ 356, tving ➔ 96, disney ➔ 337, coupang ➔ 564
(프론트에서 netflix,tving 수신 시 ➔ TMDB 파라미터 8|96 형식으로 파싱)

3.2 시청 무드(Mode) Genre IDs
sleep ➔ 99 (Documentary), 18 (Drama)

commute ➔ 35 (Comedy), 16 (Animation)

meal ➔ 10764 (Reality), 10751 (Family)

free ➔ 28 (Action), 878 (Sci-Fi), 53 (Thriller)

4. 데이터 정제(Refining) 및 예외 처리 스키마
4.1 속성 통합 및 예외 처리 규칙 (매우 중요)
러닝타임 누락 예외 (Fallback Logic): TMDB 데이터 중 러닝타임이 0이거나 null인 경우 무조건 배제하지 않는다. 사용자가 선택한 mode(장르)와 일치하는 genre_ids를 가지고 있다면 예외적으로 추천 배열에 포함시킨다.

고유 ID & 타입: 원본 id 유지. 식별을 위해 type 속성(movie 또는 tv)을 DTO에 수동으로 추가.

제목 (Title): 영화는 title, TV는 name 속성을 title 필드로 통일.

포스터 URL: 원본 poster_path 앞에 https://image.tmdb.org/t/p/w500를 결합. null이면 객체 제외.

정렬 & 제한: Movie와 TV 배열을 합친 후 popularity 기준으로 내림차순 정렬하여 최대 20개만 반환.

4.2 최종 Response JSON 스키마 (ApiResponse<T> 래퍼 사용)
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
      "genreIds": [28, 878],
      "isRuntimeFallback": false
    }
  ],
  "error": null
}
5. 예외 처리 (Global Error Handling) 규칙
형식: { "success": false, "data": null, "error": { "status": HTTP코드, "message": "에러 내용" } }

400 에러: 필수 파라미터 누락 시 @RestControllerAdvice에서 즉시 400 반환.

500 에러: 외부 API 호출 실패나 서버 내부 오류 시 500 에러 응답 포맷으로 안전하게 처리 (서버 크래시 방지).

6. 시스템 디렉토리 구조 (준수 필수)
Plaintext
backend/
 ┣ src/main/java/com/dailycut/backend/
 ┃ ┣ config/             # CorsConfig, RestTemplateConfig
 ┃ ┣ controller/         # HealthController, RecommendController
 ┃ ┣ service/            # RecommendService (로직, API 호출)
 ┃ ┣ dto/                # ContentResponseDto, ApiResponseDto, TmdbResponseDto
 ┃ ┣ exception/          # GlobalExceptionHandler
 ┃ ┗ utils/              # OttProvider, MoodGenre (Enum)
 ┗ src/main/resources/
   ┗ application.yml     # 포트 및 TMDB API 키 설정