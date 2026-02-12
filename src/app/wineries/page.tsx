import Link from 'next/link';
import { wineryStates } from '@/lib/wineries';
import Newsletter from '@/components/Newsletter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Winery Guide | Raging Wine',
  description: 'Explore wineries across the U.S. with honest profiles, tasting details, and the info you actually need before you visit.',
};

export default function WineriesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-brand-dark mb-3">
          Winery Guide
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Honest winery profiles with the details that matter: what they grow, what it costs,
          what the experience is actually like, and whether it&apos;s worth the drive.
          Pick a state and start exploring.
        </p>
      </div>

      {/* State Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {wineryStates.map(state => (
          <Link key={state.slug} href={`/wineries/${state.slug}`} className="block group">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
              <div className="h-2 bg-wine-500" />
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-semibold text-wine-600 uppercase tracking-wider mb-1">
                      {state.abbreviation}
                    </p>
                    <h2 className="text-xl font-bold text-brand-dark group-hover:text-wine-700 transition-colors">
                      {state.name}
                    </h2>
                    <p className="text-sm text-gray-500 italic mt-1">{state.tagline}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-brand-dark">{state.wineryCount}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Wineries</p>
                  </div>
                </div>

                {/* Key Stats */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <div>
                    <p className="text-sm font-bold text-brand-dark">{state.avas.length}</p>
                    <p className="text-xs text-gray-400">AVAs</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-dark">{state.regions.length}</p>
                    <p className="text-xs text-gray-400">Regions</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-dark">{state.keyGrapes.length}</p>
                    <p className="text-xs text-gray-400">Key Grapes</p>
                  </div>
                </div>

                {/* Key Grapes Preview */}
                <div className="flex flex-wrap gap-1.5">
                  {state.keyGrapes.slice(0, 5).map(grape => (
                    <span key={grape} className="text-xs bg-brand-warm text-gray-600 px-2 py-0.5 rounded">
                      {grape}
                    </span>
                  ))}
                  {state.keyGrapes.length > 5 && (
                    <span className="text-xs text-gray-400">+{state.keyGrapes.length - 5} more</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Coming Soon placeholder for states without data yet */}
      {wineryStates.length < 2 && (
        <div className="text-center py-12 mb-12">
          <p className="text-lg font-medium text-gray-400 mb-2">More states coming soon</p>
          <p className="text-sm text-gray-400">
            Subscribe below to get notified as we add new state winery guides.
          </p>
        </div>
      )}

      <Newsletter />
    </div>
  );
}
