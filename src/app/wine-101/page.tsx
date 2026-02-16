import Link from 'next/link';
import Newsletter from '@/components/Newsletter';
import { getAllWine101Articles } from '@/lib/wine101';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wine 101 | Raging Wine',
  description: 'Learn wine without the snob factor. Practical guides for ordering wine at restaurants, understanding varietals, and drinking better.',
};

const categoryColors: Record<string, string> = {
  'Restaurant Skills': 'text-brand-blue bg-blue-50',
  'Wine Basics': 'text-emerald-700 bg-emerald-50',
  'Food Pairing': 'text-amber-700 bg-amber-50',
  'Comparisons': 'text-purple-700 bg-purple-50',
  'Value & Budget': 'text-rose-700 bg-rose-50',
  'Health & Science': 'text-teal-700 bg-teal-50',
  'Wine Culture': 'text-indigo-700 bg-indigo-50',
  'Trends': 'text-orange-700 bg-orange-50',
};

export default function Wine101Page() {
  const articles = getAllWine101Articles();

  // Group articles by category
  const grouped = articles.reduce((acc, article) => {
    if (!acc[article.category]) acc[article.category] = [];
    acc[article.category].push(article);
    return acc;
  }, {} as Record<string, typeof articles>);

  const categoryOrder = [
    'Restaurant Skills',
    'Wine Basics',
    'Food Pairing',
    'Comparisons',
    'Value & Budget',
    'Health & Science',
    'Wine Culture',
    'Trends',
  ];

  const sortedCategories = categoryOrder.filter((cat) => grouped[cat]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-3">Wine 101</h1>
        <p className="text-gray-500 max-w-2xl text-lg">
          Practical wine knowledge for people who eat at restaurants. No jargon,
          no history lectures, no pretension. Just the stuff that helps you order better
          and enjoy more.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-10">
          <p className="font-semibold text-blue-800 mb-1">Full guides dropping soon</p>
          <p className="text-blue-700 text-sm">
            Wine 101 articles are in the works. Subscribe for first access.
          </p>
        </div>
      ) : (
        <>
          {/* All Articles */}
          {sortedCategories.map((category) => (
            <section key={category} className="mb-12">
              <h2 className="text-xl font-bold text-brand-dark mb-5 flex items-center gap-3">
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${categoryColors[category] || 'text-gray-700 bg-gray-100'}`}>
                  {category}
                </span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {grouped[category].map((article) => (
                  <Link
                    key={article.slug}
                    href={`/wine-101/${article.slug}`}
                    className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all"
                  >
                    <h3 className="font-bold text-brand-dark mb-2 group-hover:text-brand-wine">
                      {article.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{article.description}</p>
                    <span className="text-xs text-gray-400">{article.readTime} read</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </>
      )}

      <Newsletter />
    </div>
  );
}
