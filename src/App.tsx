import React, { useState } from 'react';
import { 
  SkincareProduct, 
  ProductVariant, 
  LayoutMode, 
  CurrencyCode, 
  CartItem, 
  CustomerOrder, 
  ReviewItem, 
  LoyaltyProfile,
  TrackingStatus
} from './types';
import { PRODUCTS, GEL_CREAM_VARIANTS, CURRENCIES } from './data/products';
import { INITIAL_INVENTORY, InventoryRecord } from './data/inventory';
import { INITIAL_REVIEWS, INITIAL_LOYALTY } from './data/reviews';

import { Navbar } from './components/layout/Navbar';
import { ProductModelViewer } from './components/3d/ProductModelViewer';
import { ARViewerModal } from './components/3d/ARViewerModal';
import { ProductCustomizer } from './components/products/ProductCustomizer';
import { VariantComparisonView } from './components/products/VariantComparisonView';
import { EditorialShowcase } from './components/products/EditorialShowcase';
import { ProductCatalogGrid } from './components/products/ProductCatalogGrid';
import { CartDrawer } from './components/cart/CartDrawer';
import { PaymentGatewayModal } from './components/checkout/PaymentGatewayModal';
import { InvoiceModal } from './components/invoice/InvoiceModal';
import { DeliveryTrackingDashboard } from './components/tracking/DeliveryTrackingDashboard';
import { InventoryDatabaseDrawer } from './components/inventory/InventoryDatabaseDrawer';
import { ReviewsAndLoyalty } from './components/reviews/ReviewsAndLoyalty';

