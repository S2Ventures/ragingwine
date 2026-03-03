import type { Review } from '@/lib/types';
import { BADGE_CONFIG } from '@/lib/types';

// ---------------------------------------------------------------------------
// Badge → schema.org rating mapping
// ---------------------------------------------------------------------------
const BADGE_RATING: Record<string, number> = {
  rager: 5,
  wildcard: 4,
  reliable: 3,
  lazy: 1,
};

// ---------------------------------------------------------------------------
// Review page: Restaurant + Review + BreadcrumbList
// ---------------------------------------------------------------------------
export function ReviewJsonLd({ review }: { review: Review }) {
  const rating = BADGE_RATING[review.badge] ?? 3;
  const config = BADGE_CONFIG[review.badge];
  const reviewUrl = `https://ragingwine.com/reviews/${review.slug}`;

  const restaurant: Record<string, unknown> = {
    '@type': 'Restaurant',
    name: review.restaurant,
    servesCuisine: review.cuisineType,
  };

  if (review.address) {
    restaurant.address = {
      '@type': 'PostalAddress',
      streetAddress: review.address.street,
      addressLocality: review.address.city,
      addressRegion: review.address.state,
      postalCode: review.address.zip,
      addressCountry: review.address.country || 'US',
    };
  }

  if (review.website) {
    restaurant.url = review.website;
  }

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Review',
      name: `${review.restaurant} Wine List Review`,
      url: reviewUrl,
      author: { '@type': 'Organization', name: 'Raging Wine', url: 'https://ragingwine.com' },
      publisher: { '@type': 'Organization', name: 'Raging Wine', url: 'https://ragingwine.com' },
      datePublished: review.publishedAt,
      description: review.bottomLine,
      itemReviewed: restaurant,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: rating,
        bestRating: 5,
        worstRating: 1,
        ratingExplanation: `${config.icon} ${config.label} — ${config.description}`,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ragingwine.com' },
        { '@type': 'ListItem', position: 2, name: 'Reviews', item: 'https://ragingwine.com/reviews' },
        { '@type': 'ListItem', position: 3, name: review.city, item: `https://ragingwine.com/cities/${review.citySlug}` },
        { '@type': 'ListItem', position: 4, name: review.restaurant, item: reviewUrl },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ---------------------------------------------------------------------------
// City page: BreadcrumbList + ItemList of reviews
// ---------------------------------------------------------------------------
export function CityJsonLd({ city, state, citySlug, reviewCount }: {
  city: string;
  state: string;
  citySlug: string;
  reviewCount: number;
}) {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ragingwine.com' },
        { '@type': 'ListItem', position: 2, name: 'Reviews', item: 'https://ragingwine.com/reviews' },
        { '@type': 'ListItem', position: 3, name: city, item: `https://ragingwine.com/cities/${citySlug}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${city} Wine List Reviews`,
      description: `${reviewCount} restaurant wine list reviews in ${city}, ${state}.`,
      url: `https://ragingwine.com/cities/${citySlug}`,
      isPartOf: { '@type': 'WebSite', name: 'Raging Wine', url: 'https://ragingwine.com' },
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ---------------------------------------------------------------------------
// Wine 101 article: Article + BreadcrumbList
// ---------------------------------------------------------------------------
export function Wine101JsonLd({ title, description, slug, publishedAt }: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
}) {
  const url = `https://ragingwine.com/wine-101/${slug}`;

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      url,
      author: { '@type': 'Organization', name: 'Raging Wine', url: 'https://ragingwine.com' },
      publisher: { '@type': 'Organization', name: 'Raging Wine', url: 'https://ragingwine.com' },
      datePublished: publishedAt || undefined,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ragingwine.com' },
        { '@type': 'ListItem', position: 2, name: 'Wine 101', item: 'https://ragingwine.com/wine-101' },
        { '@type': 'ListItem', position: 3, name: title, item: url },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ---------------------------------------------------------------------------
// WebSite schema (goes in layout)
// ---------------------------------------------------------------------------
export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Raging Wine',
    alternateName: 'RagingWine.com',
    url: 'https://ragingwine.com',
    description: 'Restaurant wine list reviews, city guides, and AI-powered recommendations.',
    publisher: {
      '@type': 'Organization',
      name: 'Raging Wine',
      url: 'https://ragingwine.com',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
