import { ReviewItem, LoyaltyProfile } from '../types';

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-01',
    author: 'Elena Rostova',
    verifiedBuyer: true,
    rating: 5,
    date: '3 days ago',
    skinType: 'Combination / Sensitive',
    ageRange: '25-34',
    title: 'The texture is like whipped silk — transformed my skin texture in 10 days!',
    comment: 'I was hesitant about changing my moisturizer, but the 3D viewer let me inspect the ingredients and texture before purchasing. The Radiance Gel Cream absorbs instantly with zero tacky residue. My redness calmed down completely and my makeup sits so smoothly over it.',
    helpfulCount: 42,
    resultsTimeline: 'Glow seen within 7 days',
    attributes: {
      texture: 5,
      absorption: 5,
      scent: 5,
      hydration: 5
    },
    productVariant: 'Radiance Gel Cream'
  },
  {
    id: 'rev-02',
    author: 'Priya Sharma',
    verifiedBuyer: true,
    rating: 5,
    date: '1 week ago',
    skinType: 'Normal to Dry',
    ageRange: '35-44',
    title: 'The rose gold lid with custom engraving arrived gorgeous! Plus safe INR payment.',
    comment: 'The checkout was super smooth using UPI in Indian Rupees! The automated invoice came directly to my email with tracking updates. The Glow Night Cream is so decadent, woke up with dewy, plump skin without feeling oily.',
    helpfulCount: 29,
    resultsTimeline: 'Overnight glow',
    attributes: {
      texture: 5,
      absorption: 5,
      scent: 5,
      hydration: 5
    },
    productVariant: 'Glow Night Cream'
  },
  {
    id: 'rev-03',
    author: 'Marcus Vance',
    verifiedBuyer: true,
    rating: 5,
    date: '2 weeks ago',
    skinType: 'Oily / Blemish-Prone',
    ageRange: '18-24',
    title: 'Zero shine, all glow. Best Niacinamide formula on the market.',
    comment: 'The AR camera view let me see how it would look on my bathroom vanity shelf before buying. The green tea and niacinamide combination balances my T-zone all afternoon while keeping my skin barrier so healthy.',
    helpfulCount: 19,
    resultsTimeline: '14 days oil control',
    attributes: {
      texture: 5,
      absorption: 5,
      scent: 4,
      hydration: 5
    },
    productVariant: 'Radiance Gel Cream'
  },
  {
    id: 'rev-04',
    author: 'Sophie Lemoine',
    verifiedBuyer: true,
    rating: 4,
    date: '3 weeks ago',
    skinType: 'Dry & Sensitive',
    ageRange: '45-54',
    title: 'Exceptional sustainable packaging and clean botanicals',
    comment: 'I love that the jar is refillable and printed with soy ink! The walnut & rice scrub is micro-fine and never scratches the skin. FreshGlow is truly setting the standard for transparent luxury skincare.',
    helpfulCount: 15,
    resultsTimeline: 'Instant softness',
    attributes: {
      texture: 4,
      absorption: 5,
      scent: 5,
      hydration: 4
    },
    productVariant: 'Renew Exfoliating Scrub'
  }
];

export const INITIAL_LOYALTY: LoyaltyProfile = {
  points: 250,
  tier: 'Sprout',
  nextTierPoints: 500,
  reviewsSubmitted: 2,
  jarsRecycled: 3,
  unlockedPerks: [
    'Free Carbon-Neutral Express Shipping',
    'Exclusive Seasonal Sample Tubes',
    'Double Points on Refill Jars'
  ]
};
