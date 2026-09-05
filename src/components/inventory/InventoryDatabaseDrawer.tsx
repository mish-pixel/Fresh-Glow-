import React from 'react';
import { InventoryRecord } from '../../data/inventory';
import { 
  Database, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Thermometer, 
  ShieldCheck, 
  Package,
  RefreshCw
} from 'lucide-react';

interface InventoryDatabaseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryRecord[];
  onRefresh: () => void;
}

export const InventoryDatabaseDrawer: React.FC<InventoryDatabaseDrawerProps> = ({
  isOpen,
  onClose,
  inventory,
  onRefresh
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between border-l border-gray-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#FAF9F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF3EA] text-[#2E6B4E] flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-[#1A3324]">
                  FreshGlow Central Inventory Database
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Connected
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Connected to Oracle Cloud Skincare Logistics • Real-time synchronization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="p-2 text-gray-500 hover:text-[#2E6B4E] rounded-lg hover:bg-white transition-colors"
              title="Refresh inventory status"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Database Content Table */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E8DCC0]">
              <div className="text-[11px] text-gray-500">Total Stock Available</div>
              <div className="text-xl font-bold text-[#1A3324] mt-0.5">
                {inventory.reduce((sum, item) => sum + item.inStock, 0)} units
              </div>
            </div>
            <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E8DCC0]">
              <div className="text-[11px] text-gray-500">Active SKUs Tracked</div>
              <div className="text-xl font-bold text-[#2E6B4E] mt-0.5">
                {inventory.length} SKUs
              </div>
            </div>
            <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E8DCC0]">
              <div className="text-[11px] text-gray-500">Batch QC Purity Avg</div>
              <div className="text-xl font-bold text-[#D9896A] mt-0.5">
                99.8% Passed
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              SKU Inventory Roster & Cold Storage Status
            </h4>

            {inventory.map((item) => {
              const isLowStock = item.inStock <= item.reorderLevel;
              return (
                <div
                  key={item.sku}
                  className="bg-white p-4 rounded-xl border border-gray-200 hover:border-[#2E6B4E]/40 transition-colors shadow-2xs space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1A3324]">{item.name}</span>
                        {isLowStock ? (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Reorder Triggered
                          </span>
                        ) : (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Optimum Stock
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 font-mono mt-0.5">
                        SKU: {item.sku} • {item.category}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-bold text-[#1A3324]">{item.inStock} in stock</div>
                      <div className="text-[10px] text-gray-400">({item.reserved} reserved in carts)</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gray-100 text-[11px] text-gray-600">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Location:</span>
                      <span className="font-medium text-gray-700">{item.warehouseBay}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Active Batch:</span>
                      <span className="font-medium text-gray-700">{item.batchNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Purity Score:</span>
                      <span className="font-medium text-emerald-700 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> {item.purityScore}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Storage Temp:</span>
                      <span className="font-medium text-gray-700 flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-amber-600" /> {item.idealTempCelsius}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-[#FAF9F5] text-xs text-gray-500 flex items-center justify-between">
          <span>Enterprise Inventory API v4.2 • SSL Encrypted</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2E6B4E] hover:bg-[#1E4B35] text-white rounded-xl text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
