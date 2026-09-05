import React from 'react';
import { SkincareProduct, ProductVariant } from '../../types';
import { Sparkles, Shield, Heart, Droplets, Leaf, ArrowUpRight } from 'lucide-react';

interface EditorialShowcaseProps {
  product: SkincareProduct;
  selectedVariant: ProductVariant;
  onReturnToStudio: () => void;
}

export const EditorialShowcase: React.FC<EditorialShowcaseProps> = ({
  product,
  selectedVariant,
  onReturnToStudio
}) => {
  return (
    <div className="space-y-8 my-6">
      {/* Editorial Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#2E6B4E] to-[#1E4B35] text-white p-8 sm:p-12 shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-[#A7C4A1]">
            <span>🌿 FreshGlow Botanical Science</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
            Nourished by Nature, Glowing for You.
          </h2>
          <p className="text-sm text-gray-200 leading-relaxed">
            Harnessing wild-harvested Japanese green tea, bioactive niacinamide, and cold-pressed botanical oils.
            Zero parabens, zero petrochemicals, zero compromises.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onReturnToStudio}
              className="bg-[#D9896A] hover:bg-[#BC6E50] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inspect {selectedVariant?.name || 'Formula'} in 3D</span>
            </button>
          </div>
        </div>

        {/* Decorative botanical backdrop elements */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none flex items-center justify-center">
          <span className="text-9xl">🍃</span>
        </div>
      </div>

      {/* Clinical Results Section */}
      <div className="bg-white/95 rounded-3xl p-6 sm:p-8 border border-[#E8DCC0] shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h3 className="font-serif text-2xl font-bold text-[#1A3324]">
            Clinically Proven Botanical Efficacy
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Independent consumer perception study conducted over 28 days with 120 diverse participants.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E8DCC0]/60">
            <div className="font-serif text-4xl font-bold text-[#2E6B4E]">98%</div>
            <div className="text-xs font-semibold text-[#333333] mt-2">Visible Radiance Boost</div>
            <p className="text-[11px] text-gray-500 mt-1">
              Noticed smoother, dewy, glowing skin tone after only 14 days of twice-daily use.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E8DCC0]/60">
            <div className="font-serif text-4xl font-bold text-[#D9896A]">72h</div>
            <div className="text-xs font-semibold text-[#333333] mt-2">Deep Hydration Lock</div>
            <p className="text-[11px] text-gray-500 mt-1">
              Corneometer clinical measurements confirmed 3.4x skin moisture barrier reinforcement.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E8DCC0]/60">
            <div className="font-serif text-4xl font-bold text-[#2E6B4E]">100%</div>
            <div className="text-xs font-semibold text-[#333333] mt-2">Weightless Absorption</div>
            <p className="text-[11px] text-gray-500 mt-1">
              Agreed the whipped gel-cream texture melts seamlessly without oiliness or clogging pores.
            </p>
          </div>
        </div>
      </div>

      {/* Packaging & Planet Commitment */}
      <div className="bg-[#FAF9F5] rounded-3xl p-6 sm:p-8 border border-[#E8DCC0]">
        <h3 className="font-serif text-xl font-bold text-[#1A3324] mb-4 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-[#2E6B4E]" />
          Beauty that’s Good for You & Kind to Earth
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700">
          <div className="flex gap-3 bg-white p-4 rounded-xl border border-[#E8DCC0]/50">
            <span className="text-xl">🌿</span>
            <div>
              <span className="font-bold text-[#1A3324] block mb-0.5">Organic & Natural Ingredients</span>
              Cold-pressed organic actives sourced transparently from certified sustainable family farms.
            </div>
          </div>
          <div className="flex gap-3 bg-white p-4 rounded-xl border border-[#E8DCC0]/50">
            <span className="text-xl">🌱</span>
            <div>
              <span className="font-bold text-[#1A3324] block mb-0.5">Toxin Free & Clean Formulation</span>
              Formulated without sulfates, parabens, phthalates, synthetic dyes, or synthetic fragrances.
            </div>
          </div>
          <div className="flex gap-3 bg-white p-4 rounded-xl border border-[#E8DCC0]/50">
            <span className="text-xl">♻️</span>
            <div>
              <span className="font-bold text-[#1A3324] block mb-0.5">Recyclable Glass & Paper Tube</span>
              Infinitely recyclable frosted glass containers with soy-ink printed unboxing tubes.
            </div>
          </div>
          <div className="flex gap-3 bg-white p-4 rounded-xl border border-[#E8DCC0]/50">
            <span className="text-xl">🐰</span>
            <div>
              <span className="font-bold text-[#1A3324] block mb-0.5">Leaping Bunny Certified Cruelty Free</span>
              Never tested on animals at any stage of ingredient sourcing or product development.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
