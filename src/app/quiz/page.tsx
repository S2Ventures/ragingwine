'use client';

import { useState } from 'react';
import Link from 'next/link';
import Newsletter from '@/components/Newsletter';

type BadgeResult = 'rager' | 'wildcard' | 'reliable' | 'lazyslayer';

interface Question {
  question: string;
  subtitle: string;
  options: { label: string; emoji: string; scores: Record<BadgeResult, number> }[];
}

const questions: Question[] = [
  {
    question: 'The wine list lands on the table. What do you do?',
    subtitle: 'Be honest. We won\'t judge. (Much.)',
    options: [
      {
        label: 'Flip straight to the by-the-glass section and start asking questions',
        emoji: '\uD83D\uDD0D',
        scores: { rager: 3, wildcard: 1, reliable: 0, lazyslayer: 0 },
      },
      {
        label: 'Look for something I\'ve never heard of and order it blind',
        emoji: '\uD83C\uDFB2',
        scores: { rager: 1, wildcard: 3, reliable: 0, lazyslayer: 0 },
      },
      {
        label: 'Find a familiar grape from a region I trust and go with that',
        emoji: '\u2714\uFE0F',
        scores: { rager: 0, wildcard: 0, reliable: 3, lazyslayer: 1 },
      },
      {
        label: 'Panic, stall, then ask what everyone else is having',
        emoji: '\uD83D\uDE05',
        scores: { rager: 0, wildcard: 0, reliable: 1, lazyslayer: 3 },
      },
    ],
  },
  {
    question: 'Your server says "we have a great Zweigelt by the glass." Your move?',
    subtitle: 'Zweigelt is Austrian. But that\'s not the point.',
    options: [
      {
        label: '"Tell me everything. What does it taste like? What\'s it near on the list?"',
        emoji: '\uD83E\uDD13',
        scores: { rager: 3, wildcard: 1, reliable: 0, lazyslayer: 0 },
      },
      {
        label: '"I have no idea what that is. Pour it."',
        emoji: '\uD83D\uDE08',
        scores: { rager: 1, wildcard: 3, reliable: 0, lazyslayer: 0 },
      },
      {
        label: '"Interesting, but I\'ll stick with the Pinot Noir I know I like"',
        emoji: '\uD83E\uDD1D',
        scores: { rager: 0, wildcard: 0, reliable: 3, lazyslayer: 1 },
      },
      {
        label: '"I\'ll just have whatever red you recommend" (internally screaming)',
        emoji: '\uD83D\uDE48',
        scores: { rager: 0, wildcard: 0, reliable: 1, lazyslayer: 3 },
      },
    ],
  },
  {
    question: 'What kind of food are you pairing with tonight?',
    subtitle: 'Your dinner tells us a lot about your wine soul.',
    options: [
      {
        label: 'Chef\'s tasting menu with wine pairings already selected',
        emoji: '\uD83C\uDF7D\uFE0F',
        scores: { rager: 3, wildcard: 1, reliable: 1, lazyslayer: 0 },
      },
      {
        label: 'Something spicy, funky, or from a cuisine I can\'t pronounce',
        emoji: '\uD83C\uDF36\uFE0F',
        scores: { rager: 1, wildcard: 3, reliable: 0, lazyslayer: 0 },
      },
      {
        label: 'A well-executed steak, seafood, or pasta. The classics.',
        emoji: '\uD83E\uDD69',
        scores: { rager: 0, wildcard: 0, reliable: 3, lazyslayer: 1 },
      },
      {
        label: 'Honestly? I\'m here for the appetizers and the vibe',
        emoji: '\uD83C\uDF78',
        scores: { rager: 0, wildcard: 1, reliable: 1, lazyslayer: 3 },
      },
    ],
  },
  {
    question: 'The bottle budget tonight. Where\'s your head at?',
    subtitle: 'No judgment. Great wine exists at every price.',
    options: [
      {
        label: '$80+ \u2014 I\'m here for an experience, not just a drink',
        emoji: '\uD83D\uDCB0',
        scores: { rager: 3, wildcard: 1, reliable: 0, lazyslayer: 0 },
      },
      {
        label: '$40\u201380 \u2014 I want quality but I\'m watching the markup',
        emoji: '\uD83E\uDDEE',
        scores: { rager: 1, wildcard: 1, reliable: 3, lazyslayer: 0 },
      },
      {
        label: 'Under $40 \u2014 best value on the list, that\'s my lane',
        emoji: '\uD83C\uDFAF',
        scores: { rager: 0, wildcard: 2, reliable: 1, lazyslayer: 2 },
      },
      {
        label: 'By the glass only \u2014 commitment is not my strong suit',
        emoji: '\uD83C\uDF77',
        scores: { rager: 0, wildcard: 1, reliable: 1, lazyslayer: 3 },
      },
    ],
  },
  {
    question: 'Your ideal wine evening looks like...',
    subtitle: 'Close your eyes. (After you pick one.)',
    options: [
      {
        label: 'A tasting flight at a wine bar where the sommelier picks for me',
        emoji: '\u2728',
        scores: { rager: 3, wildcard: 2, reliable: 0, lazyslayer: 0 },
      },
      {
        label: 'A hidden gem restaurant in a neighborhood I\'ve never explored',
        emoji: '\uD83D\uDDFA\uFE0F',
        scores: { rager: 1, wildcard: 3, reliable: 0, lazyslayer: 0 },
      },
      {
        label: 'My favorite spot, my usual table, a bottle I know will deliver',
        emoji: '\uD83C\uDFE0',
        scores: { rager: 0, wildcard: 0, reliable: 3, lazyslayer: 1 },
      },
      {
        label: 'Anywhere with outdoor seating, decent wine, and no pretension',
        emoji: '\u2600\uFE0F',
        scores: { rager: 0, wildcard: 1, reliable: 1, lazyslayer: 3 },
      },
    ],
  },
  {
    question: 'The moment of truth: how did your last wine order go?',
    subtitle: 'We\'ve all been there.',
    options: [
      {
        label: 'Found an incredible bottle the table talked about all night',
        emoji: '\uD83D\uDD25',
        scores: { rager: 3, wildcard: 1, reliable: 0, lazyslayer: 0 },
      },
      {
        label: 'Took a risk on something weird and it totally paid off',
        emoji: '\uD83C\uDF89',
        scores: { rager: 1, wildcard: 3, reliable: 0, lazyslayer: 0 },
      },
      {
        label: 'Picked something solid. No complaints, no surprises. Job done.',
        emoji: '\uD83D\uDC4D',
        scores: { rager: 0, wildcard: 0, reliable: 3, lazyslayer: 0 },
      },
      {
        label: 'Ended up with the second cheapest bottle. Again.',
        emoji: '\uD83D\uDE29',
        scores: { rager: 0, wildcard: 0, reliable: 1, lazyslayer: 3 },
      },
    ],
  },
];

