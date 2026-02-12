import { Review, City, EditorialSection } from './types';

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
    publishedAt: '2026-02-15',
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
    publishedAt: '2026-02-18',
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
    publishedAt: '2026-02-20',
  },
  // --- Key West Reviews (Editorial Style) ---
  {
    slug: 'lolas-bistro-key-west',
    restaurant: 'Lola\'s Bistro',
    neighborhood: 'Old Town',
    city: 'Key West',
    citySlug: 'key-west',
    cuisineType: 'Italian-Eclectic / BYOB',
    badge: 'rager',
    subtitle: 'The BYOB Secret That Changes Everything',
    tags: ['BYOB', 'Reservation Only', 'Cash/Venmo', 'Top Pick'],
    editorial: [
      {
        title: 'The Setup',
        body: 'Lola\'s Bistro sits at 728 Simonton Street, and unless someone tells you about it, you will walk right past. No flashy signage. No Yelp-bait patio. Just a candlelit room with about ten tables, an open kitchen, and Chef Richard working with the kind of focus that makes you lower your voice. This is reservation-only, two seatings per night, and BYOB with no corkage fee. Cash, check, or Venmo. No printed menu. The chef tells you what he\'s making tonight, and you say yes.',
      },
      {
        title: 'Why Wine Lovers Should Care',
        body: 'Here is the move that makes Lola\'s a Rager for wine people: Key West has two excellent wine shops on the island. You walk in that afternoon, tell them where you\'re eating, and they build you a pairing for a fraction of what any restaurant would charge. You show up to dinner with a bottle of Barolo and a crisp Vermentino, and the chef brings an opener. No $25 corkage. No markup. No judgment. For a wine lover in Key West, this is the perfect situation. You get a world-class meal with exactly the wine you want at retail price. That combination does not exist anywhere else on this island.',
      },
      {
        title: 'The Food',
        body: 'The menu changes daily but always features four starters and four entrees. Scallops seared with precision. Duck that pulls apart with no resistance. Lobster ravioli that makes you forget you\'re in the Keys. Hog fish so fresh it probably swam past Mallory Square that morning. Every plate comes out of that open kitchen like it matters personally to the person who made it. Because it does.',
      },
      {
        title: 'The Details',
        body: 'Starters run $12 to $18, entrees $28 to $38. Book at least two weeks out, especially in season. Call (305) 204-4457 or DM on Instagram @lolasbistro_keywest. Bring your wine. Bring cash. Bring someone you want to have a real conversation with. This is not the kind of place where you check your phone.',
      },
    ],
    bottomLine: 'Lola\'s Bistro is the best-kept BYOB secret in Key West. Bring your own bottle, let the chef cook, and have the kind of meal that makes you rethink what dining out can be. This is our number one.',
    publishedAt: '2026-02-08',
  },
  {
    slug: 'the-little-pearl-key-west',
    restaurant: 'The Little Pearl',
    neighborhood: 'Old Town (Olivia Street)',
    city: 'Key West',
    citySlug: 'key-west',
    cuisineType: 'Coastal Fine Dining',
    badge: 'rager',
    subtitle: 'The Quiet Corner of Key West That Gets It Right Every Time',
    tags: ['Prix Fixe', 'Wine Program', 'Date Night', 'Top Pick'],
    editorial: [
      {
        title: 'The Setup',
        body: 'The Little Pearl sits at the corner of Olivia and Elizabeth, a deliberate distance from the Duval Street chaos. That placement tells you everything. This restaurant is not trying to grab walk-in traffic. It is trying to feed people who care. The format is a four-course prix fixe tasting menu that changes monthly, built around whatever the local boats bring in and whatever is at peak season. We first came here in 2019. We confirmed it in 2020. Confirmed again in 2024. And again in 2025. It has not missed once.',
      },
      {
        title: 'The Wine List',
        body: 'About fifteen wines by the glass and six half-bottle selections, which is exactly the right size for a tasting-menu restaurant. The list favors coastal whites and lighter reds that work with the seafood-forward menu. Bottles under $50 are available without feeling like afterthoughts, and the premium selections (Burgundy around $95, Oregon Pinot Noir at $98) are priced fairly for the quality. This is a wine program that was built by someone who eats here, not just someone who orders for here.',
      },
      {
        title: 'The Food',
        body: 'Each course builds on the last. You might start with a chilled crab presentation or a tuna crudo that barely needs the sauce underneath it. The mains rotate but often feature local grouper, swordfish, or the signature lobster, shrimp, and crab pot pie that has become a quiet legend on this island. Desserts do not mail it in. The kitchen treats the last course like it matters as much as the first.',
      },
      {
        title: 'The Details',
        body: 'Open seven nights a week, 5 PM to 9 PM. Reservations highly recommended and required for five or more. Same owners as The Thirsty Mermaid, which tells you they understand hospitality at every price point. A 4.9 on OpenTable from over 3,000 diners does not happen by accident.',
      },
    ],
    bottomLine: 'The Little Pearl is the restaurant that makes you realize Key West has a real food scene, not just a tourist one. Excellent wine list, flawless tasting menu, and the kind of quiet confidence that only comes from doing it right for years. This is our number two, and some nights it fights for number one.',
    publishedAt: '2026-02-08',
  },
  {
    slug: 'latitudes-sunset-key',
    restaurant: 'Latitudes on the Beach',
    neighborhood: 'Sunset Key',
    city: 'Key West',
    citySlug: 'key-west',
    cuisineType: 'Caribbean / Coastal American',
    badge: 'rager',
    subtitle: 'Take the Boat. Trust Us.',
    tags: ['Island Dining', 'Sunset Views', 'Wine List', 'Special Occasion'],
    editorial: [
      {
        title: 'The Setup',
        body: 'Getting to Latitudes requires a boat. The complimentary ferry leaves from Slip 29 behind the Opal Key Resort, and the ride takes about seven minutes. Your reservation time is your departure time, so show up eight to ten minutes early. This small logistical barrier is the best thing about Latitudes. It filters out the casual strollers and leaves you on a private island restaurant with beachfront tables, lighted palm trees, and a sunset view that justifies every dollar on the bill.',
      },
      {
        title: 'The Wine Situation',
        body: 'Latitudes maintains a well-curated list that leans into whites and rosés that make sense with Caribbean-influenced seafood. The markup is resort-level, which means you are paying for the setting as much as the wine. Worth it? When you are sitting on the sand watching the sun drop into the Gulf of Mexico with a glass of something cold and crisp, yes. The answer is yes.',
      },
      {
        title: 'The Food',
        body: 'Local spiny lobster. Yellowtail snapper with cumin. Key West Pinks (shrimp done right). Black grouper with saffron crust and smoked paprika oil. The kitchen sources directly from local waters and treats ingredients with respect. This is not hotel food dressed up for a view. It is a real restaurant that happens to be on a private island. We have eaten our Thanksgiving meal here on multiple occasions. That should tell you everything about our confidence level.',
      },
      {
        title: 'The Details',
        body: 'Open 7 AM to 10 PM daily. Call (305) 292-5394 for reservations, which are required. Dress code is upscale resort: collared shirts for men, no beachwear. Go for a late afternoon meal. Arrive while the sun is still up, order a glass of wine, watch the light change over the water. Stay for dinner. The transition from daylight to candlelight on Sunset Key is one of the best dining experiences in the Florida Keys.',
      },
    ],
    bottomLine: 'Latitudes is what you picture when someone says "island dining" and it actually delivers. The boat ride, the beach, the sunset, the food, the wine. One of our absolute favorites and worth every bit of the effort to get there.',
    publishedAt: '2026-02-08',
  },
  {
    slug: 'louies-backyard-key-west',
    restaurant: 'Louie\'s Backyard',
    neighborhood: 'Old Town (Waddell Ave)',
    city: 'Key West',
    citySlug: 'key-west',
    cuisineType: 'New American / Caribbean',
    badge: 'rager',
    subtitle: 'The Deck, the Sunset, and a Wine List That Backs It Up',
    tags: ['Oceanfront', 'Wine List', 'Sunset', 'Classic Key West'],
    editorial: [
      {
        title: 'The Setup',
        body: 'Louie\'s Backyard has been a Key West institution since 1971, and the back deck is the reason. Multi-tiered outdoor seating suspended above the Atlantic, so close to the turquoise water you could theoretically drop a bread roll into the ocean. The restored Victorian house gives it a sense of place that the chain restaurants on Duval will never touch. Executive Chef Doug Shook has maintained the kind of New American-Caribbean menu that rewards both the adventurous and the traditional diner.',
      },
      {
        title: 'The Wine List',
        body: 'Over 100 selections and a by-the-glass program that does not treat casual drinkers as afterthoughts. The Afterdeck Bar offers curated wines with creative cocktails in an alfresco setting that doubles as one of the best pre-dinner spots on the island. The main dining list goes deep enough to reward exploration, with fair pricing on most bottles given the setting. If you are going to spend on wine anywhere in Key West, this is where the glass-to-view ratio pays off.',
      },
      {
        title: 'The Food',
        body: 'Snapper ceviche to start. Grilled octopus if they have it. The local catch changes daily and the kitchen handles every protein like it came off the boat that morning. Louie\'s also does not skimp on the land side: steaks, lamb chops, and a Key lime pie that ends the meal exactly right. Lunch is the more casual option and equally strong. The upstairs dining is more relaxed if you want a lighter touch.',
      },
      {
        title: 'The Move',
        body: 'Arrive for a late afternoon drink at the Afterdeck Bar. Watch the sunset. Move to the main dining room for dinner. This two-act experience is one of the best evenings you can have in Key West, and the wine list supports both halves. Open Monday through Sunday, 11:30 AM to 2:30 PM and 5:00 PM to 9:00 PM. Call (305) 294-1061 for reservations.',
      },
    ],
    bottomLine: 'Louie\'s Backyard is the rare Key West restaurant that has been famous for decades and still earns it every night. The back deck alone is worth the trip. The wine list and food make it one of our favorites on the island.',
    publishedAt: '2026-02-08',
  },
  {
    slug: 'el-siboney-key-west',
    restaurant: 'El Siboney',
    neighborhood: 'Old Town (Catherine Street)',
    city: 'Key West',
    citySlug: 'key-west',
    cuisineType: 'Cuban',
    badge: 'wildcard',
    subtitle: 'No Wine List. Don\'t Care. Get the Sangria.',
    tags: ['Cuban', 'Sangria', 'Cash Friendly', 'Local Legend'],
    editorial: [
      {
        title: 'The Honest Truth',
        body: 'El Siboney does not have a wine list. They do not serve wine at all. And they are in this guide anyway. Because Raging Wine is about finding the right drink at the right place, and at El Siboney the right drink is their homemade sangria. Fruity, strong, cold, and absolutely perfect with a plate of roast pork and black beans. This is the Cuban restaurant that locals call "the place where conchs take other conchs to dinner." It has been winning Best Cuban Restaurant in Key West every year since 1993, and the de la Cruz family has been running it since 2004.',
      },
      {
        title: 'Why It\'s Here',
        body: 'Not every great meal needs a sommelier. Sometimes you need a picnic table, a plate of Masitas de Puerco Fritas, a cup of that sangria, and absolutely zero pretense. El Siboney is that restaurant. The portions are enormous, the prices are almost comically low (four people can eat for about $60), and the food is cooked with the kind of pride that no amount of Michelin stars can manufacture. If you want paella, call an hour ahead. If you want the roast pork, just show up.',
      },
      {
        title: 'The Sangria',
        body: 'We keep coming back to the sangria because it deserves its own section. It is made in-house, served cold, and pairs with everything on the menu in the way that only a drink made for the food can. It is not fancy. It is not trying to be a wine replacement. It is the exact right beverage for this exact right restaurant. Order it.',
      },
      {
        title: 'The Details',
        body: 'Located at 900 Catherine Street with a second location on Stock Island. Open Monday through Sunday, 11 AM to 9:30 PM. No reservations needed. TripAdvisor ranks it #32 out of 360 Key West restaurants, which for a place with laminated menus and paper napkins tells you everything about the food. Call (305) 296-4184 if you want to order the paella ahead.',
      },
    ],
    bottomLine: 'El Siboney breaks every rule in this guide and still earns its spot. No wine, no white tablecloths, no reservations. Just the best Cuban food on the island, homemade sangria that hits perfectly, and a check that makes you feel like you got away with something.',
    publishedAt: '2026-02-08',
  },
  {
    slug: 'cafe-marquesa-key-west',
    restaurant: 'Cafe Marquesa',
    neighborhood: 'Old Town (Fleming Street)',
    city: 'Key West',
    citySlug: 'key-west',
    cuisineType: 'Coastal Fine Dining',
    badge: 'rager',
    subtitle: 'Two Michelin Keys and a Wine List That Earned Them',
    tags: ['Michelin Keys', 'Wine Spectator', 'Tasting Menu', 'Wine List'],
    editorial: [
      {
        title: 'The Setup',
        body: 'Cafe Marquesa sits at 600 Fleming Street, steps from the Historic Seaport, inside one of those Key West buildings that feels like it has always been there. Two Michelin Keys (2024 and 2025). Wine Spectator Award of Excellence. OpenTable Diners\' Choice. TripAdvisor ranks it #8 out of 363 Key West restaurants. This is not a place that coasts on reputation. It defends it nightly with a seven-course tasting menu, freshly baked bread, and house-made desserts that close the meal with the same care that opened it.',
      },
      {
        title: 'The Wine List',
        body: 'This is where Cafe Marquesa separates from the field. The wine program is extensive and intelligent, with a full range from Champagne and sparkling through whites and reds from recognized regions worldwide. Wines by the glass run $6 to $16, which means you can explore without committing to a full bottle on a tasting-menu night. The Wine Spectator Award confirms what you will feel when you open the list: someone here treats wine as seriously as the food. That alignment is rare in Key West.',
      },
      {
        title: 'The Food',
        body: 'The She Crab Soup alone would justify a visit. Shrimp and Grits with the kind of creole intensity that proves this kitchen knows the South. Crispy Gulf Oysters on red rice. The seven-course tasting menu (available 5:30 to 8:30 PM) is the way to go if you want the full experience, but the a la carte dinner menu (5:00 to 9:00 PM) is equally strong. Breakfast runs 8:00 to 11:00 AM with Marquesa Beignets and tropical fruit plates that make you wonder why every restaurant in Key West does not start the day this well.',
      },
      {
        title: 'The Details',
        body: 'The dining room is intimate and romantic, the kind of space where first dates become anniversaries. Service is attentive without being theatrical. Prices are high but justified by the quality and care behind every course. Book ahead during peak season. This is one of the restaurants that serious food people in Key West will mention unprompted, and the wine list is the reason it belongs in this guide.',
      },
    ],
    bottomLine: 'Cafe Marquesa has the best wine program of any sit-down restaurant in Key West, full stop. Two Michelin Keys, Wine Spectator recognition, and a kitchen that matches the cellar course for course. If you care about wine and you are in Key West, this is mandatory.',
    publishedAt: '2026-02-08',
  },
  {
    slug: 'santiagos-bodega-key-west',
    restaurant: 'Santiago\'s Bodega',
    neighborhood: 'Bahama Village',
    city: 'Key West',
    citySlug: 'key-west',
    cuisineType: 'Tapas / Small Plates',
    badge: 'wildcard',
    subtitle: 'Off-Duval Tapas With a Wine List That Overdelivers',
    tags: ['Tapas', 'Wine Variety', 'Happy Hour', 'Bahama Village'],
    editorial: [
      {
        title: 'The Setup',
        body: 'Santiago\'s Bodega sits at 207 Petronia Street in Bahama Village, which means you have to want to find it. That is the first good sign. The space is dark, sensuous, and intimate in the way that great tapas bars should be. Founded in 2003 by Jason Dugan, it has become the spot that local foodies mention when tourists ask where they actually eat. The concept is globally inspired small plates, and the move is to order two to three per person and share everything.',
      },
      {
        title: 'The Wine List',
        body: 'Here is the surprise: Santiago\'s Bodega has one of the most varied wine lists in Key West. The staff travels to wine regions to curate the selection, which means you are not getting a distributor\'s greatest hits. The by-the-glass program is strong, and during happy hour (3 PM to 6 PM daily) wine is half-priced. That happy hour alone makes this a mandatory stop. Beer and wine only, no spirits, which means the wine list gets the full attention it deserves. They also make their own sangria, which is worth trying alongside the tapas.',
      },
      {
        title: 'The Food',
        body: 'The Yellowfin Tuna Ceviche with citrus, avocado, mango, and cilantro is the table-setter. Beef Carpaccio with truffle oil and shaved parmesan. Filet Mignon with Gorgonzola butter for when you want something substantial. And the Croissant Bread Pudding for dessert is the kind of thing that does not sound like it belongs on a tapas menu until you eat it and realize it was the best decision of the evening. Regular plates run $18 to $26, happy hour specials drop to $5 to $7.',
      },
      {
        title: 'The Details',
        body: 'Open daily 11 AM to 10 PM. Happy hour 3 to 6 PM with half-price wine and $5-$7 tapas specials. Reservations recommended, especially for groups of six or more. Fodor\'s calls it "a secret spot for local foodies in the know," which it was until everyone found out. Go early, grab the happy hour wine deal, and order more tapas than you think you need. Call (305) 296-7691.',
      },
    ],
    bottomLine: 'Santiago\'s Bodega is the Key West wine bar hiding inside a tapas restaurant. The variety of the wine list, the half-price happy hour, and the quality of the small plates make this a Wild Card that overdelivers every time. If you only have one casual evening in Key West, spend it here.',
    publishedAt: '2026-02-08',
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
