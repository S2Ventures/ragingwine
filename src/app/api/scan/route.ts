import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getSupabase } from '@/lib/supabase';
import { getReviews } from '@/lib/sanity';
import { analyzeScanImage } from '@/lib/scanner';
import type { ScanRequest, ScanResult, ScanError } from '@/lib/scan-types';

const VALID_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB base64 ≈ 7.5 MB raw
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isScanResult(r: ScanResult | ScanError): r is ScanResult {
  return 'id' in r;
}

export async function POST(request: Request) {
  try {
    // --- Parse body ---
    const body = await request.json() as Partial<ScanRequest>;

    if (!body.image || typeof body.image !== 'string') {
      return NextResponse.json({ code: 'invalid_image', message: 'Image data is required.' }, { status: 400 });
    }
    if (!body.mimeType || !VALID_MIME_TYPES.includes(body.mimeType)) {
      return NextResponse.json({ code: 'invalid_image', message: 'Unsupported image type. Use JPEG, PNG, or WebP.' }, { status: 400 });
    }
    if (body.image.length > MAX_IMAGE_SIZE) {
      return NextResponse.json({ code: 'invalid_image', message: 'Image too large. Max 10 MB.' }, { status: 400 });
    }

    // --- Rate limiting (IP-based via Supabase) ---
    const headersList = await headers();
    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headersList.get('x-real-ip') ||
      'unknown';

    const supabase = getSupabase();
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();

    const { count } = await supabase
      .from('scan_logs')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .gte('created_at', windowStart);

    if ((count ?? 0) >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { code: 'rate_limited', message: 'Too many scans. Try again in an hour.' },
        { status: 429 }
      );
    }

    // --- Fetch reviews for context ---
    const reviews = await getReviews();

    // --- Analyze ---
    const scanRequest: ScanRequest = {
      image: body.image,
      mimeType: body.mimeType as ScanRequest['mimeType'],
      context: body.context,
    };

    const result = await analyzeScanImage(scanRequest, reviews);

    if (!isScanResult(result)) {
      // ScanError
      const status = result.code === 'no_wines_found' ? 422 : 500;
      return NextResponse.json(result, { status });
    }

    // --- Log to Supabase (fire-and-forget) ---
    void (async () => {
      try {
        await supabase.from('scan_logs').insert({
          scan_id: result.id,
          ip_address: ip,
          restaurant_guess: result.restaurantGuess,
          recommendation_count: result.recommendations.length,
          result_json: result,
        });
      } catch (err: unknown) {
        console.error('Failed to log scan:', err);
      }
    })();

    return NextResponse.json(result);
  } catch (error) {
    console.error('Scan API error:', error);
    return NextResponse.json(
      { code: 'api_error', message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
