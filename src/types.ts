export type ProductCategory = 'creams' | 'serums' | 'cleansers' | 'toners' | 'spf' | 'bundles';

export type ProductVariantId = 'radiance-gel' | 'glow-night' | 'renew-scrub' | 'sunshield-spf';

export interface ProductVariant {
  id: ProductVariantId;
  name: string;
  tagline: string;
  activeIngredients: string;
  jarColor: string;
  creamColor: string;
  lidColor: string;
  textColor: string;
  accentColor: string;
  netWeight: string;
  priceUSD: number;
  stockCount: number;
  sku: string;
  batchNumber: string;
  benefits: string[];
}

export interface SkincareProduct {
  id: string;
  name: string;
  category: ProductCategory;
  headline: string;
  description: string;
  keyActives: string[];
  skinType: string;
  volume: string;
  basePriceUSD: number;
  rating: number;
  reviewCount: number;
  isHeroProduct?: boolean;
  variants?: ProductVariant[];
  selectedVariantId?: ProductVariantId;
  modelType: 'jar' | 'dropper' | 'pump' | 'spray' | 'tube';
  certifications: string[];
  packaging: {
    material: string;
    recyclable: boolean;
    soyInk: boolean;
    refillable: boolean;
  };
  directions: string;
  ingredientsList: string;
  sku: string;
  inventoryStock: number;
  warehouseLocation: string;
  expiryDate: string;
}

export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'JPY';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateFromUSD: number;
  name: string;
  flag: string;
}

export type LightingPreset = 'studio' | 'sunset' | 'spa' | 'midnight';

export interface ViewerLightingSettings {
  preset: LightingPreset;
  intensity: number;
  ambientIntensity: number;
  rotation: number;
  roughness: number;
  metalness: number;
  transmission: number;
  backgroundMode: 'cream' | 'forest' | 'transparent' | 'pedestal';
}

export interface CameraAnglePreset {
  id: string;
  name: string;
  position: [number, number, number];
  target: [number, number, number];
}

export type LayoutMode = 'studio' | 'editorial' | 'compare' | 'grid';

export interface CartItem {
  product: SkincareProduct;
  variant?: ProductVariant;
  quantity: number;
  customEngraving?: string;
  includeEcoTube: boolean;
}

export type PaymentMethod = 'stripe' | 'paypal' | 'upi' | 'card';

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: CurrencyCode;
  paymentMethod: PaymentMethod;
  paymentStatus: 'completed' | 'pending' | 'processing';
  transactionId: string;
  shippingAddress: {
    fullName: string;
    email: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  currentStatus: TrackingStatus;
  statusHistory: TrackingMilestone[];
  invoiceGenerated: boolean;
}

export type TrackingStatus = 
  | 'confirmed'
  | 'formulating'
  | 'quality_checked'
  | 'dispatched'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered';

export interface TrackingMilestone {
  status: TrackingStatus;
  label: string;
  location: string;
  timestamp: string;
  completed: boolean;
  notes?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  verifiedBuyer: boolean;
  rating: number;
  date: string;
  skinType: string;
  ageRange: string;
  title: string;
  comment: string;
  helpfulCount: number;
  resultsTimeline: string;
  attributes: {
    texture: number; // 1-5
    absorption: number;
    scent: number;
    hydration: number;
  };
  productVariant: string;
}

export interface LoyaltyProfile {
  points: number;
  tier: 'Seedling' | 'Sprout' | 'Blooming Glow' | 'Forest Guardian';
  nextTierPoints: number;
  reviewsSubmitted: number;
  jarsRecycled: number;
  unlockedPerks: string[];
}
