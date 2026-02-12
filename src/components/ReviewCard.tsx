import Link from 'next/link';
import { Review, BADGE_CONFIG } from '@/lib/types';
import Badge from './Badge';

export default function ReviewCard({ review }: { review: Review }) {
  const config = BADGE_CONFIG[review.badge];

  return (
    <Link href={`/reviews/${review.slug}`} className="block group">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
        <div className={`h-2 ${review.badge === 'rager' ? 'bg-badge-rager' : review.badge === 'wildcard' ? 'bg-badge-wildcard' : review.badge === 'reliable' ? 'bg-badge-reliable' : 'bg-badge-lazy'}`} />
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="font-bold text-lg text-brand-dark group-hover:text-wine-700 transition-colors">
                {review.restaurant}
              </h3>
              <p className="text-sm text-gray-500">
                {review.neighborhood} &middot; {review.city} &middot; {review.cuisineType}
              </p>
            </div>
            <Badge type={review.badge} size="sm" />
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {review.bottomLine}
          </p>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <span>Glassware:</span>
              <span className="font-medium text-gray-600">{review.metrics.glassware}</span>
            </span>
            <span>&middot;</span>
            <span className="flex items-center gap-1">
              <span>Markup:</span>
              <span className="font-medium text-gray-600">{review.metrics.markup}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
