import React from 'react';
import { CartItem } from '../../types';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  Box
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  formatPrice: (priceUSD: number) => string;
  onProceedToCheckout: () => void;
  onOpenAR: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  formatPrice,
  onProceedToCheckout,
  onOpenAR
}) => {
  if (!isOpen) return null;

  const subtotalUSD = items.reduce((sum, item) => {
    const price = item.variant ? item.variant.priceUSD : item.product.basePriceUSD;
    const packagingCost = item.includeEcoTube ? 8 : 0;
    return sum + (price + packagingCost) * item.quantity;
  }, 0);

  const freeShippingThreshold = 50;
  const progressPercent = Math.min(100, (subtotalUSD / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-gray-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#FAF9F5]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#2E6B4E]" />
            <h3 className="font-serif font-bold text-lg text-[#1A3324]">
              Your Skincare Bag ({items.reduce((sum, i) => sum + i.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-[#FAF9F5] px-6 py-3 border-b border-[#E8DCC0]/60 text-xs">
          <div className="flex justify-between text-gray-700 font-medium mb-1.5">
            <span>
              {subtotalUSD >= freeShippingThreshold ? (
                <span className="text-[#2E6B4E] font-bold">🎉 You unlocked FREE Global Eco Shipping!</span>
              ) : (
                <span>Add {formatPrice(freeShippingThreshold - subtotalUSD)} more for FREE Eco Shipping</span>
              )}
            </span>
            <span className="font-semibold text-[#2E6B4E]">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#2E6B4E] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <span className="text-5xl block">🧴</span>
              <p className="font-serif font-semibold text-lg text-gray-700">Your bag is empty</p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Explore our clean botanical creams and custom engraved jars in 3D WebGL!
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 bg-[#2E6B4E] text-white text-xs font-semibold rounded-xl"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            items.map((item, idx) => {
              const itemPrice = (item.variant ? item.variant.priceUSD : item.product.basePriceUSD) + (item.includeEcoTube ? 8 : 0);
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-gray-200 bg-white hover:border-[#2E6B4E]/30 transition-colors shadow-2xs space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-xs text-[#1A3324]">
                        {item.variant ? item.variant.name : item.product.name}
                      </h4>
                      <p className="text-[11px] text-[#2E6B4E] font-medium">
                        {item.variant?.tagline || item.product.description}
                      </p>
                      {item.includeEcoTube && (
                        <div className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1 mt-0.5">
                          <Box className="w-3 h-3 text-[#2E6B4E]" />
                          Includes Biodegradable Paper Tube
                        </div>
                      )}
                      {item.customEngraving && (
                        <div className="text-[10px] text-[#D9896A] italic mt-0.5">
                          Lid: “{item.customEngraving}”
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onRemoveItem(idx)}
                      className="text-gray-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-200"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-200"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="font-bold text-sm text-[#1A3324]">
                      {formatPrice(itemPrice * item.quantity)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-gray-200 bg-[#FAF9F5] space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-gray-500">Subtotal</span>
              <span className="font-bold text-lg text-[#1A3324]">{formatPrice(subtotalUSD)}</span>
            </div>
            <p className="text-[11px] text-gray-400">
              Taxes & multi-currency options calculated at secure checkout.
            </p>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full bg-[#D9896A] hover:bg-[#BC6E50] text-white font-semibold py-3.5 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenAR();
              }}
              className="w-full bg-white hover:bg-[#F6F4EC] border border-[#2E6B4E] text-[#2E6B4E] font-medium py-2 rounded-xl text-xs flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D9896A]" />
              <span>Preview in Your Room with AR</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
