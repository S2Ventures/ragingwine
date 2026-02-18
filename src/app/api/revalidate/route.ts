import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createHmac } from 'crypto';

// Sanity document type → paths that need revalidation
const REVALIDATION_MAP: Record<string, string[]> = {
  review: ['/', '/reviews', '/reviews/[slug]', '/cities/[city]'],
  city: ['/', '/cities/[city]', '/reviews'],
  wineryState: ['/', '/wineries', '/wineries/[state]'],
  winery: ['/wineries', '/wineries/[state]'],
};

function isValidSignature(body: string, signature: string, secret: string): boolean {
  const hmac = createHmac('sha256', secret);
  hmac.update(body);
  const digest = hmac.digest('hex');
  return signature === digest;
}

export async function POST(request: Request) {
  try {
    const secret = process.env.SANITY_WEBHOOK_SECRET;
    if (!secret) {
      console.error('SANITY_WEBHOOK_SECRET is not set');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    // Validate the webhook signature
    const signature = request.headers.get('x-sanity-webhook-signature') || '';
    const rawBody = await request.text();

    if (!isValidSignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const { _type } = body;

    if (!_type) {
      return NextResponse.json({ error: 'Missing _type in payload' }, { status: 400 });
    }

    const paths = REVALIDATION_MAP[_type];
    if (!paths) {
      // Document type we don't need to revalidate for (e.g. future types)
      return NextResponse.json({ revalidated: false, reason: `No paths mapped for type: ${_type}` });
    }

    // Revalidate all affected paths
    for (const path of paths) {
      revalidatePath(path, 'page');
    }

    console.log(`Revalidated paths for ${_type}: ${paths.join(', ')}`);
    return NextResponse.json({ revalidated: true, type: _type, paths });
  } catch (err) {
    console.error('Revalidation webhook error:', err);
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}
