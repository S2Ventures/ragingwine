/**
 * Backfill website URLs for restaurants in Sanity.
 *
 * Usage: npx tsx pipeline/scripts/backfill-websites.ts [--dry-run]
 *
 * Requires SANITY_WRITE_TOKEN in .env.local
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const client = createClient({
  projectId: 'qyap5sez',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const WEBSITE_MAP: Record<string, string> = {
  // === TAMPA (25) ===
  "717-south-restaurant-tampa": "https://www.717south.com/",
  "barcelona-wine-bar-tampa": "https://barcelonawinebar.com/location/tampa/",
  "cws-gin-joint-tampa": "https://cwginjoint.com/",
  "casa-santo-stefano-tampa": "https://casasantostefano.com/",
  "charleys-steak-house-tampa": "https://www.charleyssteakhouse.com/",
  "chateau-cellars-tampa": "https://chateaucellars.com/",
  "cipresso-tampa": "https://casino.hardrock.com/tampa/dining/cipresso",
  "cru-cellars-tampa": "https://www.crucellars.com/",
  "del-friscos-grille-tampa": "https://www.delfriscosgrille.com/",
  "donatello-tampa": "https://donatellotampa.com/",
  "flemings-prime-steakhouse-and-wine-bar-tampa": "https://www.flemingssteakhouse.com/",
  "forbici-modern-italian-tampa": "https://www.eatforbici.com/",
  "gemma-floral-wine-tampa": "https://floralandwine.com/",
  "harry-waugh-dessert-room-tampa": "https://bernssteakhouse.com/harry-waugh-dessert-room/",
  "haven-tampa": "https://haventampa.com/",
  "kona-grill-tampa-tampa": "https://konagrill.com/location/tampa-fl/",
  "la-vid-fine-wines-and-vinoteca-tampa": "https://lavidtampa.com/",
  "lilac-tampa": "https://www.lilacrestauranttampa.com/",
  "redneck-wine-company-tampa": "https://redneckwinecompany.com/",
  "rooster-and-the-till-tampa": "https://www.roosterandthetill.com/",
  "seasons-52-tampa": "https://www.seasons52.com/locations/fl/tampa/tampa/4511",
  "the-capital-grille-tampa": "https://www.thecapitalgrille.com/locations/fl/tampa/tampa/8022",
  "the-cork-room-tampa": "https://www.corkroomtampa.com/",
  "wine-on-water-tampa": "https://www.wineonwatertpa.com/",
  "edison-fooddrink-lab-tampa": "https://www.edison-tampa.com/",

  // === MIAMI (23 — 2 had null) ===
  "ariete-miami": "https://arietecoconutgrove.com/",
  "baoli-miami": "https://baoli.restaurant/",
  "bouchon-bistro-miami": "https://thomaskeller.com/coral-gables-florida/bouchon-bistro/",
  "contessa-miami-miami": "https://contessaristorante.com/miami",
  "delilah-miami": "https://www.delilahrestaurants.com/location/miami/",
  "fontainebleau-miami-beach-miami": "https://www.fontainebleau.com/miamibeach/dining/",
  "fooqs-miami": "https://fooqsmiami.com/",
  "hakkasan-miami-miami": "https://taogroup.com/venues/hakkasan-miami/",
  "itamae-miami": "https://www.itamaeao.com/",
  "joia-beach-miami": "https://joiabeachmiami.com/",
  "kk-hospitality-group-miami": "https://kkhospitalitygroup.com/",
  "klaw-miami": "https://www.klawrestaurant.com/",
  "lpm-restaurant-and-bar-miami": "https://lpmrestaurants.com/miami/",
  "luca-osteria-miami": "https://lucamiami.com/",
  "mastros-ocean-club-miami": "https://www.mastrosrestaurants.com/location/mastros-ocean-club-miami/",
  "pastis-miami": "https://pastismiami.com/",
  "pubbelly-wine-bar-miami": "https://www.pubbellyglobal.com/",
  "queen-miami-beach-miami": "https://queenmiamibeach.com/",
  "sra-martinez-miami": "https://www.sramartinezmiami.com/",
  "stubborn-seed-miami": "https://www.stubbornseed.com/miami",
  "the-surf-club-restaurant-miami": "https://www.surfclubrestaurant.com/",
  "torno-subito-miami-miami": "https://tornosubitomia.com/",
  "zaytinya-miami": "https://www.zaytinya.com/location/south-beach/",

  // === NEW ORLEANS (13) ===
  "chemin-la-mer-new-orleans": "https://www.cheminalamer.com/",
  "chophouse-new-orleans-prime-steaks-new-orleans": "https://chophousenola.com/",
  "clancys-new-orleans": "https://www.clancysneworleans.com/",
  "commanders-palace-new-orleans": "https://www.commanderspalace.com/",
  "emerils-new-orleans": "https://emerilsrestaurant.com/",
  "gw-fins-new-orleans": "https://www.gwfins.com/",
  "galatoires-new-orleans": "https://www.galatoires.com/",
  "mr-bs-bistro-new-orleans": "https://www.mrbsbistro.com/",
  "muriels-jackson-square-new-orleans": "https://muriels.com/",
  "ralphs-on-the-park-new-orleans": "https://www.ralphsonthepark.com/",
  "restaurant-august-new-orleans": "https://www.restaurantaugust.com/",
  "saffron-nola-new-orleans": "https://www.saffronnola.com",
  "the-pelican-club-new-orleans": "https://www.pelicanclub.com/",

  // === SAVANNAH (18 — 5 had null) ===
  "1540-room-at-the-desoto-savannah": "https://www.1540savannah.com/",
  "alligator-soul-savannah": "https://alligatorsoul.com/",
  "bar-julian-at-thompson-savannah-savannah": "https://www.barjulian.com/",
  "chart-house-restaurant-savannah-savannah": "https://www.chart-house.com/location/chart-house-savannah-ga/",
  "circa-1875-savannah": "https://circa1875.com/",
  "elizabeth-on-37th-savannah": "https://www.elizabethon37threstaurant.com/",
  "husk-savannah-savannah": "https://husksavannah.com/",
  "local-11ten-food-and-wine-savannah": "https://www.local11ten.com/",
  "noble-fare-savannah": "https://www.noblefare.com/",
  "ruths-chris-steak-house-savannah-savannah": "https://www.ruthschrisphg.com/savannah",
  "sobremesa-savannah": "https://www.sobremesasav.com/",
  "the-collins-quarter-savannah": "https://www.thecollinsquarter.com/",
  "the-emporium-kitchen-and-wine-market-savannah": "https://www.emporiumsavannah.com/",
  "the-fitzroy-savannah": "https://thefitzroysavannah.com/",
  "the-grey-savannah": "https://thegreyrestaurant.com/",
  "the-pirates-house-savannah": "https://thepirateshouse.com/",
  "vics-on-the-river-savannah": "https://www.vicsontheriver.com/",
  "westin-savannah-harbor-golf-resort-and-spa-river-concourse-savannah": "https://westinresortsavannah.com/",

  // === ASHEVILLE (24 — 3 had null) ===
  "5-walnut-cheese-bar-asheville": "https://www.5walnut.com/",
  "5-walnut-wine-bar-asheville": "https://www.5walnut.com/",
  "bargello-asheville": "https://bargelloavl.com/",
  "battery-park-book-exchange-asheville": "https://batteryparkbookexchange.com/",
  "battery-park-book-exchange-and-champagne-bar-asheville": "https://batteryparkbookexchange.com/",
  "biltmore-winery-wine-bar-asheville": "https://www.biltmore.com/visit/winery/",
  "bottle-riot-asheville": "https://www.bottleriot.com/",
  "buxton-hall-barbecue-asheville": "https://www.buxtonhall.com/",
  "carrabbas-italian-grill-asheville": "https://www.carrabbas.com/",
  "chestnut-asheville": "https://www.chestnutasheville.com/",
  "corner-kitchen-asheville": "https://thecornerkitchen.com/",
  "crate-asheville": "https://curatetapasbar.com/",
  "grove-arcade-wine-bars-asheville": "https://grovearcade.com/",
  "husk-asheville-asheville": "https://huskrestaurant.com/",
  "jerusalem-garden-cafe-asheville": "https://jerusalemgardencafe.com/",
  "metro-wines-asheville": "https://metrowinesasheville.com/",
  "posana-asheville": "https://posanarestaurant.com/",
  "posana-biltmore-park-asheville": "https://posanarestaurant.com/",
  "red-stag-grill-asheville": "https://www.redstaggrill.com/",
  "rhubarb-asheville": "https://rhubarbasheville.com/",
  "sunset-terrace-at-omni-grove-park-inn-asheville": "https://www.omnihotels.com/hotels/asheville-grove-park/dining/sunset-terrace",
  "the-admiral-asheville": "https://www.theadmiralasheville.com/",
  "white-duck-taco-shop-asheville": "https://whiteducktacoshop.com/",
  "zambra-asheville": "https://zambratapas.com/",
};

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const slugs = Object.keys(WEBSITE_MAP);

  console.log(`\n🔍 Backfilling websites for ${slugs.length} restaurants${dryRun ? ' (DRY RUN)' : ''}...\n`);

  // First, fetch all reviews that match these slugs and currently have no website
  const query = `*[_type == "review" && slug.current in $slugs && (!defined(website) || website == "")]{_id, slug, "restaurant": restaurant}`;
  const docs = await client.fetch(query, { slugs });

  console.log(`Found ${docs.length} Sanity documents needing website updates.\n`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const doc of docs) {
    const slug = doc.slug?.current;
    const url = WEBSITE_MAP[slug];

    if (!url) {
      console.log(`⏭️  Skip: ${doc.restaurant} — no URL in map`);
      skipped++;
      continue;
    }

    if (dryRun) {
      console.log(`🏷️  Would update: ${doc.restaurant} → ${url}`);
      updated++;
      continue;
    }

    try {
      await client.patch(doc._id).set({ website: url }).commit();
      console.log(`✅ Updated: ${doc.restaurant} → ${url}`);
      updated++;
    } catch (err: any) {
      console.error(`❌ Failed: ${doc.restaurant} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${updated} updated, ${skipped} skipped, ${failed} failed`);

  // Also update the local pipeline JSON files so future publishes don't overwrite
  console.log(`\n📁 Updating local pipeline JSON files...`);
  const fs = await import('fs');
  const glob = await import('glob');

  const reviewFiles = glob.sync('pipeline/data/runs/*-reviews-*.json');
  let filesUpdated = 0;

  for (const file of reviewFiles) {
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    if (!Array.isArray(data)) continue;

    let changed = false;
    for (const review of data) {
      if (review.slug && WEBSITE_MAP[review.slug] && !review.website) {
        review.website = WEBSITE_MAP[review.slug];
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(file, JSON.stringify(data, null, 2));
      filesUpdated++;
      console.log(`📝 Updated: ${file}`);
    }
  }

  console.log(`\n📁 ${filesUpdated} pipeline JSON files updated.`);
}

main().catch(console.error);
