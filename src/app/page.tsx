import Link from 'next/link';
import { reviews, cities } from '@/lib/data';
import { BADGE_CONFIG, BadgeType } from '@/lib/types';
import ReviewCard from '@/components/ReviewCard';
import Newsletter from '@/components/Newsletter';
import { BadgeWithDescription } from '@/components/Badge';

export default function Home() {
  const featuredReviews = reviews.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-dark text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
          <p className="text-wine-400 font-semibold text-sm uppercase tracking-wider mb-4">
            Your Wine List Wingman
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
            Stop guessing.<br />Start drinking better.
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            We review restaurant wine lists so you don&apos;t waste $60 on a $15 bottle.
            Real reviews, real metrics, zero pretension.
          </p>
          <Newsletter variant="hero" />
        </div>
      </section>

      {/* Latest Reviews */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-brand-dark">Latest Reviews</h2>
            <p className="text-gray-500 text-sm mt-1">Honest wine list breakdowns from our team</p>
          </div>
          <Link href="/reviews" className="text-sm font-semibold text-wine-600 hover:text-wine-800 transition-colors">
            View All &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredReviews.map(review => (
            <ReviewCard key={review.slug} review={review} />
          ))}
        </div>
      </section>

      {/* Badge System Explainer */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-brand-dark">The Vibe-Check Rating System</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">
              No stars. No scores. Every wine list gets a badge that tells you exactly what to expect.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(BADGE_CONFIG) as BadgeType[]).map(badge => (
              <BadgeWithDescription key={badge} type={badge} />
            ))}
          </div>
        </div>
      </section>

      {/* Wingman Metrics Explainer */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-brand-dark">Wingman Metrics</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">
            Three things that tell you more about a wine program than any point score ever could.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">&#x1F377;</span>
            </div>
            <h3 className="font-bold text-brand-dark mb-2">Glassware Grade</h3>
            <p className="text-gray-500 text-sm">
              Varietal-specific stems, stemless casual, or red-flag plastics.
              How a restaurant serves your wine says everything about how much they care.
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">&#x1F9D1;&#x200D;&#x1F373;</span>
            </div>
            <h3 className="font-bold text-brand-dark mb-2">Staff Confidence</h3>
            <p className="text-gray-500 text-sm">
              Knowledgeable and friendly, willing but green, or actively unhelpful.
              Your server is either your wingman or your obstacle.
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">&#x1F4B0;</span>
            </div>
            <h3 className="font-bold text-brand-dark mb-2">Markup Fairness</h3>
            <p className="text-gray-500 text-sm">
              Fair, steep, or gouge. We compare list prices to retail so you know
              whether you&apos;re paying a reasonable premium or getting fleeced.
            </p>
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-brand-dark">Explore by City</h2>
            <p className="text-gray-500 text-sm mt-2">
              Launching with three cities. More coming soon.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cities.map(city => (
              <Link key={city.slug} href={`/cities/${city.slug}`} className="group">
                <div className="bg-brand-cream rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all hover:-translate-y-0.5">
                  <h3 className="font-bold text-lg text-brand-dark group-hover:text-wine-700 transition-colors">
                    {city.name}, {city.state}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 italic">{city.tagline}</p>
                  <p className="text-sm text-gray-600 mt-3 line-clamp-3">{city.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* The Enemy + Newsletter */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="text-2xl font-bold text-brand-dark mb-4">Fighting the Corporate Wine List</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            You know the list. Five whites, five reds, all from the same distributor,
            all marked up 400%. It&apos;s the restaurant equivalent of a playlist curated by
            an algorithm that hates you. We exist because you deserve better information
            before you spend your money.
          </p>
        </div>
        <Newsletter />
      </section>
    </div>
  );
}
