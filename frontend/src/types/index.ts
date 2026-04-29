export interface OttPlatform {
  id: string;
  name: string;
  color: string;
  logoText: string;
}

export interface WatchLink {
  providerCode: string;
  providerName: string;
  url: string;
}

export interface Content {
  id: string;
  title: string;
  posterUrl: string;
  runtime: number;
  platforms: string[];
  watchLinks?: WatchLink[];
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
