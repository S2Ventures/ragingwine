'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';

const navItems = [
  { label: 'Reviews', href: '/reviews' },
  { label: 'Wineries', href: '/wineries' },
  { label: 'Quiz', href: '/quiz' },
  { label: 'Adventures', href: '/adventures' },
  { label: 'Wine 101', href: '/wine-101' },
  { label: 'Atlanta', href: '/cities/atlanta' },
  { label: 'Greenville', href: '/cities/greenville' },
  { label: 'Key West', href: '/cities/key-west' },
  { label: 'Charleston', href: '/cities/charleston' },
  { label: 'Shop', href: '/shop' },
  { label: 'Suggest', href: '/suggest' },
  { label: 'For Restaurants', href: '/submit' },
  { label: 'About', href: '/about' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-wine-700 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-600"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-100 pt-2">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-gray-600 hover:text-wine-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
