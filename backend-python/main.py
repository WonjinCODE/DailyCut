from fastapi import FastAPI
import requests
from bs4 import BeautifulSoup

app = FastAPI()

# FlixPatrol: Netflix 공식 Top10 데이터를 집계하는 서드파티 사이트
# requests + BeautifulSoup으로 파싱 가능 (서버사이드 렌더링)
# Netflix Tudum 직접 크롤링은 SPA(JS 렌더링)라 requests로 불가
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}


@app.get("/")
def root():
    return {"message": "Crawling Test Server Running"}


@app.get("/crawl/netflix-top10-kr")
def crawl_netflix_top10_kr():
    """
    FlixPatrol에서 Netflix 한국 Top10 크롤링
    - /title/ 경로 포함 링크만 수집 (콘텐츠 링크)
    - 숫자만 있는 링크(순위 이미지)는 제외
    - 중복 제거 후 순위 부여
    - 앞 10개: 영화 / 뒤 10개: TV 시리즈
    """
    url = "https://flixpatrol.com/top10/netflix/south-korea/"

    try:
        res = requests.get(url, headers=HEADERS, timeout=10, verify=False)
        res.raise_for_status()
    except requests.RequestException as e:
        return {"success": False, "error": str(e)}

    soup = BeautifulSoup(res.text, "html.parser")

    # /title/ 포함된 링크만 수집 → 콘텐츠 제목 링크
    all_links = soup.find_all("a", href=lambda h: h and "/title/" in h)

    # 숫자(순위 이미지 링크) 제외, 텍스트 있는 것만
    title_links = [
        a for a in all_links
        if a.get_text(strip=True) and not a.get_text(strip=True).isdigit()
    ]

    # 중복 제거
    seen = set()
    unique_titles = []
    for a in title_links:
        text = a.get_text(strip=True)
        if text not in seen:
            seen.add(text)
            unique_titles.append({
                "title": text,
                "link": "https://flixpatrol.com" + a.get("href", "")
            })

    # 순위 부여
    ranked = [{"rank": i + 1, **item} for i, item in enumerate(unique_titles)]

    return {
        "success": True,
        "source_url": url,
        "movies": ranked[:10],      # 영화 Top10
        "tv_shows": ranked[10:20],  # TV 시리즈 Top10
    }


@app.get("/debug/links")
def debug_links():
    """
    [디버깅용] FlixPatrol 페이지의 /title/ 링크 구조 확인
    - selector 수정 필요할 때 사용
    - 실제 서비스에서는 제거해도 됨
    """
    url = "https://flixpatrol.com/top10/netflix/south-korea/"
    res = requests.get(url, headers=HEADERS, timeout=10, verify=False)
    soup = BeautifulSoup(res.text, "html.parser")

    links = soup.find_all("a", href=lambda h: h and "/title/" in h)
    return {
        "count": len(links),
        "sample": [
            {"text": a.get_text(strip=True), "href": a["href"], "class": a.get("class")}
            for a in links[:30]
        ]
    }9;