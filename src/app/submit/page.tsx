'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SubmitRestaurantPage() {
  const [form, setForm] = useState({
    restaurantName: '',
    city: '',
    website: '',
    reason: '',
    contactName: '',
    contactEmail: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/submit-restaurant', {
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
        <p className="text-5xl mb-6">🔥</p>
        <h1 className="text-3xl font-bold text-brand-dark mb-4">
          Submission Received!
        </h1>
        <p className="text-gray-500 mb-2">
          We&apos;ve got your info. If your wine program catches our attention
          (and it sounds like it will), we&apos;ll reach out to schedule a visit.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Every restaurant gets a fair, honest review. We call it like we see it.
          And we always lead with what works.
        </p>
        <Link
          href="/reviews"
          className="bg-wine-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-wine-800 transition-colors inline-block"
        >
          See How We Review
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-bold uppercase tracking-widest text-wine-600 mb-3">
          For Restaurants
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
          Get a Vibe-Check
        </h1>
        <p className="text-gray-500">
          Think your wine program deserves attention? We agree. Raging Wine
          reviews restaurant wine lists with a focus on variety, value, glassware,
          staff knowledge, specials, and storage. If you&apos;re proud of what
          you pour, let us come see it.
        </p>
      </div>

      {/* What to Expect */}
      <div className="bg-wine-50 border border-wine-200 rounded-xl p-6 mb-10">
        <h2 className="font-bold text-wine-800 mb-3">What to Expect</h2>
        <div className="space-y-2 text-wine-700 text-sm">
          <p>
            <span className="font-semibold">Honest reviews.</span> We don&apos;t
            do puff pieces. We call it like we see it, and we always highlight
            what&apos;s working.
          </p>
          <p>
            <span className="font-semibold">The Vibe-Check badge.</span> Every
            reviewed restaurant earns one of four badges: Rager, Wild Card,
            Reliable, or Lazy List. Your badge is based on our six Wingman Metrics.
          </p>
          <p>
            <span className="font-semibold">No pay-to-play.</span> Submitting
            your restaurant does not guarantee a positive review, and positive
            reviews are never for sale. That&apos;s the whole point.
          </p>
        </div>
      </div>

      {/* Guide CTA */}
      <div className="mb-10">
        <Link
          href="/submit/guide"
          className="group flex items-center justify-between w-full bg-white border-2 border-wine-200 rounded-xl p-5 hover:border-wine-400 hover:bg-wine-50 transition-all"
        >
          <div>
            <p className="font-bold text-brand-dark group-hover:text-wine-700 transition-colors">
              Before you submit&hellip; read our guide to earning The Rager 🔥
            </p>
            <p className="text-sm text-gray-500 mt-1">
              The six things we actually look for, and how to nail every one.
            </p>
          </div>
          <span className="text-wine-600 text-xl ml-4 group-hover:translate-x-1 transition-transform">
            &rarr;
          </span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            placeholder="Your restaurant name"
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
            placeholder="e.g., Atlanta, Charleston, Greenville"
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-semibold text-brand-dark mb-1">
            Website
          </label>
          <input
            id="website"
            type="url"
            value={form.website}
            onChange={e => handleChange('website', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-wine-500 focus:border-wine-500 outline-none"
            placeholder="https://yourrestaurant.com"
          />
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-semibold text-brand-dark mb-1">
            Tell Us About Your Wine Program <span className="text-wine-600">*</span>
          </label>
          <textarea
            id="reason"
            required
            rows={4}
            value={form.reason}
            onChange={e => handleChange('reason', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-wine-500 focus:border-wine-500 outline-none resize-y"
            placeholder="What makes your wine list special? Anything you want us to know before we visit?"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contactName" className="block text-sm font-semibold text-brand-dark mb-1">
              Contact Name <span className="text-wine-600">*</span>
            </label>
            <input
              id="contactName"
              type="text"
              required
              value={form.contactName}
              onChange={e => handleChange('contactName', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-wine-500 focus:border-wine-500 outline-none"
              placeholder="Your name or wine director"
            />
          </div>
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-semibold text-brand-dark mb-1">
              Contact Email <span className="text-wine-600">*</span>
            </label>
            <input
              id="contactEmail"
              type="email"
              required
              value={form.contactEmail}
              onChange={e => handleChange('contactEmail', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-wine-500 focus:border-wine-500 outline-none"
              placeholder="restaurant@email.com"
            />
          </div>
        </div>

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
          {status === 'submitting' ? 'Submitting...' : 'Request a Vibe-Check'}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Submissions are reviewed weekly. We prioritize restaurants in our
          active markets (Atlanta, Greenville, Key West, Charleston) but accept
          submissions from anywhere.
        </p>
      </form>

      {/* Cross-link */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        <p className="text-gray-500 text-sm mb-2">
          Not a restaurant owner? Know a great wine list we should check out?
        </p>
        <Link
          href="/suggest"
          className="text-wine-700 font-semibold hover:text-wine-800 transition-colors"
        >
          Suggest a Restaurant &rarr;
        </Link>
      </div>
    </div>
  );
}
