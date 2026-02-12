import { Review, City } from './types';

export const cities: City[] = [
  {
    name: 'Atlanta',
    slug: 'atlanta',
    state: 'Georgia',
    tagline: 'Where Southern hospitality meets serious wine programs',
    description: 'Atlanta\'s food scene has exploded with diverse cuisine corridors, ambitious independent restaurants, and a growing wine culture that outpaces its media coverage. From Buckhead fine dining to Buford Highway adventures, this city is full of wine list surprises.',
  },
  {
    name: 'Greenville',
    slug: 'greenville',
    state: 'South Carolina',
    tagline: 'A rising food city punching above its weight',
    description: 'Greenville\'s walkable downtown and strong independent restaurant scene deliver wine value with almost zero wine-specific media coverage. Low competition, high potential, and a Main Street corridor that rewards exploration.',
  },
  {
    name: 'Key West',
    slug: 'key-west',
    state: 'Florida',
    tagline: 'Wine adventures beyond the frozen margarita',
    description: 'Key West is a destination city where visitors make restaurant decisions daily with zero local knowledge. Wine lists here range from tourist-trap lazy to surprisingly adventurous. We map the territory so you don\'t have to guess.',
  },
];

export const reviews: Review[] = [
  {
    slug: 'the-optimist-atlanta',
    restaurant: 'The Optimist',
    neighborhood: 'Westside',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'Seafood',
    badge: 'rager',
    metrics: {
      glassware: 'Varietal Specific',
      staff: 'Knowledgeable & Friendly',
      markup: 'Fair',
    },
    firstImpression: 'A thick, leather-bound list that feels like it belongs in a restaurant twice this price point. Organized by style rather than region, which immediately signals that someone here actually thinks about how people choose wine with food. Over 200 selections with a by-the-glass program that rotates weekly.',
    selectionDeepDive: 'This is where The Optimist earns its Gold badge. The list goes deep on coastal whites you\'d expect with seafood (Albari\u00F1o, Muscadet, Vermentino) but also surprises with a serious Burgundy section and a half-page of Greek wines that pair brilliantly with the raw bar. The buyer clearly has a point of view and isn\'t afraid to stock bottles you won\'t find at the table next door.',
    byTheGlass: 'Twelve pours that change weekly. On our visit, the lineup included a Txakoli from Basque Country and a skin-contact white from Georgia (the country). This is not a by-the-glass program running on autopilot. Every pour felt intentional.',
    bestValue: {
      wine: 'Domaine de la P\u00E9piere Muscadet S\u00E8vre et Maine',
      price: '$14/glass',
      note: 'Bone-dry, saline, and built for oysters. At $14 a glass, this is one of the best seafood wine values in Atlanta.',
    },
    hiddenGem: {
      wine: 'Assyrtiko from Santorini (Sigalas)',
      note: 'Buried in the Greek section that most diners skip. Volcanic minerality that makes the grilled octopus sing. Ask your server about it.',
    },
    skipThis: {
      wine: 'The entry-level Sancerre',
      note: 'Not a bad wine, but at $18/glass it\'s the most overpriced pour on the list. The Muscadet is better with seafood and costs $4 less.',
    },
    perfectPairing: {
      wine: 'Sigalas Assyrtiko',
      dish: 'Grilled Octopus',
      note: 'The volcanic mineral character of the wine mirrors the char on the octopus. Salt meets smoke. This is why you came here.',
    },
    bottomLine: 'The Optimist isn\'t just a great seafood restaurant with a wine list. It\'s a wine destination that happens to serve incredible fish. Trust this restaurant to choose your wine for you.',
    publishedAt: '2025-02-15',
  },
  {
    slug: 'staplehouse-atlanta',
    restaurant: 'Staplehouse',
    neighborhood: 'Old Fourth Ward',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'New American',
    badge: 'wildcard',
    metrics: {
      glassware: 'Varietal Specific',
      staff: 'Knowledgeable & Friendly',
      markup: 'Steep',
    },
    firstImpression: 'A concise, curated list of about 60 bottles that changes with the tasting menu. No bloat. Every bottle feels like it was placed here for a reason. The format is clean and organized by weight (light to full) rather than geography.',
    selectionDeepDive: 'This list is a playground for natural wine lovers and people who want to try something they\'ve never heard of. Heavy on small producers, biodynamic farms, and regions you didn\'t know made wine. If you want a safe Cabernet, look elsewhere. If you want a Trousseau from Jura that will change your Tuesday, sit down.',
    byTheGlass: 'Six pours, all natural or minimal intervention. Our visit featured a p\u00E9t-nat that arrived with a wink from the server. The by-the-glass program is an extension of the kitchen\'s philosophy: adventurous, personal, and a little unpredictable.',
    bestValue: {
      wine: 'Domaine de la Boh\u00E8me C\u00F4tes du Rh\u00F4ne',
      price: '$52/bottle',
      note: 'A $15 retail bottle at a 3.5x markup is steep on paper, but for the quality and the context of a tasting-menu dinner, it drinks well above its price.',
    },
    hiddenGem: {
      wine: 'Gut Oggau Theodora (Blaufr\u00E4nkisch ros\u00E9)',
      note: 'An Austrian natural ros\u00E9 with the face of a child on the label. Sounds weird. Tastes like crushed wild strawberries with a savory finish. Pairs with everything on the tasting menu.',
    },
    skipThis: {
      wine: 'The Champagne section',
      note: 'Only two options, both north of $120. If you want bubbles, the p\u00E9t-nat by the glass is more fun and more in the spirit of this restaurant.',
    },
    perfectPairing: {
      wine: 'Gut Oggau Theodora',
      dish: 'The seasonal vegetable course',
      note: 'Whichever vegetables are on the tasting menu, this ros\u00E9 has the acidity and earthiness to match. Ask the sommelier to time this pour.',
    },
    bottomLine: 'Staplehouse is for the diner who wants to be surprised. The wine list is an adventure, not a safety net. Come with an open mind and let the staff guide you.',
    publishedAt: '2025-02-18',
  },
  {
    slug: 'south-city-kitchen-atlanta',
    restaurant: 'South City Kitchen',
    neighborhood: 'Midtown',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'Southern',
    badge: 'reliable',
    metrics: {
      glassware: 'Stemless Casual',
      staff: 'Willing but Green',
      markup: 'Fair',
    },
    firstImpression: 'A clean, one-page list organized by style (Crisp & Light, Rich & Bold, etc.) with about 40 bottles and 10 by-the-glass options. Easy to read, nothing intimidating. This is a list designed for the person who wants to order quickly and get back to the conversation.',
    selectionDeepDive: 'Solid but safe. You\'ll find the usual suspects: a New Zealand Sauvignon Blanc, an Oregon Pinot Noir, a California Cabernet. Nothing will offend you, and nothing will surprise you. The Southern cuisine deserves more adventurous pairings (where\'s the Chenin Blanc with the fried green tomatoes?), but what\'s here is competently chosen and fairly priced.',
    byTheGlass: 'Ten options covering the basics. A ros\u00E9, a couple of whites, a few reds, and a sparkling option. Pours are generous and prices hover around $12\u2013$16. No complaints, no excitement.',
    bestValue: {
      wine: 'Charles & Charles Ros\u00E9',
      price: '$12/glass',
      note: 'A crowd-pleasing dry ros\u00E9 at the lowest glass price on the list. Perfect with the pimento cheese and fried chicken.',
    },
    hiddenGem: {
      wine: 'Bonterra Viognier',
      note: 'The only slightly adventurous pick on the list. Floral and round, it pairs surprisingly well with the spicy shrimp and grits. Most people will walk right past it.',
    },
    skipThis: {
      wine: 'The Kendall-Jackson Chardonnay',
      note: 'It\'s fine. It\'s always fine. But at $14/glass, you\'re paying a premium for the most recognizable label on the list. The Bonterra is more interesting for $2 more.',
    },
    perfectPairing: {
      wine: 'Bonterra Viognier',
      dish: 'Shrimp and Grits',
      note: 'The wine\'s floral aromatics cut through the richness of the grits while its soft acidity complements the spice. An underrated combination.',
    },
    bottomLine: 'South City Kitchen has a wine list that does its job without trying to impress. Fair prices, safe picks, and nothing that\'ll embarrass you on a date. It just won\'t make your night either.',
    publishedAt: '2025-02-20',
  },
];

export function getReviewsByCity(citySlug: string): Review[] {
  return reviews.filter(r => r.citySlug === citySlug);
}

export function getReviewBySlug(slug: string): Review | undefined {
  return reviews.find(r => r.slug === slug);
}

export function getCityBySlug(slug: string): City | undefined {
  return cities.find(c => c.slug === slug);
}
