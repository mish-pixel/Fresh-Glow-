import React, { useState } from 'react';
import { ReviewItem, LoyaltyProfile } from '../../types';
import { 
  Star, 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  ThumbsUp, 
  Award, 
  Recycle, 
  Gift, 
  MessageSquare, 
  Send, 
  ChevronDown 
} from 'lucide-react';

interface ReviewsAndLoyaltyProps {
  reviews: ReviewItem[];
  onAddReview: (review: ReviewItem) => void;
  loyalty: LoyaltyProfile;
  onEarnRecyclePoints: () => void;
  productName: string;
}

export const ReviewsAndLoyalty: React.FC<ReviewsAndLoyaltyProps> = ({
  reviews,
  onAddReview,
  loyalty,
  onEarnRecyclePoints,
  productName
}) => {
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  // Form State
  const [authorName, setAuthorName] = useState<string>('');
  const [starRating, setStarRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [skinType, setSkinType] = useState<string>('Combination');
  const [ageRange, setAgeRange] = useState<string>('25-34');
  const [resultsTimeline, setResultsTimeline] = useState<string>('7 days');
  const [variantReviewed, setVariantReviewed] = useState<string>('Radiance Gel Cream');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: authorName,
      verifiedBuyer: true,
      rating: starRating,
      date: 'Just now',
      skinType,
      ageRange,
      title: reviewTitle || 'Incredible glow and silky texture',
      comment,
      helpfulCount: 1,
      resultsTimeline: `Saw glow within ${resultsTimeline}`,
      attributes: {
        texture: 5,
        absorption: 5,
        scent: 5,
        hydration: 5
      },
      productVariant: variantReviewed
    };

    onAddReview(newRev);
    setSubmittedMessage('Thank you! Your feedback has been verified and +50 FreshGlow Points added to your account!');
    setShowReviewForm(false);
    // Reset
    setAuthorName('');
    setReviewTitle('');
    setComment('');
  };

  const filteredReviews = filterRating === 'all'
    ? reviews
    : reviews.filter((r) => r.rating === filterRating);

  return (
    <div className="space-y-8 my-8">
      {/* 1. FreshGlow Loyalty Loop & Circular Recycling Banner */}
      <div className="bg-gradient-to-r from-[#FAF9F5] via-[#F4EFE6] to-[#EAE3D2] rounded-3xl p-6 sm:p-8 border border-[#E8DCC0] shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left: Points & Tier */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-[#2E6B4E] text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-[#F2C7C1]" />
              FreshGlow Circular Loyalty Circle
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1A3324]">
              Tier: {loyalty.tier} Member
            </h3>
            <p className="text-xs text-gray-600 max-w-md">
              Earn reward points on purchases, verified customer reviews, and returning empty glass jars for recycling.
            </p>
            <div className="flex items-center gap-4 pt-1">
              <div className="bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-[#E8DCC0]">
                <span className="text-[10px] text-gray-500 block">Current Balance</span>
                <span className="text-lg font-bold text-[#2E6B4E]">{loyalty.points} Points</span>
              </div>
              <div className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">{loyalty.nextTierPoints - loyalty.points} pts</span> to reach Blooming Glow tier
              </div>
            </div>
          </div>

          {/* Right: Circular Recycling Action Loop */}
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-[#E8DCC0] space-y-3 w-full md:w-80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1A3324] flex items-center gap-1.5">
                <Recycle className="w-4 h-4 text-[#2E6B4E]" />
                Zero-Waste Jar Return
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                +100 Points
              </span>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Mail us your empty 50g glass jars with our prepaid eco label to receive 100 reward points and a free refill cap.
            </p>
            <button
              onClick={onEarnRecyclePoints}
              className="w-full py-2 bg-[#2E6B4E] hover:bg-[#1E4B35] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Recycle className="w-3.5 h-3.5" />
              <span>Log Empty Jar Return (+100 Pts)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Customer Satisfaction Scores Breakdown */}
      <div className="bg-white/95 rounded-3xl p-6 sm:p-8 border border-[#E8DCC0] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-3xl font-bold text-[#1A3324]">4.9</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                Based on {reviews.length + 380} verified reviews
              </span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1A3324] mt-1">
              Customer Satisfaction & Feedback Loop
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-[#D9896A] hover:bg-[#BC6E50] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Write a Review (+50 Points)</span>
            </button>
          </div>
        </div>

        {submittedMessage && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{submittedMessage}</span>
          </div>
        )}

        {/* 3. Review Submission Form (Collapsible) */}
        {showReviewForm && (
          <form
            onSubmit={handleSubmitReview}
            className="bg-[#FAF9F5] p-5 sm:p-6 rounded-2xl border border-[#E8DCC0] space-y-4 animate-in fade-in"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-base text-[#1A3324] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D9896A]" /> Share Your Skincare Experience
              </h4>
              <span className="text-[11px] text-[#2E6B4E] font-semibold">
                Earn 50 Points on submission
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#333333]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Formula Reviewed</label>
                <select
                  value={variantReviewed}
                  onChange={(e) => setVariantReviewed(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#333333]"
                >
                  <option value="Radiance Gel Cream">Radiance Gel Cream (50g)</option>
                  <option value="Glow Night Cream">Glow Night Cream (50g)</option>
                  <option value="Renew Exfoliating Scrub">Renew Exfoliating Scrub (50g)</option>
                  <option value="Sunshield Mineral SPF 50">Sunshield Mineral SPF 50 (50g)</option>
                  <option value="Vitamin C Face Serum">Vitamin C Face Serum (30ml)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Star Rating</label>
                <div className="flex gap-1 items-center bg-white p-2 rounded-xl border border-gray-200">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStarRating(star)}
                      className="p-0.5"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= starRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold ml-2 text-gray-700">{starRating} Stars</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Your Skin Type</label>
                <select
                  value={skinType}
                  onChange={(e) => setSkinType(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#333333]"
                >
                  <option value="Sensitive">Sensitive</option>
                  <option value="Combination">Combination</option>
                  <option value="Dry">Dry</option>
                  <option value="Oily">Oily</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Results Seen After</label>
                <select
                  value={resultsTimeline}
                  onChange={(e) => setResultsTimeline(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#333333]"
                >
                  <option value="Overnight">Overnight</option>
                  <option value="3 days">3 days</option>
                  <option value="7 days">7 days</option>
                  <option value="14 days">14 days</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Review Headline</label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Sum up your experience in a sentence"
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#333333]"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Detailed Review & Texture Feedback</label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How did the texture feel? Did it absorb well? Any changes in skin glow?"
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-[#333333]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#2E6B4E] hover:bg-[#1E4B35] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Verified Feedback (+50 Pts)</span>
              </button>
            </div>
          </form>
        )}

        {/* 4. Attribute Ratings Gauge Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E8DCC0]/60 text-center">
            <span className="text-xs text-gray-500">Whipped Texture</span>
            <div className="font-bold text-[#2E6B4E] text-base mt-0.5">5.0 / 5</div>
            <div className="w-full bg-gray-200 h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-[#2E6B4E] h-full w-[100%]" />
            </div>
          </div>
          <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E8DCC0]/60 text-center">
            <span className="text-xs text-gray-500">Fast Absorption</span>
            <div className="font-bold text-[#2E6B4E] text-base mt-0.5">4.9 / 5</div>
            <div className="w-full bg-gray-200 h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-[#2E6B4E] h-full w-[98%]" />
            </div>
          </div>
          <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E8DCC0]/60 text-center">
            <span className="text-xs text-gray-500">Natural Botanical Scent</span>
            <div className="font-bold text-[#2E6B4E] text-base mt-0.5">4.8 / 5</div>
            <div className="w-full bg-gray-200 h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-[#2E6B4E] h-full w-[96%]" />
            </div>
          </div>
          <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E8DCC0]/60 text-center">
            <span className="text-xs text-gray-500">Hydration Longevity</span>
            <div className="font-bold text-[#2E6B4E] text-base mt-0.5">5.0 / 5</div>
            <div className="w-full bg-gray-200 h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-[#2E6B4E] h-full w-[100%]" />
            </div>
          </div>
        </div>

        {/* 5. Verified Customer Reviews List */}
        <div className="space-y-4 pt-2">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-[#2E6B4E]/30 transition-colors shadow-2xs space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#EBF3EA] text-[#2E6B4E] flex items-center justify-center font-bold text-xs">
                    {rev.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-[#1A3324]">{rev.author}</span>
                      {rev.verifiedBuyer && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Verified Buyer
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {rev.skinType} Skin • Age {rev.ageRange}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400' : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400">{rev.date}</span>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-xs text-gray-900">{rev.title}</h5>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{rev.comment}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px]">
                <span className="bg-[#FAF9F5] px-2.5 py-0.5 rounded-full border border-[#E8DCC0] text-[#2E6B4E] font-medium">
                  {rev.productVariant} • {rev.resultsTimeline}
                </span>

                <div className="flex items-center gap-1 text-gray-400 hover:text-gray-600 cursor-pointer">
                  <ThumbsUp className="w-3 h-3" />
                  <span>Helpful ({rev.helpfulCount})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
