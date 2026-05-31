import type {
  GenreCode,
  InteractionType,
  MyInteractionsResponse,
  OttCode,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    status: number;
    message: string;
  };
}

function buildAuthHeaders(includeJsonContentType = false): HeadersInit {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {};

  if (includeJsonContentType) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function requestApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...buildAuthHeaders(init?.body !== undefined),
      ...(init?.headers ?? {}),
    },
  });

  const result = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || !result?.success) {
    throw new Error(result?.error?.message || '마이페이지 요청에 실패했습니다.');
  }

  return result.data;
}

export function getMyInteractions(): Promise<MyInteractionsResponse> {
  return requestApi<MyInteractionsResponse>('/mypage/interactions');
}

export function updateMyInteraction(
  contentId: string,
  evaluationType: InteractionType
): Promise<string> {
  return requestApi<string>(`/mypage/interactions/${encodeURIComponent(contentId)}`, {
    method: 'PUT',
    body: JSON.stringify({ evaluationType }),
  });
}

export function deleteMyInteraction(contentId: string): Promise<string> {
  return requestApi<string>(`/mypage/interactions/${encodeURIComponent(contentId)}`, {
    method: 'DELETE',
  });
}

export async function getMyOtts(): Promise<OttCode[]> {
  const data = await requestApi<{ otts: OttCode[] }>('/mypage/otts');
  return data.otts ?? [];
}

export async function updateMyOtts(otts: OttCode[]): Promise<OttCode[]> {
  const data = await requestApi<{ otts: OttCode[] }>('/mypage/otts', {
    method: 'PUT',
    body: JSON.stringify({ otts }),
  });
  return data.otts ?? [];
}

export async function getMyPreferences(): Promise<GenreCode[]> {
  const data = await requestApi<{ genres: GenreCode[] }>('/mypage/preferences');
  return data.genres ?? [];
}

export async function updateMyPreferences(genres: GenreCode[]): Promise<GenreCode[]> {
  const data = await requestApi<{ genres: GenreCode[] }>('/mypage/preferences', {
    method: 'PUT',
    body: JSON.stringify({ genres }),
  });
  return data.genres ?? [];
}
