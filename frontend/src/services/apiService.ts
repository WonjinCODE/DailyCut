const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface RecommendationResponse {
  success: boolean;
  data: Array<{
    id: number;
    type: 'movie' | 'tv';
    title: string;
    posterUrl: string;
    overview: string;
    popularity: number;
    genre_ids: number[];
  }>;
}

export const getRecommendations = async (
  time: number,
  otts: string[],
  mode: string
): Promise<RecommendationResponse> => {
  const ottsParam = otts.join(',');
  const url = `${API_BASE_URL}/contents/recommend?time=${time}&otts=${ottsParam}&mode=${mode}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('네트워크 응답에 문제가 발생했습니다.');
  }
  return response.json();
};
