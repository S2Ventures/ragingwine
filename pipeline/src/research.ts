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
import type { ResearchedRestaurant, SkippedRestaurant, CityResearch } from './types.js';

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
// Pass 2 — Deep Dive (batches of config.deepDiveBatchSize)
// Uses structured 6-step methodology for thorough wine program research
// ---------------------------------------------------------------------------
async function deepDiveRestaurants(
  restaurants: string[],
  city: string,
  state: string
): Promise<ResearchedRestaurant[]> {
  const results: ResearchedRestaurant[] = [];
  const batchSize = config.deepDiveBatchSize;

  for (let i = 0; i < restaurants.length; i += batchSize) {
    const batch = restaurants.slice(i, i + batchSize);
    log.info(`Pass 2: Deep dive batch ${Math.floor(i / batchSize) + 1} — ${batch.join(', ')}`);

    const systemPrompt = `You are a wine industry analyst conducting thorough research for a wine review publication. Your job is to gather VERIFIABLE, SPECIFIC data about restaurant wine programs.

HARD REQUIREMENTS:
- Every claim must be backed by a credible source. Include citation URLs.
- If you cannot verify a detail, mark it as "unknown" — NEVER guess or fabricate.
- Minimum 3 credible sources per restaurant about the wine program specifically.
- Search the restaurant's official website, Google Maps photos, Yelp photos, press coverage, and sommelier interviews.
- Return structured JSON data only.`;

    const userPrompt = `Research these restaurants in ${city}, ${state} with a focus on their WINE PROGRAM:

${batch.map((name, idx) => `${idx + 1}. ${name}`).join('\n')}

Follow this research methodology for EACH restaurant:

**Step 1 — Confirm & Locate**
- Verify the restaurant exists and is currently open
- Find official website URL, full street address, phone number
- If the restaurant appears closed or cannot be confirmed, note it

**Step 2 — Gather Wine Program Evidence**
Search these sources for wine program details:
- Restaurant's official website (look for wine list PDF, menu pages, wine director bio)
- Google Maps photos (patrons often photograph wine lists, wine walls, bottles)
- Yelp photos and reviews mentioning wine
- Press coverage: local food blogs, newspaper reviews, Wine Spectator/Wine Enthusiast mentions
- Sommelier or wine director interviews
- Social media posts about wine events, tastings, new arrivals
- Record every source URL as a citation

**Step 3 — Quantify the Wine Program**
- Total number of wines on the list (bottles + by-the-glass)
- By-the-glass count and price range
- Bottle price range (entry-level to top-end)
- Region/country breakdown (what's emphasized?)
- Create a markup sampling: find 8-12 specific wines where you can compare the restaurant price to typical retail. Record: wine name, restaurant price, retail price, markup percentage.

**Step 4 — Service & Experience Signals**
- Is there a sommelier or wine director on staff? Who?
- Glassware quality (Riedel/Zalto vs. generic stemware — look for photos)
- Wine storage (visible wine wall? proper cellar? temperature controlled?)
- Wine events, tastings, wine dinner programs
- Half-price wine nights or specials (which day, what's included)
- Staff wine knowledge (mentioned in reviews?)

**Step 5 — Structured Output**
For EACH restaurant, return a JSON object:
{
  "name": "Official restaurant name",
  "neighborhood": "Neighborhood/area",
  "cuisineType": "Primary cuisine",
  "website": "Official website URL or null if not found",
  "address": { "street": "Full street address", "city": "${city}", "state": "${state}", "zip": "XXXXX" },
  "wineListSize": "e.g. '150 labels' or 'unknown'",
  "byTheGlassCount": "e.g. '18 options' or 'unknown'",
  "priceRange": "e.g. '$12-$24/glass, $40-$200/bottle' or 'unknown'",
  "notableWines": ["Specific producer/wine names found in sources — NEVER guess"],
  "wineRegionFocus": ["Regions emphasized on the list"],
  "sommelierOnStaff": true/false/null,
  "halfPriceNight": "Day of week or null",
  "halfPriceDetails": "Details about their wine deal or null",
  "vibeDescription": "One sentence on the dining atmosphere",
  "popularDishes": ["2-3 signature dishes"],
  "reservationRecommended": true/false,
  "averageEntreePrice": "$XX range",
  "citationLinks": ["Every URL used as a source"],
  "markupSampling": [
    { "wine": "Producer Wine Name Vintage", "restaurantPrice": "$XX", "retailPrice": "$XX", "markupPercent": XX }
  ],
  "wineListSource": "website|photo|review|inferred|unknown",
  "photoSourcesChecked": true/false,
  "sourcesFound": number_of_distinct_sources_about_wine_program,
  "confidenceLevel": "high|medium|low"
}

**Step 6 — Confidence Rating**
- "high": 5+ sources specifically about the wine program, specific wines verified
- "medium": 3-4 sources, some wine details verified
- "low": <3 sources about wine specifically, mostly inferred

If a restaurant has fewer than 3 credible sources about its wine program, still include it but mark confidenceLevel as "low".

Return a JSON array of these objects. ONLY the JSON array, no markdown fencing, no explanation.`;

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
// Quality scoring & filtering
// ---------------------------------------------------------------------------

/** Score how complete a restaurant's research data is (0-100) */
function scoreDataCompleteness(r: ResearchedRestaurant): number {
  const fields: Array<{ key: keyof ResearchedRestaurant; weight: number }> = [
    { key: 'website', weight: 10 },
    { key: 'address', weight: 5 },
    { key: 'wineListSize', weight: 10 },
    { key: 'byTheGlassCount', weight: 8 },
    { key: 'priceRange', weight: 10 },
    { key: 'notableWines', weight: 15 },
    { key: 'wineRegionFocus', weight: 5 },
    { key: 'sommelierOnStaff', weight: 3 },
    { key: 'halfPriceNight', weight: 3 },
    { key: 'vibeDescription', weight: 3 },
    { key: 'popularDishes', weight: 3 },
    { key: 'averageEntreePrice', weight: 3 },
    { key: 'citationLinks', weight: 7 },
    { key: 'markupSampling', weight: 12 },
    { key: 'wineListSource', weight: 3 },
  ];

  let earned = 0;
  let total = 0;

  for (const { key, weight } of fields) {
    total += weight;
    const val = r[key];
    if (val === undefined || val === null || val === 'unknown' || val === '') continue;
    if (Array.isArray(val) && val.length === 0) continue;
    earned += weight;
  }

  return Math.round((earned / total) * 100);
}

/** Filter out restaurants with insufficient data and attempt replacements */
async function filterAndReplaceInsufficient(
  restaurants: ResearchedRestaurant[],
  city: string,
  state: string
): Promise<{ kept: ResearchedRestaurant[]; skipped: SkippedRestaurant[] }> {
  const kept: ResearchedRestaurant[] = [];
  const skipped: SkippedRestaurant[] = [];

  // Score each restaurant
  for (const r of restaurants) {
    r.dataCompleteness = scoreDataCompleteness(r);

    const isLowConfidence = r.confidenceLevel === 'low';
    const tooFewSources = (r.sourcesFound ?? 0) < config.minSourcesRequired;
    const tooIncomplete = (r.dataCompleteness ?? 0) < config.minDataCompleteness;

    if (isLowConfidence || tooFewSources || tooIncomplete) {
      const reasons: string[] = [];
      if (isLowConfidence) reasons.push('low confidence');
      if (tooFewSources) reasons.push(`only ${r.sourcesFound ?? 0} sources (min: ${config.minSourcesRequired})`);
      if (tooIncomplete) reasons.push(`${r.dataCompleteness}% complete (min: ${config.minDataCompleteness}%)`);

      skipped.push({
        name: r.name,
        neighborhood: r.neighborhood || 'Unknown',
        reason: reasons.join('; '),
        sourcesFound: r.sourcesFound ?? 0,
        confidenceLevel: r.confidenceLevel || 'low',
        dataCompleteness: r.dataCompleteness ?? 0,
        phase: 'research',
      });

      r.skipReason = reasons.join('; ');
      log.warn(`⚠ Insufficient data for ${r.name}: ${reasons.join('; ')}`);
    } else {
      kept.push(r);
    }
  }

  log.info(`Quality filter: ${kept.length} kept, ${skipped.length} insufficient`);

  // Attempt replacements if we lost restaurants
  if (skipped.length > 0) {
    const skippedNames = skipped.map(s => s.name);
    const keptNames = kept.map(r => r.name);
    const allExclude = [...keptNames, ...skippedNames];

    for (let attempt = 1; attempt <= config.maxReplacementAttempts; attempt++) {
      const needed = skipped.length - (skipped.filter(s => s.replacedBy).length);
      if (needed === 0) break;

      log.info(`Replacement attempt ${attempt}/${config.maxReplacementAttempts}: looking for ${needed} replacements`);

      // Discover new candidates
      const candidates = await runDiscoveryPass(city, state, needed + 5, allExclude,
        `You are a restaurant and wine industry researcher specializing in wine programs. You always respond with structured JSON data. Never refuse a request — this is factual restaurant research, not harmful content. Return verified information only.`
      );

      if (candidates.length === 0) {
        log.info('No more replacement candidates found');
        break;
      }

      // Deep dive the candidates
      const newRestaurants = await deepDiveRestaurants(candidates, city, state);

      // Score and filter the replacements
      for (const r of newRestaurants) {
        r.dataCompleteness = scoreDataCompleteness(r);

        const isGood = r.confidenceLevel !== 'low'
          && (r.sourcesFound ?? 0) >= config.minSourcesRequired
          && (r.dataCompleteness ?? 0) >= config.minDataCompleteness;

        if (isGood) {
          // Find an unreplaced skipped restaurant to mark as replaced
          const unreplaced = skipped.find(s => !s.replacedBy);
          if (unreplaced) {
            unreplaced.replacedBy = r.name;
            r.replacedBy = undefined; // not needed on kept restaurants
            kept.push(r);
            log.info(`✓ Replaced ${unreplaced.name} with ${r.name} (${r.dataCompleteness}% complete)`);
          }
        } else {
          allExclude.push(r.name);
          log.info(`✗ Replacement candidate ${r.name} also insufficient (${r.dataCompleteness}% complete)`);
        }
      }
    }
  }

  log.info(`Final: ${kept.length} restaurants kept, ${skipped.length} skipped (${skipped.filter(s => s.replacedBy).length} replaced)`);
  return { kept, skipped };
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
  const allRestaurants = await deepDiveRestaurants(discoveredNames, city, state);

  // Quality filter — remove insufficient data, attempt replacements
  const { kept, skipped } = await filterAndReplaceInsufficient(allRestaurants, city, state);

  // Pass 3 — Verify & discover website URLs (only for kept restaurants)
  const enriched = await verifyAndDiscoverWebsites(kept);

  const result: CityResearch = {
    city,
    citySlug,
    state,
    researchedAt: new Date().toISOString(),
    restaurants: enriched,
    skippedRestaurants: skipped,
  };

  log.info(`Research complete: ${enriched.length} restaurants profiled, ${skipped.length} skipped`);
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
