import Link from 'next/link';
import Newsletter from '@/components/Newsletter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wine 101 | Raging Wine',
  description: 'Learn wine without the snob factor. Practical guides for ordering wine at restaurants.',
};

const guides = [
  {
    title: 'How to Read a Restaurant Wine List in 60 Seconds',
    description: 'The four things to look at first, what the layout tells you about the restaurant, and when to just ask your server.',
    category: 'The Basics',
    readTime: '4 min',
  },
  {
    title: 'The Markup Math: What You\'re Actually Paying',
    description: 'Standard restaurant markup is 2.5\u20133x retail. Here\'s how to spot fair pricing and when to order by the glass vs. bottle.',
    category: 'Value',
    readTime: '5 min',
  },
  {
    title: 'By the Glass: When It\'s Smart and When It\'s a Trap',
    description: 'By-the-glass programs can be a goldmine or a graveyard. Learn to tell the difference before you order.',
    category: 'Strategy',
    readTime: '3 min',
  },
  {
    title: 'Wine and Food Pairing: The Only 3 Rules You Need',
    description: 'Forget the complicated charts. Match weight, consider acid, and don\'t overthink it. That covers 90% of pairings.',
    category: 'Pairing',
    readTime: '4 min',
  },
  {
    title: '5 Wines That Are Almost Always a Good Value on Restaurant Lists',
    description: 'Albari\u00F1o, Cru Beaujolais, Gr\u00FCner Veltliner, Malbec, and Muscadet. Why these five punch above their price.',
    category: 'Value',
    readTime: '5 min',
  },
  {
    title: 'What to Say When the Sommelier Asks What You Like',
    description: 'Forget grape names. Tell them what you\'re eating, your price range, and whether you want safe or adventurous. That\'s it.',
    category: 'The Basics',
    readTime: '3 min',
  },
];

export default function Wine101Page() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-brand-dark mb-2">Wine 101</h1>
        <p className="text-gray-500 max-w-xl">
          Practical wine knowledge for people who eat at restaurants. No jargon,
          no history lessons, no pretension. Just the stuff that helps you order better.
        </p>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-10">
        <p className="font-semibold text-blue-800 mb-1">Full guides dropping soon</p>
        <p className="text-blue-700 text-sm">
          Wine 101 articles are in the works. Here&apos;s a preview of what&apos;s coming.
          Subscribe for first access.
        </p>
      </div>

      {/* Guide Previews */}
      <div className="space-y-4 mb-12">
        {guides.map((guide, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-blue-50 px-2 py-1 rounded-full">
                {guide.category}
              </span>
              <span className="text-xs text-gray-400">{guide.readTime} read</span>
            </div>
            <h3 className="font-bold text-brand-dark mb-1">{guide.title}</h3>
            <p className="text-gray-500 text-sm">{guide.description}</p>
          </div>
        ))}
      </div>

      <Newsletter />
    </div>
  );
}
