import type { Metadata } from 'next';
import ScanPageClient from './ScanPageClient';

export const metadata: Metadata = {
  title: 'Wine List Scanner | RagingWine',
  description:
    'Snap a photo of any restaurant wine list and get instant, opinionated recommendations from the RagingWine team.',
  openGraph: {
    title: 'Wine List Scanner | RagingWine',
    description: 'Point. Shoot. Drink better.',
  },
};

export default function ScanPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">&#127863;</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-3">
            Wine List Scanner
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Snap a photo of a restaurant wine list and get instant
            recommendations powered by 237+ RagingWine reviews.
          </p>
        </div>

        <ScanPageClient />

        {/* How it works */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl mb-2">&#128247;</div>
            <h3 className="font-semibold text-brand-dark mb-1">1. Snap</h3>
            <p className="text-sm text-gray-500">
              Take a photo of the wine list at your table
            </p>
          </div>
          <div>
            <div className="text-2xl mb-2">&#129504;</div>
            <h3 className="font-semibold text-brand-dark mb-1">2. Analyze</h3>
            <p className="text-sm text-gray-500">
              AI reads the list and matches it against our reviews
            </p>
          </div>
          <div>
            <div className="text-2xl mb-2">&#127942;</div>
            <h3 className="font-semibold text-brand-dark mb-1">3. Pick</h3>
            <p className="text-sm text-gray-500">
              Get ranked recommendations with prices and reasons
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
