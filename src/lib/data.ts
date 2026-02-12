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
  // --- Atlanta Reviews (Editorial Style) ---
  {
    slug: 'hw-steakhouse-atlanta',
    restaurant: 'H&W Steakhouse',
    neighborhood: 'Buckhead',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'Steakhouse',
    badge: 'rager',
    subtitle: '500 Selections and a Napa Obsession Worth Exploring',
    tags: ['500+ Wines', 'Buckhead', 'Steakhouse', 'Napa Valley Focus'],
    editorial: [
      {
        title: 'The Wine Program',
        body: 'H&W Steakhouse keeps over 500 selections with a deep bias toward Napa Valley and Bordeaux. This is a steakhouse wine list that knows exactly what it is: big reds for big cuts. But the depth goes beyond the obvious. The buyer stocks verticals from cult Napa producers and sneaks in enough Barolo and Rioja to reward anyone willing to read past the California section. The by-the-glass program rotates and consistently punches above the typical steakhouse pour.',
      },
      {
        title: 'The Setting',
        body: 'Buckhead location with the kind of dark-wood, leather-booth ambiance that signals serious dining. The staff knows the list and can navigate you through the heavier sections without defaulting to the most expensive bottle. Service here is old-school Atlanta hospitality: attentive, knowledgeable, unhurried.',
      },
      {
        title: 'The Play',
        body: 'If you are a Cabernet person, this is your Atlanta headquarters. The Napa depth alone makes it worth the trip. But the hidden play is the Bordeaux section, where the markups are more reasonable than the California side and the quality matches or exceeds. Order the ribeye, ask about older vintages, and let the staff do their job.',
      },
    ],
    bottomLine: 'H&W Steakhouse is the Buckhead wine destination for anyone who thinks steak and Cabernet is a love story worth telling. 500+ selections with real depth in Napa and Bordeaux.',
    publishedAt: '2026-02-10',
  },
  {
    slug: 'atlanta-fish-market',
    restaurant: 'Atlanta Fish Market',
    neighborhood: 'Buckhead',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'Seafood',
    badge: 'reliable',
    subtitle: 'Wine Spectator Recognized and Built for the Crowd',
    tags: ['Wine Spectator', 'Buckhead', 'Seafood', 'Large Format'],
    editorial: [
      {
        title: 'The Wine Program',
        body: 'Atlanta Fish Market carries a Wine Spectator Award of Excellence, which means the list has breadth, fair pricing, and logical organization. The selection leans into whites and lighter reds that work with seafood, and the by-the-glass options cover enough ground that you can eat your way through the raw bar without committing to a bottle. It is not an adventurous list. It is a well-managed one.',
      },
      {
        title: 'The Experience',
        body: 'This is a large-format restaurant that handles volume without sacrificing quality. The giant copper fish sculpture outside is impossible to miss, and the dining room buzzes with the energy of a place that has been a Buckhead staple for decades. Wine service is professional and efficient. If you need a recommendation, you will get one. If you know what you want, nobody will slow you down.',
      },
      {
        title: 'Who This Is For',
        body: 'Business dinners, large groups, and anyone who wants a safe wine pick with excellent seafood. The list will not challenge you, but it will not disappoint you either. Fair pricing across the board, which is not always a given in Buckhead.',
      },
    ],
    bottomLine: 'Atlanta Fish Market delivers exactly what Wine Spectator recognition promises: a well-organized list with fair pricing and enough depth to keep a seafood dinner interesting. Reliable in the best sense.',
    publishedAt: '2026-02-10',
  },
  {
    slug: 'atlas-atlanta',
    restaurant: 'Atlas',
    neighborhood: 'Buckhead (St. Regis)',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'New American Fine Dining',
    badge: 'rager',
    subtitle: '900 Selections, 75 By the Glass, and a Best of Award',
    tags: ['900+ Wines', '75 BTG', 'Wine Spectator Best of Award', 'Fine Dining'],
    editorial: [
      {
        title: 'The Wine Program',
        body: 'Atlas holds a Wine Spectator Best of Award of Excellence, which puts it in rare company globally and in a class of its own in Atlanta. The numbers tell the story: 900 selections, 75 wines by the glass, and a cellar that spans every major wine region on earth. This is not a list you skim. You study it. The Burgundy section alone could occupy an entire dinner conversation. The by-the-glass program is one of the largest in the Southeast, which means you can explore without the commitment of a full bottle on a Tuesday.',
      },
      {
        title: 'The Setting',
        body: 'Located inside the St. Regis Atlanta, the room is as serious as the wine list. Art collection on the walls. White tablecloths. Service that operates at the pace of fine dining without the stiffness that sometimes comes with it. The sommelier team here is deep, and they enjoy guiding diners through the list as much as they enjoy building it.',
      },
      {
        title: 'The Verdict',
        body: 'If you have one special-occasion dinner in Atlanta and wine matters to you, Atlas is the answer. The 75 BTG program alone justifies the visit. The food is excellent New American fine dining, but the wine program is why this restaurant exists in this guide at the highest level. Ask about allocated wines and library selections. They have things here that most Atlanta diners do not know are available.',
      },
    ],
    bottomLine: 'Atlas has the deepest wine program in Atlanta. 900 selections, 75 by the glass, Wine Spectator Best of Award. This is the city\'s wine destination for serious drinkers.',
    publishedAt: '2026-02-10',
  },
  {
    slug: 'bones-atlanta',
    restaurant: 'Bones',
    neighborhood: 'Buckhead',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'Steakhouse',
    badge: 'rager',
    subtitle: '7,000 Bottles and 35 Years of Wine Spectator Awards',
    tags: ['7000 Bottles', '710 Selections', 'Wine Spectator Legacy', 'Classic Steakhouse'],
    editorial: [
      {
        title: 'The Wine Program',
        body: 'Bones has won a Wine Spectator award every single year for over 35 years. That is not a streak. That is an identity. The cellar holds 7,000 bottles across 710 selections, and the list reads like a textbook on classic wine regions with real depth in Bordeaux, Napa, and Burgundy. The markups are steakhouse-standard, but the selection quality and vintage depth justify the spend. If you have ever wanted to drink a 15-year-old Bordeaux with a dry-aged steak, Bones has the bottle.',
      },
      {
        title: 'The Institution',
        body: 'Bones is Atlanta old guard. Power lunches, deal-closing dinners, and the kind of regulars who have had the same table for twenty years. The service matches the clientele: professional, discreet, and fluent in the wine list. This is not the place for experimental pours or natural wine. This is the place where the classics are treated with the respect they deserve.',
      },
      {
        title: 'The Play',
        body: 'Ask about the cellar selections that are not on the printed list. Bones has older vintages tucked away that reward the curious diner. The staff knows what is drinking well right now and what needs time. Trust them. Order the bone-in filet, ask for a Bordeaux recommendation in whatever price range you are comfortable with, and settle into one of the best old-school wine experiences in the Southeast.',
      },
    ],
    bottomLine: 'Bones is the most decorated wine program in Atlanta, full stop. 35+ years of Wine Spectator recognition, 7,000 bottles, and a staff that treats every pour like it matters. A Buckhead institution.',
    publishedAt: '2026-02-10',
  },
  {
    slug: 'canoe-atlanta',
    restaurant: 'Canoe',
    neighborhood: 'Vinings',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'New Southern',
    badge: 'reliable',
    subtitle: 'Riverfront Dining With a 370-Bottle List That Fits',
    tags: ['Riverfront', '370 Bottles', 'Vinings', 'New Southern'],
    editorial: [
      {
        title: 'The Wine Program',
        body: 'Canoe stocks around 370 bottles with a balanced mix of domestic and imported selections. The list is organized clearly, priced fairly, and built to complement a menu that moves between Southern comfort and seasonal ambition. Nothing revolutionary, but nothing lazy either. The by-the-glass program covers the bases with enough variety to handle a four-top where everyone wants something different.',
      },
      {
        title: 'The Setting',
        body: 'Canoe sits on the Chattahoochee River with a patio that makes every other restaurant in Atlanta jealous. Gardens surround the property. The dining room has floor-to-ceiling windows. This is a setting restaurant, and the wine list is smart enough to support the experience without trying to steal the show. Date nights, anniversaries, and any occasion where the view matters as much as the meal.',
      },
      {
        title: 'The Play',
        body: 'Go for the patio. Order a crisp white by the glass and let the river do the work. The food (smoked trout, lamb, seasonal vegetables from the garden) pairs naturally with medium-bodied reds and aromatic whites. Canoe does not need a 900-bottle list. It needs exactly the list it has.',
      },
    ],
    bottomLine: 'Canoe pairs a 370-bottle wine list with one of the best restaurant settings in Atlanta. The list is reliable, the pricing is fair, and the riverfront patio sells itself.',
    publishedAt: '2026-02-10',
  },
  {
    slug: 'le-bilboquet-atlanta',
    restaurant: 'Le Bilboquet',
    neighborhood: 'Buckhead',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'French Bistro',
    badge: 'rager',
    subtitle: '2,000 Bottles of French Ambition in Buckhead',
    tags: ['2000+ Bottles', 'French Focus', 'Buckhead', 'Cellar'],
    editorial: [
      {
        title: 'The Wine Program',
        body: 'Le Bilboquet houses over 2,000 bottles with a French-first philosophy. Burgundy, Bordeaux, Rhone, Loire, Champagne: every major French region is represented with genuine depth. This is not a French restaurant that stocks a few token bottles from the homeland. This is a wine program that treats France the way Bones treats Napa: with the conviction that one country can fill an entire cellar and justify every shelf. The non-French selections exist but feel like concessions to diners who insist on Cabernet.',
      },
      {
        title: 'The Bistro',
        body: 'The energy here is Parisian bistro transplanted to Buckhead with the volume turned up slightly. Steak frites, tuna tartare, Dover sole. The food is classically French and executed with confidence. The room is loud in the best way: people having a good time over good food and serious wine. The staff speaks the language of the list and can guide you from a casual Cotes du Rhone to a premier cru Burgundy without missing a beat.',
      },
      {
        title: 'The Verdict',
        body: 'If you love French wine and you live in Atlanta, Le Bilboquet is your home base. 2,000 bottles of depth, fair pricing relative to the quality, and a kitchen that gives you the food to match. The Burgundy section alone is worth a dedicated visit.',
      },
    ],
    bottomLine: 'Le Bilboquet is the deepest French wine program in Atlanta. 2,000+ bottles, serious Burgundy and Bordeaux depth, and a bistro kitchen that earns every cork pulled.',
    publishedAt: '2026-02-10',
  },
  {
    slug: 'le-bon-nosh-atlanta',
    restaurant: 'Le Bon Nosh',
    neighborhood: 'Westside',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'French',
    badge: 'wildcard',
    subtitle: '500 Bottles, All French, Many Biodynamic',
    tags: ['All French', 'Biodynamic', '500+ Bottles', 'Westside'],
    editorial: [
      {
        title: 'The Wine Program',
        body: 'Le Bon Nosh stocks over 500 bottles and every single one is French. That commitment alone makes it a Wild Card. But the list goes further: a significant portion of the selections are biodynamic or organic, reflecting a philosophical approach to wine that goes beyond geography. The buyer here is not just stocking France. They are stocking a version of France that most Atlanta diners have never explored. Small producers, natural methods, regions that get overlooked in conventional French wine programs.',
      },
      {
        title: 'The Approach',
        body: 'This is a restaurant for people who think they know French wine and want to discover how much they have missed. The staff is passionate about the biodynamic selections and will walk you through the differences without lecturing. Pairings are thoughtful. The food is French with a modern touch, and the wine integration feels intentional rather than decorative.',
      },
      {
        title: 'Why Wild Card',
        body: 'An all-French, heavily biodynamic wine program is a gamble in a market that defaults to California Cabernet. Le Bon Nosh bets that Atlanta diners are ready for something more specific, more philosophical, and more interesting. That bet is paying off. Go here when you want to be challenged.',
      },
    ],
    bottomLine: 'Le Bon Nosh is the most philosophically committed wine program in Atlanta. 500+ bottles, all French, many biodynamic. This is where you go when you want wine to mean something beyond the glass.',
    publishedAt: '2026-02-10',
  },
  {
    slug: 'marcel-atlanta',
    restaurant: 'Marcel',
    neighborhood: 'Westside',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'Steakhouse / French',
    badge: 'rager',
    subtitle: '465 Selections Where French Elegance Meets California Power',
    tags: ['465 Selections', 'French-California', 'Westside', 'Steakhouse'],
    editorial: [
      {
        title: 'The Wine Program',
        body: 'Marcel carries 465 selections split between French and California, which gives it a dual identity that works because the kitchen operates the same way. The French side goes deep on Burgundy and Rhone. The California side focuses on Napa and Sonoma with enough variety to avoid the single-region fatigue that hits most steakhouse lists. The result is a wine program with genuine range. You can start with Champagne, move to a white Burgundy, and finish with a Napa Cab, and every pour feels like it belongs.',
      },
      {
        title: 'The Restaurant',
        body: 'Ford Fry\'s steakhouse-meets-French-brasserie concept delivers on both sides of the hyphen. Dry-aged steaks share the menu with steak frites and duck confit. The dining room has the swagger of a great steakhouse with the finesse of a French restaurant. Wine service is sharp, and the staff can navigate both halves of the list with equal fluency.',
      },
      {
        title: 'The Play',
        body: 'Order something French with the appetizer and something Californian with the steak. Marcel is built for that kind of transatlantic journey, and the list rewards it. The pricing is steakhouse-level but justified by the selection quality. Ask about allocated bottles. They stock things here that rotate off the list before most diners notice.',
      },
    ],
    bottomLine: 'Marcel bridges French elegance and California muscle across 465 selections. One of the most balanced wine programs in Atlanta, backed by a kitchen that deserves every bottle.',
    publishedAt: '2026-02-10',
  },
  {
    slug: 'white-oak-kitchen-atlanta',
    restaurant: 'White Oak Kitchen & Cocktails',
    neighborhood: 'Downtown',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'New American',
    badge: 'rager',
    subtitle: 'A Glass Wine Cellar With 450 Labels Behind It',
    tags: ['450 Labels', 'Glass Wine Cellar', 'Downtown', 'Visual Wow'],
    editorial: [
      {
        title: 'The Wine Program',
        body: 'White Oak Kitchen stocks 450 labels and displays them in a floor-to-ceiling glass wine cellar that dominates the dining room. The visual alone signals intent. The list covers domestic and international selections with enough depth in key regions to reward exploration. The by-the-glass program is generous, and the staff can walk you through the cellar with the kind of enthusiasm that makes you want to try something you would not have ordered on your own.',
      },
      {
        title: 'The Setting',
        body: 'Downtown Atlanta location with a design-forward interior built around that glass cellar. The restaurant attracts a mix of hotel guests, convention visitors, and locals who know the wine program outperforms the address. The food is New American with Southern touches, and it pairs naturally with the mid-weight reds and aromatic whites that anchor the list.',
      },
      {
        title: 'The Verdict',
        body: 'White Oak Kitchen is the downtown Atlanta wine destination that most visitors miss. 450 labels, a cellar you can see from your table, and a team that genuinely cares about matching wine to food. If you are staying downtown and want a wine-forward dinner, this is the move.',
      },
    ],
    bottomLine: 'White Oak Kitchen pairs 450 labels with a glass wine cellar and a downtown location that deserves more attention. One of Atlanta\'s most visually striking wine programs with the depth to back it up.',
    publishedAt: '2026-02-10',
  },
  {
    slug: 'aria-atlanta',
    restaurant: 'Aria',
    neighborhood: 'Buckhead',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'New American',
    badge: 'wildcard',
    subtitle: 'Biodynamic, Low-Intervention, and Star Wine List Recognized',
    tags: ['Biodynamic', 'Low-Intervention', 'Star Wine List', 'Buckhead'],
    editorial: [
      {
        title: 'The Wine Program',
        body: 'Aria earned recognition from Star Wine List, which evaluates restaurants specifically on their wine programs using independent expert judges. That nod puts Aria in serious company. The list leans heavily into biodynamic and low-intervention wines, which in Buckhead is a genuinely bold move. This is not a natural wine bar trying to be contrarian. This is a fine dining restaurant that believes biodynamic farming produces better wine and has built a program around that conviction.',
      },
      {
        title: 'The Experience',
        body: 'Chef Gerry Klaskala has been running Aria since 2000, and the consistency shows. New American cuisine with a seasonal focus, served in a Buckhead dining room that balances elegance with warmth. The wine staff is knowledgeable about the biodynamic selections and can explain the philosophy without evangelizing. Pairings are creative and often surprising.',
      },
      {
        title: 'Why Wild Card',
        body: 'A biodynamic-focused wine program in Buckhead fine dining is inherently a Wild Card. Most of the big Buckhead restaurants play it safe with conventional selections. Aria bets that diners want something more intentional. If you care about how your wine is farmed as much as how it tastes, this is your Atlanta restaurant.',
      },
    ],
    bottomLine: 'Aria is the biodynamic fine dining wine program Atlanta did not know it needed. Star Wine List recognition, low-intervention focus, and a chef who has kept this restaurant excellent for over two decades.',
    publishedAt: '2026-02-10',
  },
  {
    slug: 'bacchanalia-atlanta',
    restaurant: 'Bacchanalia',
    neighborhood: 'Westside',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'New American / Tasting Menu',
    badge: 'rager',
    subtitle: 'Michelin Star. Tasting Menu. Wine Program to Match.',
    tags: ['Michelin Star', 'Tasting Menu', 'Westside', 'Fine Dining'],
    editorial: [
      {
        title: 'The Wine Program',
        body: 'Bacchanalia holds a Michelin star and the wine program operates at that level. The list is curated rather than massive, built to complement the tasting menu format with selections that can move from a delicate seafood course to a rich meat course without losing the thread. By-the-glass options change with the menu, and the sommelier pairing is worth the upcharge. This is a program where every bottle was chosen to work with specific dishes, not just fill a page.',
      },
      {
        title: 'The Restaurant',
        body: 'Chef-owners Anne Quatrano and Clifford Harrison have been operating Bacchanalia since 1993, making it one of the longest-running fine dining restaurants in Atlanta. The move to the Westside location brought a more modern space, but the philosophy remains: source impeccably, cook precisely, and let the ingredients lead. The tasting menu changes frequently and reflects what is best right now, not what was best last season.',
      },
      {
        title: 'The Play',
        body: 'Do the sommelier pairing. The wine team here builds pairings that are specific to the current menu and often include bottles you would not have discovered on your own. If you prefer to order from the list, ask about wines that work across multiple courses. The staff excels at finding that one bottle that threads the needle through an entire tasting experience.',
      },
    ],
    bottomLine: 'Bacchanalia is Atlanta\'s Michelin-starred wine experience. The program is built for the tasting menu format, and the sommelier pairing is one of the best values in Atlanta fine dining.',
    publishedAt: '2026-02-10',
  },
  {
    slug: 'la-grotta-atlanta',
    restaurant: 'La Grotta',
    neighborhood: 'Buckhead',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'Italian Fine Dining',
    badge: 'rager',
    subtitle: '400 Italian Labels and Four Decades of Proof',
    tags: ['400+ Italian Labels', 'Buckhead', 'Italian', 'Legacy'],
    editorial: [
      {
        title: 'The Wine Program',
        body: 'La Grotta stocks over 400 labels with an Italian focus that goes well beyond Chianti and Pinot Grigio. The list digs into Piedmont with serious Barolo and Barbaresco depth, covers Tuscany with Super Tuscans and Brunello, and ventures into southern Italian regions that most Atlanta restaurants ignore entirely. If you want to drink Italian wine with Italian food in Atlanta, there is La Grotta and there is everywhere else.',
      },
      {
        title: 'The Institution',
        body: 'Open since the early 1980s, La Grotta is Atlanta\'s Italian fine dining anchor. The Buckhead location has the kind of old-world warmth that cannot be manufactured. Handmade pasta, veal, and seafood preparations that have been refined over four decades. The service staff has been here long enough to know which wines age well in this cellar and which are drinking perfectly right now.',
      },
      {
        title: 'The Play',
        body: 'Skip the familiar and ask the staff to guide you into the southern Italian section. Sicily, Campania, and Puglia produce wines that pair brilliantly with La Grotta\'s menu and cost significantly less than the Piedmont selections. The by-the-glass options rotate and often feature wines the buyer is excited about, which is always a good sign.',
      },
    ],
    bottomLine: 'La Grotta is the deepest Italian wine program in Atlanta. 400+ labels, four decades of expertise, and a staff that knows every corner of the list. If Italian wine is your thing, this is mandatory.',
    publishedAt: '2026-02-10',
  },
  {
    slug: 'sotto-sotto-atlanta',
    restaurant: 'Sotto Sotto',
    neighborhood: 'Inman Park',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'Italian',
    badge: 'reliable',
    subtitle: 'Deep Italian Program in Atlanta\'s Favorite Neighborhood Spot',
    tags: ['Italian', 'Inman Park', 'Neighborhood Gem', 'Deep Italian List'],
    editorial: [
      {
        title: 'The Wine Program',
        body: 'Sotto Sotto runs a deep Italian wine program that matches the kitchen\'s commitment to regional Italian cooking. The list covers the major Italian wine regions with enough depth to satisfy serious Italian wine drinkers while keeping enough accessible options for the table that just wants a good Montepulciano. Pricing is fair by Atlanta standards, and the by-the-glass selections rotate with intention.',
      },
      {
        title: 'The Restaurant',
        body: 'Inman Park location, perpetually packed, and for good reason. The pasta is handmade, the energy is high, and the room feels like a neighborhood restaurant that happens to take wine seriously. This is not a stuffy Italian fine dining room. This is the place where you bring friends, order too much food, and discover a Nero d\'Avola you have never tried.',
      },
      {
        title: 'The Verdict',
        body: 'Sotto Sotto is the reliable Italian wine choice in Atlanta. Not the deepest list, not the most adventurous, but consistently well-chosen and fairly priced. Perfect for a weeknight dinner where you want good Italian wine without studying a 400-label list.',
      },
    ],
    bottomLine: 'Sotto Sotto delivers a solid Italian wine program in one of Atlanta\'s most beloved neighborhood restaurants. Reliable picks, fair pricing, and the kind of energy that makes Tuesday feel like Friday.',
    publishedAt: '2026-02-10',
  },
  {
    slug: 'miller-union-atlanta',
    restaurant: 'Miller Union',
    neighborhood: 'Westside',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'Farm-to-Table',
    badge: 'rager',
    subtitle: 'Five Certified Sommeliers and a James Beard Nomination',
    tags: ['5 Sommeliers', 'James Beard', 'Farm-to-Table', 'Westside'],
    editorial: [
      {
        title: 'The Wine Program',
        body: 'Miller Union employs five certified sommeliers on staff. Five. That depth of wine expertise in a single restaurant is almost unheard of in the Southeast. The result is a wine program that is not just well-stocked but actively managed by people who understand how wine and food interact at a molecular level. The list emphasizes producers who farm sustainably, which aligns with the kitchen\'s farm-to-table philosophy. Every recommendation you get here will be specific, informed, and tailored to what you ordered.',
      },
      {
        title: 'The Restaurant',
        body: 'Chef Steven Satterfield\'s James Beard-nominated restaurant is one of the most respected farm-to-table programs in Atlanta. The menu changes with the seasons, and the wine list moves with it. This integration between kitchen and cellar is what separates Miller Union from restaurants that treat wine as a separate department. Here, wine is part of the conversation from the moment the menu is written.',
      },
      {
        title: 'The Play',
        body: 'Tell your sommelier what you are eating and let them choose. With five certified wine professionals on staff, the pairing recommendations at Miller Union are among the best in the city. If you prefer to browse the list yourself, ask about the lower-profile selections from sustainable producers. That is where this list really shines.',
      },
    ],
    bottomLine: 'Miller Union has the most qualified wine staff in Atlanta. Five certified sommeliers, a James Beard-nominated kitchen, and a list built on the same farm-to-table principles as the food. Trust the team here.',
    publishedAt: '2026-02-10',
  },
  {
    slug: 'rays-on-the-river-atlanta',
    restaurant: 'Ray\'s on the River',
    neighborhood: 'Sandy Springs',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'Seafood / Steakhouse',
    badge: 'reliable',
    subtitle: '3,000 Bottles and Value Pricing That Surprises',
    tags: ['3000+ Bottles', 'Value Pricing', 'Riverfront', 'Sandy Springs'],
    editorial: [
      {
        title: 'The Wine Program',
        body: 'Ray\'s on the River holds over 3,000 bottles, which makes it one of the largest cellar inventories in the Atlanta metro area. The list spans domestic and international selections with a bias toward crowd-pleasing varietals at prices that consistently undercut comparable Atlanta restaurants. This is a volume operation, but the buying is smart. You will find well-known labels at fair markups and enough depth in key regions to reward anyone who reads past the first page.',
      },
      {
        title: 'The Setting',
        body: 'Chattahoochee River views from Sandy Springs with a patio that rivals Canoe for scenic dining. The restaurant handles large parties and celebrations well, and the wine list is built to serve tables of eight as comfortably as couples. Wine service is efficient and helpful without being overbearing.',
      },
      {
        title: 'The Value Play',
        body: 'Ray\'s on the River is where you go when you want a good bottle at an honest price. The value pricing strategy is the defining feature of this program. You will spend less here for comparable wines than at most Buckhead restaurants, and the riverfront setting is a bonus. Not the most exciting list in Atlanta, but possibly the most fairly priced.',
      },
    ],
    bottomLine: 'Ray\'s on the River stocks 3,000+ bottles at prices that make Buckhead look expensive. A reliable wine program with value pricing and a riverfront setting. The smart choice for a nice dinner that does not punish your wallet.',
    publishedAt: '2026-02-10',
  },
  {
    slug: 'rays-in-the-city-atlanta',
    restaurant: 'Ray\'s in the City',
    neighborhood: 'Downtown',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'Seafood / Steakhouse',
    badge: 'rager',
    subtitle: 'Wine Spectator Best of Award in Downtown Atlanta',
    tags: ['Wine Spectator Best of Award', 'Downtown', 'Deep Cellar', 'Surf & Turf'],
    editorial: [
      {
        title: 'The Wine Program',
        body: 'Ray\'s in the City holds a Wine Spectator Best of Award of Excellence, which is the highest tier of recognition and puts it alongside Atlas as one of only two Atlanta restaurants at that level. The list is deep, global, and organized with the kind of precision that makes a 500+ selection program feel navigable rather than overwhelming. The sommelier team is strong, and the by-the-glass program offers enough range to sample across regions without committing to a full bottle.',
      },
      {
        title: 'The Restaurant',
        body: 'Downtown location with the energy of a high-volume restaurant that has not sacrificed wine quality for throughput. The menu covers seafood and steaks with equal commitment, and the wine list is built to handle both. This is a restaurant where a table of four can order oysters, steak, lobster, and a vegetarian entree and still find a single bottle that works for everyone.',
      },
      {
        title: 'The Verdict',
        body: 'Ray\'s in the City is the downtown counterpart to the suburban Ray\'s on the River, but the wine program here operates at a different level. The Best of Award recognition means the list has been vetted by critics who evaluate thousands of programs annually. If you are downtown and want a wine-forward dinner, this is the first call.',
      },
    ],
    bottomLine: 'Ray\'s in the City holds one of only two Wine Spectator Best of Awards in Atlanta. Deep list, strong service, and a downtown location that makes it the go-to for serious wine with surf or turf.',
    publishedAt: '2026-02-10',
  },
  {
    slug: 'kyma-atlanta',
    restaurant: 'Kyma',
    neighborhood: 'Buckhead',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'Greek Seafood',
    badge: 'wildcard',
    subtitle: '90% Greek Wines and an Education in Every Glass',
    tags: ['90% Greek Wine', 'Greek Seafood', 'Buckhead', 'Unique Program'],
    editorial: [
      {
        title: 'The Wine Program',
        body: 'Kyma stocks a wine list that is roughly 90% Greek, which makes it the most regionally committed wine program in Atlanta. Assyrtiko from Santorini, Xinomavro from Naoussa, Moschofilero from the Peloponnese, Agiorgitiko from Nemea. If those names are unfamiliar, that is exactly the point. Greek wine is having a global moment, and Kyma gives you a front-row seat. The staff is trained to guide diners through these varietals, and the pairings with the seafood-forward menu are natural and often revelatory.',
      },
      {
        title: 'The Experience',
        body: 'Greek seafood is the backbone of the menu: whole grilled fish, octopus, prawns, and preparations that let the ingredients lead. The Buckhead setting is polished, and the hospitality carries that Greek warmth that makes you feel like a guest rather than a customer. The wine experience here is as much educational as it is enjoyable.',
      },
      {
        title: 'Why Wild Card',
        body: 'Committing 90% of your wine list to a single country that most American diners cannot identify on a wine map is the definition of a Wild Card. But Greek wine is the most exciting undervalued category in the world right now, and Kyma is the best place in Atlanta to discover it. Go with an open mind. Order the Assyrtiko. Thank us later.',
      },
    ],
    bottomLine: 'Kyma is the Greek wine education Atlanta needed. 90% Greek list, expert staff, and seafood that demands these wines. The most regionally unique wine program in the city.',
    publishedAt: '2026-02-10',
  },
  {
    slug: 'le-colonial-atlanta',
    restaurant: 'Le Colonial',
    neighborhood: 'Buckhead',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'French-Vietnamese',
    badge: 'reliable',
    subtitle: '200 Selections That Bridge Two Cuisines',
    tags: ['200+ Selections', 'French-Vietnamese', 'Buckhead', 'Crossover List'],
    editorial: [
      {
        title: 'The Wine Program',
        body: 'Le Colonial carries over 200 selections built around the challenge of pairing wine with a menu that moves between French and Vietnamese influences. The list leans French (naturally) but includes enough aromatic whites and off-dry options to handle the lemongrass, ginger, and chili-forward dishes. Alsatian wines, Rieslings, and lighter Burgundies feature prominently, which is exactly the right call for this cuisine. A thoughtful list that solves a pairing problem most restaurants do not even attempt.',
      },
      {
        title: 'The Setting',
        body: 'Colonial-era Saigon aesthetic with palm trees, ceiling fans, and a second-floor lounge that feels transplanted from 1930s Vietnam. The atmosphere does heavy lifting, and the wine list supports it by staying elegant without being stuffy. Wine service is attentive and the staff understands the pairing challenges inherent in the menu.',
      },
      {
        title: 'The Play',
        body: 'Lean into the aromatic whites. Gewurztraminer, Riesling, and Vouvray work brilliantly with the Vietnamese side of the menu. If you default to Cabernet here, you are fighting the food. Trust the list\'s design and order what it is built to do: bridge two cuisines with a single glass.',
      },
    ],
    bottomLine: 'Le Colonial has a wine list built to solve one of the hardest pairing challenges in dining: matching wine to Vietnamese flavors. 200 selections, French-leaning, and smarter than most lists twice its size.',
    publishedAt: '2026-02-10',
  },
  {
    slug: 'capolinea-atlanta',
    restaurant: 'Capolinea',
    neighborhood: 'Inman Park',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'Italian',
    badge: 'wildcard',
    subtitle: '175 Italian-Centric Labels and a Neighborhood Vibe',
    tags: ['175 Labels', 'Italian-Centric', 'Inman Park', 'Neighborhood Wine Bar'],
    editorial: [
      {
        title: 'The Wine Program',
        body: 'Capolinea runs 175 labels with a heavy Italian lean, but the buying here is more adventurous than the number suggests. The list features small Italian producers that do not show up on other Atlanta wine lists, along with enough French and domestic options to keep non-Italian-wine drinkers engaged. The by-the-glass program rotates frequently and often features wines the buyer discovered on buying trips. This is a list curated by someone who drinks the inventory.',
      },
      {
        title: 'The Restaurant',
        body: 'Inman Park location with the energy of a neighborhood wine bar that serves excellent Italian food. Handmade pasta, charcuterie, and the kind of small plates that make you order a second glass before you planned to. The vibe is casual and the wine pricing reflects a neighborhood restaurant rather than a destination spot.',
      },
      {
        title: 'Why Wild Card',
        body: 'Capolinea does not have the biggest Italian list in Atlanta, but it might have the most interesting one. The buying is personal and the selections reflect taste rather than market expectations. If you want to discover Italian wine you have not tried before, this 175-label list will surprise you more than lists three times its size.',
      },
    ],
    bottomLine: 'Capolinea is the Italian wine Wild Card in Atlanta. 175 labels, personal buying, and a neighborhood vibe that makes exploration feel natural. Smaller list, bigger discoveries.',
    publishedAt: '2026-02-10',
  },
  {
    slug: 'lyla-lila-atlanta',
    restaurant: 'Lyla Lila',
    neighborhood: 'Midtown',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'New American',
    badge: 'wildcard',
    subtitle: 'Organic and Biodynamic Only. James Beard Nominee.',
    tags: ['All Organic/Biodynamic', 'James Beard Nominee', 'Midtown', 'Zero Compromise'],
    editorial: [
      {
        title: 'The Wine Program',
        body: 'Lyla Lila stocks exclusively organic and biodynamic wines. No exceptions. This is the most philosophically rigid wine program in Atlanta, and it works because the buying is excellent. The list spans multiple countries and regions but every bottle meets the same standard: organic or biodynamic certification. The result is a wine list that tastes different from any other restaurant in the city. Cleaner, more expressive, and often more interesting than conventional selections at the same price point.',
      },
      {
        title: 'The Restaurant',
        body: 'James Beard-nominated chef Craig Richards runs a seasonal, farm-driven kitchen that shares the same values as the wine program. The food is sourced from local farms and the menu changes frequently. The Midtown location is stylish without being pretentious, and the staff is passionate about the organic commitment without being preachy about it. Pairings here feel holistic because the entire operation shares a single philosophy.',
      },
      {
        title: 'Why Wild Card',
        body: 'An all-organic, all-biodynamic wine program is a Wild Card by definition. Lyla Lila eliminates a huge percentage of the world\'s wine production from consideration and still builds a list worth exploring. The James Beard recognition confirms that the gamble is working. If you care about sustainability and want your wine to reflect that, there is no other choice in Atlanta.',
      },
    ],
    bottomLine: 'Lyla Lila is the most uncompromising wine program in Atlanta. 100% organic and biodynamic, James Beard-nominated kitchen, and a list that proves sustainability and quality are the same thing.',
    publishedAt: '2026-02-10',
  },
  {
    slug: 'madeira-park-atlanta',
    restaurant: 'Madeira Park',
    neighborhood: 'East Atlanta',
    city: 'Atlanta',
    citySlug: 'atlanta',
    cuisineType: 'Portuguese / Mediterranean',
    badge: 'wildcard',
    subtitle: 'The Hidden Wine List Creating the Most Buzz in Atlanta',
    tags: ['Hidden Gem', 'Portuguese', 'East Atlanta', 'Newest Buzz'],
    editorial: [
      {
        title: 'The Wine Program',
        body: 'Madeira Park is the newest wine buzz in Atlanta, and the list is the reason. The program leans Portuguese and Mediterranean with selections that most Atlanta diners have never encountered. Portuguese reds, Vinho Verde, Madeira (obviously), and Mediterranean whites that pair with the kitchen\'s coastal-influenced menu. The list is not large, but every bottle feels like a discovery. This is what happens when a restaurant builds a wine program around a cuisine rather than around what sells.',
      },
      {
        title: 'The Story',
        body: 'East Atlanta location with the energy of a neighborhood restaurant that is becoming a destination. The food is Portuguese and Mediterranean influenced, and the wine program was designed alongside the menu rather than after it. That integration shows in every pairing. The staff is excited about the list in the way that only happens when a program is new and the team is genuinely proud of what they have built.',
      },
      {
        title: 'Why Wild Card',
        body: 'Portuguese wine is one of the most undervalued categories in the world. Madeira Park is betting that Atlanta is ready to discover it. Based on the early buzz, that bet is correct. Go now, while the list is still a discovery and before everyone else figures it out. This is the most exciting new wine program in Atlanta.',
      },
    ],
    bottomLine: 'Madeira Park is the most exciting new wine program in Atlanta. Portuguese and Mediterranean focus, discovery-driven list, and the kind of early buzz that turns neighborhood restaurants into destinations.',
    publishedAt: '2026-02-10',
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
