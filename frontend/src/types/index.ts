export interface OttPlatform {
  id: string;
  name: string;
  color: string;
  logoText: string;
}

export interface Content {
  id: string;
  title: string;
  posterUrl: string;
  runtime: number;
  platforms: string[];
  type: 'movie' | 'drama';
  rating: number;
  genre?: string[];
  releaseYear?: number;
  summary?: string;
}

export interface RecommendationParams {
  time: number;
  otts: string[];
  genre?: number[];
}

export interface DailyPlan {
  day: number;
  episodes: number[];
  totalTime: number;
}
