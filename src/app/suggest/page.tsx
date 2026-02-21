'use client';

import { useState } from 'react';
import Link from 'next/link';

const wingmanMetrics = [
  {
    key: 'listVariety',
    label: 'Wine List Variety',
    placeholder: 'e.g., Deep and eclectic, lots of regions. Or: pretty basic, mostly California.',
    description: 'Range, depth, adventure factor',
  },
  {
    key: 'markupFairness',
    label: 'Markup Fairness',
    placeholder: 'e.g., Fair prices, or: felt overpriced for what you get.',
    description: 'How pricing felt relative to quality',
  },
  {
    key: 'glasswareGrade',
    label: 'Glassware',
    placeholder: 'e.g., Proper stemware, varietal-appropriate. Or: basic stemless.',
    description: 'Glass quality, stems, pour level',
  },
  {
    key: 'staffConfidence',
    label: 'Staff Wine Knowledge',
    placeholder: 'e.g., Server knew the list cold. Or: they shrugged when I asked.',
    description: 'Did the staff know the wine list?',
  },
  {
    key: 'specialsDeals',
    label: 'Specials & Deals',
    placeholder: 'e.g., Half-price wine night on Tuesdays, rotating pours.',
    description: 'Featured wines, happy hours, flights',
  },
  {
    key: 'storageTemp',
    label: 'Storage & Temperature',
    placeholder: 'e.g., Whites were properly chilled. Or: red arrived warm.',
    description: 'Was the wine served at proper temperature?',
  },
];

export default function SuggestPage() {
  const [form, setForm] = useState({
    restaurantName: '',
    city: '',
    website: '',
    reason: '',
    submitterName: '',
    submitterEmail: '',
    listVariety: '',
    markupFairness: '',
    glasswareGrade: '',
    staffConfidence: '',
    specialsDeals: '',
    storageTemp: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showMetrics, setShowMetrics] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong.');
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-5xl mb-6">🍷</p>
        <h1 className="text-3xl font-bold text-brand-dark mb-4">
          Suggestion Received!
        </h1>
        <p className="text-gray-500 mb-2">
          We&apos;ve added this restaurant to our list. If it makes the cut,
          we&apos;ll do a full Vibe-Check review and publish it on the site.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Want to know when we review it? Make sure you&apos;re subscribed to the newsletter.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/reviews"
            className="bg-wine-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-wine-800 transition-colors"
          >
            Browse Reviews
          </Link>
          <button
            onClick={() => {
              setStatus('idle');
              setForm({
                restaurantName: '', city: '', website: '', reason: '', submitterName: '',
                submitterEmail: '', listVariety: '', markupFairness: '',
                glasswareGrade: '', staffConfidence: '', specialsDeals: '', storageTemp: '',
              });
              setShowMetrics(false);
            }}
            className="border border-gray-300 text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Suggest Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-bold uppercase tracking-widest text-wine-600 mb-3">
          Your Pick
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
          Suggest a Restaurant
        </h1>
        <p className="text-gray-500">
          Know a restaurant with a wine list worth talking about? Tell us.
          We review the list, the glassware, the staff, the vibe. If your
          pick makes the cut, it gets the full Vibe-Check treatment.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Required Fields */}
        <div>
          <label htmlFor="restaurantName" className="block text-sm font-semibold text-brand-dark mb-1">
            Restaurant Name <span className="text-wine-600">*</span>
          </label>
          <input
            id="restaurantName"
            type="text"
            required
            value={form.restaurantName}
            onChange={e => handleChange('restaurantName', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-wine-500 focus:border-wine-500 outline-none"
            placeholder="e.g., The Optimist"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-semibold text-brand-dark mb-1">
            City <span className="text-wine-600">*</span>
          </label>
          <input
            id="city"
            type="text"
            required
            value={form.city}
            onChange={e => handleChange('city', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-wine-500 focus:border-wine-500 outline-none"
            placeholder="e.g., Atlanta"
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-semibold text-brand-dark mb-1">
            Restaurant Website
          </label>
          <input
            id="website"
            type="url"
            value={form.website}
            onChange={e => handleChange('website', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-wine-500 focus:border-wine-500 outline-none"
            placeholder="https://therestaurant.com"
          />
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-semibold text-brand-dark mb-1">
            Why Should We Review It? <span className="text-wine-600">*</span>
          </label>
          <textarea
            id="reason"
            required
            rows={3}
            value={form.reason}
            onChange={e => handleChange('reason', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-wine-500 focus:border-wine-500 outline-none resize-y"
            placeholder="What stood out about the wine program? Great list, surprising value, interesting pours?"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="submitterName" className="block text-sm font-semibold text-brand-dark mb-1">
              Your Name <span className="text-wine-600">*</span>
            </label>
            <input
              id="submitterName"
              type="text"
              required
              value={form.submitterName}
              onChange={e => handleChange('submitterName', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-wine-500 focus:border-wine-500 outline-none"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="submitterEmail" className="block text-sm font-semibold text-brand-dark mb-1">
              Your Email <span className="text-wine-600">*</span>
            </label>
            <input
              id="submitterEmail"
              type="email"
              required
              value={form.submitterEmail}
              onChange={e => handleChange('submitterEmail', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-wine-500 focus:border-wine-500 outline-none"
              placeholder="you@email.com"
            />
          </div>
        </div>

        {/* Wingman Metrics Toggle */}
        <div className="border-t border-gray-200 pt-6">
          <button
            type="button"
            onClick={() => setShowMetrics(!showMetrics)}
            className="flex items-center gap-2 text-wine-700 font-semibold hover:text-wine-800 transition-colors"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${showMetrics ? 'rotate-90' : ''}`}
            >
              <path d="M7 5l5 5-5 5" />
            </svg>
            Share Your Wingman Observations (Optional)
          </button>
          <p className="text-gray-400 text-sm mt-1 ml-7">
            Already been? Share what you noticed about the wine program.
            These help us prioritize and prep for the review.
          </p>
        </div>

        {showMetrics && (
          <div className="space-y-5 bg-wine-50/50 rounded-xl p-6 border border-wine-100">
            <p className="text-xs font-bold uppercase tracking-widest text-wine-600 mb-2">
              Wingman Metrics
            </p>
            {wingmanMetrics.map(metric => (
              <div key={metric.key}>
                <label
                  htmlFor={metric.key}
                  className="block text-sm font-semibold text-brand-dark mb-0.5"
                >
                  {metric.label}
                </label>
                <p className="text-xs text-gray-400 mb-1">{metric.description}</p>
                <input
                  id={metric.key}
                  type="text"
                  value={form[metric.key as keyof typeof form]}
                  onChange={e => handleChange(metric.key, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 text-sm focus:ring-2 focus:ring-wine-500 focus:border-wine-500 outline-none"
                  placeholder={metric.placeholder}
                />
              </div>
            ))}
          </div>
        )}

        {/* Error Display */}
        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-wine-700 text-white px-6 py-3.5 rounded-lg font-bold text-lg hover:bg-wine-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? 'Submitting...' : 'Submit Suggestion'}
        </button>

        <p className="text-xs text-gray-400 text-center">
          We read every submission. Not every restaurant makes the cut, but every suggestion
          helps us decide where to eat next. Which is basically the best job ever.
        </p>
      </form>

      {/* Cross-link */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        <p className="text-gray-500 text-sm mb-2">
          Own a restaurant? Want us to review your wine program?
        </p>
        <Link
          href="/submit"
          className="text-wine-700 font-semibold hover:text-wine-800 transition-colors"
        >
          Submit Your Restaurant &rarr;
        </Link>
      </div>
    </div>
  );
}
