'use client';

import { useState } from 'react';
import { Winery } from '@/lib/types';

function SourcingBadge({ sourcing }: { sourcing: string }) {
  const colors =
    sourcing === '100% Estate'
      ? 'bg-green-50 text-green-700 border-green-200'
      : sourcing === 'Estate + Sourced'
        ? 'bg-blue-50 text-blue-700 border-blue-200'
        : 'bg-gray-50 text-gray-600 border-gray-200';

  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded border ${colors}`}>
      {sourcing}
    </span>
  );
}

export default function WineryCard({ winery }: { winery: Winery }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
    >
      <div className="h-2 bg-wine-500" />
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="font-bold text-lg text-brand-dark">{winery.name}</h3>
            <p className="text-sm text-gray-500">{winery.location}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-bold text-wine-700">{winery.rating}</p>
            <p className="text-xs text-gray-400">{winery.ratingSource}</p>
          </div>
        </div>

        {/* Sourcing + Tasting Price */}
        <div className="flex items-center gap-2 mb-3">
          <SourcingBadge sourcing={winery.sourcing} />
          <span className="text-xs text-gray-500">Tasting: {winery.tastingPrice}</span>
        </div>

        {/* Description */}
        <p className={`text-sm text-gray-600 mb-4 ${expanded ? '' : 'line-clamp-3'}`}>
          {winery.description}
        </p>

        {/* Highlights */}
        {winery.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(expanded ? winery.highlights : winery.highlights.slice(0, 3)).map((h, i) => (
              <span key={i} className="text-xs bg-brand-warm text-gray-600 px-2 py-0.5 rounded">
                {h}
              </span>
            ))}
            {!expanded && winery.highlights.length > 3 && (
              <span className="text-xs text-gray-400">+{winery.highlights.length - 3} more</span>
            )}
          </div>
        )}

        {/* Quick Details Grid */}
        <div className={`grid grid-cols-2 gap-x-4 gap-y-2 text-xs border-t border-gray-100 pt-3 ${expanded ? '' : ''}`}>
          <div>
            <span className="text-gray-400">Grapes</span>
            <p className={`font-medium text-gray-600 ${expanded ? '' : 'line-clamp-1'}`}>{winery.grapes}</p>
          </div>
          <div>
            <span className="text-gray-400">Hours</span>
            <p className={`font-medium text-gray-600 ${expanded ? '' : 'line-clamp-1'}`}>{winery.hours}</p>
          </div>
          <div>
            <span className="text-gray-400">Food</span>
            <p className={`font-medium text-gray-600 ${expanded ? '' : 'line-clamp-1'}`}>{winery.food}</p>
          </div>
          <div>
            <span className="text-gray-400">Entertainment</span>
            <p className={`font-medium text-gray-600 ${expanded ? '' : 'line-clamp-1'}`}>{winery.entertainment}</p>
          </div>
        </div>

        {/* Expanded: Tasting Details */}
        {expanded && winery.tastingDetails && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">Tasting Details</span>
            <p className="text-xs font-medium text-gray-600 mt-0.5">{winery.tastingDetails}</p>
          </div>
        )}

        {/* Website Link + Expand Indicator */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          {winery.website ? (
            <a
              href={winery.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-medium text-wine-600 hover:text-wine-800 transition-colors"
            >
              Visit Website &rarr;
            </a>
          ) : (
            <span />
          )}
          <span className="text-xs text-gray-400">
            {expanded ? 'Click to collapse' : 'Click to expand'}
          </span>
        </div>
      </div>
    </div>
  );
}
