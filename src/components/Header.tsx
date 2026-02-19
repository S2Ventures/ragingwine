'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';

const cityItems = [
  { label: 'Atlanta', href: '/cities/atlanta' },
  { label: 'Blue Ridge', href: '/cities/blue-ridge' },
  { label: 'Charleston', href: '/cities/charleston' },
  { label: 'Clayton', href: '/cities/clayton' },
  { label: 'Greenville', href: '/cities/greenville' },
  { label: 'Key West', href: '/cities/key-west' },
  { label: 'Asheville', href: '/cities/asheville', comingSoon: true },
  { label: 'New Orleans', href: '/cities/new-orleans', comingSoon: true },
  { label: 'Savannah', href: '/cities/savannah', comingSoon: true },
];

const navItems = [
  { label: 'Reviews', href: '/reviews' },
  { label: 'Wineries', href: '/wineries' },
  { label: 'Quiz', href: '/quiz' },
  { label: 'Adventures', href: '/adventures' },
  { label: 'Wine 101', href: '/wine-101' },
  { label: 'Shop', href: '/shop' },
  { label: 'Suggest', href: '/suggest' },
  { label: 'For Restaurants', href: '/submit' },
  { label: 'About', href: '/about' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [citiesOpen, setCitiesOpen] = useState(false);
  const [mobileCitiesOpen, setMobileCitiesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCitiesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.slice(0, 5).map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-wine-700 transition-colors"
              >
                {item.label}
              </Link>
            ))}

            {/* Cities dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setCitiesOpen(!citiesOpen)}
                className="text-sm font-medium text-gray-600 hover:text-wine-700 transition-colors flex items-center gap-1"
              >
                Cities
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`transition-transform ${citiesOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M3 5l3 3 3-3" />
                </svg>
              </button>
              {citiesOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px] z-50">
                  {cityItems.map(city => (
                    <Link
                      key={city.href}
                      href={city.href}
                      onClick={() => setCitiesOpen(false)}
                      className="flex items-center justify-between px-4 py-2 text-sm text-gray-600 hover:text-wine-700 hover:bg-gray-50 transition-colors"
                    >
                      {city.label}
                      {city.comingSoon && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-wine-500 bg-wine-50 px-1.5 py-0.5 rounded">
                          Soon
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navItems.slice(5).map(item => (
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
            {navItems.slice(0, 5).map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-gray-600 hover:text-wine-700"
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile cities accordion */}
            <button
              onClick={() => setMobileCitiesOpen(!mobileCitiesOpen)}
              className="w-full text-left py-2 text-sm font-medium text-gray-600 hover:text-wine-700 flex items-center justify-between"
            >
              Cities
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-transform ${mobileCitiesOpen ? 'rotate-180' : ''}`}
              >
                <path d="M3 5l3 3 3-3" />
              </svg>
            </button>
            {mobileCitiesOpen && (
              <div className="pl-4">
                {cityItems.map(city => (
                  <Link
                    key={city.href}
                    href={city.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-2 text-sm text-gray-500 hover:text-wine-700"
                  >
                    {city.label}
                    {city.comingSoon && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-wine-500 bg-wine-50 px-1.5 py-0.5 rounded">
                        Soon
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}

            {navItems.slice(5).map(item => (
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
