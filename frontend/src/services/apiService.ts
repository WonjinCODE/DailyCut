import type { InteractionType, WatchLink } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';

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
  currentInteractionType?: InteractionType | null;
}

export interface RecommendationResponse {
  success: boolean;
  data: RecommendationItem[];
}

export interface EvaluationRequestPayload {
  evaluationType: InteractionType;
  title: string;
  type: 'movie' | 'tv';
  genreIds: number[];
  posterUrl: string;
  runtime: number;
}

function buildAuthHeaders(includeJsonContentType = false): HeadersInit {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {};

  if (includeJsonContentType) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

async function getErrorMessage(response: Response, fallbackMessage: string): Promise<string> {
  try {
    const result = await response.json();
    return result?.error?.message || result?.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
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

  const response = await fetch(url, {
    headers: buildAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, '추천 데이터를 불러오지 못했습니다.'));
  }
  return response.json();
};

export const evaluateContent = async (
  contentId: string,
  payload: EvaluationRequestPayload
): Promise<string> => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('로그인이 필요한 기능입니다.');
  }

  const response = await fetch(`${API_BASE_URL}/contents/${contentId}/evaluate`, {
    method: 'POST',
    headers: buildAuthHeaders(true),
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success) {
    throw new Error(result?.error?.message || '반응 저장에 실패했습니다.');
  }

  return typeof result.data === 'string' ? result.data : '반응이 저장되었습니다.';
};

export const deleteEvaluation = async (contentId: string): Promise<string> => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('로그인이 필요한 기능입니다.');
  }

  const response = await fetch(`${API_BASE_URL}/contents/${contentId}/evaluate`, {
    method: 'DELETE',
    headers: buildAuthHeaders(),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success) {
    throw new Error(result?.error?.message || '반응 취소에 실패했습니다.');
  }

  return typeof result.data === 'string' ? result.data : '반응이 취소되었습니다.';
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
