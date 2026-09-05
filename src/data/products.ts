import { SkincareProduct, ProductVariant } from '../types';

export const GEL_CREAM_VARIANTS: ProductVariant[] = [
  {
    id: 'radiance-gel',
    name: 'Radiance Gel Cream',
    tagline: 'With Niacinamide & Green Tea',
    activeIngredients: '5% Niacinamide, Camellia Sinensis (Green Tea), Hyaluronic Acid',
    jarColor: '#E8EFE5', // soft sage frosted
    creamColor: '#D2E7CD', // fresh pale green gel
    lidColor: '#D4AF37', // luxury brushed gold
    textColor: '#2E6B4E',
    accentColor: '#2E6B4E',
    netWeight: '50 g e 1.76 oz.',
    priceUSD: 48,
    stockCount: 142,
    sku: 'FG-RGC-050',
    batchNumber: 'LOT-2026-B94',
    benefits: ['Boosts skin radiance & barrier', 'Controls excess sebum without dryness', 'Antioxidant shield against pollution', 'Plumps fine lines with dual-weight HA']
  },
  {
    id: 'glow-night',
    name: 'Glow Night Cream',
    tagline: 'With Rosehip & Squalane',
    activeIngredients: 'Cold-Pressed Rosehip Seed Oil, Plant Squalane, Bakuchiol 1%',
    jarColor: '#F7E7E5', // soft blush frosted
    creamColor: '#F2D3CF', // velvety soft rose cream
    lidColor: '#D4AF37',
    textColor: '#8C483F',
    accentColor: '#D9896A',
    netWeight: '50 g e 1.76 oz.',
    priceUSD: 52,
    stockCount: 68,
    sku: 'FG-GNC-050',
    batchNumber: 'LOT-2026-N12',
    benefits: ['Intensive overnight cellular renewal', 'Smoothes texture without retinoid irritation', 'Locks in moisture for 24-hour dewiness', 'Fades post-blemish dark marks']
  },
  {
    id: 'renew-scrub',
    name: 'Renew Exfoliating Scrub',
    tagline: 'With Walnut & Rice Extract',
    activeIngredients: 'Micro-Milled Walnut Shell, Fermented Rice Water, Oat Beta-Glucan',
    jarColor: '#EDE7F0', // subtle lilac / mauve frosted
    creamColor: '#E2D7E8', // gentle exfoliating scrub base with micro-particles
    lidColor: '#D4AF37',
    textColor: '#4B3F54',
    accentColor: '#7A6B85',
    netWeight: '50 g e 1.76 oz.',
    priceUSD: 42,
    stockCount: 95,
    sku: 'FG-RES-050',
    batchNumber: 'LOT-2026-S77',
    benefits: ['Buffs away dull dead skin cells safely', 'Clarifies pores without stripping moisture', 'Rice enzymes brighten uneven tone', 'Silky rinse-off with zero microplastics']
  },
  {
    id: 'sunshield-spf',
    name: 'Sunshield Mineral SPF 50',
    tagline: 'With Zinc Oxide & Aloe Vera',
    activeIngredients: 'Non-Nano Zinc Oxide 21%, Organic Aloe Vera, Vitamin E',
    jarColor: '#F7EED9', // sunny warm cream
    creamColor: '#FFF8E6', // lightweight vanishing mineral cream
    lidColor: '#D4AF37',
    textColor: '#6D5325',
    accentColor: '#D99B26',
    netWeight: '50 g e 1.76 oz.',
    priceUSD: 46,
    stockCount: 84,
    sku: 'FG-SMS-050',
    batchNumber: 'LOT-2026-SPF04',
    benefits: ['Broad-spectrum UVA/UVB mineral protection', 'Invisible weightless finish with zero white cast', 'Soothes sun-stressed skin with organic aloe', 'Reef safe & eco-certified formula']
  }
];

