'use client';

import { useState, useMemo } from 'react';
import { Review, BADGE_CONFIG, BadgeType } from '@/lib/types';
import ReviewCard from './ReviewCard';

interface ReviewsPageFiltersProps {
  reviews: Review[];
}

const BADGE_ORDER: BadgeType[] = ['rager', 'wildcard', 'reliable', 'lazy'];

export default function ReviewsPageFilters({ reviews }: ReviewsPageFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBadge, setActiveBadge] = useState<BadgeType | 'all'>('all');
  const [activeCity, setActiveCity] = useState<string>('all');
  const [halfPriceOnly, setHalfPriceOnly] = useState(false);

  const halfPriceCount = useMemo(() => {
    return reviews.filter(r => r.halfPriceWineNight).length;
  }, [reviews]);

  const cities = useMemo(() => {
    const set = new Set(reviews.map(r => r.city));
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
    const q = searchQuery.toLowerCase().trim();
    return reviews.filter(r => {
      if (q) {
        const haystack = [
          r.restaurant,
          r.city,
          r.neighborhood,
          r.cuisineType,
          r.subtitle || '',
          r.bottomLine,
          ...(r.tags || []),
        ].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (activeBadge !== 'all' && r.badge !== activeBadge) return false;
      if (activeCity !== 'all' && r.city !== activeCity) return false;
      if (halfPriceOnly && !r.halfPriceWineNight) return false;
      return true;
    });
  }, [reviews, searchQuery, activeBadge, activeCity, halfPriceOnly]);

  const isFiltered = searchQuery !== '' || activeBadge !== 'all' || activeCity !== 'all' || halfPriceOnly;

  const clearAll = () => {
    setSearchQuery('');
    setActiveBadge('all');
    setActiveCity('all');
    setHalfPriceOnly(false);
  };

  return (
    <div>
      {/* Search Input */}
      <div className="relative mb-5">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search restaurants, cities, cuisines, tags..."
          className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine-500 focus:border-transparent placeholder-gray-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Badge Filters */}
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

      {/* City + Half-Price Row */}
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

        {halfPriceCount > 0 && cities.length > 1 && (
          <span className="text-gray-300 text-xs">|</span>
        )}

        {cities.length > 1 && (
          <>
            <button
              onClick={() => setActiveCity('all')}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                activeCity === 'all'
                  ? 'bg-gray-700 text-white border-gray-700'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              All Cities
            </button>
            {cities.map(c => (
              <button
                key={c}
                onClick={() => setActiveCity(activeCity === c ? 'all' : c)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                  activeCity === c
                    ? 'bg-gray-700 text-white border-gray-700'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                {c}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Results Count */}
      {isFiltered && (
        <div className="flex items-center gap-3 mb-4">
          <p className="text-xs text-gray-400">
            Showing {filtered.length} of {reviews.length} reviews
            {searchQuery && <span> &middot; &ldquo;{searchQuery}&rdquo;</span>}
            {activeBadge !== 'all' && <span> &middot; {BADGE_CONFIG[activeBadge].label}</span>}
            {activeCity !== 'all' && <span> &middot; {activeCity}</span>}
            {halfPriceOnly && <span> &middot; Half-Price Wine Night</span>}
          </p>
          <button
            onClick={clearAll}
            className="text-wine-600 text-xs hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Reviews Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(review => (
            <ReviewCard key={review.slug} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-sm text-gray-400">
            {searchQuery ? `No reviews match "${searchQuery}"` : 'No reviews match these filters.'}
          </p>
          <button
            onClick={clearAll}
            className="text-wine-600 text-sm mt-2 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
