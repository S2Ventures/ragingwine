import type { BadgeType } from './types';

// --- Request ---
export interface ScanRequest {
  image: string; // base64-encoded
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
  context?: {
    partySize?: number;
    budget?: 'low' | 'moderate' | 'splurge';
    preferences?: string; // free-text: "love Pinot Noir, hate oaky Chardonnay"
  };
}

// --- Response ---
export interface WineRecommendation {
  name: string;
  producer: string;
  vintage?: string;
  price?: string; // as listed, e.g. "$14" or "$52"
  style: string; // e.g. "Red - Cabernet Sauvignon"
  badge?: BadgeType; // if the restaurant has a RagingWine review
  matchReason: string; // why this wine was recommended
  reviewSlug?: string; // link to existing review if restaurant matched
  confidence: 'high' | 'medium' | 'low';
}

export interface ListSummary {
  wineCount: number;
  priceRange: string; // e.g. "$9 – $85"
  stylesDetected: string[]; // e.g. ["Reds", "Whites", "Sparkling"]
}

export interface ScanResult {
  id: string; // nanoid
  recommendations: WineRecommendation[];
  restaurantGuess: string | null;
  listSummary: ListSummary;
  timestamp: string; // ISO
}

// --- Errors ---
export type ScanErrorCode =
  | 'invalid_image'
  | 'no_wines_found'
  | 'rate_limited'
  | 'api_error';

export interface ScanError {
  code: ScanErrorCode;
  message: string;
}
