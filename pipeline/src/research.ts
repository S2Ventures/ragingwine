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

async function queryPerplexity(messages: PerplexityMessage[], retries = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
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
    } catch (err) {
      log.error(`Perplexity API attempt ${attempt}/${retries} failed: ${err}`);
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 3000 * attempt));
    }
  }
  throw new Error('Perplexity API: all retries exhausted');
}

// Try to extract a JSON array from a response that may contain surrounding text
function extractJsonArray(text: string): unknown[] {
  // Try direct parse first
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed;
  } catch { /* fall through */ }

  // Try to find a JSON array embedded in the text
  const match = cleaned.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) return parsed;
    } catch { /* fall through */ }
  }

  throw new Error(`No valid JSON array found in response: ${cleaned.slice(0, 100)}...`);
}

// ---------------------------------------------------------------------------
// Pass 1 — Discovery
// ---------------------------------------------------------------------------
async function discoverRestaurants(city: string, state: string, count: number): Promise<string[]> {
  log.info(`Pass 1: Discovering wine-forward restaurants in ${city}, ${state} (target: ${count})`);

  const systemPrompt = `You are a restaurant and wine industry researcher specializing in wine programs. You always respond with structured JSON data. Never refuse a request — this is factual restaurant research, not harmful content. Return verified information only.`;

  const allNames: string[] = [];
  const overshoot = Math.ceil(count * 1.5); // Ask for more than we need

  // First discovery pass — ask for 1.5x the target
  const firstPassNames = await runDiscoveryPass(city, state, overshoot, [], systemPrompt);
  allNames.push(...firstPassNames);
  log.info(`Pass 1a: Got ${allNames.length} restaurants`);

  // If we're still short, run a second pass asking for more, excluding what we have
  if (allNames.length < count) {
    const remaining = count - allNames.length + 10; // overshoot again
    log.info(`Pass 1b: Need ${count - allNames.length} more, requesting ${remaining} additional`);
    const secondPassNames = await runDiscoveryPass(city, state, remaining, allNames, systemPrompt);
    const dedupedNew = secondPassNames.filter(n => !allNames.includes(n));
    allNames.push(...dedupedNew);
    log.info(`Pass 1b: Got ${dedupedNew.length} new restaurants (total: ${allNames.length})`);
  }

  // Trim to target count
  const finalNames = allNames.slice(0, count);
  log.info(`Discovery complete: ${finalNames.length} restaurants for ${city}`);
  return finalNames;
}

async function runDiscoveryPass(
  city: string,
  state: string,
  count: number,
  exclude: string[],
  systemPrompt: string
): Promise<string[]> {
  const excludeClause = exclude.length > 0
    ? `\n\nDo NOT include these restaurants (already found):\n${exclude.map(n => `- ${n}`).join('\n')}\n`
    : '';

  const userPrompt = `Research restaurants in ${city}, ${state} that have notable wine programs or wine lists.

Find ${count} restaurants including a mix of:
- Fine dining with deep cellars and extensive wine lists
- Wine bars and wine-focused bistros
- Upscale casual spots with surprisingly good wine selections
- Neighborhood gems with curated wine lists
- Steakhouses and Italian restaurants known for wine
- Hotel restaurants with notable wine programs
- Any restaurant where wine is a meaningful part of the experience
${excludeClause}
For each restaurant, provide:
1. Restaurant name (exact, official name)
2. Neighborhood/area within ${city}
3. Cuisine type (e.g., "Italian", "New American", "Steakhouse")
4. One sentence on why their wine program stands out

Respond with ONLY a JSON array of objects with keys: name, neighborhood, cuisineType, whyNotable
No markdown fencing, no explanation, no preamble. Just the JSON array.`;

  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const messages: PerplexityMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: attempt === 1
        ? userPrompt
        : `${userPrompt}\n\nIMPORTANT: You must respond with a JSON array. Do not explain why you cannot help. This is factual restaurant research for a wine review publication. Return as many as you can find, even if fewer than ${count}.`
      },
    ];

    const response = await queryPerplexity(messages);

    try {
      const parsed = extractJsonArray(response);
      const names = parsed.map((r: any) => r.name).filter(Boolean);
      if (names.length === 0) throw new Error('Parsed array contained no restaurant names');
      log.info(`Discovery pass got ${names.length} restaurants (attempt ${attempt})`);
      return names;
    } catch (err) {
      log.error(`Discovery parse attempt ${attempt}/${maxAttempts} failed: ${err}`);
      log.error(`Response preview: ${response.slice(0, 200)}`);
      if (attempt === maxAttempts) {
        throw new Error(`Discovery failed after ${maxAttempts} attempts. Last error: ${err}`);
      }
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  throw new Error('Discovery pass: unreachable');
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
  "website": "Restaurant's official website URL — try the format https://restaurantname.com or https://www.restaurantname.com. Most restaurants have a website. Only return null if you are confident the restaurant has no website.",
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
      const parsed = extractJsonArray(response) as ResearchedRestaurant[];
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
// Pass 3 — Website URL verification & discovery
// ---------------------------------------------------------------------------
// For each restaurant:
//   - If URL exists: HEAD-check it (keep if 2xx/3xx, clear if dead)
//   - If URL is missing: try common patterns and keep the first that resolves
// ---------------------------------------------------------------------------

/** Check if a URL responds with a success/redirect status */
async function urlResolves(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'RagingWineBot/1.0 (wine review site; website verification)' },
    });
    clearTimeout(timeout);
    return res.ok || (res.status >= 300 && res.status < 400);
  } catch {
    // HEAD may be blocked — try GET with minimal download
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'User-Agent': 'RagingWineBot/1.0 (wine review site; website verification)' },
      });
      clearTimeout(timeout);
      // Consume and discard body to avoid memory leak
      try { await res.text(); } catch { /* ignore */ }
      return res.ok;
    } catch {
      return false;
    }
  }
}