export default function App() {
  // Core Selection
  const [currentProduct, setCurrentProduct] = useState<SkincareProduct>(PRODUCTS[0]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(GEL_CREAM_VARIANTS[0]);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('studio');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  // Customization Options
  const [customEngraving, setCustomEngraving] = useState<string>('Glow Daily');
  const [includeEcoTube, setIncludeEcoTube] = useState<boolean>(true);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRODUCTS[0],
      variant: GEL_CREAM_VARIANTS[0],
      quantity: 1,
      customEngraving: 'Glow Daily',
      includeEcoTube: true
    }
  ]);

  // Inventory Database State
  const [inventory, setInventory] = useState<InventoryRecord[]>(INITIAL_INVENTORY);

  // Reviews & Loyalty State
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [loyalty, setLoyalty] = useState<LoyaltyProfile>(INITIAL_LOYALTY);

  // Orders & Active Order
  const [latestOrder, setLatestOrder] = useState<CustomerOrder | null>(null);

  // Modal / Drawer Open States
  const [isAROpen, setIsAROpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState<boolean>(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);

  // Price Formatter based on active currency
  const formatPrice = (priceUSD: number) => {
    const config = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];
    const converted = priceUSD * config.rateFromUSD;
    return `${config.symbol}${converted.toLocaleString('en-US', {
      minimumFractionDigits: config.code === 'JPY' ? 0 : 2,
      maximumFractionDigits: config.code === 'JPY' ? 0 : 2
    })}`;
  };

  // Cart Operations
  const handleAddToCart = () => {
    const existingIndex = cartItems.findIndex(
      (item) =>
        item.product.id === currentProduct.id &&
        item.variant?.id === selectedVariant.id &&
        item.customEngraving === customEngraving &&
        item.includeEcoTube === includeEcoTube
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        {
          product: currentProduct,
          variant: selectedVariant,
          quantity: 1,
          customEngraving,
          includeEcoTube
        }
      ]);
    }
    setIsCartOpen(true);
  };

  const handleQuickAddToCart = (product: SkincareProduct) => {
    const variant = product.variants ? product.variants[0] : undefined;
    setCartItems([
      ...cartItems,
      {
        product,
        variant,
        quantity: 1,
        includeEcoTube: false
      }
    ]);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    const updated = [...cartItems];
    updated[index].quantity = newQty;
    setCartItems(updated);
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems(cartItems.filter((_, idx) => idx !== index));
  };

  // Checkout Completion Handler
  const handleOrderCompleted = (newOrder: CustomerOrder) => {
    setLatestOrder(newOrder);
    setIsCheckoutOpen(false);

    // Decrement inventory stock in database
    setInventory((prevInv) =>
      prevInv.map((invItem) => {
        const matchingCartItem = newOrder.items.find(
          (item) => (item.variant?.sku || item.product.sku) === invItem.sku
        );
        if (matchingCartItem) {
          return {
            ...invItem,
            inStock: Math.max(0, invItem.inStock - matchingCartItem.quantity),
            reserved: Math.max(0, invItem.reserved - matchingCartItem.quantity)
          };
        }
        return invItem;
      })
    );

    // Reward Loyalty Points (+10 points per dollar spent)
    const pointsEarned = Math.round(newOrder.total * 10);
    setLoyalty((prev) => ({
      ...prev,
      points: prev.points + pointsEarned
    }));

    // Clear cart and show automated invoice
    setCartItems([]);
    setIsInvoiceOpen(true);
  };

  // Review & Loyalty Interactions
  const handleAddReview = (newRev: ReviewItem) => {
    setReviews([newRev, ...reviews]);
    // Award 50 points
    setLoyalty((prev) => ({
      ...prev,
      points: prev.points + 50
    }));
  };

  const handleEarnRecyclePoints = () => {
    setLoyalty((prev) => ({
      ...prev,
      points: prev.points + 100,
      emptyJarsRecycled: prev.emptyJarsRecycled + 1
    }));
    alert('Thank you for choosing zero-waste! 100 reward points and a prepaid shipping return label have been generated.');
  };

  // Simulate Delivery Milestone
  const handleSimulateStatusAdvance = (nextStatus: TrackingStatus) => {
    if (!latestOrder) return;
    setLatestOrder({
      ...latestOrder,
      currentStatus: nextStatus,
      statusHistory: latestOrder.statusHistory.map((step) => {
        if (step.status === nextStatus) {
          return { ...step, completed: true, timestamp: 'Just now' };
        }
        return step;
      })
    });
  };

  const totalStockCount = inventory.reduce((sum, item) => sum + item.inStock, 0);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#333333] font-sans selection:bg-[#2E6B4E] selection:text-white flex flex-col justify-between">
      {/* 1. Global Navigation Bar */}
      <Navbar
        layoutMode={layoutMode}
        onChangeLayoutMode={setLayoutMode}
        currency={currency}
        onChangeCurrency={setCurrency}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAR={() => setIsAROpen(true)}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        totalStockCount={totalStockCount}
      />

      {/* 2. Main Page Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
        {/* Layout Mode Views */}

        {/* View A: 3D WebGL Studio */}
        {layoutMode === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Interactive 3D WebGL Canvas */}
            <div className="lg:col-span-7">
              <ProductModelViewer
                product={currentProduct}
                modelType={currentProduct.modelType}
                selectedVariant={selectedVariant}
                variant={selectedVariant}
                customEngraving={customEngraving}
                includeEcoTube={includeEcoTube}
                onOpenAR={() => setIsAROpen(true)}
              />
            </div>

            {/* Right 5 Columns: Layout & Variant Customizer */}
            <div className="lg:col-span-5">
              <ProductCustomizer
                product={currentProduct}
                selectedVariant={selectedVariant}
                onSelectVariant={setSelectedVariant}
                layoutMode={layoutMode}
                onChangeLayoutMode={setLayoutMode}
                customEngraving={customEngraving}
                onChangeEngraving={setCustomEngraving}
                includeEcoTube={includeEcoTube}
                onToggleEcoTube={setIncludeEcoTube}
                formatPrice={formatPrice}
                onAddToCart={handleAddToCart}
                onOpenAR={() => setIsAROpen(true)}
              />
            </div>
          </div>
        )}

        {/* View B: Editorial Brand Story */}
        {layoutMode === 'editorial' && (
          <EditorialShowcase
            product={currentProduct}
            selectedVariant={selectedVariant}
            onReturnToStudio={() => setLayoutMode('studio')}
          />
        )}

        {/* View C: 4-Jar Formula Comparison */}
        {layoutMode === 'compare' && (
          <VariantComparisonView
            selectedVariant={selectedVariant}
            onSelectVariant={setSelectedVariant}
            formatPrice={formatPrice}
            onSwitchToStudio={() => setLayoutMode('studio')}
          />
        )}

        {/* View D: Full Skincare Catalog Grid */}
        {layoutMode === 'grid' && (
          <ProductCatalogGrid
            onSelectProduct={(p) => {
              setCurrentProduct(p);
              if (p.variants && p.variants.length > 0) {
                setSelectedVariant(p.variants[0]);
              } else {
                setSelectedVariant({
                  id: 'radiance-gel',
                  name: p.name,
                  tagline: p.headline,
                  activeIngredients: p.keyActives.join(', '),
                  jarColor: '#E8EFE5',
                  creamColor: '#D2E7CD',
                  lidColor: '#D4AF37',
                  textColor: '#2E6B4E',
                  accentColor: '#2E6B4E',
                  netWeight: p.volume,
                  priceUSD: p.basePriceUSD,
                  stockCount: p.inventoryStock,
                  sku: p.sku,
                  batchNumber: 'LOT-2026-X01',
                  benefits: p.keyActives
                });
              }
              setLayoutMode('studio');
            }}
            activeProductId={currentProduct.id}
            formatPrice={formatPrice}
            onAddToCart={handleQuickAddToCart}
          />
        )}

        {/* Customer Satisfaction & Review Feedback Loop (Always present to encourage brand loyalty) */}
        <ReviewsAndLoyalty
          reviews={reviews}
          onAddReview={handleAddReview}
          loyalty={loyalty}
          onEarnRecyclePoints={handleEarnRecyclePoints}
          productName={currentProduct.name}
        />
      </main>

      {/* 3. Global Footer */}
      <footer className="bg-white border-t border-[#E8DCC0] py-10 mt-12 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl text-[#2E6B4E]">🌿</span>
              <span className="font-serif font-bold text-lg text-[#1A3324]">FreshGlow</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Clean botanical skincare crafted with certified organic wild-harvested actives. Infinitely recyclable frosted glass and biodegradable packaging.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-[#1A3324] mb-2 uppercase tracking-wider text-[11px]">
              Technology & Experience
            </h5>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => setIsAROpen(true)} className="hover:text-[#2E6B4E]">
                  WebRTC Augmented Reality (AR)
                </button>
              </li>
              <li>
                <button onClick={() => setLayoutMode('studio')} className="hover:text-[#2E6B4E]">
                  WebGL Three.js 3D Inspector
                </button>
              </li>
              <li>
                <button onClick={() => setIsInventoryOpen(true)} className="hover:text-[#2E6B4E]">
                  Central Inventory Database
                </button>
              </li>
              <li>
                <button onClick={() => setIsTrackingOpen(true)} className="hover:text-[#2E6B4E]">
                  Live Shipment Telemetry
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-[#1A3324] mb-2 uppercase tracking-wider text-[11px]">
              Payment & Security
            </h5>
            <p className="text-[11px] leading-relaxed mb-2">
              Stripe 3D Secure, PayPal Buyer Protection, and Indian Rupee (INR) UPI QR instant gateway.
            </p>
            <div className="flex items-center gap-2 text-base">
              <span>💳</span>
              <span>🅿️</span>
              <span>📱</span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                256-Bit SSL
              </span>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-[#1A3324] mb-2 uppercase tracking-wider text-[11px]">
              Sustainability Pledge
            </h5>
            <p className="text-[11px] leading-relaxed">
              100% Carbon Neutral deliveries, zero single-use plastics, soy-based inks, and certified cruelty-free.
            </p>
            <div className="mt-2 text-[10px] text-[#2E6B4E] font-semibold">
              © {new Date().getFullYear()} FreshGlow Skincare LLC. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* 4. Interactive Drawers & Modals */}
      {/* AR Modal */}
      <ARViewerModal
        isOpen={isAROpen}
        onClose={() => setIsAROpen(false)}
        product={currentProduct}
        selectedVariant={selectedVariant}
        customEngraving={customEngraving}
      />

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        formatPrice={formatPrice}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onOpenAR={() => {
          setIsCartOpen(false);
          setIsAROpen(true);
        }}
      />

      {/* Multi-Currency Secure Payment Gateway Modal */}
      <PaymentGatewayModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        currency={currency}
        onChangeCurrency={setCurrency}
        formatPrice={formatPrice}
        loyalty={loyalty}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Automated Tax Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        order={latestOrder}
        onOpenTracking={() => setIsTrackingOpen(true)}
      />

      {/* Delivery Tracking Dashboard Modal */}
      <DeliveryTrackingDashboard
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        order={latestOrder}
        onSimulateStatusAdvance={handleSimulateStatusAdvance}
      />

      {/* Central Inventory Database Drawer */}
      <InventoryDatabaseDrawer
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        inventory={inventory}
        onRefresh={() => {
          setInventory([...inventory]);
        }}
      />
    </div>
  );
}
