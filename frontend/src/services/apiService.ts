import type { WatchLink } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export interface RecommendationItem {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  posterUrl: string;
  overview: string;
  popularity: number;
  genreIds?: number[];
  genre_ids?: number[];
  runtime?: number;
  tmdbRating?: number | null;
  watchLinks?: WatchLink[];
}

export interface RecommendationResponse {
  success: boolean;
  data: RecommendationItem[];
}

export const getRecommendations = async (
  time: number,
  otts: string[],
  genre?: number[]
): Promise<RecommendationResponse> => {
  const ottsParam = otts.join(',');
  let url = `${API_BASE_URL}/contents/recommend?time=${time}&otts=${ottsParam}`;
  
  if (genre && genre.length > 0) {
    url += `&genre=${genre.join(',')}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('네트워크 응답에 문제가 발생했습니다.');
  }
  return response.json();
};

// 마이페이지 응답 데이터 타입 정의
export interface MyPageData {
  email: string;
  nickname: string;
  subscribedOtts: string[];
  preferredGenres: string[];
}

// 마이페이지 정보 가져오기 (토큰 필요)
export const getMyPageInfo = async (): Promise<MyPageData> => {
  // 1. 로컬 스토리지에서 로그인할 때 저장해둔 토큰을 꺼냅니다.
  const token = localStorage.getItem('accessToken'); 
  
  const url = `${API_BASE_URL}/users/me`;

  // 2. fetch 요청 시 headers에 토큰을 담아서 보냅니다.
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // ✨ 핵심: 백엔드에 나임을 증명하는 신분증!
    },
  });

  if (!response.ok) {
    throw new Error('마이페이지 데이터를 불러오는데 실패했습니다.');
  }

  const result = await response.json();
  // 백엔드에서 ApiResponseDto.success(response) 형태로 감싸서 보냈으므로 .data로 꺼냅니다.
  return result.data; 
};