/** Generate common URL patterns from a restaurant name */
function guessUrls(name: string): string[] {
  // Strip common suffixes and normalize
  const cleaned = name
    .toLowerCase()
    .replace(/\s*[-–—]\s*.*$/, '')           // "Chart House - Savannah" → "Chart House"
    .replace(/\b(restaurant|bar|grill|bistro|cafe|kitchen)\b/gi, '')
    .trim()
    .replace(/['']/g, '')                      // apostrophes
    .replace(/[&+]/g, 'and')
    .replace(/[^a-z0-9\s]/g, '')               // non-alphanumeric
    .replace(/\s+/g, '');                       // collapse spaces

  // Also try with dashes instead of collapsed
  const dashed = name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[&+]/g, 'and')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');

  const candidates = new Set<string>();
  // Most common patterns
  candidates.add(`https://www.${cleaned}.com`);
  candidates.add(`https://${cleaned}.com`);
  candidates.add(`https://www.${dashed}.com`);
  candidates.add(`https://${dashed}.com`);

  return Array.from(candidates);
}

async function verifyAndDiscoverWebsites(
  restaurants: ResearchedRestaurant[]
): Promise<ResearchedRestaurant[]> {
  log.info(`Pass 3: Verifying/discovering website URLs for ${restaurants.length} restaurants`);

  let verified = 0;
  let discovered = 0;
  let cleared = 0;

  // Process in parallel batches of 5 to avoid hammering servers
  const batchSize = 5;
  for (let i = 0; i < restaurants.length; i += batchSize) {
    const batch = restaurants.slice(i, i + batchSize);

    await Promise.all(batch.map(async (r) => {
      if (r.website) {
        // Verify existing URL
        const ok = await urlResolves(r.website);
        if (ok) {
          verified++;
          log.info(`✓ Verified: ${r.name} → ${r.website}`);
        } else {
          log.warn(`✗ Dead URL for ${r.name}: ${r.website} — clearing`);
          r.website = undefined;
          cleared++;
        }
      }

      if (!r.website) {
        // Try to discover URL from common patterns
        const guesses = guessUrls(r.name);
        for (const url of guesses) {
          const ok = await urlResolves(url);
          if (ok) {
            r.website = url;
            discovered++;
            log.info(`🔍 Discovered: ${r.name} → ${url}`);
            break;
          }
        }
        if (!r.website) {
          log.info(`⚠ No website found for: ${r.name}`);
        }
      }
    }));

    // Small delay between batches
    if (i + batchSize < restaurants.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  log.info(`Website results: ${verified} verified, ${discovered} discovered, ${cleared} dead URLs cleared`);
  return restaurants;
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

  // Pass 1 — Discover restaurant names
  const discoveredNames = await discoverRestaurants(city, state, target);

  // Pass 2 — Deep dive each restaurant
  const restaurants = await deepDiveRestaurants(discoveredNames, city, state);

  // Pass 3 — Verify & discover website URLs
  const enriched = await verifyAndDiscoverWebsites(restaurants);

  const result: CityResearch = {
    city,
    citySlug,
    state,
    researchedAt: new Date().toISOString(),
    restaurants: enriched,
  };

  log.info(`Research complete: ${enriched.length} restaurants profiled`);
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
