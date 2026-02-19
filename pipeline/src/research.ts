// ---------------------------------------------------------------------------
// Stage 1: Perplexity Research Module
// ---------------------------------------------------------------------------
// Queries Perplexity API to gather wine program intel for restaurants in a city.
// Two-pass approach:
//   Pass 1 — Discovery: "Top 30 restaurants with notable wine programs in {city}"
//   Pass 2 — Deep Dive: Per-restaurant wine list details, pricing, staff, specials
// ---------------------------------------------------------------------------

import { config } from './config.js';
import { createLogger } from './logger.js';
import type { ResearchedRestaurant, CityResearch } from './types.js';

const log = createLogger('research');

// ---------------------------------------------------------------------------
// Perplexity API call
// ---------------------------------------------------------------------------
interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function queryPerplexity(messages: PerplexityMessage[]): Promise<string> {
  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.perplexityApiKey}`,
    },
    body: JSON.stringify({
      model: config.perplexityModel,
      messages,
      temperature: 0.1,
      max_tokens: 8000,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Perplexity API ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

// ---------------------------------------------------------------------------
// Pass 1 — Discovery
// ---------------------------------------------------------------------------
async function discoverRestaurants(city: string, state: string, count: number): Promise<string[]> {
  log.info(`Pass 1: Discovering top ${count} wine-forward restaurants in ${city}, ${state}`);

  const systemPrompt = `You are a restaurant and wine industry researcher. Return factual, verified information only. Focus on restaurants known for their wine programs, wine lists, or wine-centric dining experiences.`;

  const userPrompt = `List the top ${count} restaurants in ${city}, ${state} that are known for having notable wine programs or wine lists. Include a mix of:
- Fine dining with deep cellars
- Wine bars and wine-focused bistros
- Upscale casual spots with surprisingly good wine lists
- Neighborhood gems with curated selections

For each restaurant, provide ONLY:
1. Restaurant name (exact, official name)
2. Neighborhood/area within ${city}
3. Cuisine type (e.g., "Italian", "New American", "Steakhouse")
4. One sentence on why their wine program stands out

Format as a JSON array of objects with keys: name, neighborhood, cuisineType, whyNotable
Return ONLY the JSON array, no markdown fencing or explanation.`;

  const response = await queryPerplexity([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  try {
    // Strip any markdown fencing if present
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);
    const names = parsed.map((r: { name: string }) => r.name);
    log.info(`Discovered ${names.length} restaurants`);
    return names;
  } catch (err) {
    log.error('Failed to parse discovery response', response);
    throw new Error(`Discovery parse failed: ${err}`);
  }
}

// ---------------------------------------------------------------------------
// Pass 2 — Deep Dive (batches of 5)
// ---------------------------------------------------------------------------
async function deepDiveRestaurants(
  restaurants: string[],
  city: string,
  state: string
): Promise<ResearchedRestaurant[]> {
  const results: ResearchedRestaurant[] = [];
  const batchSize = 5;

  for (let i = 0; i < restaurants.length; i += batchSize) {
    const batch = restaurants.slice(i, i + batchSize);
    log.info(`Pass 2: Deep dive batch ${Math.floor(i / batchSize) + 1} — ${batch.join(', ')}`);

    const systemPrompt = `You are a wine industry analyst. Return factual, verifiable data about restaurant wine programs. If you cannot verify a detail, say "unknown" rather than guessing. Be specific about wines, prices, and programs.`;

    const userPrompt = `Research these restaurants in ${city}, ${state} and provide detailed wine program intel for each:

${batch.map((name, idx) => `${idx + 1}. ${name}`).join('\n')}

For EACH restaurant, return a JSON object with these fields:
{
  "name": "Official restaurant name",
  "neighborhood": "Neighborhood/area",
  "cuisineType": "Primary cuisine",
  "website": "URL or null",
  "address": { "street": "123 Main St", "city": "${city}", "state": "${state}", "zip": "30301" },
  "wineListSize": "Approximate number of wines, e.g. '150 labels'",
  "byTheGlassCount": "Number of by-the-glass options, e.g. '18 options'",
  "priceRange": "Glass and bottle price ranges, e.g. '$12-$24/glass, $40-$200/bottle'",
  "notableWines": ["Specific producers or wines they carry"],
  "wineRegionFocus": ["Wine regions emphasized, e.g. 'Willamette Valley', 'Rhône'"],
  "sommelierOnStaff": true/false,
  "halfPriceNight": "Day of week or null",
  "halfPriceDetails": "Details about their wine deal or null",
  "vibeDescription": "One sentence on the dining atmosphere",
  "popularDishes": ["2-3 signature dishes"],
  "reservationRecommended": true/false,
  "averageEntreePrice": "$XX range",
  "sourcesFound": number_of_sources_referenced,
  "confidenceLevel": "high/medium/low"
}

Return a JSON array of these objects. ONLY the JSON array, no markdown fencing.`;

    const response = await queryPerplexity([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    try {
      const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed: ResearchedRestaurant[] = JSON.parse(cleaned);
      results.push(...parsed);
      log.info(`Got ${parsed.length} results from batch`);
    } catch (err) {
      log.error(`Failed to parse deep dive batch`, { batch, error: String(err) });
      // Add placeholder entries for failed batch
      for (const name of batch) {
        results.push({
          name,
          neighborhood: 'Unknown',
          cuisineType: 'Unknown',
          sourcesFound: 0,
          confidenceLevel: 'low',
        });
      }
    }

    // Rate limit: wait 2s between batches
    if (i + batchSize < restaurants.length) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export async function researchCity(
  city: string,
  citySlug: string,
  state: string,
  count?: number
): Promise<CityResearch> {
  const target = count ?? config.restaurantsPerCity;
  log.info(`Starting research for ${city}, ${state} — targeting ${target} restaurants`);

  // Pass 1
  const discoveredNames = await discoverRestaurants(city, state, target);

  // Pass 2
  const restaurants = await deepDiveRestaurants(discoveredNames, city, state);

  const result: CityResearch = {
    city,
    citySlug,
    state,
    researchedAt: new Date().toISOString(),
    restaurants,
  };

  log.info(`Research complete: ${restaurants.length} restaurants profiled`);
  return result;
}

// ---------------------------------------------------------------------------
// CLI runner
// ---------------------------------------------------------------------------
if (process.argv[1]?.endsWith('research.ts')) {
  const city = process.argv[2] || 'Charleston';
  const slug = process.argv[3] || 'charleston';
  const state = process.argv[4] || 'South Carolina';
  const count = parseInt(process.argv[5] || '5', 10);

  researchCity(city, slug, state, count)
    .then(result => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch(err => {
      console.error('Research failed:', err);
      process.exit(1);
    });
}
