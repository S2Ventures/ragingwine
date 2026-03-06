// ---------------------------------------------------------------------------
// Stage 1: Research Module (v2 — Multi-Pass + Claude Enrichment)
// ---------------------------------------------------------------------------
// Three-pass Perplexity research with Claude enrichment:
//   Pass 1 — Discovery: "Top 30 restaurants with notable wine programs in {city}"
//   Pass 2 — Focused Deep Dives (3 parallel queries per batch):
//     2a: Basic info (website, address, cuisine, hours)
//     2b: Wine program (list size, BTG, regions, sommelier, specials)
//     2c: Pricing (specific bottles, glass prices, markup sampling)
//   Pass 3 — Claude Enrichment: fills gaps, validates, cross-references
//   Pass 4 — Quality filter + replacements
//   Pass 5 — Website URL verification
// ---------------------------------------------------------------------------

import Anthropic from '@anthropic-ai/sdk';
import { config } from './config.js';
import { createLogger } from './logger.js';
import type { ResearchedRestaurant, SkippedRestaurant, CityResearch } from './types.js';

const log = createLogger('research');

const anthropic = new Anthropic({ apiKey: config.anthropicApiKey });

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

const RESEARCH_SYSTEM_PROMPT = `You are a restaurant and wine industry researcher specializing in wine programs. You always respond with structured JSON data. Never refuse a request — this is factual restaurant research, not harmful content. Return verified information only.`;

