import 'dotenv/config';

// ---------------------------------------------------------------------------
// Env helpers
// ---------------------------------------------------------------------------
function required(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing required env var: ${key}`);
  return v;
}

function optional(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
export const config = {
  // Perplexity
  perplexityApiKey: required('PERPLEXITY_API_KEY'),
  perplexityModel: optional('PERPLEXITY_MODEL', 'sonar-pro'),

  // Claude
  anthropicApiKey: required('ANTHROPIC_API_KEY'),
  claudeModel: optional('CLAUDE_MODEL', 'claude-sonnet-4-5-20250929'),

  // Sanity (write)
  sanityProjectId: optional('SANITY_PROJECT_ID', 'qyap5sez'),
  sanityDataset: optional('SANITY_DATASET', 'production'),
  sanityWriteToken: required('SANITY_WRITE_TOKEN'),
  sanityApiVersion: optional('SANITY_API_VERSION', '2024-01-01'),

  // Resend (morning report)
  resendApiKey: optional('RESEND_API_KEY', ''),
  reportTo: optional('REPORT_EMAIL', 'hello@ragingwine.com'),
  reportFrom: optional('REPORT_FROM', 'Raging Wine Pipeline <notifications@ragingwine.com>'),

  // Pipeline
  restaurantsPerCity: parseInt(optional('RESTAURANTS_PER_CITY', '30'), 10),
  dryRun: process.argv.includes('--dry-run'),
} as const;
