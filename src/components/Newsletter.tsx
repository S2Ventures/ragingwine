'use client';

import { useState } from 'react';

export default function Newsletter({ variant = 'default' }: { variant?: 'default' | 'hero' }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Beehiiv API
    // For now, store in localStorage as proof of concept
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={`text-center ${variant === 'hero' ? 'text-white' : 'text-brand-dark'}`}>
        <p className="font-semibold">You're in. Welcome to the crew.</p>
        <p className="text-sm mt-1 opacity-75">Check your inbox for the first issue.</p>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className="flex-1 px-4 py-3 rounded-lg text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-wine-500"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-wine-500 text-white rounded-lg font-semibold text-sm hover:bg-wine-700 transition-colors whitespace-nowrap"
        >
          Join the List
        </button>
      </form>
    );
  }

  return (
    <div className="bg-brand-dark rounded-xl p-8 text-center">
      <h3 className="text-white font-bold text-xl mb-2">Get the Weekly Wingman</h3>
      <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
        One wine list review, one adventure pick, one quick tip, and a personal note. Every week. Under 500 words.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className="flex-1 px-4 py-3 rounded-lg text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-wine-500"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-wine-500 text-white rounded-lg font-semibold text-sm hover:bg-wine-700 transition-colors"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
