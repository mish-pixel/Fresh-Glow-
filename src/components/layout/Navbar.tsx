import React from 'react';
import { CurrencyCode, LayoutMode } from '../../types';
import { CURRENCIES } from '../../data/products';
import { 
  ShoppingBag, 
  Truck, 
  Database, 
  Sparkles, 
  ChevronDown, 
  Globe, 
  Menu, 
  Layers 
} from 'lucide-react';

interface NavbarProps {
  layoutMode: LayoutMode;
  onChangeLayoutMode: (mode: LayoutMode) => void;
  currency: CurrencyCode;
  onChangeCurrency: (curr: CurrencyCode) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAR: () => void;
  onOpenInventory: () => void;
  onOpenTracking: () => void;
  totalStockCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  layoutMode,
  onChangeLayoutMode,
  currency,
  onChangeCurrency,
  cartCount,
  onOpenCart,
  onOpenAR,
  onOpenInventory,
  onOpenTracking,
  totalStockCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E8DCC0]/70 transition-all">
      {/* Top micro announcement bar */}
      <div className="bg-[#2E6B4E] text-white text-[11px] py-1 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="text-amber-200">🌿</span>
        <span>Organic Botanical Skincare • Free Global Carbon-Neutral Delivery on Orders over $50</span>
        <span className="hidden md:inline text-emerald-200">• Compliant with US, EU & INR Payment Protocols</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => onChangeLayoutMode('studio')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#2E6B4E] text-white flex items-center justify-center font-serif text-lg font-bold shadow-xs group-hover:scale-105 transition-transform">
              F
            </div>
            <div>
              <span className="font-serif font-bold text-xl tracking-tight text-[#1A3324] block leading-none">
                FreshGlow
              </span>
              <span className="text-[9px] font-bold text-[#2E6B4E] tracking-widest uppercase block mt-0.5">
                ORGANIC BOTANICALS
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links (Layout Modes) */}
          <nav className="hidden lg:flex items-center space-x-1 pl-4 border-l border-[#E8DCC0]">
            <button
              onClick={() => onChangeLayoutMode('studio')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                layoutMode === 'studio'
                  ? 'bg-[#2E6B4E] text-white shadow-2xs'
                  : 'text-gray-700 hover:text-[#2E6B4E] hover:bg-black/5'
              }`}
            >
              3D WebGL Studio
            </button>
            <button
              onClick={() => onChangeLayoutMode('editorial')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                layoutMode === 'editorial'
                  ? 'bg-[#2E6B4E] text-white shadow-2xs'
                  : 'text-gray-700 hover:text-[#2E6B4E] hover:bg-black/5'
              }`}
            >
              Botanical Story
            </button>
            <button
              onClick={() => onChangeLayoutMode('compare')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                layoutMode === 'compare'
                  ? 'bg-[#2E6B4E] text-white shadow-2xs'
                  : 'text-gray-700 hover:text-[#2E6B4E] hover:bg-black/5'
              }`}
            >
              Compare Jars
            </button>
            <button
              onClick={() => onChangeLayoutMode('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                layoutMode === 'grid'
                  ? 'bg-[#2E6B4E] text-white shadow-2xs'
                  : 'text-gray-700 hover:text-[#2E6B4E] hover:bg-black/5'
              }`}
            >
              All Skincare
            </button>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Currency Switcher */}
          <div className="relative group">
            <button className="flex items-center gap-1 bg-white hover:bg-gray-50 border border-[#E8DCC0] px-2.5 py-1.5 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs transition-colors">
              <Globe className="w-3.5 h-3.5 text-[#2E6B4E]" />
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
            <div className="absolute right-0 mt-1 w-36 bg-white border border-[#E8DCC0] rounded-xl shadow-lg py-1 hidden group-hover:block z-50 animate-in fade-in duration-150">
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => onChangeCurrency(c.code)}
                  className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-[#FAF9F5] ${
                    currency === c.code ? 'font-bold text-[#2E6B4E] bg-[#EBF3EA]' : 'text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>{c.flag}</span>
                    <span>{c.code}</span>
                  </span>
                  <span className="text-gray-400 font-mono text-[11px]">{c.symbol}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AR Camera Button */}
          <button
            onClick={onOpenAR}
            id="nav-ar-btn"
            className="hidden sm:flex items-center gap-1.5 bg-[#FAF9F5] hover:bg-[#F2EFE6] border border-[#2E6B4E]/40 text-[#2E6B4E] px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-2xs"
            title="Launch Augmented Reality Room Experience"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D9896A]" />
            <span>AR View</span>
          </button>

          {/* Live Inventory Database Pill */}
          <button
            onClick={onOpenInventory}
            id="nav-inventory-btn"
            className="hidden md:flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-[#E8DCC0] px-3 py-1.5 rounded-xl text-xs font-medium text-gray-700 shadow-2xs transition-colors"
            title="Inspect Central Inventory Database"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <Database className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[11px]">DB: {totalStockCount} units</span>
          </button>

          {/* Delivery Tracking Dashboard */}
          <button
            onClick={onOpenTracking}
            id="nav-tracking-btn"
            className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-[#E8DCC0] px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs transition-colors"
            title="Track Active Shipments"
          >
            <Truck className="w-3.5 h-3.5 text-[#2E6B4E]" />
            <span className="hidden sm:inline">Track Order</span>
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={onOpenCart}
            id="nav-cart-btn"
            className="relative bg-[#2E6B4E] hover:bg-[#1E4B35] text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            {cartCount > 0 && (
              <span className="bg-[#D9896A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
