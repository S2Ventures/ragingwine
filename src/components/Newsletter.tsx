'use client';

import { useState } from 'react';

export default function Newsletter({ variant = 'default' }: { variant?: 'default' | 'hero' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
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
      <div className={`text-center ${variant === 'hero' ? 'text-white' : 'text-brand-dark'}`}>
        <p className="font-semibold">You&apos;re in. Welcome to the crew.</p>
        <p className="text-sm mt-1 opacity-75">Check your inbox for the first issue.</p>
      </div>
    );
  }

  const isLoading = status === 'loading';

  if (variant === 'hero') {
    return (
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-lg text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-wine-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-wine-500 text-white rounded-lg font-semibold text-sm hover:bg-wine-700 transition-colors whitespace-nowrap disabled:opacity-50"
          >
            {isLoading ? 'Joining...' : 'Join the List'}
          </button>
        </form>
        {status === 'error' && (
          <p className="text-red-300 text-xs mt-2 text-center">{errorMsg}</p>
        )}
      </div>
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
          disabled={isLoading}
          className="flex-1 px-4 py-3 rounded-lg text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-wine-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-wine-500 text-white rounded-lg font-semibold text-sm hover:bg-wine-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-red-300 text-xs mt-3">{errorMsg}</p>
      )}
    </div>
  );
}