const resultData: Record<BadgeResult, {
  badge: string;
  emoji: string;
  title: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  superpower: string;
  weakness: string;
  advice: string;
  reviewFilter: string;
}> = {
  rager: {
    badge: 'The Rager',
    emoji: '\uD83D\uDD25',
    title: 'You\'re a Rager',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description: 'You don\'t just drink wine \u2014 you hunt for it. A 200-selection list is foreplay. You\'ve asked a sommelier to "surprise you" and meant it. You are the person your friends text when they need a restaurant recommendation, and you always have one ready.',
    superpower: 'You can spot a great wine program from the parking lot.',
    weakness: 'You sometimes spend $90 on a bottle when the $45 one was the better call.',
    advice: 'You don\'t need us to tell you what to order. But we can show you where the Rager-rated lists are hiding.',
    reviewFilter: 'rager',
  },
  wildcard: {
    badge: 'The Wild Card',
    emoji: '\uD83C\uDFB2',
    title: 'You\'re a Wild Card',
    color: 'text-wine-600',
    bgColor: 'bg-wine-50',
    borderColor: 'border-wine-200',
    description: 'You\'d rather drink something weird and interesting than something safe and boring. You\'ve ordered a wine because you liked the label, and it worked out more often than it should have. Sommeliers love you because you actually listen to their recommendations.',
    superpower: 'You find the one great bottle everyone else walks past.',
    weakness: 'That Moldovan orange wine at the airport bar was a swing too far.',
    advice: 'We flag the Wild Card restaurants for exactly your energy. Exciting lists with genuine surprises.',
    reviewFilter: 'wildcard',
  },
  reliable: {
    badge: 'The Reliable',
    emoji: '\u2714\uFE0F',
    title: 'You\'re a Reliable',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'You know what you like and you\'re not embarrassed about it. When the list has 150 options, you zero in on the three that match your palate and pick the best value. You\'re the person who orders wine for the table and nobody ever complains.',
    superpower: 'Consistent picks that never disappoint.',
    weakness: 'You haven\'t tried a new grape varietal since 2019.',
    advice: 'We\'ll show you the Reliable lists where your strategy works best \u2014 and occasionally nudge you toward a Wild Card pick you\'ll actually love.',
    reviewFilter: 'reliable',
  },
  lazyslayer: {
    badge: 'The Corporate List Slayer',
    emoji: '\u2694\uFE0F',
    title: 'You\'re a Corporate List Slayer',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    description: 'You\'ve been burned by bad wine lists so many times that you\'ve developed a sixth sense for them. You can spot a lazy, overpriced, distributor-driven list from across the restaurant. You\'re not a wine newbie \u2014 you\'re a wine skeptic. And honestly? That\'s a superpower.',
    superpower: 'You never overpay. Your markup radar is military-grade.',
    weakness: 'Sometimes you skip the wine entirely because you assume the worst. Don\'t let the Corporate Wine List win.',
    advice: 'We built Raging Wine for you. We call out the Lazy Lists so you don\'t have to gamble, and point you straight to the lists worth trusting.',
    reviewFilter: 'reliable',
  },
};

