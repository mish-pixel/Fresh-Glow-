import React from 'react';
import { 
  SkincareProduct, 
  ProductVariant, 
  LayoutMode, 
  CurrencyCode 
} from '../../types';
import { 
  Layers, 
  Sparkles, 
  Columns, 
  Grid, 
  Check, 
  Feather, 
  ShieldCheck, 
  Box, 
  HelpCircle,
  Award
} from 'lucide-react';

interface ProductCustomizerProps {
  product: SkincareProduct;
  selectedVariant: ProductVariant;
  onSelectVariant: (variant: ProductVariant) => void;
  layoutMode: LayoutMode;
  onChangeLayoutMode: (mode: LayoutMode) => void;
  customEngraving: string;
  onChangeEngraving: (engraving: string) => void;
  includeEcoTube: boolean;
  onToggleEcoTube: (include: boolean) => void;
  formatPrice: (priceUSD: number) => string;
  onAddToCart: () => void;
  onOpenAR: () => void;
}

export const ProductCustomizer: React.FC<ProductCustomizerProps> = ({
  product,
  selectedVariant,
  onSelectVariant,
  layoutMode,
  onChangeLayoutMode,
  customEngraving,
  onChangeEngraving,
  includeEcoTube,
  onToggleEcoTube,
  formatPrice,
  onAddToCart,
  onOpenAR
}) => {
  const currentVariant = selectedVariant || (product?.variants && product.variants[0]) || {
    id: 'radiance-gel',
    name: product?.name || 'Skincare Jar',
    tagline: product?.headline || 'Organic Formulation',
    activeIngredients: product?.keyActives ? product.keyActives.join(', ') : '',
    jarColor: '#E8EFE5',
    creamColor: '#D2E7CD',
    lidColor: '#D4AF37',
    textColor: '#2E6B4E',
    accentColor: '#2E6B4E',
    netWeight: product?.volume || '50g',
    priceUSD: product?.basePriceUSD || 48,
    stockCount: product?.inventoryStock || 50,
    sku: product?.sku || 'FG-JAR-050',
    batchNumber: 'LOT-2026-X01',
    benefits: product?.keyActives || []
  };

  return (
    <div className="space-y-6">
      {/* 1. Layout Mode Switcher */}
      <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-[#E8DCC0] shadow-xs">
        <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-[#F5F0E6]">
          <span className="text-xs font-semibold text-[#2E6B4E] uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Product Layout Experience
          </span>
          <span className="text-[11px] text-gray-500">Choose display mode</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          <button
            id="layout-studio-btn"
            onClick={() => onChangeLayoutMode('studio')}
            className={`py-2 px-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              layoutMode === 'studio'
                ? 'bg-[#2E6B4E] text-white shadow-xs'
                : 'bg-[#F9F8F3] hover:bg-[#F2EFE6] text-[#333333]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3D Studio</span>
          </button>
          <button
            id="layout-editorial-btn"
            onClick={() => onChangeLayoutMode('editorial')}
            className={`py-2 px-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              layoutMode === 'editorial'
                ? 'bg-[#2E6B4E] text-white shadow-xs'
                : 'bg-[#F9F8F3] hover:bg-[#F2EFE6] text-[#333333]'
            }`}
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Editorial</span>
          </button>
          <button
            id="layout-compare-btn"
            onClick={() => onChangeLayoutMode('compare')}
            className={`py-2 px-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              layoutMode === 'compare'
                ? 'bg-[#2E6B4E] text-white shadow-xs'
                : 'bg-[#F9F8F3] hover:bg-[#F2EFE6] text-[#333333]'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Compare 4 Jars</span>
          </button>
          <button
            id="layout-grid-btn"
            onClick={() => onChangeLayoutMode('grid')}
            className={`py-2 px-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              layoutMode === 'grid'
                ? 'bg-[#2E6B4E] text-white shadow-xs'
                : 'bg-[#F9F8F3] hover:bg-[#F2EFE6] text-[#333333]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Full Catalog</span>
          </button>
        </div>
      </div>

      {/* 2. Product Header & Price */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-[#EBF3EA] text-[#2E6B4E] text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Organic Skincare
          </span>
          <span className="text-gray-400 text-xs">•</span>
          <span className="text-xs text-gray-500">{currentVariant.netWeight}</span>
          <span className="text-gray-400 text-xs">•</span>
          <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            In Stock ({currentVariant.stockCount} left)
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1A3324] leading-tight">
          {product.name}
        </h1>
        <p className="text-xs sm:text-sm text-[#2E6B4E] font-medium mt-1">
          {currentVariant.tagline}
        </p>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-2xl sm:text-3xl font-bold text-[#1A3324]">
            {formatPrice(currentVariant.priceUSD + (includeEcoTube ? 8 : 0))}
          </span>
          <span className="text-xs text-gray-500">Tax included • Free global eco-shipping over $50</span>
        </div>
      </div>

      {/* 3. Variant Selector (From user's image: Radiance, Glow Night, Renew Scrub, Sunshield SPF) */}
      {product.variants && product.variants.length > 0 && (
        <div className="bg-white/80 p-4 rounded-2xl border border-[#E8DCC0]">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-semibold text-[#333333] uppercase tracking-wider">
              Select Formula Variant
            </label>
            <span className="text-xs font-medium text-[#2E6B4E]">
              {currentVariant.name}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {product.variants.map((v) => {
              const isSelected = v.id === currentVariant.id;
              return (
                <button
                  key={v.id}
                  id={`variant-${v.id}-btn`}
                  onClick={() => onSelectVariant(v)}
                  className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#2E6B4E] bg-[#F7FAF6] ring-2 ring-[#2E6B4E]/20 shadow-xs'
                      : 'border-[#E8DCC0]/70 bg-white hover:border-[#2E6B4E]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {/* Color dot matching jar variant */}
                      <span
                        className="w-4 h-4 rounded-full border border-gray-300 shadow-xs"
                        style={{ backgroundColor: v.creamColor }}
                      />
                      <span className="text-xs font-bold text-[#1A3324]">{v.name}</span>
                    </div>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#2E6B4E] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-1">{v.tagline}</p>
                  <div className="mt-2 pt-1 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-gray-700">{formatPrice(v.priceUSD)}</span>
                    <span className="text-gray-400 font-mono text-[10px]">{v.sku}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Personalized Custom Engraving (Real-time WebGL update on gold lid) */}
      <div className="bg-white/80 p-4 rounded-2xl border border-[#E8DCC0]">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-[#333333] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D9896A]" /> Complimentary Gold Lid Engraving
          </label>
          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
            Free Gift
          </span>
        </div>
        <p className="text-[11px] text-gray-500 mb-2">
          Your personal message or name will be embossed directly on the 3D brushed gold lid.
        </p>
        <div className="relative">
          <input
            id="engraving-input"
            type="text"
            maxLength={26}
            value={customEngraving}
            onChange={(e) => onChangeEngraving(e.target.value)}
            placeholder="e.g. Crafted for Sarah / Glow Everyday"
            className="w-full bg-[#FAF9F5] border border-[#E8DCC0] rounded-xl px-3 py-2 text-xs text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2E6B4E]/30"
          />
          {customEngraving && (
            <span className="absolute right-3 top-2 text-[10px] text-gray-400">
              {26 - customEngraving.length} left
            </span>
          )}
        </div>
      </div>

      {/* 5. Packaging Upgrade: Eco Tube Cylinder (from user's image) */}
      <div
        id="toggle-eco-tube"
        onClick={() => onToggleEcoTube(!includeEcoTube)}
        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
          includeEcoTube
            ? 'bg-[#F9F7F1] border-[#D9896A] ring-1 ring-[#D9896A]'
            : 'bg-white/80 border-[#E8DCC0] hover:border-[#D9896A]/60'
        }`}
      >
        <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center ${
          includeEcoTube ? 'bg-[#D9896A] border-[#D9896A] text-white' : 'border-gray-300 bg-white'
        }`}>
          {includeEcoTube && <Check className="w-3.5 h-3.5" />}
        </div>
        <div className="flex-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#1A3324] flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-[#2E6B4E]" /> Add Cylindrical Eco Paper Gift Tube
            </span>
            <span className="font-semibold text-[#D9896A]">+{formatPrice(8)}</span>
          </div>
          <p className="text-gray-500 text-[11px] mt-0.5">
            Heavyweight biodegradable tube made from post-consumer recycled paperboard, printed with plant soy ink.
          </p>
        </div>
      </div>

      {/* 6. Primary Action CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          id="add-to-cart-btn"
          onClick={onAddToCart}
          className="flex-1 bg-[#D9896A] hover:bg-[#BC6E50] text-white font-semibold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2 transform active:scale-[0.98]"
        >
          <span>Add to Bag • {formatPrice(currentVariant.priceUSD + (includeEcoTube ? 8 : 0))}</span>
        </button>

        <button
          id="open-ar-cta-btn"
          onClick={onOpenAR}
          className="bg-white hover:bg-[#F6F4EC] border-2 border-[#2E6B4E] text-[#2E6B4E] font-semibold py-3.5 px-5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-xs hover:shadow-md"
        >
          <Sparkles className="w-4 h-4 text-[#D9896A]" />
          <span>Launch AR Room View</span>
        </button>
      </div>

      {/* 7. Sustainability Highlights Bar (Matching bottom section of user's packaging image!) */}
      <div className="pt-3 border-t border-[#E8DCC0]/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] text-[#2E6B4E]">
        <div className="bg-white/60 p-2 rounded-xl border border-[#E8DCC0]/50 flex flex-col items-center">
          <span className="text-base mb-0.5">🌿</span>
          <span className="font-semibold">Organic & Natural</span>
        </div>
        <div className="bg-white/60 p-2 rounded-xl border border-[#E8DCC0]/50 flex flex-col items-center">
          <span className="text-base mb-0.5">♻️</span>
          <span className="font-semibold">Recyclable Glass</span>
        </div>
        <div className="bg-white/60 p-2 rounded-xl border border-[#E8DCC0]/50 flex flex-col items-center">
          <span className="text-base mb-0.5">🌱</span>
          <span className="font-semibold">Soy Based Ink</span>
        </div>
        <div className="bg-white/60 p-2 rounded-xl border border-[#E8DCC0]/50 flex flex-col items-center">
          <span className="text-base mb-0.5">🐰</span>
          <span className="font-semibold">100% Cruelty Free</span>
        </div>
      </div>
    </div>
  );
};
