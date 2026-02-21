#!/usr/bin/env npx tsx
// ---------------------------------------------------------------------------
// Publish a manually-written review JSON to Sanity
// Usage: npx tsx pipeline/scripts/publish-manual-review.ts pipeline/data/manual-reviews/langdons-mount-pleasant.json
// ---------------------------------------------------------------------------

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

const sanity = createClient({
  projectId: 'qyap5sez',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

interface ReviewJSON {
  slug: string;
  restaurant: string;
  neighborhood: string;
  city: string;
  citySlug: string;
  cuisineType: string;
  badge: string;
  subtitle?: string;
  tags?: string[];
  metrics: Record<string, string>;
  firstImpression: string;
  selectionDeepDive: string;
  byTheGlass: string;
  bestValue: { wine: string; price: string; note: string };
  hiddenGem: { wine: string; note: string };
  skipThis: { wine: string; note: string };
  perfectPairing: { wine: string; dish: string; note: string };
  bottomLine: string;
  halfPriceWineNight?: { day: string; details?: string } | null;
  website?: string;
  address?: { street: string; city: string; state: string; zip: string; country: string };
}

async function resolveCityRef(citySlug: string, cityName: string, state: string): Promise<string> {
  const existing = await sanity.fetch<{ _id: string; comingSoon?: boolean } | null>(
    `*[_type == "city" && slug.current == $slug][0]{ _id, comingSoon }`,
    { slug: citySlug }
  );

  if (existing) {
    if (existing.comingSoon) {
      console.log(`Clearing comingSoon flag for ${cityName}`);
      await sanity.patch(existing._id).set({ comingSoon: false }).commit();
    }
    return existing._id;
  }

  // Create city if it doesn't exist
  const created = await sanity.create({
    _type: 'city',
    name: cityName,
    slug: { _type: 'slug', current: citySlug },
    state,
    tagline: `Wine list reviews in ${cityName}`,
    description: `Explore restaurant wine lists across ${cityName}, ${state}.`,
    comingSoon: false,
  });
  console.log(`Created city "${cityName}": ${created._id}`);
  return created._id;
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: npx tsx pipeline/scripts/publish-manual-review.ts <review.json>');
    process.exit(1);
  }

  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('SANITY_WRITE_TOKEN environment variable required');
    process.exit(1);
  }

  const review: ReviewJSON = JSON.parse(readFileSync(filePath, 'utf-8'));
  console.log(`Publishing: ${review.restaurant} (${review.citySlug})`);

  // Resolve city reference
  const cityRefId = await resolveCityRef(review.citySlug, review.city, review.address?.state || 'SC');

  // Check if review already exists
  const existing = await sanity.fetch<{ _id: string } | null>(
    `*[_type == "review" && slug.current == $slug][0]{ _id }`,
    { slug: review.slug }
  );

  const doc: Record<string, unknown> = {
    _type: 'review',
    slug: { _type: 'slug', current: review.slug },
    restaurant: review.restaurant,
    neighborhood: review.neighborhood,
    city: { _type: 'reference', _ref: cityRefId },
    cuisineType: review.cuisineType,
    badge: review.badge,
    subtitle: review.subtitle,
    tags: review.tags || [],
    metrics: review.metrics,
    firstImpression: review.firstImpression,
    selectionDeepDive: review.selectionDeepDive,
    byTheGlass: review.byTheGlass,
    bestValue: review.bestValue,
    hiddenGem: review.hiddenGem,
    skipThis: review.skipThis,
    perfectPairing: review.perfectPairing,
    bottomLine: review.bottomLine,
    halfPriceWineNight: review.halfPriceWineNight || undefined,
    website: review.website || undefined,
    address: review.address || undefined,
    publishedAt: new Date().toISOString(),
  };

  if (existing) {
    await sanity.patch(existing._id).set(doc).commit();
    console.log(`Updated existing review: ${existing._id}`);
  } else {
    const created = await sanity.create(doc);
    console.log(`Created review: ${created._id}`);
  }

  console.log(`Done! ${review.restaurant} is live.`);
}

main().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});
