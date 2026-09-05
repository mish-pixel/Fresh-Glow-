import React from 'react';
import { CustomerOrder } from '../../types';
import { CURRENCIES } from '../../data/products';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  Leaf, 
  ShieldCheck, 
  Truck, 
  ArrowRight 
} from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: CustomerOrder | null;
  onOpenTracking: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  order,
  onOpenTracking
}) => {
  if (!isOpen || !order) return null;

  const currConfig = CURRENCIES.find((c) => c.code === order.currency) || CURRENCIES[0];

  const formatCurrency = (amountUSD: number) => {
    const val = amountUSD * currConfig.rateFromUSD;
    return `${currConfig.symbol}${val.toLocaleString('en-US', {
      minimumFractionDigits: currConfig.code === 'JPY' ? 0 : 2,
      maximumFractionDigits: currConfig.code === 'JPY' ? 0 : 2
    })}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-auto flex flex-col">
        {/* Action Header */}
        <div className="bg-[#FAF9F5] p-4 px-6 border-b border-[#E8DCC0] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-[#2E6B4E] p-1.5 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <span className="font-semibold text-sm text-[#1A3324]">
              Automated Invoice Generated Successfully
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-gray-600 hover:text-[#2E6B4E] bg-white border border-gray-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Print Invoice"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="p-6 sm:p-8 space-y-6 text-gray-800 bg-white">
          {/* Top Brand & Metadata */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-gray-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl text-[#2E6B4E]">🌿</span>
                <span className="font-serif font-bold text-2xl text-[#1A3324] tracking-tight">
                  FreshGlow
                </span>
              </div>
              <p className="text-[11px] text-[#2E6B4E] font-semibold tracking-widest uppercase mt-0.5">
                ORGANIC SKINCARE LLC
              </p>
              <p className="text-xs text-gray-500 mt-1">
                742 Evergreen Botanical Way, Suite 400<br />
                Portland, OR 97201 USA • GST/VAT ID: US-ORG-9821430
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block bg-[#EBF3EA] text-[#2E6B4E] font-mono text-xs font-bold px-3 py-1 rounded-full uppercase">
                TAX INVOICE
              </span>
              <div className="mt-2 text-xs">
                <span className="text-gray-400">Invoice No:</span>{' '}
                <span className="font-mono font-bold text-[#1A3324]">
                  INV-{order.orderNumber.replace('FG-ORD-', '2026-')}
                </span>
              </div>
              <div className="text-xs">
                <span className="text-gray-400">Date:</span>{' '}
                <span className="font-semibold text-gray-700">{order.date}</span>
              </div>
              <div className="text-xs">
                <span className="text-gray-400">Payment:</span>{' '}
                <span className="font-semibold text-emerald-700 uppercase">
                  {order.paymentMethod} (PAID)
                </span>
              </div>
            </div>
          </div>

          {/* Bill To & Ship To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E8DCC0]/60">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Billed & Shipped To:
              </span>
              <div className="font-bold text-[#1A3324]">{order.shippingAddress.fullName}</div>
              <div className="text-gray-600">{order.shippingAddress.street}</div>
              <div className="text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </div>
              <div className="text-gray-600">{order.shippingAddress.country}</div>
              <div className="text-gray-500 mt-1">Email: {order.shippingAddress.email}</div>
            </div>

            <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E8DCC0]/60 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Logistics & Tracking Info:
                </span>
                <div className="flex items-center gap-1.5 font-bold text-gray-800">
                  <Truck className="w-3.5 h-3.5 text-[#2E6B4E]" />
                  <span>{order.carrier}</span>
                </div>
                <div className="text-xs font-mono text-[#2E6B4E] mt-1 font-semibold">
                  {order.trackingNumber}
                </div>
              </div>

              <div className="text-[11px] text-gray-500 pt-2 border-t border-gray-200 mt-2">
                Estimated Delivery: <span className="font-semibold text-[#1A3324]">{order.estimatedDelivery}</span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-300 text-gray-500 uppercase tracking-wider text-[10px]">
                  <th className="py-2 font-semibold">Item & Variant Details</th>
                  <th className="py-2 text-center font-semibold">Qty</th>
                  <th className="py-2 text-right font-semibold">Unit Price</th>
                  <th className="py-2 text-right font-semibold">Total ({order.currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item, idx) => {
                  const unitPrice = (item.variant ? item.variant.priceUSD : item.product.basePriceUSD) + (item.includeEcoTube ? 8 : 0);
                  return (
                    <tr key={idx} className="text-gray-700">
                      <td className="py-2.5">
                        <span className="font-bold text-[#1A3324] block">
                          {item.variant ? item.variant.name : item.product.name}
                        </span>
                        <span className="text-[10px] text-gray-500 block">
                          SKU: {item.variant ? item.variant.sku : item.product.sku}
                        </span>
                        {item.includeEcoTube && (
                          <span className="text-[10px] text-emerald-700 block">
                            + Cylindrical Eco Paper Packaging Tube
                          </span>
                        )}
                        {item.customEngraving && (
                          <span className="text-[10px] text-[#D9896A] italic block">
                            Lid Engraving: “{item.customEngraving}”
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 text-center font-semibold">{item.quantity}</td>
                      <td className="py-2.5 text-right font-mono">{formatCurrency(unitPrice)}</td>
                      <td className="py-2.5 text-right font-bold text-gray-900 font-mono">
                        {formatCurrency(unitPrice * item.quantity)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="flex flex-col sm:flex-row justify-between items-start pt-4 border-t border-gray-200 gap-4">
            <div className="text-xs text-gray-500 max-w-xs space-y-1">
              <div className="flex items-center gap-1 text-emerald-800 font-semibold">
                <ShieldCheck className="w-4 h-4" /> 100% Carbon-Neutral Shipping
              </div>
              <p className="text-[11px]">
                Your shipment carbon emissions are offset by FreshGlow reforestation projects in the Pacific Northwest.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discounts Applied</span>
                  <span className="font-mono">-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Eco Shipping</span>
                <span className="font-mono">{order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (VAT / GST included)</span>
                <span className="font-mono">{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-[#1A3324] pt-2 border-t border-gray-300">
                <span>Grand Total</span>
                <span className="font-mono text-[#2E6B4E]">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="p-4 bg-[#FAF9F5] border-t border-[#E8DCC0] flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <div className="text-xs text-gray-500">
            Order reference: <span className="font-mono font-bold text-gray-700">{order.orderNumber}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onOpenTracking();
              }}
              className="flex-1 sm:flex-initial bg-[#2E6B4E] hover:bg-[#1E4B35] text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Truck className="w-4 h-4" />
              <span>Track Delivery in Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
