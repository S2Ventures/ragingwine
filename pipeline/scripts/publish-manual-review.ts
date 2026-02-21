#!/usr/bin/env npx tsx
// ---------------------------------------------------------------------------
// Publish a manually-written review JSON to Sanity
// Usage: npm run publish-review langdons-mount-pleasant
// ---------------------------------------------------------------------------

import { createClient } from '@sanity/client';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve, join, basename } from 'path';

// Load .env.local if present (for local runs without dotenv dependency)
const envPath = resolve(process.cwd(), '.env.local');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

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

async function publishOne(filePath: string): Promise<void> {
  const review: ReviewJSON = JSON.parse(readFileSync(filePath, 'utf-8'));
  console.log(`\nPublishing: ${review.restaurant} (${review.citySlug})`);

  const cityRefId = await resolveCityRef(review.citySlug, review.city, review.address?.state || 'US');

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
    console.log(`  Updated: ${existing._id}`);
  } else {
    const created = await sanity.create(doc);
    console.log(`  Created: ${created._id}`);
  }

  console.log(`  Done! ${review.restaurant} is live.`);
}

const REVIEWS_DIR = resolve(process.cwd(), 'pipeline/data/manual-reviews');

async function main() {
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('SANITY_WRITE_TOKEN not found. Add it to .env.local or set it as an env var.');
    process.exit(1);
  }

  const arg = process.argv[2];

  if (!arg) {
    console.error('Usage:');
    console.error('  npm run publish-review <name>     Publish one review (e.g. langdons-mount-pleasant)');
    console.error('  npm run publish-review --all       Publish all reviews in manual-reviews/');
    process.exit(1);
  }

  if (arg === '--all') {
    const files = readdirSync(REVIEWS_DIR).filter(f => f.endsWith('.json'));
    console.log(`Publishing ${files.length} reviews...`);
    for (const file of files) {
      await publishOne(join(REVIEWS_DIR, file));
    }
    console.log(`\nAll ${files.length} reviews published.`);
  } else {
    // Accept either full path or just the name (with or without .json)
    let filePath = arg;
    if (!existsSync(filePath)) {
      const name = arg.replace(/\.json$/, '');
      filePath = join(REVIEWS_DIR, `${name}.json`);
    }
    if (!existsSync(filePath)) {
      console.error(`Review file not found: ${arg}`);
      console.error(`Looked in: ${REVIEWS_DIR}`);
      process.exit(1);
    }
    await publishOne(filePath);
  }
}

main().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});
