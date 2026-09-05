import React from 'react';
import { ProductVariant } from '../../types';
import { GEL_CREAM_VARIANTS } from '../../data/products';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

interface VariantComparisonViewProps {
  selectedVariant: ProductVariant;
  onSelectVariant: (variant: ProductVariant) => void;
  formatPrice: (price: number) => string;
  onSwitchToStudio: () => void;
}

export const VariantComparisonView: React.FC<VariantComparisonViewProps> = ({
  selectedVariant,
  onSelectVariant,
  formatPrice,
  onSwitchToStudio
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#E8DCC0] shadow-sm my-6 space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <span className="bg-[#EBF3EA] text-[#2E6B4E] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Available in Multiple Variants
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A3324] mt-2">
          Compare the FreshGlow Organic Formulas
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Every jar is designed with sustainable frosted glass, an embossed gold lid, and clinical-grade clean botanicals.
        </p>
      </div>

      {/* Comparison Cards Grid (4 variants as in user's image) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {GEL_CREAM_VARIANTS.map((v) => {
          const isSelected = selectedVariant?.id === v.id;
          return (
            <div
              key={v.id}
              className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-[#2E6B4E] bg-[#F8FAF7] ring-2 ring-[#2E6B4E]/20 shadow-md transform -translate-y-1'
                  : 'border-[#E8DCC0] bg-white hover:border-[#2E6B4E]/40'
              }`}
            >
              <div>
                {/* Visual Jar Simulation Swatch */}
                <div className="relative h-28 rounded-xl flex items-center justify-center mb-4 overflow-hidden border border-[#E8DCC0]/50"
                     style={{ background: `linear-gradient(to bottom, #FAF8F4, ${v.jarColor})` }}>
                  {/* Jar Representation */}
                  <div className="w-20 h-16 rounded-b-lg rounded-t-sm shadow-md flex flex-col items-center justify-center relative border border-black/5"
                       style={{ backgroundColor: v.jarColor }}>
                    {/* Gold lid */}
                    <div className="w-22 h-4 rounded-t-sm absolute -top-4 shadow-sm flex items-center justify-center"
                         style={{ backgroundColor: v.lidColor }}>
                      <span className="text-[8px] text-[#5A3D0B]">🌿</span>
                    </div>
                    {/* Label */}
                    <div className="bg-[#F8F6EE] px-2 py-0.5 rounded text-[8px] font-bold text-[#2E6B4E] text-center shadow-xs">
                      {v.name.split(' ')[0]}
                    </div>
                  </div>
                  {isSelected && (
                    <span className="absolute top-2 right-2 bg-[#2E6B4E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-[#1A3324] text-base leading-tight">
                  {v.name}
                </h3>
                <p className="text-xs text-[#2E6B4E] font-medium mt-0.5 mb-2">
                  {v.tagline}
                </p>

                <div className="text-sm font-bold text-[#1A3324] mb-3">
                  {formatPrice(v.priceUSD)}
                  <span className="text-[11px] font-normal text-gray-500 ml-1.5">/ {v.netWeight}</span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-600 mb-4 border-t border-gray-100 pt-3">
                  <div className="text-[11px] font-semibold text-[#333333] mb-1">Key Actives:</div>
                  <p className="text-[11px] text-gray-700 bg-gray-50 p-2 rounded-lg leading-relaxed">
                    {v.activeIngredients}
                  </p>
                  <div className="text-[11px] font-semibold text-[#333333] pt-2 mb-1">Target Results:</div>
                  {v.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                      <Check className="w-3 h-3 text-[#2E6B4E] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onSelectVariant(v);
                    onSwitchToStudio();
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-[#2E6B4E] text-white shadow-xs'
                      : 'bg-white hover:bg-[#F6F4EC] border border-[#2E6B4E] text-[#2E6B4E]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSelected ? 'View in 3D WebGL' : 'Select & Inspect 3D'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
