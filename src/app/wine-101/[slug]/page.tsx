import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllWine101Articles, getWine101Article, getRelatedArticles } from '@/lib/wine101';
import MarkdownContent from '@/components/MarkdownContent';
import Newsletter from '@/components/Newsletter';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllWine101Articles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getWine101Article(slug);
  if (!article) return { title: 'Article Not Found | Raging Wine' };
  return {
    title: `${article.title} | Raging Wine`,
    description: article.description,
  };
}

export default async function Wine101ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getWine101Article(slug);
  if (!article) notFound();

  const related = getRelatedArticles(article.related);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand-wine">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/wine-101" className="hover:text-brand-wine">Wine 101</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{article.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-blue-50 px-3 py-1 rounded-full">
            {article.category}
          </span>
          <span className="text-sm text-gray-400">{article.readTime} read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-dark leading-tight mb-4">
          {article.title}
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed">{article.description}</p>
      </header>

      {/* Article Body */}
      <article className="mb-16">
        <MarkdownContent content={article.content} />
      </article>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="border-t border-gray-200 pt-10 mb-12">
          <h2 className="text-xl font-bold text-brand-dark mb-6">Keep Reading</h2>
          <div className="space-y-4">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/wine-101/${r.slug}`}
                className="block bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                    {r.category}
                  </span>
                  <span className="text-xs text-gray-400">{r.readTime}</span>
                </div>
                <h3 className="font-semibold text-brand-dark">{r.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{r.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <Newsletter />

      {/* Back Link */}
      <div className="mt-10 text-center">
        <Link href="/wine-101" className="text-brand-wine font-medium hover:underline">
          ← Back to all Wine 101 guides
        </Link>
      </div>
    </div>
  );
}
