import { reviews } from '@/lib/data';
import { BADGE_CONFIG, BadgeType } from '@/lib/types';
import Badge from '@/components/Badge';
import ReviewsPageFilters from '@/components/ReviewsPageFilters';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wine List Reviews | Raging Wine',
  description: 'Honest restaurant wine list reviews with our Vibe-Check badge system and Wingman Metrics. No scores, no BS.',
};

export default function ReviewsPage() {
  const badgeTypes: BadgeType[] = ['rager', 'wildcard', 'reliable', 'lazy'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-brand-dark mb-2">Wine List Reviews</h1>
        <p className="text-gray-500 max-w-xl">
          Every review includes our Vibe-Check badge, Wingman Metrics, and the picks
          you actually need: best value, hidden gem, skip this, and the perfect pairing.
        </p>
      </div>

      {/* Badge Legend */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-10">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Rating System</p>
        <div className="flex flex-wrap gap-3">
          {badgeTypes.map(badge => (
            <div key={badge} className="flex items-center gap-2">
              <Badge type={badge} size="sm" />
              <span className="text-xs text-gray-500 hidden sm:inline">{BADGE_CONFIG[badge].description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search, Filters & Reviews Grid */}
      <ReviewsPageFilters reviews={reviews} />
    </div>
  );
}
