import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Build a Wine Program That Earns The Rager | Raging Wine',
  description:
    'A straight-talk guide for restaurant operators on building a wine program worth bragging about. The six metrics we evaluate and how to nail every one.',
};

export default function GuideToSuccessPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-500">
        <Link href="/" className="hover:text-wine-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/submit" className="hover:text-wine-600">For Restaurants</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Guide</span>
      </nav>

      {/* Header */}
      <header className="mb-12">
        <p className="text-sm font-bold uppercase tracking-widest text-wine-600 mb-3">
          The Raging Wine Playbook
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-dark leading-tight mb-4">
          How to Build a Wine Program Worth Bragging About
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed">
          You already know your food. You know your neighborhood. This guide is about
          making your wine list punch as hard as the rest of your operation. Consider it
          a conversation over a glass of something good.
        </p>
      </header>

      {/* Intro */}
      <section className="mb-12">
        <p className="text-gray-700 leading-relaxed mb-4">
          We review restaurant wine lists. Not menus. Not service. Not ambiance. Just
          the wine program: what you pour, how you price it, how you present it, and
          whether anyone on your staff can actually talk about it.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          Every restaurant we visit gets rated on six metrics. We call them the Wingman
          Metrics, and they add up to one of four badges. We&apos;re going to walk you
          through all of it right here, because we&apos;d rather you build something great
          than catch you off guard.
        </p>
        <p className="text-gray-700 leading-relaxed">
          This isn&apos;t a checklist from a consulting firm. It&apos;s what we actually
          look for when we sit down at your bar and open the wine list. Think of it as
          the friend who works in the industry telling you what they&apos;d do if it were
          their restaurant.
        </p>
      </section>

      {/* The Badges */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-brand-dark mb-6">The Four Badges</h2>
        <div className="space-y-4">
          <div className="border border-yellow-200 bg-yellow-50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔥</span>
              <h3 className="font-bold text-lg text-yellow-800">The Rager</h3>
            </div>
            <p className="text-yellow-800 text-sm leading-relaxed">
              An exceptional wine program. The list is interesting, the pricing is fair,
              the staff knows their stuff, and you can tell someone put real thought into
              every bottle on that page. This is the restaurant we tell everyone about. Worth
              traveling for.
            </p>
          </div>

          <div className="border border-red-200 bg-red-50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎲</span>
              <h3 className="font-bold text-lg text-red-800">The Wild Card</h3>
            </div>
            <p className="text-red-800 text-sm leading-relaxed">
              Exciting finds and unique selections. Maybe the list is small but every
              bottle is a gem. Maybe there&apos;s a wildly good by-the-glass pour next to a few
              head-scratchers. High reward, a little inconsistent. We dig the energy.
            </p>
          </div>

          <div className="border border-blue-200 bg-blue-50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">✔️</span>
              <h3 className="font-bold text-lg text-blue-800">The Reliable</h3>
            </div>
            <p className="text-blue-800 text-sm leading-relaxed">
              Solid program. Good selections, fair pricing, nothing that makes you wince.
              You won&apos;t discover anything new, but you won&apos;t get burned either. A lot
              of good restaurants live here, and there&apos;s no shame in it.
            </p>
          </div>

          <div className="border border-gray-200 bg-gray-50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">❌</span>
              <h3 className="font-bold text-lg text-gray-600">The Lazy List</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              The wine list is an afterthought. Overpriced, boring, or neglected. These
              are the programs where someone called a distributor rep, said &ldquo;just
              send me whatever,&rdquo; and never looked at it again. Your guests deserve
              better. You can do better.
            </p>
          </div>
        </div>
      </section>

      {/* The Six Metrics */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-brand-dark mb-2">The Six Wingman Metrics</h2>
        <p className="text-gray-500 mb-8">
          This is exactly what we evaluate. No secrets, no gotchas.
        </p>

        {/* Metric 1 */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-brand-dark mb-2">
            1. List Variety
          </h3>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Deep &amp; Eclectic · Solid Range · Plays It Safe · Grocery Store
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            This is the big one. Your wine list is a reflection of your taste, your
            curiosity, and your respect for the people sitting at your tables.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            A great list doesn&apos;t need to be huge. Ten bottles that are carefully chosen
            beat fifty bottles that a distributor rep picked for you. And that&apos;s the
            real trap: your rep is working a quota. They&apos;re incentivized to move volume,
            not to curate your identity. If your list reads like a greatest-hits sampler
            from one distributor&apos;s book, your guests notice. Maybe not consciously, but
            they feel the sameness.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            Mix it up. Work with more than one distributor. Throw in a bottle from
            a region your guests haven&apos;t heard of. Put a Greek Assyrtiko next to
            your Chardonnay. Stock a Portuguese red nobody can pronounce. These are
            the bottles that start conversations, and conversations are what keep people
            at the table longer.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If you&apos;re a steakhouse, great. You need Cabernet. But you don&apos;t need
            four Napa Cabs and nothing else. Give us a Malbec from Cahors, a Ribera del
            Duero, a Barossa Shiraz. Show us you&apos;ve actually tasted things.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-brand-dark mb-2">
            2. Markup Fairness
          </h3>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Fair · Steep · Gouge
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            We know you have to make money on wine. We respect that. A 2.5-3x markup on
            bottles is industry standard and nobody should complain about it.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            Where it goes sideways: charging $18 for a glass of wine that retails at $10
            a bottle. Pricing a $12 wholesale bottle at $65 on the list. Marking up
            well-known wines aggressively because you think customers won&apos;t price-check.
            They do. Especially now.
          </p>
          <p className="text-gray-700 leading-relaxed">
            The restaurants that win here price their wine so people actually order it.
            Fair markup on bottles, reasonable pours by the glass, and maybe a half-price
            wine night or an industry-night deal. You make more money when people drink
            more wine. And people drink more wine when they don&apos;t feel robbed.
          </p>
        </div>

        {/* Metric 3 */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-brand-dark mb-2">
            3. Staff Knowledge
          </h3>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Knowledgeable &amp; Friendly · Willing but Green · Gatekeeper · MIA
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            Your servers are your wine program&apos;s last mile. A great list with a
            staff that can&apos;t speak to it is like a Ferrari with no one who knows how
            to drive it.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            We&apos;re not expecting every server to be a sommelier. &ldquo;Willing but
            Green&rdquo; is perfectly fine. If someone says &ldquo;I&apos;m not sure, but
            let me find out,&rdquo; that&apos;s great. What tanks a score: servers who
            clearly haven&apos;t tasted anything on the list, or who default to the most
            expensive bottle without asking what you like.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Run a tasting for your staff once a month. Let them try the wines. Give them
            two or three talking points per bottle. That small investment pays for itself
            every time a server confidently recommends a glass and the guest says yes.
          </p>
        </div>

        {/* Metric 4 */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-brand-dark mb-2">
            4. Glassware
          </h3>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Varietal Specific · Stemless Casual · Red Flag
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            Glassware is the silent signal. It tells your guest how seriously you take
            wine before they taste a single drop.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            You don&apos;t need Riedel Sommeliers at $50 a stem. Good, thin-lipped stemware
            with a decent bowl works. Even stemless is fine for a casual concept, as long
            as it&apos;s clean, appropriate, and not a juice glass.
          </p>
          <p className="text-gray-700 leading-relaxed">
            The red flag: serving a $60 bottle in the same thick-rimmed glass you use for
            water. If you&apos;re charging wine-list prices, the glass should feel like it
            belongs with the wine. It doesn&apos;t have to be expensive. It just has to not
            be embarrassing.
          </p>
        </div>

        {/* Metric 5 */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-brand-dark mb-2">
            5. Specials &amp; Deals
          </h3>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Active Program · Occasional · Set &amp; Forget
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            Half-price wine night. A rotating by-the-glass feature. A sommelier&apos;s
            pick of the week. A wine flight paired with your tasting menu. These things
            tell us you&apos;re actively working your wine program, not just maintaining it.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            The restaurants that score highest here treat wine like a living, breathing
            part of the experience. They rotate. They experiment. They give guests a
            reason to come back and see what&apos;s new.
          </p>
          <p className="text-gray-700 leading-relaxed">
            And here&apos;s the business case: wine specials drive traffic on slow nights.
            A well-promoted half-price bottle night fills seats on a Tuesday. A featured
            pairing upsells an appetizer into a wine sale. Wine isn&apos;t just margin. It&apos;s
            a marketing tool.
          </p>
        </div>

        {/* Metric 6 */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-brand-dark mb-2">
            6. Storage &amp; Temperature
          </h3>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Proper · Acceptable · Hot Mess
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            We check. White wine should be cold. Red wine should not be warm. If
            you&apos;re storing bottles next to the kitchen heat lamp, we&apos;re going to
            notice.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Proper storage doesn&apos;t require a $20,000 wine room. A temperature-controlled
            cooler, a spot away from direct heat and light, and serving whites and
            sparkling at the right temperature covers 90% of it. The last 10% is caring
            enough to check.
          </p>
        </div>
      </section>

      {/* The Real Talk */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-brand-dark mb-4">
          The Part Nobody Else Will Tell You
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Your guests are more adventurous than you think. The restaurant industry has
          this persistent belief that customers only want safe, familiar wines. That if
          you don&apos;t stock Kendall-Jackson Chardonnay and Meiomi Pinot Noir, people will
          revolt. That&apos;s not true. It was barely true ten years ago and it&apos;s definitely
          not true now.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          Your guests will be a function of your offerings. Stock interesting wine and
          you attract people who want interesting wine. Stock boring wine and you attract
          people who want boring wine, and those people don&apos;t spend as much, don&apos;t come
          back as often, and don&apos;t tell their friends about you.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          Don&apos;t just take your distributor rep&apos;s recommendation at face value. They
          have targets to hit. They&apos;re going to push whatever they&apos;re overstocked on
          or whatever earns them the best commission. That doesn&apos;t make them bad people.
          It makes them salespeople. Your job is to be the curator, not the customer.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Taste everything before it goes on your list. Ask for samples. Work with
          importers who specialize in smaller producers. Visit a wine shop you admire
          and ask what they&apos;d put on a 20-bottle restaurant list. The people who geek
          out about wine will geek out about helping you build a great program.
        </p>
      </section>

      {/* The Quick Wins */}
      <section className="mb-12 bg-wine-50 border border-wine-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-wine-800 mb-4">
          Five Moves That Immediately Improve Your Wine Program
        </h2>
        <div className="space-y-3 text-wine-700 text-sm leading-relaxed">
          <p>
            <span className="font-bold">Add one wine nobody&apos;s heard of.</span>{' '}
            A Portuguese red, a Greek white, an Austrian Grüner Veltliner. Just one.
            Put it at a great price. Watch what happens when your servers get excited
            about recommending it.
          </p>
          <p>
            <span className="font-bold">Run a monthly staff tasting.</span>{' '}
            Open three bottles. Let everyone taste. Give them two sentences to describe
            each wine. Your staff&apos;s confidence is your program&apos;s confidence.
          </p>
          <p>
            <span className="font-bold">Start a half-price wine night.</span>{' '}
            Pick your slowest night. Offer bottles at half off. You fill seats, you move
            inventory, you build a reputation as the place where wine is accessible. It
            costs you almost nothing because those seats were empty anyway.
          </p>
          <p>
            <span className="font-bold">Check your glass temperature.</span>{' '}
            Right now. Walk to your bar and feel the white wine. If it&apos;s not cold,
            fix it today. This is the lowest-effort, highest-impact move on the list.
          </p>
          <p>
            <span className="font-bold">Put a story on the list.</span>{' '}
            Pick one wine and add a single line about it. &ldquo;From a family estate in
            Sicily&apos;s Mount Etna region. Volcanic soil, old vines, tastes like nowhere
            else.&rdquo; People buy stories. Give them one.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <p className="text-gray-500 mb-4">
          Ready to show us what you&apos;ve got?
        </p>
        <Link
          href="/submit"
          className="inline-block bg-wine-700 text-white px-8 py-3.5 rounded-lg font-bold text-lg hover:bg-wine-800 transition-colors"
        >
          Request a Vibe-Check
        </Link>
        <p className="text-xs text-gray-400 mt-3">
          Every restaurant gets a fair, honest review. We call it like we see it.
        </p>
      </section>
    </div>
  );
}
