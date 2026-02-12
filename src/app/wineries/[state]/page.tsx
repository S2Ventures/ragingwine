import { notFound } from 'next/navigation';
import Link from 'next/link';
import { wineryStates, getWineryStateBySlug, getWineriesByState, getWineriesByRegion } from '@/lib/wineries';
import WineryCard from '@/components/WineryCard';
import Newsletter from '@/components/Newsletter';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return wineryStates.map(state => ({ state: state.slug }));
}

export function generateMetadata({ params }: { params: { state: string } }): Metadata {
  const state = getWineryStateBySlug(params.state);
  if (!state) return { title: 'State Not Found' };
  return {
    title: `${state.name} Wineries | Raging Wine`,
    description: `Explore ${state.wineryCount} wineries across ${state.name}. ${state.tagline}`,
  };
}

export default function WineryStatePage({ params }: { params: { state: string } }) {
  const state = getWineryStateBySlug(params.state);
  if (!state) notFound();

  const stateWineries = getWineriesByState(state.slug);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6 flex items-center gap-1">
        <Link href="/" className="hover:text-wine-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/wineries" className="hover:text-wine-600 transition-colors">Wineries</Link>
        <span>/</span>
        <span className="text-gray-600">{state.name}</span>
      </nav>

      {/* State Header */}
      <div className="mb-8">
        <p className="text-wine-600 font-semibold text-sm uppercase tracking-wider mb-1">
          {state.abbreviation}
        </p>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-brand-dark mb-2">
          {state.name} Wineries
        </h1>
        <p className="text-gray-500 italic mb-4">{state.tagline}</p>
      </div>

      {/* Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <p className="text-sm text-gray-600 leading-relaxed">{state.overview}</p>
      </div>

      {/* Stats Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex flex-wrap gap-8">
          <div>
            <p className="text-2xl font-bold text-brand-dark">{state.wineryCount}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Active Wineries</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-brand-dark">{state.avas.length}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">AVAs</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-brand-dark">{state.regions.length}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Regions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-brand-dark">{stateWineries.length}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Profiled</p>
          </div>
        </div>
      </div>

      {/* AVAs and Key Grapes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Recognized AVAs
          </h2>
          <div className="space-y-2">
            {state.avas.map(ava => (
              <p key={ava} className="text-sm font-medium text-brand-dark">{ava}</p>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Key Grapes
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {state.keyGrapes.map(grape => (
              <span key={grape} className="text-xs bg-brand-warm text-gray-600 px-2 py-1 rounded">
                {grape}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Key Takeaways */}
      {state.keyTakeaways.length > 0 && (
        <div className="bg-brand-warm rounded-xl p-6 mb-12">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Key Takeaways
          </h2>
          <div className="space-y-3">
            {state.keyTakeaways.map((takeaway, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-wine-500 font-bold text-sm flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-gray-700 leading-relaxed">{takeaway}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wineries By Region */}
      {state.regions.map(region => {
        const regionWineries = getWineriesByRegion(region);
        if (regionWineries.length === 0) return null;

        return (
          <div key={region} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-display font-bold text-brand-dark">{region}</h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                {regionWineries.length} {regionWineries.length === 1 ? 'winery' : 'wineries'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {regionWineries.map(winery => (
                <WineryCard key={winery.slug} winery={winery} />
              ))}
            </div>
          </div>
        );
      })}

      <Newsletter />
    </div>
  );
}
