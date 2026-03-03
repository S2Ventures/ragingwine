// ---------------------------------------------------------------------------
// Stage 2: Claude Review Writer
// ---------------------------------------------------------------------------
// Takes Perplexity research data and generates structured reviews
// using the Raging Wine brand voice.
// ---------------------------------------------------------------------------

import Anthropic from '@anthropic-ai/sdk';
import { config } from './config.js';
import { createLogger } from './logger.js';
import { BRAND_VOICE_SYSTEM_PROMPT } from './system-prompt.js';
import type { ResearchedRestaurant, SkippedRestaurant, CityResearch, GeneratedReview } from './types.js';

const log = createLogger('writer');

const anthropic = new Anthropic({ apiKey: config.anthropicApiKey });

// ---------------------------------------------------------------------------
// Slug generation
// ---------------------------------------------------------------------------
function generateSlug(name: string, city: string): string {
  const base = name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const citySuffix = city.toLowerCase().replace(/\s+/g, '-');
  return `${base}-${citySuffix}`;
}

// ---------------------------------------------------------------------------
// Write result — discriminated union
// ---------------------------------------------------------------------------
type WriteResult =
  | { type: 'review'; review: GeneratedReview }
  | { type: 'skipped'; skipped: SkippedRestaurant }
  | { type: 'error'; restaurant: string; error: string };

