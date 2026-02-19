// ---------------------------------------------------------------------------
// Pipeline-specific types
// ---------------------------------------------------------------------------

/** Raw restaurant data from Perplexity research */
export interface ResearchedRestaurant {
  name: string;
  neighborhood: string;
  cuisineType: string;
  website?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  // Wine program intel
  wineListSize?: string;         // "40 bottles", "200+ labels"
  byTheGlassCount?: string;      // "12 options"
  priceRange?: string;           // "$8-$22/glass, $30-$150/bottle"
  notableWines?: string[];       // Specific wines or producers carried
  wineRegionFocus?: string[];    // "Napa", "Burgundy", "Georgia"
  sommelierOnStaff?: boolean;
  halfPriceNight?: string;       // "Tuesday" or null
  halfPriceDetails?: string;
  // General observations
  vibeDescription?: string;
  popularDishes?: string[];
  reservationRecommended?: boolean;
  dressCode?: string;
  averageEntreePrice?: string;
  // Source quality
  sourcesFound: number;          // How many distinct sources referenced
  confidenceLevel: 'high' | 'medium' | 'low';
}

/** A full city research payload */
export interface CityResearch {
  city: string;
  citySlug: string;
  state: string;
  researchedAt: string;
  restaurants: ResearchedRestaurant[];
}

/** Review ready for Sanity publishing */
export interface GeneratedReview {
  slug: string;
  restaurant: string;
  neighborhood: string;
  city: string;
  citySlug: string;
  cuisineType: string;
  badge: 'rager' | 'wildcard' | 'reliable' | 'lazy';
  metrics: {
    glassware: string;
    staff: string;
    markup: string;
    variety: string;
    specials: string;
    storage: string;
  };
  // Structured format (default)
  firstImpression: string;
  selectionDeepDive: string;
  byTheGlass: string;
  bestValue: { wine: string; price: string; note: string };
  hiddenGem: { wine: string; note: string };
  skipThis: { wine: string; note: string };
  perfectPairing: { wine: string; dish: string; note: string };
  bottomLine: string;
  subtitle?: string;
  tags?: string[];
  halfPriceWineNight?: { day: string; details?: string };
  website?: string;
  address?: { street: string; city: string; state: string; zip: string; country: string };
}

/** Pipeline run result for morning report */
export interface PipelineResult {
  city: string;
  citySlug: string;
  startedAt: string;
  completedAt: string;
  restaurantsResearched: number;
  reviewsWritten: number;
  reviewsPublished: number;
  errors: string[];
  reviews: Array<{
    restaurant: string;
    slug: string;
    badge: string;
    published: boolean;
    error?: string;
  }>;
}

/** City queue entry */
export interface CityQueueEntry {
  city: string;
  citySlug: string;
  state: string;
  priority: number;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  lastRunAt?: string;
  reviewCount?: number;
}
