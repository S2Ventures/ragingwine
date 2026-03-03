'use client';

import { useState } from 'react';
import WineCard from './WineCard';
import type { ScanResult } from '@/lib/scan-types';

interface ScanResultsProps {
  result: ScanResult;
  onScanAnother?: () => void; // omit for read-only shareable view
}

export default function ScanResults({ result, onScanAnother }: ScanResultsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/scan/${result.id}`
    : `/scan/${result.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        {result.restaurantGuess && (
          <h2 className="text-2xl font-bold text-brand-dark mb-1">
            {result.restaurantGuess}
          </h2>
        )}
        <p className="text-sm text-gray-500">
          {result.listSummary.wineCount} wines found
          {result.listSummary.priceRange ? ` · ${result.listSummary.priceRange}` : ''}
          {result.listSummary.stylesDetected.length > 0
            ? ` · ${result.listSummary.stylesDetected.join(', ')}`
            : ''}
        </p>
      </div>

      {/* Recommendations grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {result.recommendations.map((wine, i) => (
          <WineCard key={`${wine.name}-${i}`} wine={wine} />
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
          {copied ? 'Copied!' : 'Share Results'}
        </button>

        {onScanAnother && (
          <button
            onClick={onScanAnother}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-wine-700 rounded-lg hover:bg-wine-800 transition-colors"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Scan Another
          </button>
        )}
      </div>
    </div>
  );
}
