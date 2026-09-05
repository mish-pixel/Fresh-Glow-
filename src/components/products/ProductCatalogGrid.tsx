import React, { useState } from 'react';
import { SkincareProduct, ProductCategory } from '../../types';
import { PRODUCTS } from '../../data/products';
import { Sparkles, Eye, ShoppingBag, Check } from 'lucide-react';

interface ProductCatalogGridProps {
  onSelectProduct: (product: SkincareProduct) => void;
  activeProductId: string;
  formatPrice: (priceUSD: number) => string;
  onAddToCart: (product: SkincareProduct) => void;
}

export const ProductCatalogGrid: React.FC<ProductCatalogGridProps> = ({
  onSelectProduct,
  activeProductId,
  formatPrice,
  onAddToCart
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'creams', label: 'Gel & Face Creams' },
    { id: 'serums', label: 'Targeted Serums' },
    { id: 'cleansers', label: 'Cleansers' },
    { id: 'toners', label: 'Mists & Toners' },
    { id: 'bundles', label: 'Ritual Boxes' }
  ];

  const filteredProducts = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#E8DCC0] shadow-sm my-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0EBE0] pb-5">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1A3324]">
            FreshGlow Skincare Collection
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            100% Certified Organic & Vegan Formulas • Interactive 3D WebGL inspection available for all items
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#2E6B4E] text-white shadow-xs'
                  : 'bg-[#FAF9F5] text-gray-700 hover:bg-[#F0ECE1]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => {
          const isActive = prod.id === activeProductId;
          return (
            <div
              key={prod.id}
              className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                isActive
                  ? 'border-[#2E6B4E] bg-[#FAFBF9] ring-2 ring-[#2E6B4E]/20 shadow-md'
                  : 'border-[#E8DCC0]/70 bg-white hover:border-[#2E6B4E]/50 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="bg-[#EBF3EA] text-[#2E6B4E] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {prod.category}
                  </span>
                  <span className="text-[11px] font-mono text-gray-400">{prod.sku}</span>
                </div>

                {/* Model preview icon/badge */}
                <div className="h-28 bg-[#F9F8F4] rounded-xl flex items-center justify-center mb-3 border border-[#E8DCC0]/40 relative overflow-hidden">
                  <span className="text-4xl">
                    {prod.modelType === 'jar' && '🧴'}
                    {prod.modelType === 'dropper' && '🧪'}
                    {prod.modelType === 'pump' && '🧴'}
                    {prod.modelType === 'spray' && '✨'}
                    {prod.modelType === 'tube' && '📦'}
                  </span>
                  <div className="absolute bottom-1.5 left-2 right-2 text-center text-[10px] text-[#2E6B4E] font-medium bg-white/80 py-0.5 rounded">
                    3D Model: {prod.modelType.toUpperCase()}
                  </div>
                </div>

                <h3 className="font-serif font-bold text-[#1A3324] text-base mb-1">
                  {prod.name}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                  {prod.description}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-emerald-700 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{prod.inventoryStock} units in stock</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <span className="font-bold text-[#1A3324] text-lg">
                  {formatPrice(prod.basePriceUSD)}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onSelectProduct(prod)}
                    className="p-2 bg-[#2E6B4E] hover:bg-[#1E4B35] text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
                    title="Load into 3D WebGL Viewer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>View in 3D</span>
                  </button>
                  <button
                    onClick={() => onAddToCart(prod)}
                    className="p-2 bg-[#FAF9F5] hover:bg-[#F2EFE6] text-[#333333] border border-[#E8DCC0] rounded-xl text-xs transition-colors"
                    title="Quick Add to Bag"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
