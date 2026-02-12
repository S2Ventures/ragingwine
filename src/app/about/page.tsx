import Link from 'next/link';
import Newsletter from '@/components/Newsletter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Raging Wine',
  description: 'We review restaurant wine lists so you stop guessing and start drinking better. Meet the team behind Raging Wine.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-display font-bold text-brand-dark mb-8">
        About Raging Wine
      </h1>

      <div className="prose-sm text-gray-600 leading-relaxed space-y-6">
        <p className="text-lg text-gray-700">
          We review restaurant wine lists because nobody else does, and we think
          that&apos;s ridiculous.
        </p>

        <p>
          Food critics review the food. Interior designers judge the decor. Yelp reviewers
          photograph the parking lot. But the wine list? The thing you&apos;re about to
          spend $60 on with zero information? Nobody touches it.
        </p>

        <p>
          Raging Wine exists to fix that. We walk into restaurants, study their wine programs
          from glassware to pricing, and tell you exactly what to order, what to skip, and
          what the list says about how much the restaurant actually cares about wine.
        </p>

        <h2 className="text-xl font-bold text-brand-dark pt-4">The Enemy</h2>
        <p>
          Our enemy is the Corporate Wine List: the lazy, distributor-driven, overpriced
          list that treats wine as an afterthought. Five whites, five reds, all safe, all
          boring, all marked up 400%. It&apos;s the restaurant equivalent of a playlist
          curated by an algorithm that hates you.
        </p>
        <p>
          We believe every restaurant with a wine list has a responsibility to do better.
          And every diner who spends money on wine deserves honest information before they choose.
        </p>

        <h2 className="text-xl font-bold text-brand-dark pt-4">How We Rate</h2>
        <p>
          No stars. No 100-point scores. Every wine list gets a Vibe-Check Badge
          that tells you exactly what to expect: The Rager (exceptional), The Wild Card
          (adventurous and exciting), The Reliable (solid and fair), or The Lazy List
          (skip the wine).
        </p>
        <p>
          We also score six Wingman Metrics that tell you more about a wine program than
          any point score ever could: List Variety (real depth or grocery-store defaults),
          Markup Fairness (fair premium or highway robbery), Glassware Grade (varietal stems
          or red-flag plastics), Staff Confidence (knowledgeable wingman or actively unhelpful),
          Specials &amp; Deals (featured wines, half-price nights, or set-and-forget), and
          Storage &amp; Temp (proper cellar or bottles baking on top of the bar).
        </p>

        <h2 className="text-xl font-bold text-brand-dark pt-4">Where We Are</h2>
        <p>
          We&apos;re launching in three cities: Atlanta, Greenville (SC), and Key West (FL).
          Each city was chosen because the wine culture outpaces the wine media coverage.
          Great restaurants, interesting lists, and zero coverage. That&apos;s where we thrive.
        </p>

        <h2 className="text-xl font-bold text-brand-dark pt-4">Who We Are</h2>
        <p>
          Raging Wine is built by people who love wine but hate wine snobbery. We&apos;re
          not sommeliers. We&apos;re the people sitting at the table, trying to make a good
          decision with limited information and a menu that costs more than our electric bill.
        </p>
        <p>
          If that sounds like you, welcome. You found your people.
        </p>

        <h2 className="text-xl font-bold text-brand-dark pt-4">Want to Contribute?</h2>
        <p>
          We&apos;re building a network of local wine nerds who want to review wine lists in
          their cities. No formal credentials required. You just need a palate, an opinion,
          and the willingness to sit at a bar and take notes.
        </p>
        <p>
          Interested? Drop us a line at{' '}
          <a href="mailto:hello@ragingwine.com" className="text-wine-600 hover:text-wine-800 font-medium">
            hello@ragingwine.com
          </a>
        </p>
      </div>

      <div className="mt-12">
        <Newsletter />
      </div>
    </div>
  );
}
