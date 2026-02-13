import Newsletter from '@/components/Newsletter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop | Raging Wine',
  description: 'Raging Wine merch is coming soon. Gear up to drink boldly.',
};

const sneak = [
  {
    emoji: '👕',
    name: 'Tagline Tees',
    description:
      'T-shirts with lines like "Skip the Second Cheapest Bottle" and "Your Wine List Wingman." The kind of shirt that starts conversations at restaurants.',
  },
  {
    emoji: '🧢',
    name: 'The Raging Cap',
    description:
      'Embroidered dad hat. Subtle enough for a nice dinner. Bold enough for a tailgate. Works everywhere wine does.',
  },
  {
    emoji: '🍷',
    name: 'Insulated Tumblers',
    description:
      'Stemless wine tumblers that keep your pour cold at the park, the pool, and everywhere your glassware can\'t go.',
  },
  {
    emoji: '☕',
    name: 'The Morning After Mug',
    description:
      '"I Rate Wine Lists" coffee mug. For the morning after you rated one too many.',
  },
  {
    emoji: '🎨',
    name: 'Vibe-Check Sticker Pack',
    description:
      'All four badges: Rager, Wild Card, Reliable, Lazy List. Stick them on laptops, water bottles, wine fridges, or that restaurant menu that earned a Lazy List.',
  },
  {
    emoji: '👜',
    name: 'The Raging Tote',
    description:
      '"This Bag Held a Rager." Big enough for two bottles, a corkscrew, and zero regrets.',
  },
];

export default function ShopPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <p className="text-sm font-bold uppercase tracking-widest text-wine-600 mb-3">
          Coming Soon
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
          The Raging Wine Shop
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          By popular demand (okay, like four people asked, but they were{' '}
          <span className="italic">very</span> enthusiastic), we&apos;re launching a merch shop.
        </p>
      </div>

      {/* Fun Status Banner */}
      <div className="bg-wine-50 border border-wine-200 rounded-xl p-8 mb-12 text-center">
        <p className="text-3xl mb-4">🧵🪡🍷</p>
        <h2 className="text-xl font-bold text-wine-800 mb-3">
          Our team is hard at work
        </h2>
        <p className="text-wine-700 max-w-xl mx-auto mb-4">
          And by &quot;team&quot; we mean two people with a laptop, a Printful account, and strong
          opinions about font sizes. We&apos;re picking fabrics, arguing over thread colors,
          and making sure every product is something we&apos;d actually wear to dinner.
        </p>
        <p className="text-wine-600 text-sm italic">
          No rush. Good merch, like good wine, shouldn&apos;t be rushed.
        </p>
      </div>

      {/* What's Coming */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-brand-dark mb-2">What&apos;s in the Works</h2>
        <p className="text-gray-500 mb-8">
          A sneak peek at what we&apos;re cooking up. Everything designed for people who
          love wine but refuse to take it too seriously.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sneak.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-wine-300 transition-colors"
            >
              <div className="text-3xl mb-3">{item.emoji}</div>
              <h3 className="font-bold text-brand-dark mb-2">{item.name}</h3>
              <p className="text-gray-500 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* The Promise */}
      <div className="bg-brand-dark rounded-xl p-8 mb-12 text-center">
        <h2 className="text-xl font-bold text-brand-cream mb-3">
          The Raging Wine Merch Promise
        </h2>
        <div className="max-w-lg mx-auto space-y-3 text-brand-cream/80 text-sm">
          <p>
            ✓ Every item tested by us before it goes on sale. If we wouldn&apos;t
            wear it to a restaurant, we won&apos;t sell it to you.
          </p>
          <p>
            ✓ No generic logo slapping. Every design earns its place.
          </p>
          <p>
            ✓ Made to order. No warehouse full of medium tees nobody wanted.
            Your shirt gets printed when you order it.
          </p>
          <p>
            ✓ A portion of every sale goes toward our Research Fund.
            That&apos;s what we call the dinner budget.
          </p>
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-brand-dark mb-2">
          Get First Dibs
        </h2>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Drop your email and we&apos;ll let you know the second the shop opens.
          Subscribers get early access and a launch-day discount. Because loyalty
          should come with perks.
        </p>
      </div>
      <Newsletter />
    </div>
  );
}
