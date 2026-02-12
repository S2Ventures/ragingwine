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
      return true;
    });
  }, [reviews, activeBadge, activeNeighborhood]);

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

      {/* Neighborhood Filter */}
      {neighborhoods.length > 3 && (
        <div className="flex flex-wrap gap-2 mb-8">
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
        </div>
      )}

      {/* Results Count */}
      {(activeBadge !== 'all' || activeNeighborhood !== 'all') && (
        <p className="text-xs text-gray-400 mb-4">
          Showing {filtered.length} of {reviews.length} reviews
          {activeBadge !== 'all' && <span> &middot; {BADGE_CONFIG[activeBadge].label}</span>}
          {activeNeighborhood !== 'all' && <span> &middot; {activeNeighborhood}</span>}
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
            onClick={() => { setActiveBadge('all'); setActiveNeighborhood('all'); }}
            className="text-wine-600 text-sm mt-2 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
