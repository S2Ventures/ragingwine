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
import type { ResearchedRestaurant, CityResearch, GeneratedReview } from './types.js';

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
// Write a single review
// ---------------------------------------------------------------------------
async function writeReview(
  restaurant: ResearchedRestaurant,
  city: string,
  citySlug: string,
  state: string
): Promise<GeneratedReview | null> {
  log.info(`Writing review for ${restaurant.name}`);

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

GENERAL:
- Vibe: ${restaurant.vibeDescription || 'Unknown'}
- Popular dishes: ${restaurant.popularDishes?.join(', ') || 'Unknown'}
- Reservations recommended: ${restaurant.reservationRecommended ?? 'Unknown'}
- Average entree price: ${restaurant.averageEntreePrice || 'Unknown'}

RESEARCH CONFIDENCE: ${restaurant.confidenceLevel} (${restaurant.sourcesFound} sources)`;

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
  "website": "Restaurant's official website URL. Most restaurants have one. Only use null if truly none exists.",
  "address": { "street": "...", "city": "...", "state": "...", "zip": "...", "country": "US" } or null
}

RULES:
- Use ONLY the exact metric values listed in your instructions
- Name SPECIFIC wines in all pick cards — real producers, real bottles
- Badge must be justified by metrics pattern
- If research confidence is "low", lean toward "reliable" badge and note limited intel in the writing
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
    };

    log.info(`Review written: ${review.restaurant} → ${review.badge}`);
    return review;
  } catch (err) {
    log.error(`Failed to write review for ${restaurant.name}`, String(err));
    return null;
  }
}

// ---------------------------------------------------------------------------
// Write all reviews for a city
// ---------------------------------------------------------------------------
export async function writeReviews(research: CityResearch): Promise<GeneratedReview[]> {
  log.info(`Writing reviews for ${research.city} — ${research.restaurants.length} restaurants`);

  const reviews: GeneratedReview[] = [];
  const concurrency = 3; // Process 3 at a time to stay within rate limits

  for (let i = 0; i < research.restaurants.length; i += concurrency) {
    const batch = research.restaurants.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map(r => writeReview(r, research.city, research.citySlug, research.state))
    );

    for (const result of batchResults) {
      if (result.status === 'fulfilled' && result.value) {
        reviews.push(result.value);
      }
    }

    // Rate limit pause between batches
    if (i + concurrency < research.restaurants.length) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  log.info(`Completed: ${reviews.length}/${research.restaurants.length} reviews written`);
  return reviews;
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
