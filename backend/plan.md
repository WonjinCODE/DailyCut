# 🚀 DailyCut 백엔드(Backend) 10단계 초상세 개발 실행 계획 (Spring Boot)

본 문서는 `requirement.md` 스펙을 완벽하게 구현하기 위한 AI 어시스턴트 전용 10단계 작업 지시서이다. 각 단계를 수행할 때 명시된 클래스명, 로직 흐름, **특히 10단계의 러닝타임 누락 예외 로직**을 100% 준수하여 코드를 작성해야 한다.

---

### 1단계: 프로젝트 초기화 및 계층형 패키지 뼈대 구축
- **Spring Initializr 세팅:** Java 17, Spring Boot 3.x, Maven 기반 의존성(`Spring Web`, `Lombok`, `Validation`) 추가.
- **폴더 스캐폴딩:** `config`, `controller`, `service`, `dto`, `exception`, `utils` 패키지 생성.

### 2단계: 환경 변수(application.yml) 및 보안 설정
- **환경 변수 세팅:** `application.yml`에 `server.port: 8080` 및 `tmdb.api-key: ${TMDB_API_KEY}` 작성.
- **보안 적용:** `.gitignore`에 환경변수 파일 및 IDE 설정 파일 명시.

### 3단계: 전역 미들웨어(CORS) 및 Health Check API 구축
- **CORS 설정 (`config/CorsConfig.java`):** `WebMvcConfigurer` 구현, `http://localhost:5173` 접근 허용.
- **Health Check (`controller/HealthController.java`):** `GET /api/v1/health` 엔드포인트 구현 및 정상 작동 테스트.

### 4단계: 공통 에러 핸들링 및 응답 래퍼 설계
- **응답 래퍼 (`dto/ApiResponseDto.java`):** `success`, `data`, `error` 구조를 가진 제네릭 응답 객체 생성.
- **예외 처리기 (`exception/GlobalExceptionHandler.java`):** `@RestControllerAdvice`를 사용해 400, 500 에러를 `ApiResponseDto` 형식으로 포맷팅.

### 5단계: 데이터 매핑 Enum 및 유틸리티 구현
- **OTT 매핑 (`utils/OttProvider.java`):** "netflix,tving" ➔ "8|96" 형태 변환 정적 메서드 구현.
- **장르 매핑 (`utils/MoodGenre.java`):** "sleep" ➔ "99,18" 등 상황별 장르 ID 변환 메서드 구현.

### 6단계: TMDB 통신 전용 HTTP 클라이언트 세팅
- **RestTemplate 빈 등록 (`config/RestTemplateConfig.java`):**
  - `Authorization: Bearer {TMDB_API_KEY}` 헤더를 자동 주입하는 인터셉터 포함하여 빈(Bean) 등록.

### 7단계: 외부 연동 및 응답용 DTO 클래스 설계
- **TMDB 원본 DTO (`dto/TmdbResponseDto.java`):** TMDB JSON 규격(`results` 배열, `id`, `title`, `name`, `poster_path`, `genre_ids` 등) 매핑.
- **프론트 응답 DTO (`dto/ContentResponseDto.java`):** `id`, `type`, `title`, `posterUrl`, `popularity`, `genreIds`, **`isRuntimeFallback`** (boolean) 선언.

### 8단계: 추천 컨트롤러 - 파라미터 수신 및 검증
- **컨트롤러 (`controller/RecommendController.java`):**
  - `@GetMapping("/recommend")`
  - `@RequestParam Integer time`, `@RequestParam String otts`, `@RequestParam(required = false) String mode` 매핑.

### 9단계: 추천 서비스(1) - TMDB API 호출 로직
- **서비스 로직 (`service/RecommendService.java`):**
  - `UriComponentsBuilder`를 활용하여 `movie`, `tv` API 요청 URL 조합.
  - 파라미터 적용: `language=ko-KR`, `watch_region=KR`, `with_watch_providers=(OTT결과)`.
  - *참고:* 장르 Fallback 로직의 원활한 동작을 위해 `with_runtime.lte`를 엄격하게 걸지 않고 넓게 데이터를 가져온 뒤, Java 단에서 정밀하게 필터링.

### 10단계: 추천 서비스(2) - 통합, 정제, 정렬 및 장르 Fallback 필터링 로직 (핵심)
- **Stream API를 활용한 데이터 필터링 및 변환:**
  - 영화와 TV 데이터를 하나의 리스트로 병합.
  - `.filter(item -> item.getPosterPath() != null)`: 포스터 누락 데이터 제거.
  - **Fallback 필터링 적용:**
    - *조건 A:* TMDB 러닝타임이 존재하고, 입력받은 `time` 이하인 경우 ➔ `isRuntimeFallback = false`로 매핑.
    - *조건 B:* 러닝타임이 `0`이거나 누락되었지만, 입력받은 `mode` 장르와 일치하는 경우 ➔ `isRuntimeFallback = true`로 매핑.
    - 위 두 조건에 해당하지 않는 데이터는 버림.
  - `.map(...)`: `title`/`name` 통일, `poster_path` 절대경로 합성하여 `ContentResponseDto` 완성.
  - `.sorted(...)`: `popularity` 기준 내림차순 정렬.
  - `.limit(20)`: 최종 상위 20개 추출하여 `ApiResponseDto.success()`로 컨트롤러 반환.