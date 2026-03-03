import Link from 'next/link';
import Badge from './Badge';
import type { WineRecommendation } from '@/lib/scan-types';

const confidenceColor = {
  high: 'bg-green-500',
  medium: 'bg-yellow-500',
  low: 'bg-gray-400',
} as const;

const confidenceLabel = {
  high: 'High confidence',
  medium: 'Medium confidence',
  low: 'Low confidence',
} as const;

export default function WineCard({ wine }: { wine: WineRecommendation }) {
  const inner = (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 h-full flex flex-col">
      {/* Color bar */}
      <div className="h-1.5 bg-wine-600" />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base text-brand-dark leading-tight">
              {wine.name}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {wine.producer}
              {wine.vintage ? ` · ${wine.vintage}` : ''}
            </p>
          </div>
          {wine.price && (
            <span className="text-lg font-bold text-wine-700 flex-shrink-0">
              {wine.price}
            </span>
          )}
        </div>

        {/* Style tag */}
        <span className="inline-block text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded mb-3 w-fit">
          {wine.style}
        </span>

        {/* Badge (if restaurant matched) */}
        {wine.badge && (
          <div className="mb-3">
            <Badge type={wine.badge} size="sm" />
          </div>
        )}

        {/* Match reason */}
        <p className="text-sm text-gray-600 italic flex-1 mb-3">
          {wine.matchReason}
        </p>

        {/* Footer: confidence */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100">
          <span className={`w-2 h-2 rounded-full ${confidenceColor[wine.confidence]}`} />
          <span className="text-xs text-gray-500">{confidenceLabel[wine.confidence]}</span>
        </div>
      </div>
    </div>
  );

  if (wine.reviewSlug) {
    return (
      <Link href={`/reviews/${wine.reviewSlug}`} className="block">
        {inner}
      </Link>
    );
  }

  return inner;
}
