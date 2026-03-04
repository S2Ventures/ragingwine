import Anthropic from '@anthropic-ai/sdk';
import { nanoid } from 'nanoid';
import type { Review } from './types';
import type { ScanRequest, ScanResult, ScanError, WineRecommendation, ListSummary } from './scan-types';

// ---------------------------------------------------------------------------
// Claude client (singleton)
// ---------------------------------------------------------------------------
let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!_client) {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error('Missing ANTHROPIC_API_KEY');
    _client = new Anthropic({ apiKey: key });
  }
  return _client;
}

// ---------------------------------------------------------------------------
// Condense reviews for the system prompt
// ---------------------------------------------------------------------------
function buildReviewContext(reviews: Review[]): string {
  const lines = reviews.map(r => {
    const parts = [
      r.restaurant,
      r.badge.toUpperCase(),
      r.neighborhood,
      r.city,
      r.cuisineType,
    ];
    if (r.halfPriceWineNight) parts.push(`Half-price ${r.halfPriceWineNight.day}`);
    if (r.tags?.length) parts.push(r.tags.join(', '));
    return `- ${parts.join(' | ')} [slug:${r.slug}]`;
  });
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------
function buildSystemPrompt(reviews: Review[], preferences?: string): string {
  const reviewCtx = buildReviewContext(reviews);

  return `You are RagingWine's sommelier assistant. Your job is to analyze a photograph of a restaurant wine list and recommend the best wines on it.

CONTEXT: RagingWine is an opinionated restaurant wine guide. We rate restaurants with badges:
- RAGER: Exceptional wine program, worth traveling for
- WILDCARD: Exciting finds, unique selections, high reward
- RELIABLE: Solid, fair pricing, good selections
- LAZY: Overpriced, boring, or neglected

REVIEWED RESTAURANTS (format: Name | Badge | Neighborhood | City | Cuisine | extras [slug:url-slug]):
${reviewCtx}

INSTRUCTIONS:
1. Read the wine list in the image carefully.
2. Identify the restaurant if possible (from the list name, header, or logo).
3. Recommend 3-6 wines from the list. Prioritize: value (price vs quality), interesting/uncommon selections, and wines that match the restaurant's cuisine.
4. If the restaurant matches one in our reviewed list, include the badge and review slug.
5. For each wine, explain WHY you recommend it in 1-2 sentences.
${preferences ? `6. The user mentioned these preferences: "${preferences}". Factor them in.\n` : ''}
RESPOND WITH VALID JSON ONLY (no markdown, no code fences):
{
  "restaurantGuess": "Restaurant Name" or null,
  "listSummary": {
    "wineCount": number,
    "priceRange": "$X – $Y",
    "stylesDetected": ["Reds", "Whites", ...]
  },
  "recommendations": [
    {
      "name": "Wine Name",
      "producer": "Producer/Winery",
      "vintage": "2021" or null,
      "price": "$14" or null,
      "style": "Red - Pinot Noir",
      "badge": "rager" | "wildcard" | "reliable" | "lazy" | null,
      "matchReason": "Why this wine is a great pick...",
      "reviewSlug": "slug-value" or null,
      "confidence": "high" | "medium" | "low"
    }
  ]
}`;
}

// ---------------------------------------------------------------------------
// Main analysis function
// ---------------------------------------------------------------------------
export async function analyzeScanImage(
  request: ScanRequest,
  reviews: Review[]
): Promise<ScanResult | ScanError> {
  try {
    const client = getClient();
    const systemPrompt = buildSystemPrompt(reviews, request.context?.preferences);

    const userContent: Anthropic.Messages.ContentBlockParam[] = [
      {
        type: 'image',
        source: {
          type: 'base64',
          media_type: (request.mimeType === 'image/heic' || request.mimeType === 'image/heif')
            ? 'image/jpeg'
            : request.mimeType as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
          data: request.image,
        },
      },
      {
        type: 'text',
        text: request.context
          ? `Analyze this wine list. Party size: ${request.context.partySize ?? 'unknown'}. Budget: ${request.context.budget ?? 'any'}.`
          : 'Analyze this wine list and recommend the best wines.',
      },
    ];

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
    });

    // Extract text from response
    const textBlock = response.content.find(b => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return { code: 'api_error', message: 'No text response from Claude' };
    }

    // Parse JSON — strip markdown code fences if present
    let jsonText = textBlock.text.trim();
    // Remove ```json ... ``` or ``` ... ``` wrappers
    const fenceMatch = jsonText.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?\s*```$/);
    if (fenceMatch) {
      jsonText = fenceMatch[1].trim();
    }

    let parsed: {
      restaurantGuess: string | null;
      listSummary: ListSummary;
      recommendations: WineRecommendation[];
    };

    try {
      parsed = JSON.parse(jsonText);
    } catch {
      console.error('Failed to parse JSON:', jsonText.slice(0, 200));
      return { code: 'api_error', message: 'Failed to parse Claude response as JSON' };
    }

    if (!parsed.recommendations || parsed.recommendations.length === 0) {
      return { code: 'no_wines_found', message: 'Could not identify wines on this list.' };
    }

    const result: ScanResult = {
      id: nanoid(10),
      recommendations: parsed.recommendations,
      restaurantGuess: parsed.restaurantGuess,
      listSummary: parsed.listSummary,
      timestamp: new Date().toISOString(),
    };

    return result;
  } catch (err: unknown) {
    console.error('Scanner error:', err);
    const message = err instanceof Error ? err.message : 'Unknown scanner error';
    return { code: 'api_error', message };
  }
}
