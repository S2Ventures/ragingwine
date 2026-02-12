'use client';

import { useState, useMemo } from 'react';
import { Review, BADGE_CONFIG, BadgeType } from '@/lib/types';
import ReviewCard from './ReviewCard';

interface CityReviewFiltersProps {
  reviews: Review[];
}

const BADGE_ORDER: BadgeType[] = ['rager', 'wildcard', 'reliable', 'lazy'];

export default function CityReviewFilters({ reviews }: CityReviewFiltersProps) {
  const [activeBadge, setActiveBadge] = useState<BadgeType | 'all'>('all');
  const [activeNeighborhood, setActiveNeighborhood] = useState<string>('all');
  const [halfPriceOnly, setHalfPriceOnly] = useState(false);

  const halfPriceCount = useMemo(() => {
    return reviews.filter(r => r.halfPriceWineNight).length;
  }, [reviews]);

  const neighborhoods = useMemo(() => {
    const set = new Set(reviews.map(r => r.neighborhood));
    return Array.from(set).sort();
  }, [reviews]);

  const badgeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: reviews.length };
    BADGE_ORDER.forEach(b => {
      const c = reviews.filter(r => r.badge === b).length;
      if (c > 0) counts[b] = c;
    });
    return counts;
  }, [reviews]);

  const filtered = useMemo(() => {
    return reviews.filter(r => {
      if (activeBadge !== 'all' && r.badge !== activeBadge) return false;
      if (activeNeighborhood !== 'all' && r.neighborhood !== activeNeighborhood) return false;
      if (halfPriceOnly && !r.halfPriceWineNight) return false;
      return true;
    });
  }, [reviews, activeBadge, activeNeighborhood, halfPriceOnly]);

  const isFiltered = activeBadge !== 'all' || activeNeighborhood !== 'all' || halfPriceOnly;

  return (
    <div>
      {/* Badge Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setActiveBadge('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
            activeBadge === 'all'
              ? 'bg-brand-dark text-white border-brand-dark'
              : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
          }`}
        >
          All ({badgeCounts.all})
        </button>
        {BADGE_ORDER.map(badge => {
          if (!badgeCounts[badge]) return null;
          const config = BADGE_CONFIG[badge];
          const isActive = activeBadge === badge;
          return (
            <button
              key={badge}
              onClick={() => setActiveBadge(isActive ? 'all' : badge)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                isActive
                  ? badge === 'rager'
                    ? 'bg-badge-rager text-white border-badge-rager'
                    : badge === 'wildcard'
                    ? 'bg-badge-wildcard text-white border-badge-wildcard'
                    : badge === 'reliable'
                    ? 'bg-badge-reliable text-white border-badge-reliable'
                    : 'bg-badge-lazy text-white border-badge-lazy'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
              }`}
            >
              {config.label} ({badgeCounts[badge]})
            </button>
          );
        })}
      </div>

      {/* Half-Price Wine Night + Neighborhood row */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {halfPriceCount > 0 && (
          <button
            onClick={() => setHalfPriceOnly(!halfPriceOnly)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
              halfPriceOnly
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white text-purple-600 border-purple-300 hover:border-purple-400'
            }`}
          >
            &#127863; Half-Price Wine Night ({halfPriceCount})
          </button>
        )}

        {halfPriceCount > 0 && neighborhoods.length > 3 && (
          <span className="text-gray-300 text-xs">|</span>
        )}

        {neighborhoods.length > 3 && (
          <>
            <button
              onClick={() => setActiveNeighborhood('all')}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                activeNeighborhood === 'all'
                  ? 'bg-gray-700 text-white border-gray-700'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              All Neighborhoods
            </button>
            {neighborhoods.map(n => (
              <button
                key={n}
                onClick={() => setActiveNeighborhood(activeNeighborhood === n ? 'all' : n)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                  activeNeighborhood === n
                    ? 'bg-gray-700 text-white border-gray-700'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                {n}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Results Count */}
      {isFiltered && (
        <p className="text-xs text-gray-400 mb-4">
          Showing {filtered.length} of {reviews.length} reviews
          {activeBadge !== 'all' && <span> &middot; {BADGE_CONFIG[activeBadge].label}</span>}
          {activeNeighborhood !== 'all' && <span> &middot; {activeNeighborhood}</span>}
          {halfPriceOnly && <span> &middot; Half-Price Wine Night</span>}
        </p>
      )}

      {/* Review Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filtered.map(review => (
            <ReviewCard key={review.slug} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 mb-12">
          <p className="text-sm text-gray-400">No reviews match these filters.</p>
          <button
            onClick={() => { setActiveBadge('all'); setActiveNeighborhood('all'); setHalfPriceOnly(false); }}
            className="text-wine-600 text-sm mt-2 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