function calculateResult(answers: number[]): BadgeResult {
  const totals: Record<BadgeResult, number> = { rager: 0, wildcard: 0, reliable: 0, lazyslayer: 0 };
  answers.forEach((answerIdx, questionIdx) => {
    const scores = questions[questionIdx].options[answerIdx].scores;
    (Object.keys(scores) as BadgeResult[]).forEach(key => {
      totals[key] += scores[key];
    });
  });
  return (Object.entries(totals) as [BadgeResult, number][]).sort((a, b) => b[1] - a[1])[0][0];
}

export default function QuizPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<BadgeResult | null>(null);
  const [animating, setAnimating] = useState(false);

  const handleSelect = (optionIdx: number) => {
    if (animating) return;
    setSelectedOption(optionIdx);
    setAnimating(true);

    setTimeout(() => {
      const newAnswers = [...answers, optionIdx];
      setAnswers(newAnswers);

      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelectedOption(null);
        setAnimating(false);
      } else {
        setResult(calculateResult(newAnswers));
        setAnimating(false);
      }
    }, 600);
  };

  const restart = () => {
    setCurrentQ(0);
    setAnswers([]);
    setSelectedOption(null);
    setResult(null);
  };

  // Result screen
  if (result) {
    const r = resultData[result];
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{r.emoji}</div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-brand-dark mb-2">
            {r.title}
          </h1>
          <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${r.bgColor} ${r.color} ${r.borderColor} border`}>
            {r.badge}
          </div>
        </div>

        <div className="space-y-6 mb-10">
          <p className="text-gray-700 text-center leading-relaxed">
            {r.description}
          </p>

          <div className={`${r.bgColor} rounded-xl p-6 space-y-4`}>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Your Superpower</p>
              <p className="text-gray-800 font-medium">{r.superpower}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Your Kryptonite</p>
              <p className="text-gray-800 font-medium">{r.weakness}</p>
            </div>
          </div>

          <div className="bg-brand-cream rounded-xl p-6 border border-gray-200">
            <p className="text-xs uppercase tracking-wider text-wine-600 font-semibold mb-2">What Raging Wine Says</p>
            <p className="text-gray-700 leading-relaxed">{r.advice}</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3 mb-10">
          <Link
            href={`/reviews`}
            className="block w-full text-center px-6 py-3 bg-wine-500 text-white rounded-lg font-semibold text-sm hover:bg-wine-700 transition-colors"
          >
            See {r.badge} Reviews {r.emoji}
          </Link>
          <Link
            href="/wineries"
            className="block w-full text-center px-6 py-3 bg-brand-dark text-white rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors"
          >
            Explore Wineries Near You
          </Link>
          <button
            onClick={restart}
            className="block w-full text-center px-6 py-3 bg-white text-gray-600 rounded-lg font-semibold text-sm border border-gray-200 hover:border-gray-300 transition-colors"
          >
            Retake the Quiz
          </button>
        </div>

        {/* Newsletter */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500 mb-4">
            Get weekly wine list picks matched to your {r.badge} energy.
          </p>
          <Newsletter />
        </div>
      </div>
    );
  }

  // Quiz screen
  const q = questions[currentQ];
  const progress = ((currentQ) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-wine-500 font-semibold text-sm uppercase tracking-wider mb-2">
          The Raging Wine Quiz
        </p>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-brand-dark mb-2">
          What&apos;s Your Wine Personality?
        </h1>
        <p className="text-gray-500 text-sm">
          6 questions. No wrong answers. Mild roasting guaranteed.
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>Question {currentQ + 1} of {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-wine-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-brand-dark mb-1">
          {q.question}
        </h2>
        <p className="text-sm text-gray-400 italic">{q.subtitle}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {q.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={animating}
              className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-300 ${
                isSelected
                  ? 'border-wine-500 bg-wine-50 scale-[1.02]'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              } ${animating && !isSelected ? 'opacity-40' : ''}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5">{option.emoji}</span>
                <span className={`text-sm font-medium ${isSelected ? 'text-wine-700' : 'text-gray-700'}`}>
                  {option.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-gray-300 mt-10">
        No data collected. No accounts. Just wine vibes.
      </p>
    </div>
  );
}
