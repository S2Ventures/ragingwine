import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import HeaderServer from '@/components/HeaderServer';
import Footer from '@/components/Footer';
import { WebSiteJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  metadataBase: new URL('https://ragingwine.com'),
  title: { default: 'Raging Wine | Your Wine Adventure Wingman', template: '%s | Raging Wine' },
  description: 'Restaurant wine list reviews, city guides, and AI-powered recommendations. We help you make better wine decisions when dining out.',
  keywords: ['wine list', 'restaurant wine', 'wine reviews', 'wine pairing', 'wine guide', 'wine list review', 'restaurant wine list'],
  alternates: { canonical: 'https://ragingwine.com' },
  openGraph: {
    title: 'Raging Wine | Your Wine Adventure Wingman',
    description: 'Restaurant wine list reviews, city guides, and AI-powered recommendations.',
    url: 'https://ragingwine.com',
    siteName: 'Raging Wine',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Raging Wine | Your Wine Adventure Wingman',
    description: 'Restaurant wine list reviews, city guides, and AI-powered recommendations.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Privacy-friendly analytics by Plausible */}
        <Script
          src="https://plausible.io/js/pa-sY_uF4i4jJ2S2_snGij8l.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init();`}
        </Script>
      </head>
      <body className="min-h-screen flex flex-col">
        <WebSiteJsonLd />
        <HeaderServer />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
