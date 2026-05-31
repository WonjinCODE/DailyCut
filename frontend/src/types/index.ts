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
  sourceType?: 'movie' | 'tv';
  genreIds?: number[];
  rating: number;
  genre?: string[];
  releaseYear?: number;
  summary?: string;
  currentInteractionType?: InteractionType | null;
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

export type InteractionType = 'LIKE' | 'WATCHED' | 'DISLIKE';

export interface MyInteractionItem {
  contentId: string;
  title: string;
  contentType: string;
  posterUrl?: string;
  runtime?: number;
  genreIds?: number[];
  interactionType: InteractionType;
  createdAt?: string;
}

export interface MyInteractionsResponse {
  like: MyInteractionItem[];
  watched: MyInteractionItem[];
  dislike: MyInteractionItem[];
}

export type OttCode =
  | 'NETFLIX'
  | 'TVING'
  | 'WAVVE'
  | 'DISNEY_PLUS'
  | 'WATCHA'
  | 'COUPANG_PLAY';

export type GenreCode =
  | 'ACTION'
  | 'COMEDY'
  | 'ROMANCE'
  | 'THRILLER'
  | 'SF'
  | 'FANTASY'
  | 'CRIME'
  | 'DOCUMENTARY'
  | 'ANIMATION'
  | 'DRAMA';
