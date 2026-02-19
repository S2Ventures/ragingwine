import { createClient } from '@sanity/client';
import type { Review, City, WineryState, Winery } from './types';

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------
const client = createClient({
  projectId: 'qyap5sez',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // direct API — ensures fresh data during builds & ISR
});

// ---------------------------------------------------------------------------
// GROQ helpers
// ---------------------------------------------------------------------------

// Dereference the city reference on every review so callers get flat objects
// matching the existing Review interface (city: string, citySlug: string).
const REVIEW_PROJECTION = `{
  ...,
  "city": city->name,
  "citySlug": city->slug.current,
  badge,
  "slug": slug.current,
  restaurant,
  tagline,
  oneLiner,
  format,
  metrics,
  editorial,
  bestValueWine,
  wineNotes,
  perfectPairing,
  halfPriceWineNight,
  address,
  priceRange,
  cuisine,
  website,
  reservationUrl,
  lastVisited,
  publishedAt,
  updatedAt
}`;

const CITY_PROJECTION = `{
  name,
  "slug": slug.current,
  state,
  tagline,
  description,
  comingSoon,
  comingSoonTeaser
}`;

const WINERY_STATE_PROJECTION = `{
  name,
  "slug": slug.current,
  abbreviation,
  tagline,
  overview,
  wineryCount,
  avas,
  keyGrapes,
  regions,
  keyTakeaways
}`;

const WINERY_PROJECTION = `{
  name,
  "slug": slug.current,
  "stateSlug": state->slug.current,
  region,
  sourcing,
  highlights,
  visitingNotes,
  tastingFee,
  reservationRequired,
  website,
  address
}`;

// ---------------------------------------------------------------------------
// Cities
// ---------------------------------------------------------------------------
export async function getCities(): Promise<City[]> {
  return client.fetch(
    `*[_type == "city"] | order(name asc) ${CITY_PROJECTION}`
  );
}

export async function getCityBySlug(slug: string): Promise<City | undefined> {
  const result = await client.fetch(
    `*[_type == "city" && slug.current == $slug][0] ${CITY_PROJECTION}`,
    { slug }
  );
  return result || undefined;
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------
export async function getReviews(): Promise<Review[]> {
  return client.fetch(
    `*[_type == "review"] | order(restaurant asc) ${REVIEW_PROJECTION}`
  );
}

export async function getReviewsByCity(citySlug: string): Promise<Review[]> {
  return client.fetch(
    `*[_type == "review" && city->slug.current == $citySlug] | order(restaurant asc) ${REVIEW_PROJECTION}`,
    { citySlug }
  );
}

export async function getReviewBySlug(slug: string): Promise<Review | undefined> {
  const result = await client.fetch(
    `*[_type == "review" && slug.current == $slug][0] ${REVIEW_PROJECTION}`,
    { slug }
  );
  return result || undefined;
}

// ---------------------------------------------------------------------------
// Winery States
// ---------------------------------------------------------------------------
export async function getWineryStates(): Promise<WineryState[]> {
  return client.fetch(
    `*[_type == "wineryState"] | order(name asc) ${WINERY_STATE_PROJECTION}`
  );
}

export async function getWineryStateBySlug(slug: string): Promise<WineryState | undefined> {
  const result = await client.fetch(
    `*[_type == "wineryState" && slug.current == $slug][0] ${WINERY_STATE_PROJECTION}`,
    { slug }
  );
  return result || undefined;
}

// ---------------------------------------------------------------------------
// Wineries
// ---------------------------------------------------------------------------
export async function getWineries(): Promise<Winery[]> {
  return client.fetch(
    `*[_type == "winery"] | order(name asc) ${WINERY_PROJECTION}`
  );
}

export async function getWineriesByState(stateSlug: string): Promise<Winery[]> {
  return client.fetch(
    `*[_type == "winery" && state->slug.current == $stateSlug] | order(name asc) ${WINERY_PROJECTION}`,
    { stateSlug }
  );
}

export async function getWineriesByRegion(region: string): Promise<Winery[]> {
  return client.fetch(
    `*[_type == "winery" && region == $region] | order(name asc) ${WINERY_PROJECTION}`,
    { region }
  );
}

export async function getWineriesGroupedByRegion(stateSlug: string): Promise<Record<string, Winery[]>> {
  const wineries = await getWineriesByState(stateSlug);
  const grouped: Record<string, Winery[]> = {};
  for (const w of wineries) {
    const region = w.region || 'Other';
    if (!grouped[region]) grouped[region] = [];
    grouped[region].push(w);
  }
  return grouped;
}

// ---------------------------------------------------------------------------
// Wine 101 (keeping markdown-based system for now — migrate separately)
// ---------------------------------------------------------------------------
// Wine 101 articles still use the filesystem-based approach in wine101.ts.
// When those are migrated to Sanity Portable Text, add queries here.
