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

          {review.halfPriceWineNight && (
            <div className="flex items-center gap-1.5 mb-3 px-2 py-1 bg-purple-50 border border-purple-200 rounded-md w-fit">
              <span className="text-xs">&#127863;</span>
              <span className="text-xs font-semibold text-purple-700">Half-Price {review.halfPriceWineNight.day.includes('&') ? review.halfPriceWineNight.day : review.halfPriceWineNight.day + 's'}</span>
            </div>
          )}

          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {review.bottomLine}
          </p>

          {review.metrics && (
            <div className="grid grid-cols-3 gap-x-3 gap-y-1.5 text-xs border-t border-gray-100 pt-3">
              <div>
                <span className="text-gray-400">Variety</span>
                <p className="font-medium text-gray-600 truncate">{review.metrics.variety}</p>
              </div>
              <div>
                <span className="text-gray-400">Markup</span>
                <p className="font-medium text-gray-600">{review.metrics.markup}</p>
              </div>
              <div>
                <span className="text-gray-400">Glassware</span>
                <p className="font-medium text-gray-600 truncate">{review.metrics.glassware}</p>
              </div>
              <div>
                <span className="text-gray-400">Staff</span>
                <p className="font-medium text-gray-600 truncate">{review.metrics.staff}</p>
              </div>
              <div>
                <span className="text-gray-400">Specials</span>
                <p className="font-medium text-gray-600 truncate">{review.metrics.specials}</p>
              </div>
              <div>
                <span className="text-gray-400">Storage</span>
                <p className="font-medium text-gray-600">{review.metrics.storage}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
