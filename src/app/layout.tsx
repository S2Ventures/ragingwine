import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Raging Wine | Your Wine Adventure Wingman',
  description: 'Restaurant wine list reviews, city guides, and AI-powered recommendations. We help you make better wine decisions when dining out.',
  keywords: ['wine list', 'restaurant wine', 'wine reviews', 'wine pairing', 'wine guide'],
  openGraph: {
    title: 'Raging Wine | Your Wine Adventure Wingman',
    description: 'Restaurant wine list reviews, city guides, and AI-powered recommendations.',
    url: 'https://ragingwine.com',
    siteName: 'Raging Wine',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
