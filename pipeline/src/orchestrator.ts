// ---------------------------------------------------------------------------
// Pipeline Orchestrator
// ---------------------------------------------------------------------------
// Reads the city queue, picks the next pending city, runs all 4 stages:
//   1. Perplexity Research → 2. Claude Writer → 3. Sanity Publisher → 4. Report
// Updates the queue file when complete.
// ---------------------------------------------------------------------------

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { createLogger } from './logger.js';
import { researchCity } from './research.js';
import { writeReviews } from './writer.js';
import { publishReviews } from './publisher.js';
import { sendReport } from './report.js';
import type { CityQueueEntry, SkippedRestaurant, PipelineResult } from './types.js';

const log = createLogger('orchestrator');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUEUE_PATH = path.resolve(__dirname, '../data/city-queue.json');

// ---------------------------------------------------------------------------
// Queue management
// ---------------------------------------------------------------------------
function loadQueue(): CityQueueEntry[] {
  const raw = fs.readFileSync(QUEUE_PATH, 'utf-8');
  return JSON.parse(raw);
}

function saveQueue(queue: CityQueueEntry[]) {
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2));
}

function getNextCity(queue: CityQueueEntry[]): CityQueueEntry | undefined {
  // Explicit city from CLI args
  const cliCity = process.argv.find(a => a.startsWith('--city='))?.split('=')[1];
  if (cliCity) {
    return queue.find(c => c.citySlug === cliCity || c.city.toLowerCase() === cliCity.toLowerCase());
  }

  // Otherwise, pick highest-priority pending city
  return queue
    .filter(c => c.status === 'pending')
    .sort((a, b) => a.priority - b.priority)[0];
}

// ---------------------------------------------------------------------------
// Save intermediate outputs for debugging / reprocessing
// ---------------------------------------------------------------------------
function saveIntermediate(filename: string, data: unknown) {
  const outDir = path.resolve(__dirname, '../data/runs');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const filepath = path.join(outDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  log.debug(`Saved: ${filepath}`);
}

// ---------------------------------------------------------------------------
// Main pipeline
// ---------------------------------------------------------------------------
async function runPipeline() {
  const startedAt = new Date().toISOString();
  log.info(`Pipeline starting ${config.dryRun ? '(DRY RUN)' : '(LIVE)'}`);

  // Load queue and pick city
  const queue = loadQueue();
  const city = getNextCity(queue);

  if (!city) {
    log.info('No pending cities in queue. Nothing to do.');
    return;
  }

  log.info(`Selected city: ${city.city}, ${city.state} (priority ${city.priority})`);

  // Mark in-progress
  city.status = 'in-progress';
  saveQueue(queue);

  const errors: string[] = [];
  let restaurantsResearched = 0;
  let reviewsWritten = 0;
  let reviewsPublished = 0;
  let restaurantsSkippedResearch = 0;
  let restaurantsSkippedWriting = 0;
  let allSkipped: SkippedRestaurant[] = [];
  let reviewResults: PipelineResult['reviews'] = [];

  try {
    // ── Stage 1: Research ──────────────────────────────────────────────
    log.info('═══ STAGE 1: PERPLEXITY RESEARCH ═══');
    const research = await researchCity(city.city, city.citySlug, city.state);
    restaurantsResearched = research.restaurants.length;
    restaurantsSkippedResearch = research.skippedRestaurants?.length ?? 0;
    allSkipped.push(...(research.skippedRestaurants ?? []));
    saveIntermediate(`${city.citySlug}-research-${Date.now()}.json`, research);
    log.info(`Research: ${restaurantsResearched} kept, ${restaurantsSkippedResearch} skipped`);

    // ── Stage 2: Write Reviews ─────────────────────────────────────────
    log.info('═══ STAGE 2: CLAUDE REVIEW WRITING ═══');
    const writerOutput = await writeReviews(research);
    reviewsWritten = writerOutput.reviews.length;
    restaurantsSkippedWriting = writerOutput.skipped.length;
    allSkipped.push(...writerOutput.skipped);
    saveIntermediate(`${city.citySlug}-reviews-${Date.now()}.json`, writerOutput);
    log.info(`Writer: ${reviewsWritten} reviews, ${restaurantsSkippedWriting} skipped`);

    // ── Stage 3: Publish ───────────────────────────────────────────────
    log.info('═══ STAGE 3: SANITY PUBLISHING ═══');
    const publishResults = await publishReviews(writerOutput.reviews, city.city, city.citySlug, city.state);
    reviewsPublished = publishResults.filter(r => r.published).length;
    reviewResults = publishResults;

    // Collect publish errors
    for (const r of publishResults) {
      if (r.error && r.error !== 'duplicate') {
        errors.push(`Publish failed: ${r.restaurant} — ${r.error}`);
      }
    }

    // Mark complete
    city.status = 'completed';
    city.lastRunAt = new Date().toISOString();
    city.reviewCount = reviewsPublished;

  } catch (err) {
    log.error('Pipeline failed', String(err));
    errors.push(`Pipeline error: ${String(err)}`);
    city.status = 'failed';
  }

  saveQueue(queue);

  // ── Stage 4: Morning Report ────────────────────────────────────────
  const completedAt = new Date().toISOString();
  const result: PipelineResult = {
    city: city.city,
    citySlug: city.citySlug,
    startedAt,
    completedAt,
    restaurantsResearched,
    reviewsWritten,
    reviewsPublished,
    restaurantsSkippedResearch,
    restaurantsSkippedWriting,
    skippedRestaurants: allSkipped,
    errors,
    reviews: reviewResults,
  };

  log.info('═══ STAGE 4: MORNING REPORT ═══');
  await sendReport(result);
  saveIntermediate(`${city.citySlug}-report-${Date.now()}.json`, result);

  // Summary
  log.info('═══ PIPELINE COMPLETE ═══');
  log.info(`City: ${city.city}`);
  log.info(`Researched: ${restaurantsResearched}`);
  log.info(`Skipped (research): ${restaurantsSkippedResearch}`);
  log.info(`Skipped (writing): ${restaurantsSkippedWriting}`);
  log.info(`Written: ${reviewsWritten}`);
  log.info(`Published: ${reviewsPublished}`);
  log.info(`Errors: ${errors.length}`);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------
runPipeline().catch(err => {
  log.error('Fatal error', String(err));
  process.exit(1);
});
