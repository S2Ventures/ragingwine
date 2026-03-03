import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSupabase } from '@/lib/supabase';
import ScanResults from '@/components/ScanResults';
import type { ScanResult } from '@/lib/scan-types';

export const revalidate = 3600; // ISR: 1 hour

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getScanResult(scanId: string): Promise<ScanResult | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('scan_logs')
    .select('result_json')
    .eq('scan_id', scanId)
    .single();

  if (error || !data) return null;
  return data.result_json as ScanResult;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getScanResult(id);
  const title = result?.restaurantGuess
    ? `${result.restaurantGuess} Wine Picks | RagingWine`
    : 'Wine List Scan | RagingWine';

  return {
    title,
    description: result
      ? `${result.recommendations.length} wine recommendations from a scanned wine list`
      : 'Wine list scan results from RagingWine',
  };
}

export default async function ScanResultPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getScanResult(id);

  if (!result) notFound();

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 mb-1">Scanned wine list</p>
          <h1 className="text-2xl font-bold text-brand-dark">
            {result.restaurantGuess || 'Wine Recommendations'}
          </h1>
        </div>
        <ScanResults result={result} />
      </section>
    </main>
  );
}