export const PRODUCTS: SkincareProduct[] = [
  {
    id: 'radiance-gel-cream',
    name: 'Radiance Gel Cream',
    category: 'creams',
    headline: 'Nourished by nature, glowing for you. Clean, organic luxury.',
    description: 'A whipped, featherweight gel cream infused with Japanese organic green tea extract and multi-molecular hyaluronic acid. Delivers 72 hours of weightless hydration while reinforcing the skin moisture barrier with a velvet-glow finish.',
    keyActives: ['5% Niacinamide', 'Camellia Sinensis (Green Tea)', 'Plant Hyaluronic Acid', 'Centella Asiatica'],
    skinType: 'All Skin Types (Ideal for Sensitive & Combination)',
    volume: '50g / 1.76 oz',
    basePriceUSD: 48,
    rating: 4.9,
    reviewCount: 384,
    isHeroProduct: true,
    variants: GEL_CREAM_VARIANTS,
    selectedVariantId: 'radiance-gel',
    modelType: 'jar',
    certifications: ['ECOCERT Organic', 'Leaping Bunny Cruelty-Free', '100% Vegan', 'Dermatologically Tested'],
    packaging: {
      material: 'Recyclable frosted heavy glass jar, aluminum gold lid with embossed leaf crest',
      recyclable: true,
      soyInk: true,
      refillable: true
    },
    directions: 'Apply a dime-sized amount to cleansed face, neck, and décolletage morning and evening. Gently press into skin with fingertips using upward sweeps.',
    ingredientsList: 'Aqua/Water/Eau, Aloe Barbadensis Leaf Juice*, Glycerin, Niacinamide, Camellia Sinensis Leaf Extract*, Sodium Hyaluronate, Squalane (Olive), Xanthan Gum, Tocopherol (Vitamin E), Citrus Aurantium Bergamia Fruit Oil*, Benzyl Alcohol, Dehydroacetic Acid. *Organic Ingredients.',
    sku: 'FG-RGC-050',
    inventoryStock: 142,
    warehouseLocation: 'Bay A1 - Pacific Northwest Clean Hub',
    expiryDate: '10/2028'
  },
  {
    id: 'vitamin-c-serum',
    name: 'Vitamin C Face Serum',
    category: 'serums',
    headline: 'Brightens | Protects | Hydrates with 15% Stabilized Ascorbyl Glucoside',
    description: 'An antioxidant powerhouse formulated in deep amber UV-protective glass. Neutralizes free radicals, boosts collagen synthesis, and diminishes post-inflammatory pigmentation for glass-skin clarity.',
    keyActives: ['15% Stabilized Vitamin C', 'Ferulic Acid', 'Kakadu Plum', 'Vitamin E'],
    skinType: 'Dull, Hyperpigmented, or Age-Defying Skin',
    volume: '30ml / 1.01 fl. oz.',
    basePriceUSD: 56,
    rating: 4.8,
    reviewCount: 291,
    modelType: 'dropper',
    certifications: ['USDA Organic Certified', 'Cruelty Free', 'Paraben Free', 'Sulfate Free'],
    packaging: {
      material: 'UV-blocking amber glass vial, gold collar pipette with natural rubber dropper bulb',
      recyclable: true,
      soyInk: true,
      refillable: false
    },
    directions: 'Dispense 4-5 drops onto cleansed palms. Gently pat into face and neck before applying moisturizer and sunscreen.',
    ingredientsList: 'Rosa Damascena Flower Water*, Ascorbyl Glucoside, Terminalia Ferdinandiana (Kakadu Plum) Fruit Extract*, Ferulic Acid, Hyaluronic Acid, Tocopherol. *Organic Farming.',
    sku: 'FG-VCS-030',
    inventoryStock: 38,
    warehouseLocation: 'Bay B3 - Cool Storage Vault',
    expiryDate: '08/2028'
  },
  {
    id: 'gentle-cleanser',
    name: 'Gentle Cleanser',
    category: 'cleansers',
    headline: 'With Aloe Vera & Chamomile Extract for Pure, Calm Balance',
    description: 'A cloud-soft low-pH foaming gel cleanser that melts makeup, sunscreen, and urban impurities without stripping your natural lipids. Enriched with botanical soothing agents.',
    keyActives: ['Organic Aloe Vera Leaf', 'Chamomile Flower Extract', 'Oat Amino Acids', 'Cucumber Hydrosol'],
    skinType: 'Sensitive, Reactive & All Skin Types',
    volume: '100ml / 3.38 fl. oz.',
    basePriceUSD: 36,
    rating: 4.9,
    reviewCount: 215,
    modelType: 'pump',
    certifications: ['Hypoallergenic', 'Vegan Society', 'Carbon Neutral Certified', 'Clean at Sephora Standard'],
    packaging: {
      material: 'Recycled Ocean PET bottle with luxe gold pump dispenser',
      recyclable: true,
      soyInk: true,
      refillable: true
    },
    directions: 'Massage 1-2 pumps onto damp skin in circular motions for 60 seconds. Rinse thoroughly with lukewarm water.',
    ingredientsList: 'Aloe Barbadensis Leaf Juice*, Decyl Glucoside, Chamomilla Recutita Flower Extract*, Cucumis Sativus Fruit Water, Panthenol (Pro-Vitamin B5). *Organic.',
    sku: 'FG-GCL-100',
    inventoryStock: 89,
    warehouseLocation: 'Bay C2 - Main Fulfillment Center',
    expiryDate: '12/2028'
  },
  {
    id: 'hydrating-toner',
    name: 'Hydrating Toner',
    category: 'toners',
    headline: 'With Witch Hazel & Rose Water - Refreshes | Tones | Balances',
    description: 'An ultra-fine mist delivering micro-droplets of antioxidant floral waters. Tightens pores gently, restores acid mantle equilibrium, and primes skin for serum penetration.',
    keyActives: ['Rose Centifolia Water', 'Alcohol-Free Witch Hazel', 'Willow Bark Extract', 'Niacinamide'],
    skinType: 'All Skin Types',
    volume: '100ml / 3.38 fl. oz.',
    basePriceUSD: 38,
    rating: 4.7,
    reviewCount: 178,
    modelType: 'spray',
    certifications: ['Ecocert COSMOS', 'PETA Vegan & Cruelty Free', 'FSC Certified Outer Box'],
    packaging: {
      material: 'Frosted forest green glass bottle with micro-atomizer gold mist spray',
      recyclable: true,
      soyInk: true,
      refillable: true
    },
    directions: 'Hold bottle 8 inches from face with eyes closed. Mist 3-4 pumps generously after cleansing or throughout the day for an instant dewy pick-me-up.',
    ingredientsList: 'Hamamelis Virginiana (Witch Hazel) Water*, Rosa Damascena Flower Distillate*, Glycerin, Salix Alba (Willow) Bark Extract. *Certified Organic.',
    sku: 'FG-HYT-100',
    inventoryStock: 64,
    warehouseLocation: 'Bay C4 - Pacific Northwest Hub',
    expiryDate: '11/2028'
  },
  {
    id: 'botanical-ritual-bundle',
    name: 'Complete Glow Ritual Box (4-Piece Set)',
    category: 'bundles',
    headline: 'The Ultimate 4-Step Organic Skincare Protocol in Eco Tube',
    description: 'Contains full sizes of Gentle Cleanser, Hydrating Toner, Vitamin C Serum, and Radiance Gel Cream housed in our collector handcrafted biodegradable paper tube.',
    keyActives: ['Full 4-Step Routine: Cleanse, Tone, Treat, Moisturize'],
    skinType: 'Comprehensive Full Skin Protocol',
    volume: 'Complete 4-Piece Ritual',
    basePriceUSD: 148,
    rating: 5.0,
    reviewCount: 142,
    modelType: 'tube',
    certifications: ['Zero Waste Certified Box', 'B-Corp Certified Packaging', '100% Carbon Neutral Ship'],
    packaging: {
      material: 'Heavyweight rigid cylindrical tube made from post-consumer recycled paperboard, soy-ink printed',
      recyclable: true,
      soyInk: true,
      refillable: true
    },
    directions: 'Follow the 4-step sequence: Step 1 Cleanser -> Step 2 Toner Mist -> Step 3 Vitamin C Dropper -> Step 4 Radiance Gel Cream.',
    ingredientsList: 'See individual product listings for exhaustive botanical ingredient decks.',
    sku: 'FG-BUN-4PC',
    inventoryStock: 26,
    warehouseLocation: 'Bay D1 - Gift & VIP Suites',
    expiryDate: '10/2028'
  }
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', rateFromUSD: 1.0, name: 'US Dollar', flag: '🇺🇸' },
  { code: 'INR', symbol: '₹', rateFromUSD: 86.8, name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'EUR', symbol: '€', rateFromUSD: 0.92, name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', rateFromUSD: 0.79, name: 'British Pound', flag: '🇬🇧' },
  { code: 'AUD', symbol: 'A$', rateFromUSD: 1.54, name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CAD', symbol: 'C$', rateFromUSD: 1.38, name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'JPY', symbol: '¥', rateFromUSD: 154.5, name: 'Japanese Yen', flag: '🇯🇵' },
] as const;