// ---------------------------------------------------------------------------
// Write a single review
// ---------------------------------------------------------------------------
async function writeReview(
  restaurant: ResearchedRestaurant,
  city: string,
  citySlug: string,
  state: string
): Promise<WriteResult> {
  log.info(`Writing review for ${restaurant.name}`);

  // Defense-in-depth: skip if data completeness is below threshold
  if ((restaurant.dataCompleteness ?? 0) < config.minDataCompleteness) {
    const reason = `Data completeness ${restaurant.dataCompleteness ?? 0}% below minimum ${config.minDataCompleteness}%`;
    log.warn(`⚠ Skipping ${restaurant.name} at writer stage: ${reason}`);
    return {
      type: 'skipped',
      skipped: {
        name: restaurant.name,
        neighborhood: restaurant.neighborhood || 'Unknown',
        reason,
        sourcesFound: restaurant.sourcesFound ?? 0,
        confidenceLevel: restaurant.confidenceLevel || 'low',
        dataCompleteness: restaurant.dataCompleteness ?? 0,
        phase: 'writing',
      },
    };
  }

  const researchContext = `
RESTAURANT: ${restaurant.name}
NEIGHBORHOOD: ${restaurant.neighborhood}
CITY: ${city}, ${state}
CUISINE: ${restaurant.cuisineType}
WEBSITE: ${restaurant.website || 'Unknown'}
ADDRESS: ${restaurant.address ? `${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state} ${restaurant.address.zip}` : 'Unknown'}

WINE PROGRAM INTEL:
- Wine list size: ${restaurant.wineListSize || 'Unknown'}
- By-the-glass options: ${restaurant.byTheGlassCount || 'Unknown'}
- Price range: ${restaurant.priceRange || 'Unknown'}
- Notable wines/producers: ${restaurant.notableWines?.join(', ') || 'Unknown'}
- Region focus: ${restaurant.wineRegionFocus?.join(', ') || 'Unknown'}
- Sommelier on staff: ${restaurant.sommelierOnStaff ?? 'Unknown'}
- Half-price wine night: ${restaurant.halfPriceNight || 'None found'}
- Half-price details: ${restaurant.halfPriceDetails || 'N/A'}
${restaurant.citationLinks?.length ? `\nCITATION SOURCES:\n${restaurant.citationLinks.map(l => `- ${l}`).join('\n')}` : ''}
${restaurant.markupSampling?.length ? `\nMARKUP SAMPLING:\n${restaurant.markupSampling.map(m => `- ${m.wine}: Restaurant ${m.restaurantPrice}, Retail ${m.retailPrice}${m.markupPercent ? ` (${m.markupPercent}% markup)` : ''}`).join('\n')}` : ''}
WINE LIST SOURCE: ${restaurant.wineListSource || 'unknown'}

GENERAL:
- Vibe: ${restaurant.vibeDescription || 'Unknown'}
- Popular dishes: ${restaurant.popularDishes?.join(', ') || 'Unknown'}
- Reservations recommended: ${restaurant.reservationRecommended ?? 'Unknown'}
- Average entree price: ${restaurant.averageEntreePrice || 'Unknown'}

RESEARCH CONFIDENCE: ${restaurant.confidenceLevel} (${restaurant.sourcesFound} sources)
DATA COMPLETENESS: ${restaurant.dataCompleteness ?? 'unscored'}%`;

  const userPrompt = `Using the research data below, write a Raging Wine review for this restaurant.

${researchContext}

Return a SINGLE JSON object (no markdown fencing) with this exact structure:
{
  "restaurant": "Official Name",
  "neighborhood": "Neighborhood",
  "cuisineType": "Cuisine Type",
  "badge": "rager|wildcard|reliable|lazy",
  "subtitle": "Punchy 5-10 word tagline",
  "metrics": {
    "glassware": "exact value from options",
    "staff": "exact value from options",
    "markup": "exact value from options",
    "variety": "exact value from options",
    "specials": "exact value from options",
    "storage": "exact value from options"
  },
  "firstImpression": "2-3 sentences",
  "selectionDeepDive": "3-4 sentences",
  "byTheGlass": "2-3 sentences",
  "bestValue": { "wine": "Specific Wine Name", "price": "$XX", "note": "Why it's the pick" },
  "hiddenGem": { "wine": "Specific Wine Name", "note": "Why it's underappreciated" },
  "skipThis": { "wine": "Specific Wine Name", "note": "Why to avoid" },
  "perfectPairing": { "wine": "Specific Wine Name", "dish": "Specific Dish", "note": "Why they pair" },
  "bottomLine": "1-2 sentence verdict",
  "tags": ["tag1", "tag2"],
  "halfPriceWineNight": { "day": "Tuesday", "details": "Details" } or null,
  "website": "URL or null",
  "address": { "street": "...", "city": "...", "state": "...", "zip": "...", "country": "US" } or null
}

RULES:
- Use ONLY the exact metric values listed in your instructions
- Name SPECIFIC wines in all pick cards — only wines that appear in the research data above
- NEVER fabricate wine names, producers, or prices
- Badge must be justified by metrics pattern
- If the research data is insufficient for a credible, specific review, return a skip response instead (see system instructions)
- Return ONLY valid JSON`;

  try {
    const response = await anthropic.messages.create({
      model: config.claudeModel,
      max_tokens: 4000,
      system: BRAND_VOICE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = response.content
      .filter(block => block.type === 'text')
      .map(block => (block as { type: 'text'; text: string }).text)
      .join('');

    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    // Check if Claude returned a skip response
    if (parsed.skipped === true) {
      log.warn(`⚠ Claude skipped ${restaurant.name}: ${parsed.skipReason || 'insufficient data'}`);
      return {
        type: 'skipped',
        skipped: {
          name: parsed.restaurant || restaurant.name,
          neighborhood: parsed.neighborhood || restaurant.neighborhood || 'Unknown',
          reason: parsed.skipReason || 'Claude determined insufficient data for credible review',
          sourcesFound: restaurant.sourcesFound ?? 0,
          confidenceLevel: parsed.researchConfidence || restaurant.confidenceLevel || 'low',
          dataCompleteness: parsed.dataCompleteness ?? restaurant.dataCompleteness ?? 0,
          phase: 'writing',
        },
      };
    }

    // Build the full review object
    const review: GeneratedReview = {
      slug: generateSlug(parsed.restaurant || restaurant.name, city),
      restaurant: parsed.restaurant || restaurant.name,
      neighborhood: parsed.neighborhood || restaurant.neighborhood,
      city,
      citySlug,
      cuisineType: parsed.cuisineType || restaurant.cuisineType,
      badge: parsed.badge,
      metrics: parsed.metrics,
      firstImpression: parsed.firstImpression,
      selectionDeepDive: parsed.selectionDeepDive,
      byTheGlass: parsed.byTheGlass,
      bestValue: parsed.bestValue,
      hiddenGem: parsed.hiddenGem,
      skipThis: parsed.skipThis,
      perfectPairing: parsed.perfectPairing,
      bottomLine: parsed.bottomLine,
      subtitle: parsed.subtitle,
      tags: parsed.tags,
      halfPriceWineNight: parsed.halfPriceWineNight || undefined,
      website: parsed.website || restaurant.website,
      address: parsed.address || (restaurant.address
        ? { ...restaurant.address, country: 'US' }
        : undefined),
      dataCompleteness: restaurant.dataCompleteness,
      researchConfidence: restaurant.confidenceLevel,
    };

    log.info(`Review written: ${review.restaurant} → ${review.badge}`);
    return { type: 'review', review };
  } catch (err) {
    log.error(`Failed to write review for ${restaurant.name}`, String(err));
    return { type: 'error', restaurant: restaurant.name, error: String(err) };
  }
}

// ---------------------------------------------------------------------------
// Write all reviews for a city
// ---------------------------------------------------------------------------
export interface WriteReviewsResult {
  reviews: GeneratedReview[];
  skipped: SkippedRestaurant[];
}

export async function writeReviews(research: CityResearch): Promise<WriteReviewsResult> {
  log.info(`Writing reviews for ${research.city} — ${research.restaurants.length} restaurants`);

  const reviews: GeneratedReview[] = [];
  const skipped: SkippedRestaurant[] = [];
  const errors: string[] = [];
  const concurrency = 3; // Process 3 at a time to stay within rate limits

  for (let i = 0; i < research.restaurants.length; i += concurrency) {
    const batch = research.restaurants.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map(r => writeReview(r, research.city, research.citySlug, research.state))
    );

    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        const wr = result.value;
        if (wr.type === 'review') reviews.push(wr.review);
        else if (wr.type === 'skipped') skipped.push(wr.skipped);
        else errors.push(`${wr.restaurant}: ${wr.error}`);
      } else {
        errors.push(`Promise rejected: ${result.reason}`);
      }
    }

    // Rate limit pause between batches
    if (i + concurrency < research.restaurants.length) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  log.info(`Completed: ${reviews.length} reviews, ${skipped.length} skipped, ${errors.length} errors`);
  if (errors.length > 0) log.error(`Writer errors: ${errors.join('; ')}`);
  return { reviews, skipped };
}

// ---------------------------------------------------------------------------
// CLI runner
// ---------------------------------------------------------------------------
if (process.argv[1]?.endsWith('writer.ts')) {
  const fs = await import('fs');
  const inputFile = process.argv[2];
  if (!inputFile) {
    console.error('Usage: tsx src/writer.ts <research-output.json>');
    process.exit(1);
  }

  const research: CityResearch = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
  writeReviews(research)
    .then(reviews => {
      console.log(JSON.stringify(reviews, null, 2));
    })
    .catch(err => {
      console.error('Writer failed:', err);
      process.exit(1);
    });
}
