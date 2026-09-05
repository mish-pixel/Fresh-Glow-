export interface InventoryRecord {
  sku: string;
  name: string;
  variantId?: string;
  category: string;
  inStock: number;
  reserved: number;
  reorderLevel: number;
  warehouseBay: string;
  batchNumber: string;
  qcStatus: 'PASSED' | 'IN_TESTING' | 'RE-CERTIFIED';
  purityScore: number; // e.g. 99.8%
  organicCertificationId: string;
  lastRestocked: string;
  temperatureControlled: boolean;
  idealTempCelsius: string;
}

export const INITIAL_INVENTORY: InventoryRecord[] = [
  {
    sku: 'FG-RGC-050',
    name: 'Radiance Gel Cream (50g)',
    variantId: 'radiance-gel',
    category: 'Creams',
    inStock: 142,
    reserved: 12,
    reorderLevel: 25,
    warehouseBay: 'Vault-A12 (Cold Room)',
    batchNumber: 'LOT-2026-B94',
    qcStatus: 'PASSED',
    purityScore: 99.8,
    organicCertificationId: 'ECO-US-2026-904',
    lastRestocked: 'Sep 1, 2026',
    temperatureControlled: true,
    idealTempCelsius: '18°C - 22°C'
  },
  {
    sku: 'FG-GNC-050',
    name: 'Glow Night Cream (50g)',
    variantId: 'glow-night',
    category: 'Creams',
    inStock: 68,
    reserved: 8,
    reorderLevel: 20,
    warehouseBay: 'Vault-A14 (Cold Room)',
    batchNumber: 'LOT-2026-N12',
    qcStatus: 'PASSED',
    purityScore: 99.4,
    organicCertificationId: 'ECO-US-2026-905',
    lastRestocked: 'Aug 28, 2026',
    temperatureControlled: true,
    idealTempCelsius: '18°C - 22°C'
  },
  {
    sku: 'FG-RES-050',
    name: 'Renew Exfoliating Scrub (50g)',
    variantId: 'renew-scrub',
    category: 'Creams',
    inStock: 95,
    reserved: 5,
    reorderLevel: 20,
    warehouseBay: 'Vault-B02',
    batchNumber: 'LOT-2026-S77',
    qcStatus: 'PASSED',
    purityScore: 99.9,
    organicCertificationId: 'ECO-US-2026-881',
    lastRestocked: 'Aug 20, 2026',
    temperatureControlled: false,
    idealTempCelsius: '20°C - 25°C'
  },
  {
    sku: 'FG-SMS-050',
    name: 'Sunshield Mineral SPF 50 (50g)',
    variantId: 'sunshield-spf',
    category: 'SPF',
    inStock: 84,
    reserved: 14,
    reorderLevel: 30,
    warehouseBay: 'Vault-B08',
    batchNumber: 'LOT-2026-SPF04',
    qcStatus: 'PASSED',
    purityScore: 100.0,
    organicCertificationId: 'ECO-US-2026-773',
    lastRestocked: 'Sep 2, 2026',
    temperatureControlled: true,
    idealTempCelsius: '15°C - 20°C'
  },
  {
    sku: 'FG-VCS-030',
    name: 'Vitamin C Face Serum (30ml)',
    category: 'Serums',
    inStock: 38,
    reserved: 9,
    reorderLevel: 25,
    warehouseBay: 'Amber-Dark-Vault-01',
    batchNumber: 'LOT-2026-V88',
    qcStatus: 'PASSED',
    purityScore: 99.7,
    organicCertificationId: 'ECO-US-2026-442',
    lastRestocked: 'Aug 15, 2026',
    temperatureControlled: true,
    idealTempCelsius: '12°C - 16°C (UV Shielded)'
  },
  {
    sku: 'FG-GCL-100',
    name: 'Gentle Cleanser (100ml)',
    category: 'Cleansers',
    inStock: 89,
    reserved: 4,
    reorderLevel: 25,
    warehouseBay: 'Main-Floor-C09',
    batchNumber: 'LOT-2026-C19',
    qcStatus: 'PASSED',
    purityScore: 99.6,
    organicCertificationId: 'ECO-US-2026-118',
    lastRestocked: 'Aug 24, 2026',
    temperatureControlled: false,
    idealTempCelsius: '18°C - 24°C'
  },
  {
    sku: 'FG-HYT-100',
    name: 'Hydrating Toner (100ml)',
    category: 'Toners',
    inStock: 64,
    reserved: 7,
    reorderLevel: 20,
    warehouseBay: 'Main-Floor-C15',
    batchNumber: 'LOT-2026-T40',
    qcStatus: 'PASSED',
    purityScore: 99.8,
    organicCertificationId: 'ECO-US-2026-302',
    lastRestocked: 'Sep 1, 2026',
    temperatureControlled: false,
    idealTempCelsius: '18°C - 22°C'
  },
  {
    sku: 'FG-BUN-4PC',
    name: 'Complete Glow Ritual Box',
    category: 'Bundles',
    inStock: 26,
    reserved: 6,
    reorderLevel: 10,
    warehouseBay: 'Kitting-Assembly-Bay-K',
    batchNumber: 'LOT-2026-K01',
    qcStatus: 'PASSED',
    purityScore: 100.0,
    organicCertificationId: 'ECO-US-2026-ALL',
    lastRestocked: 'Sep 3, 2026',
    temperatureControlled: true,
    idealTempCelsius: '18°C - 22°C'
  }
];
