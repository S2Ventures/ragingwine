export type BadgeType = 'rager' | 'wildcard' | 'reliable' | 'lazy';

export type GlasswareGrade = 'Varietal Specific' | 'Stemless Casual' | 'Red Flag';
export type StaffConfidence = 'Knowledgeable & Friendly' | 'Willing but Green' | 'Rotating Cast' | 'Gatekeeper' | 'MIA';
export type MarkupFairness = 'Fair' | 'Steep' | 'Steal' | 'Gouge';
export type ListVariety = 'Deep & Eclectic' | 'Solid Range' | 'Small but Thoughtful' | 'Crowd Pleasers' | 'Surprising Depth' | 'Plays It Safe' | 'Grocery Store';
export type SpecialsAndDeals = 'Active Program' | 'Seasonal Rotation' | 'Occasional' | 'Set & Forget';
export type StorageAndTemp = 'Proper' | 'Acceptable' | 'Hot Mess';

export interface WingmanMetrics {
  glassware: GlasswareGrade;
  staff: StaffConfidence;
  markup: MarkupFairness;
  variety: ListVariety;
  specials: SpecialsAndDeals;
  storage: StorageAndTemp;
}

export interface EditorialSection {
  title: string;
  body: string;
}

export interface Review {
  slug: string;
  restaurant: string;
  neighborhood: string;
  city: string;
  citySlug: string;
  cuisineType: string;
  badge: BadgeType;
  metrics?: WingmanMetrics;
  firstImpression?: string;
  selectionDeepDive?: string;
  byTheGlass?: string;
  bestValue?: { wine: string; price: string; note: string };
  hiddenGem?: { wine: string; note: string };
  skipThis?: { wine: string; note: string };
  perfectPairing?: { wine: string; dish: string; note: string };
  bottomLine: string;
  publishedAt: string;
  heroImage?: string;
  // Editorial format (looser narrative style)
  editorial?: EditorialSection[];
  subtitle?: string;
  tags?: string[];
  // Half-price wine night deal
  halfPriceWineNight?: { day: string; details?: string };
}

export interface City {
  name: string;
  slug: string;
  state: string;
  tagline: string;
  description: string;
}

// Winery types
export type GrapeSourcing = '100% Estate' | 'Estate + Sourced' | 'Primarily Sourced';

export interface Winery {
  slug: string;
  stateSlug: string;
  name: string;
  region: string;
  location: string;
  grapes: string;
  sourcing: GrapeSourcing;
  tastingPrice: string;
  tastingDetails: string;
  hours: string;
  food: string;
  entertainment: string;
  rating: string;
  ratingSource: string;
  highlights: string[];
  description: string;
  website?: string;
}

export interface WineryState {
  name: string;
  slug: string;
  abbreviation: string;
  tagline: string;
  overview: string;
  avas: string[];
  keyGrapes: string[];
  wineryCount: number;
  regions: string[];
  keyTakeaways: string[];
}

export const BADGE_CONFIG: Record<BadgeType, { label: string; color: string; bg: string; icon: string; description: string }> = {
  rager: {
    label: 'The Rager',
    color: 'text-badge-rager',
    bg: 'bg-badge-rager-bg',
    icon: '\uD83D\uDD25',
    description: 'Exceptional wine program. Worth traveling for.',
  },
  wildcard: {
    label: 'The Wild Card',
    color: 'text-badge-wildcard',
    bg: 'bg-badge-wildcard-bg',
    icon: '\uD83C\uDFB2',
    description: 'Exciting finds, unique selections. High reward.',
  },
  reliable: {
    label: 'The Reliable',
    color: 'text-badge-reliable',
    bg: 'bg-badge-reliable-bg',
    icon: '\u2714\uFE0F',
    description: 'Solid, fair pricing, good selections. Won\'t disappoint.',
  },
  lazy: {
    label: 'The Lazy List',
    color: 'text-badge-lazy',
    bg: 'bg-badge-lazy-bg',
    icon: '\u274C',
    description: 'Overpriced, boring, or neglected. Skip the wine.',
  },
};
