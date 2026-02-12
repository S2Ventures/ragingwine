import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cities, getReviewsByCity, getCityBySlug } from '@/lib/data';
import ReviewCard from '@/components/ReviewCard';
import Newsletter from '@/components/Newsletter';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return cities.map(city => ({ city: city.slug }));
}

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const city = getCityBySlug(params.city);
  if (!city) return { title: 'City Not Found' };
  return {
    title: `${city.name} Wine List Reviews | Raging Wine`,
    description: `Restaurant wine list reviews in ${city.name}, ${city.state}. ${city.tagline}`,
  };
}

export default function CityPage({ params }: { params: { city: string } }) {
  const city = getCityBySlug(params.city);
  if (!city) notFound();

  const cityReviews = getReviewsByCity(city.slug);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6 flex items-center gap-1">
        <Link href="/" className="hover:text-wine-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-600">{city.name}</span>
      </nav>

      {/* City Header */}
      <div className="mb-10">
        <p className="text-wine-600 font-semibold text-sm uppercase tracking-wider mb-1">{city.state}</p>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-brand-dark mb-3">
          {city.name}
        </h1>
        <p className="text-gray-500 italic mb-4">{city.tagline}</p>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          {city.description}
        </p>
      </div>

      {/* City Stats */}
      {cityReviews.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-10">
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-2xl font-bold text-brand-dark">{cityReviews.length}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Reviews</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-dark">
                {cityReviews.filter(r => r.badge === 'rager').length}
              </p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Ragers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-dark">
                {Array.from(new Set(cityReviews.map(r => r.neighborhood))).length}
              </p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Neighborhoods</p>
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      {cityReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {cityReviews.map(review => (
            <ReviewCard key={review.slug} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 mb-12">
          <p className="text-lg font-medium text-gray-400 mb-2">Reviews coming soon for {city.name}</p>
          <p className="text-sm text-gray-400">Subscribe to get notified when we publish our first review here.</p>
        </div>
      )}

      <Newsletter />
    </div>
  );
}