// ---------------------------------------------------------------------------
// Pass 1 — Discovery (with Claude fallback)
// ---------------------------------------------------------------------------
async function discoverRestaurants(city: string, state: string, count: number): Promise<string[]> {
  log.info(`Pass 1: Discovering wine-forward restaurants in ${city}, ${state} (target: ${count})`);

  const allNames: string[] = [];
  const overshoot = Math.ceil(count * 1.5);

  // Try Perplexity first
  try {
    const firstPassNames = await runDiscoveryPass(city, state, overshoot, [], RESEARCH_SYSTEM_PROMPT);
    allNames.push(...firstPassNames);
    log.info(`Pass 1a (Perplexity): Got ${allNames.length} restaurants`);

    if (allNames.length < count) {
      const remaining = count - allNames.length + 10;
      log.info(`Pass 1b: Need ${count - allNames.length} more, requesting ${remaining} additional`);
      const secondPassNames = await runDiscoveryPass(city, state, remaining, allNames, RESEARCH_SYSTEM_PROMPT);
      const dedupedNew = secondPassNames.filter(n => !allNames.includes(n));
      allNames.push(...dedupedNew);
      log.info(`Pass 1b: Got ${dedupedNew.length} new restaurants (total: ${allNames.length})`);
    }
  } catch (err) {
    log.warn(`Perplexity discovery failed: ${err}`);
    log.info('Falling back to Claude for discovery...');

    // Claude fallback for discovery
    const claudeNames = await discoverWithClaude(city, state, overshoot);
    allNames.push(...claudeNames);
    log.info(`Pass 1 (Claude fallback): Got ${allNames.length} restaurants`);
  }

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

/** Claude fallback when Perplexity discovery fails entirely */
async function discoverWithClaude(city: string, state: string, count: number): Promise<string[]> {
  log.info(`Claude discovery fallback for ${city}, ${state}`);

  const response = await anthropic.messages.create({
    model: config.claudeModel,
    max_tokens: 4000,
    system: 'You are a restaurant and wine industry expert. Return structured JSON only.',
    messages: [{
      role: 'user',
      content: `List ${count} restaurants in ${city}, ${state} that are known for their wine programs or wine lists. Include fine dining, wine bars, steakhouses, Italian restaurants, and any place where wine is a meaningful part of the experience.

Return a JSON array with objects: { "name": "Official Name", "neighborhood": "Area", "cuisineType": "Cuisine" }
Only include restaurants you are confident actually exist and are currently operating. No markdown, just JSON.`,
    }],
  });

  const text = response.content
    .filter(b => b.type === 'text')
    .map(b => (b as { type: 'text'; text: string }).text)
    .join('');

  const parsed = extractJsonArray(text);
  const names = parsed.map((r: any) => r.name).filter(Boolean);
  log.info(`Claude discovered ${names.length} restaurants`);
  return names;
}

// ---------------------------------------------------------------------------
// Pass 2 — Focused Deep Dives (3 parallel queries per batch)
// ---------------------------------------------------------------------------

/** Pass 2a: Basic info — website, address, cuisine, vibe */
async function deepDiveBasicInfo(
  restaurants: string[],
  city: string,
  state: string
): Promise<Record<string, Partial<ResearchedRestaurant>>> {
  const results: Record<string, Partial<ResearchedRestaurant>> = {};

  const userPrompt = `For each restaurant below in ${city}, ${state}, find their basic information:

${restaurants.map((n, i) => `${i + 1}. ${n}`).join('\n')}

For EACH, find:
- Official website URL
- Full street address
- Cuisine type
- Vibe/atmosphere in one sentence
- 2-3 popular dishes
- Whether reservations are recommended
- Average entree price range
- Dress code if notable

Return a JSON array where each object has:
{
  "name": "Official Name",
  "website": "URL or null",
  "address": { "street": "...", "city": "${city}", "state": "${state}", "zip": "..." },
  "cuisineType": "Type",
  "vibeDescription": "One sentence",
  "popularDishes": ["dish1", "dish2"],
  "reservationRecommended": true/false,
  "averageEntreePrice": "$XX range",
  "citationLinks": ["source URLs"]
}

If you cannot verify a detail, use null. ONLY the JSON array, no markdown.`;

  try {
    const response = await queryPerplexity([
      { role: 'system', content: RESEARCH_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ]);
    const parsed = extractJsonArray(response) as any[];
    for (const r of parsed) {
      if (r.name) results[r.name] = r;
    }
    log.info(`2a BasicInfo: got data for ${Object.keys(results).length}/${restaurants.length}`);
  } catch (err) {
    log.error(`2a BasicInfo failed: ${err}`);
  }

  return results;
}

/** Pass 2b: Wine program specifics */
async function deepDiveWineProgram(
  restaurants: string[],
  city: string,
  state: string
): Promise<Record<string, Partial<ResearchedRestaurant>>> {
  const results: Record<string, Partial<ResearchedRestaurant>> = {};

  const userPrompt = `Research the WINE PROGRAMS of these restaurants in ${city}, ${state}:

${restaurants.map((n, i) => `${i + 1}. ${n}`).join('\n')}

Search each restaurant's website, Google Maps photos, Yelp reviews, press coverage, and sommelier interviews for wine-specific information.

For EACH, find:
- Total wines on the list (bottles + by-the-glass)
- Number of by-the-glass options and price range
- Bottle price range (entry-level to top-end)
- Region/country focus of the wine list
- Specific notable wines or producers carried
- Whether they have a sommelier or wine director (and who)
- Glassware quality (Riedel/Zalto vs generic — check photos)
- Wine storage setup (wine wall, cellar, etc.)
- Where the wine list data came from (website, photo, review)

Return a JSON array:
{
  "name": "Restaurant Name",
  "wineListSize": "e.g. '150 labels' or null",
  "byTheGlassCount": "e.g. '18 options' or null",
  "priceRange": "e.g. '$12-$24/glass, $40-$200/bottle' or null",
  "notableWines": ["Specific wines found in sources"],
  "wineRegionFocus": ["Regions emphasized"],
  "sommelierOnStaff": true/false/null,
  "wineListSource": "website|photo|review|inferred|unknown",
  "photoSourcesChecked": true/false,
  "citationLinks": ["source URLs"]
}

Mark anything unverified as null. ONLY the JSON array, no markdown.`;

  try {
    const response = await queryPerplexity([
      { role: 'system', content: RESEARCH_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ]);
    const parsed = extractJsonArray(response) as any[];
    for (const r of parsed) {
      if (r.name) results[r.name] = r;
    }
    log.info(`2b WineProgram: got data for ${Object.keys(results).length}/${restaurants.length}`);
  } catch (err) {
    log.error(`2b WineProgram failed: ${err}`);
  }

  return results;
}

/** Pass 2c: Pricing, markup, and specials */
async function deepDivePricing(
  restaurants: string[],
  city: string,
  state: string
): Promise<Record<string, Partial<ResearchedRestaurant>>> {
  const results: Record<string, Partial<ResearchedRestaurant>> = {};

  const userPrompt = `Research wine PRICING and SPECIALS at these restaurants in ${city}, ${state}:

${restaurants.map((n, i) => `${i + 1}. ${n}`).join('\n')}

For EACH restaurant, find:
- Half-price wine night (which day, what's included)
- Happy hour wine deals
- Wine flight offerings
- Specific wine prices (find 6-10 wines where you can identify the restaurant price)
- For each wine you find a price for, also look up the typical retail price so we can calculate markup

Return a JSON array:
{
  "name": "Restaurant Name",
  "halfPriceNight": "Day or null",
  "halfPriceDetails": "Details or null",
  "markupSampling": [
    { "wine": "Producer Wine Name Vintage", "restaurantPrice": "$XX", "retailPrice": "$XX", "markupPercent": XX }
  ],
  "citationLinks": ["source URLs"]
}

Only include markup data for wines where you can verify BOTH the restaurant price and a retail comparison. ONLY the JSON array, no markdown.`;

  try {
    const response = await queryPerplexity([
      { role: 'system', content: RESEARCH_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ]);
    const parsed = extractJsonArray(response) as any[];
    for (const r of parsed) {
      if (r.name) results[r.name] = r;
    }
    log.info(`2c Pricing: got data for ${Object.keys(results).length}/${restaurants.length}`);
  } catch (err) {
    log.error(`2c Pricing failed: ${err}`);
  }

  return results;
}

/** Merge results from 3 focused queries into ResearchedRestaurant objects */
function mergeDeepDiveResults(
  restaurants: string[],
  basicInfo: Record<string, Partial<ResearchedRestaurant>>,
  wineProgram: Record<string, Partial<ResearchedRestaurant>>,
  pricing: Record<string, Partial<ResearchedRestaurant>>
): ResearchedRestaurant[] {
  return restaurants.map(name => {
    const basic = basicInfo[name] || {};
    const wine = wineProgram[name] || {};
    const price = pricing[name] || {};

    // Merge citation links from all sources
    const allCitations = [
      ...(basic.citationLinks || []),
      ...(wine.citationLinks || []),
      ...(price.citationLinks || []),
    ];
    const uniqueCitations = [...new Set(allCitations)];

    const merged: ResearchedRestaurant = {
      name: basic.name || name,
      neighborhood: basic.neighborhood || (basic as any).neighborhood || 'Unknown',
      cuisineType: basic.cuisineType || 'Unknown',
      website: basic.website || undefined,
      address: basic.address || undefined,
      wineListSize: wine.wineListSize || undefined,
      byTheGlassCount: wine.byTheGlassCount || undefined,
      priceRange: wine.priceRange || undefined,
      notableWines: wine.notableWines || undefined,
      wineRegionFocus: wine.wineRegionFocus || undefined,
      sommelierOnStaff: wine.sommelierOnStaff ?? undefined,
      halfPriceNight: price.halfPriceNight || undefined,
      halfPriceDetails: price.halfPriceDetails || undefined,
      vibeDescription: basic.vibeDescription || undefined,
      popularDishes: basic.popularDishes || undefined,
      reservationRecommended: basic.reservationRecommended ?? undefined,
      averageEntreePrice: basic.averageEntreePrice || undefined,
      citationLinks: uniqueCitations.length > 0 ? uniqueCitations : undefined,
      markupSampling: price.markupSampling || undefined,
      wineListSource: wine.wineListSource as any || undefined,
      photoSourcesChecked: wine.photoSourcesChecked ?? undefined,
      sourcesFound: uniqueCitations.length,
      confidenceLevel: uniqueCitations.length >= 5 ? 'high' : uniqueCitations.length >= 3 ? 'medium' : 'low',
    };

    return merged;
  });
}

/** Run all 3 focused deep dive queries for a batch of restaurants */
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

    // Run all 3 focused queries in parallel
    const [basicInfo, wineProgram, pricing] = await Promise.all([
      deepDiveBasicInfo(batch, city, state),
      deepDiveWineProgram(batch, city, state),
      deepDivePricing(batch, city, state),
    ]);

    const merged = mergeDeepDiveResults(batch, basicInfo, wineProgram, pricing);
    results.push(...merged);
    log.info(`Batch merged: ${merged.length} restaurants`);

    // Rate limit: wait 2s between batches
    if (i + batchSize < restaurants.length) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Pass 3 — Claude Enrichment
// ---------------------------------------------------------------------------
// Claude uses training knowledge to:
// - Fill gaps Perplexity missed (especially websites, wine program details)
// - Validate/correct information that seems wrong
// - Add context about the restaurant and wine program
// ---------------------------------------------------------------------------
async function enrichWithClaude(
  restaurants: ResearchedRestaurant[],
  city: string,
  state: string
): Promise<ResearchedRestaurant[]> {
  log.info(`Pass 3: Claude enrichment for ${restaurants.length} restaurants`);

  const enrichBatchSize = 5; // Claude handles larger context better than Perplexity
  const enriched: ResearchedRestaurant[] = [];

  for (let i = 0; i < restaurants.length; i += enrichBatchSize) {
    const batch = restaurants.slice(i, i + enrichBatchSize);

    const restaurantSummaries = batch.map((r, idx) => {
      const gaps: string[] = [];
      if (!r.website) gaps.push('website');
      if (!r.wineListSize) gaps.push('wine list size');
      if (!r.byTheGlassCount) gaps.push('by-the-glass count');
      if (!r.priceRange) gaps.push('price range');
      if (!r.notableWines?.length) gaps.push('notable wines');
      if (!r.wineRegionFocus?.length) gaps.push('wine region focus');
      if (r.sommelierOnStaff === undefined) gaps.push('sommelier info');
      if (!r.vibeDescription) gaps.push('vibe description');
      if (!r.address) gaps.push('address');

      return `${idx + 1}. ${r.name} (${r.neighborhood || 'Unknown area'})
   Cuisine: ${r.cuisineType || 'Unknown'}
   Website: ${r.website || 'MISSING'}
   Wine list size: ${r.wineListSize || 'MISSING'}
   BTG: ${r.byTheGlassCount || 'MISSING'}
   Price range: ${r.priceRange || 'MISSING'}
   Notable wines: ${r.notableWines?.join(', ') || 'MISSING'}
   Sommelier: ${r.sommelierOnStaff ?? 'UNKNOWN'}
   Sources: ${r.sourcesFound} | Gaps: ${gaps.length > 0 ? gaps.join(', ') : 'none'}`;
    }).join('\n\n');

    try {
      const response = await anthropic.messages.create({
        model: config.claudeModel,
        max_tokens: 6000,
        system: `You are a wine industry researcher enriching restaurant data for a wine review publication. You have deep knowledge of the US restaurant and wine scene. Your job is to fill gaps and validate existing data using your knowledge.

RULES:
- Only add information you are confident about. Mark anything uncertain with null.
- For websites: use the format you'd expect (e.g., restaurantname.com). Only suggest if you're fairly sure.
- For wine programs: use your knowledge of the restaurant's reputation, cuisine style, and price point to infer likely details when specific data is missing.
- For notable wines: only name specific wines/producers you associate with this restaurant or this type of restaurant in this city.
- Do NOT fabricate specific prices, markup percentages, or citation URLs.
- Return ONLY a JSON array.`,
        messages: [{
          role: 'user',
          content: `Here are ${batch.length} restaurants in ${city}, ${state} with partial research data. Fill in gaps where you can and validate existing info.

${restaurantSummaries}

For each restaurant, return a JSON object with ONLY the fields you can add or correct:
{
  "name": "Restaurant Name (must match exactly)",
  "website": "URL if you know it, or null",
  "address": { "street": "...", "city": "${city}", "state": "${state}", "zip": "..." } or null,
  "wineListSize": "estimate if confident, or null",
  "byTheGlassCount": "estimate if confident, or null",
  "priceRange": "estimate if confident, or null",
  "notableWines": ["specific wines you associate with this place"] or null,
  "wineRegionFocus": ["regions"] or null,
  "sommelierOnStaff": true/false/null,
  "vibeDescription": "one sentence if missing" or null,
  "popularDishes": ["dishes"] or null,
  "validationNotes": "any corrections or context about the existing data"
}

Return a JSON array. No markdown fencing.`,
        }],
      });

      const text = response.content
        .filter(b => b.type === 'text')
        .map(b => (b as { type: 'text'; text: string }).text)
        .join('');

      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const enrichments = extractJsonArray(cleaned) as any[];

      // Apply enrichments to the batch
      for (const r of batch) {
        const enrichment = enrichments.find((e: any) => e.name === r.name);
        if (!enrichment) {
          enriched.push(r);
          continue;
        }

        let fieldsAdded = 0;

        // Only fill gaps — don't overwrite existing Perplexity data
        if (!r.website && enrichment.website) { r.website = enrichment.website; fieldsAdded++; }
        if (!r.address && enrichment.address) { r.address = enrichment.address; fieldsAdded++; }
        if (!r.wineListSize && enrichment.wineListSize) { r.wineListSize = enrichment.wineListSize; fieldsAdded++; }
        if (!r.byTheGlassCount && enrichment.byTheGlassCount) { r.byTheGlassCount = enrichment.byTheGlassCount; fieldsAdded++; }
        if (!r.priceRange && enrichment.priceRange) { r.priceRange = enrichment.priceRange; fieldsAdded++; }
        if ((!r.notableWines || r.notableWines.length === 0) && enrichment.notableWines?.length) {
          r.notableWines = enrichment.notableWines; fieldsAdded++;
        }
        if ((!r.wineRegionFocus || r.wineRegionFocus.length === 0) && enrichment.wineRegionFocus?.length) {
          r.wineRegionFocus = enrichment.wineRegionFocus; fieldsAdded++;
        }
        if (r.sommelierOnStaff === undefined && enrichment.sommelierOnStaff !== null && enrichment.sommelierOnStaff !== undefined) {
          r.sommelierOnStaff = enrichment.sommelierOnStaff; fieldsAdded++;
        }
        if (!r.vibeDescription && enrichment.vibeDescription) { r.vibeDescription = enrichment.vibeDescription; fieldsAdded++; }
        if ((!r.popularDishes || r.popularDishes.length === 0) && enrichment.popularDishes?.length) {
          r.popularDishes = enrichment.popularDishes; fieldsAdded++;
        }

        if (fieldsAdded > 0) {
          log.info(`Claude enriched ${r.name}: +${fieldsAdded} fields`);
        }
        enriched.push(r);
      }

      log.info(`Claude enrichment batch: ${enrichments.length} restaurants processed`);
    } catch (err) {
      log.error(`Claude enrichment failed for batch: ${err}`);
      // On failure, just pass through the original data
      enriched.push(...batch);
    }

    // Small delay between Claude batches
    if (i + enrichBatchSize < restaurants.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  return enriched;
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
      const candidates = await runDiscoveryPass(city, state, needed + 5, allExclude, RESEARCH_SYSTEM_PROMPT);

      if (candidates.length === 0) {
        log.info('No more replacement candidates found');
        break;
      }

      // Deep dive the candidates (uses new 3-query approach)
      const newRestaurants = await deepDiveRestaurants(candidates, city, state);

      // Enrich replacements with Claude too
      const enrichedReplacements = await enrichWithClaude(newRestaurants, city, state);

      // Score and filter the replacements
      for (const r of enrichedReplacements) {
        r.dataCompleteness = scoreDataCompleteness(r);

        const isGood = r.confidenceLevel !== 'low'
          && (r.sourcesFound ?? 0) >= config.minSourcesRequired
          && (r.dataCompleteness ?? 0) >= config.minDataCompleteness;

        if (isGood) {
          const unreplaced = skipped.find(s => !s.replacedBy);
          if (unreplaced) {
            unreplaced.replacedBy = r.name;
            r.replacedBy = undefined;
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
// Pass 5 — Website URL verification & discovery
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
      try { await res.text(); } catch { /* ignore */ }
      return res.ok;
    } catch {
      return false;
    }
  }
}

/** Generate common URL patterns from a restaurant name */
function guessUrls(name: string): string[] {
  const cleaned = name
    .toLowerCase()
    .replace(/\s*[-–—]\s*.*$/, '')
    .replace(/\b(restaurant|bar|grill|bistro|cafe|kitchen)\b/gi, '')
    .trim()
    .replace(/['']/g, '')
    .replace(/[&+]/g, 'and')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '');

  const dashed = name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[&+]/g, 'and')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');

  const candidates = new Set<string>();
  candidates.add(`https://www.${cleaned}.com`);
  candidates.add(`https://${cleaned}.com`);
  candidates.add(`https://www.${dashed}.com`);
  candidates.add(`https://${dashed}.com`);

  return Array.from(candidates);
}

async function verifyAndDiscoverWebsites(
  restaurants: ResearchedRestaurant[]
): Promise<ResearchedRestaurant[]> {
  log.info(`Pass 5: Verifying/discovering website URLs for ${restaurants.length} restaurants`);

  let verified = 0;
  let discovered = 0;
  let cleared = 0;

  const batchSize = 5;
  for (let i = 0; i < restaurants.length; i += batchSize) {
    const batch = restaurants.slice(i, i + batchSize);

    await Promise.all(batch.map(async (r) => {
      if (r.website) {
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

  // Pass 1 — Discover restaurant names (with Claude fallback)
  const discoveredNames = await discoverRestaurants(city, state, target);

  // Pass 2 — Focused deep dives (3 parallel queries per batch)
  const allRestaurants = await deepDiveRestaurants(discoveredNames, city, state);

  // Pass 3 — Claude enrichment (fill gaps, validate, cross-reference)
  const enrichedRestaurants = await enrichWithClaude(allRestaurants, city, state);

  // Pass 4 — Quality filter + replacements
  const { kept, skipped } = await filterAndReplaceInsufficient(enrichedRestaurants, city, state);

  // Pass 5 — Verify & discover website URLs (only for kept restaurants)
  const finalRestaurants = await verifyAndDiscoverWebsites(kept);

  const result: CityResearch = {
    city,
    citySlug,
    state,
    researchedAt: new Date().toISOString(),
    restaurants: finalRestaurants,
    skippedRestaurants: skipped,
  };

  log.info(`Research complete: ${finalRestaurants.length} restaurants profiled, ${skipped.length} skipped`);
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
