import { notFound } from 'next/navigation';
import Link from 'next/link';
import { reviews, getReviewBySlug } from '@/lib/data';
import { BADGE_CONFIG } from '@/lib/types';
import Badge from '@/components/Badge';
import WingmanMetrics from '@/components/WingmanMetrics';
import Newsletter from '@/components/Newsletter';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return reviews.map(review => ({ slug: review.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const review = getReviewBySlug(params.slug);
  if (!review) return { title: 'Review Not Found' };
  const config = BADGE_CONFIG[review.badge];
  return {
    title: `${review.restaurant} Wine List Review | Raging Wine`,
    description: `${config.icon} ${config.label} — ${review.bottomLine}`,
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-brand-dark mb-3">{title}</h2>
      <div className="text-gray-600 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function PickCard({ icon, title, wine, detail, accent }: { icon: string; title: string; wine: string; detail: string; accent: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <span className={`text-xs font-bold uppercase tracking-wider ${accent}`}>{title}</span>
      </div>
      <p className="font-semibold text-brand-dark text-sm mb-1">{wine}</p>
      <p className="text-gray-500 text-xs leading-relaxed">{detail}</p>
    </div>
  );
}

export default function ReviewPage({ params }: { params: { slug: string } }) {
  const review = getReviewBySlug(params.slug);
  if (!review) notFound();

  const config = BADGE_CONFIG[review.badge];
  const isEditorial = !!review.editorial;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6 flex items-center gap-1">
        <Link href="/reviews" className="hover:text-wine-600 transition-colors">Reviews</Link>
        <span>/</span>
        <Link href={`/cities/${review.citySlug}`} className="hover:text-wine-600 transition-colors">{review.city}</Link>
        <span>/</span>
        <span className="text-gray-600">{review.restaurant}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <Badge type={review.badge} size="lg" />
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-brand-dark mt-4 mb-2">
          {review.restaurant}
        </h1>
        {review.subtitle && (
          <p className="text-wine-600 font-medium text-lg mb-2">{review.subtitle}</p>
        )}
        <p className="text-gray-500">
          {review.neighborhood} &middot; {review.city} &middot; {review.cuisineType}
        </p>
        {review.tags && review.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {review.tags.map(tag => (
              <span key={tag} className="text-xs font-medium text-wine-700 bg-wine-50 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-3">
          Reviewed {new Date(review.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Wingman Metrics (structured format only) */}
      {review.metrics && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-10">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Wingman Metrics</p>
          <WingmanMetrics metrics={review.metrics} />
        </div>
      )}

      {/* Editorial Format */}
      {isEditorial && review.editorial!.map((section, i) => (
        <Section key={i} title={section.title}>
          <p>{section.body}</p>
        </Section>
      ))}

      {/* Structured Format */}
      {!isEditorial && (
        <>
          <Section title="First Impression">
            <p>{review.firstImpression}</p>
          </Section>
          <Section title="Selection Deep Dive">
            <p>{review.selectionDeepDive}</p>
          </Section>
          <Section title="By the Glass">
            <p>{review.byTheGlass}</p>
          </Section>

          {/* Pick Cards */}
          {review.bestValue && review.hiddenGem && review.skipThis && review.perfectPairing && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <PickCard
                icon="&#x1F4B0;"
                title="Best Value"
                wine={`${review.bestValue.wine} — ${review.bestValue.price}`}
                detail={review.bestValue.note}
                accent="text-green-700"
              />
              <PickCard
                icon="&#x1F48E;"
                title="Hidden Gem"
                wine={review.hiddenGem.wine}
                detail={review.hiddenGem.note}
                accent="text-purple-700"
              />
              <PickCard
                icon="&#x26D4;"
                title="Skip This"
                wine={review.skipThis.wine}
                detail={review.skipThis.note}
                accent="text-red-600"
              />
              <PickCard
                icon="&#x1F37D;&#xFE0F;"
                title="Perfect Pairing"
                wine={`${review.perfectPairing.wine} + ${review.perfectPairing.dish}`}
                detail={review.perfectPairing.note}
                accent="text-wine-700"
              />
            </div>
          )}
        </>
      )}

      {/* Bottom Line */}
      <div className={`rounded-xl p-6 mb-12 ${config.bg} border`} style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
        <p className={`text-xs font-bold uppercase tracking-wider ${config.color} mb-2`}>
          {config.icon} The Bottom Line
        </p>
        <p className="text-brand-dark text-sm leading-relaxed font-medium">
          {review.bottomLine}
        </p>
      </div>

      {/* Newsletter CTA */}
      <Newsletter />
    </div>
  );
}
