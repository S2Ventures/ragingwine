export type BadgeType = 'rager' | 'wildcard' | 'reliable' | 'lazy';

export type GlasswareGrade = 'Varietal Specific' | 'Stemless Casual' | 'Red Flag';
export type StaffConfidence = 'Knowledgeable & Friendly' | 'Willing but Green' | 'Gatekeeper' | 'MIA';
export type MarkupFairness = 'Fair' | 'Steep' | 'Gouge';

export interface WingmanMetrics {
  glassware: GlasswareGrade;
  staff: StaffConfidence;
  markup: MarkupFairness;
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
}

export interface City {
  name: string;
  slug: string;
  state: string;
  tagline: string;
  description: string;
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
