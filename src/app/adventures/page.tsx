import Newsletter from '@/components/Newsletter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wine Adventures | Raging Wine',
  description: 'Wine tasting adventures, vineyard visits, and tasting events across our coverage cities.',
};

const upcomingIdeas = [
  {
    title: 'The Buford Highway Wine Crawl',
    city: 'Atlanta',
    description: 'Five restaurants, five cuisines, five wine lists. We rate them all in one night along Atlanta\'s most diverse food corridor.',
    tag: 'City Crawl',
  },
  {
    title: 'Natural Wine Blind Tasting',
    city: 'Atlanta',
    description: 'Can you tell the difference between a $20 natural wine and a $60 one? We\'re gathering eight bottles and finding out.',
    tag: 'Blind Tasting',
  },
  {
    title: 'Main Street Greenville: Wine Walk',
    city: 'Greenville',
    description: 'Downtown Greenville has a walkable strip of restaurants with surprisingly deep wine programs. We hit them all.',
    tag: 'City Crawl',
  },
  {
    title: 'Key West After Dark: Beyond the Frozen Margarita',
    city: 'Key West',
    description: 'There\'s actual wine culture hiding behind the tourist bars. We find it.',
    tag: 'Deep Dive',
  },
];

export default function AdventuresPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-brand-dark mb-2">Wine Adventures</h1>
        <p className="text-gray-500 max-w-xl">
          City crawls, blind tastings, and deep dives. We go beyond the review to bring you
          the stories behind the wine lists.
        </p>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-wine-50 border border-wine-200 rounded-xl p-6 mb-10">
        <p className="font-semibold text-wine-800 mb-1">Adventures are launching soon</p>
        <p className="text-wine-700 text-sm">
          Our first adventures drop in spring 2026. Subscribe to the newsletter to get early access
          and invitations to live events.
        </p>
      </div>

      {/* Planned Adventures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {upcomingIdeas.map((idea, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-wine-600 bg-wine-50 px-2 py-1 rounded-full">
                {idea.tag}
              </span>
              <span className="text-xs text-gray-400">{idea.city}</span>
            </div>
            <h3 className="font-bold text-brand-dark mb-2">{idea.title}</h3>
            <p className="text-gray-500 text-sm">{idea.description}</p>
          </div>
        ))}
      </div>

      <Newsletter />
    </div>
  );
}
