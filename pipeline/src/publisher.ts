// ---------------------------------------------------------------------------
// Stage 3: Sanity Publisher
// ---------------------------------------------------------------------------
// Takes generated reviews and publishes them to Sanity CMS.
// Handles city reference resolution (creates city if needed) and
// deduplication (skips reviews where slug already exists).
// ---------------------------------------------------------------------------

import { createClient } from '@sanity/client';
import { config } from './config.js';
import { createLogger } from './logger.js';
import type { GeneratedReview } from './types.js';

const log = createLogger('publisher');

const sanity = createClient({
  projectId: config.sanityProjectId,
  dataset: config.sanityDataset,
  apiVersion: config.sanityApiVersion,
  token: config.sanityWriteToken,
  useCdn: false,
});

// ---------------------------------------------------------------------------
// Resolve or create city reference
// ---------------------------------------------------------------------------
async function resolveCityRef(citySlug: string, cityName: string, state: string): Promise<string> {
  // Check if city exists
  const existing = await sanity.fetch<{ _id: string; comingSoon?: boolean } | null>(
    `*[_type == "city" && slug.current == $slug][0]{ _id, comingSoon }`,
    { slug: citySlug }
  );

  if (existing) {
    log.debug(`City "${cityName}" found: ${existing._id}`);
    // Clear comingSoon flag when we're about to publish real reviews
    if (existing.comingSoon) {
      log.info(`Clearing comingSoon flag for ${cityName}`);
      await sanity.patch(existing._id).set({ comingSoon: false }).commit();
    }
    return existing._id;
  }

  // Create the city
  log.info(`Creating city: ${cityName}, ${state}`);
  const created = await sanity.create({
    _type: 'city',
    name: cityName,
    slug: { _type: 'slug', current: citySlug },
    state,
    tagline: `Wine list reviews in ${cityName}`,
    description: `Explore restaurant wine lists across ${cityName}, ${state}.`,
  });

  log.info(`City created: ${created._id}`);
  return created._id;
}

// ---------------------------------------------------------------------------
// Check for existing review
// ---------------------------------------------------------------------------
async function reviewExists(slug: string): Promise<boolean> {
  const existing = await sanity.fetch<{ _id: string } | null>(
    `*[_type == "review" && slug.current == $slug][0]{ _id }`,
    { slug }
  );
  return !!existing;
}

// ---------------------------------------------------------------------------
// Publish a single review
// ---------------------------------------------------------------------------
async function publishReview(
  review: GeneratedReview,
  cityRefId: string
): Promise<{ published: boolean; error?: string }> {
  try {
    // Dedup check
    if (await reviewExists(review.slug)) {
      log.warn(`Skipping duplicate: ${review.slug}`);
      return { published: false, error: 'duplicate' };
    }

    if (config.dryRun) {
      log.info(`[DRY RUN] Would publish: ${review.restaurant} (${review.slug})`);
      return { published: true };
    }

    const doc = {
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

    const created = await sanity.create(doc);
    log.info(`Published: ${review.restaurant} → ${created._id}`);
    return { published: true };
  } catch (err) {
    log.error(`Failed to publish ${review.restaurant}`, String(err));
    return { published: false, error: String(err) };
  }
}

// ---------------------------------------------------------------------------
// Publish all reviews for a city
// ---------------------------------------------------------------------------
export async function publishReviews(
  reviews: GeneratedReview[],
  cityName: string,
  citySlug: string,
  state: string
): Promise<Array<{ restaurant: string; slug: string; badge: string; published: boolean; error?: string }>> {
  log.info(`Publishing ${reviews.length} reviews for ${cityName}`);

  // Resolve city reference once
  const cityRefId = await resolveCityRef(citySlug, cityName, state);

  const results: Array<{ restaurant: string; slug: string; badge: string; published: boolean; error?: string }> = [];

  // Publish sequentially to avoid race conditions on dedup checks
  for (const review of reviews) {
    const result = await publishReview(review, cityRefId);
    results.push({
      restaurant: review.restaurant,
      slug: review.slug,
      badge: review.badge,
      ...result,
    });

    // Small delay between publishes
    await new Promise(r => setTimeout(r, 500));
  }

  const published = results.filter(r => r.published).length;
  const skipped = results.filter(r => r.error === 'duplicate').length;
  const failed = results.filter(r => r.error && r.error !== 'duplicate').length;

  log.info(`Done: ${published} published, ${skipped} skipped (duplicate), ${failed} failed`);
  return results;
}

// ---------------------------------------------------------------------------
// CLI runner
// ---------------------------------------------------------------------------
if (process.argv[1]?.endsWith('publisher.ts')) {
  const fs = await import('fs');
  const inputFile = process.argv[2];
  if (!inputFile) {
    console.error('Usage: tsx src/publisher.ts <reviews.json>');
    process.exit(1);
  }

  const reviews: GeneratedReview[] = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
  if (reviews.length === 0) {
    console.error('No reviews to publish');
    process.exit(1);
  }

  const { city, citySlug } = reviews[0];
  // Infer state from address or default
  const state = reviews[0].address?.state || 'Unknown';

  publishReviews(reviews, city, citySlug, state)
    .then(results => {
      console.log(JSON.stringify(results, null, 2));
    })
    .catch(err => {
      console.error('Publisher failed:', err);
      process.exit(1);
    });
}
