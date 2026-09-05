import React, { useState } from 'react';
import { CustomerOrder, TrackingStatus } from '../../types';
import { 
  Truck, 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Package, 
  RefreshCw, 
  Compass, 
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface DeliveryTrackingDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  order: CustomerOrder | null;
  onSimulateStatusAdvance?: (nextStatus: TrackingStatus) => void;
}

export const DeliveryTrackingDashboard: React.FC<DeliveryTrackingDashboardProps> = ({
  isOpen,
  onClose,
  order,
  onSimulateStatusAdvance
}) => {
  const [searchTrackingCode, setSearchTrackingCode] = useState<string>('');

  if (!isOpen) return null;

  // Fallback demo order if user opens tracking directly before checkout
  const activeOrder: CustomerOrder = order || {
    id: 'demo-ord',
    orderNumber: 'FG-ORD-882194',
    date: 'Sep 4, 2026',
    items: [],
    subtotal: 96,
    discount: 0,
    tax: 7.68,
    shipping: 0,
    total: 103.68,
    currency: 'USD',
    paymentMethod: 'stripe',
    paymentStatus: 'completed',
    transactionId: 'tx_demo99482',
    shippingAddress: {
      fullName: 'Elena Rostova',
      email: 'elena.rostova@example.com',
      street: '1428 Botanical Garden Blvd',
      city: 'Portland',
      state: 'OR',
      postalCode: '97201',
      country: 'United States',
      phone: '+1 503-555-0144'
    },
    trackingNumber: 'TRK-FG-9821430-US',
    carrier: 'DHL Express Green (Eco Electric Fleet)',
    estimatedDelivery: 'Sep 7, 2026 by 2:00 PM',
    currentStatus: 'in_transit',
    statusHistory: [
      {
        status: 'confirmed',
        label: 'Order Confirmed & Securely Paid',
        location: 'FreshGlow Organic Labs (Portland, OR)',
        timestamp: 'Sep 4, 08:30 AM',
        completed: true,
        notes: 'Payment verified via 256-bit SSL gateway. Fresh lab batch assigned.'
      },
      {
        status: 'formulating',
        label: 'Cold Formulation & Lab Quality Batching',
        location: 'Cleanroom Suite 3 (Portland, OR)',
        timestamp: 'Sep 4, 11:15 AM',
        completed: true,
        notes: 'Cold-pressed green tea & niacinamide homogenised under inert argon shield.'
      },
      {
        status: 'quality_checked',
        label: 'Triple Purity & Microbial Inspection',
        location: 'Bio-Analytical QA Wing',
        timestamp: 'Sep 4, 02:45 PM',
        completed: true,
        notes: 'Purity score verified: 99.8% organic actives. Certificate LOT-2026-B94 generated.'
      },
      {
        status: 'dispatched',
        label: 'Packed in Recyclable Soy-Ink Tube & Dispatched',
        location: 'Eco Fulfillment Station #4',
        timestamp: 'Sep 4, 05:20 PM',
        completed: true,
        notes: 'Sealed with plant-based tape in 100% post-consumer cardboard tube.'
      },
      {
        status: 'in_transit',
        label: 'In Transit to Regional Eco Sorting Facility',
        location: 'Pacific Northwest Green Hub (Seattle, WA)',
        timestamp: 'Sep 5, 04:10 AM',
        completed: true,
        notes: 'Departed sorting facility on electric logistics transporter.'
      },
      {
        status: 'out_for_delivery',
        label: 'Out for Delivery to Your Doorstep',
        location: 'Local Green Courier Van (Portland, OR)',
        timestamp: 'Expected Sep 7, 09:00 AM',
        completed: false,
        notes: 'Courier will request signature or safe drop on covered porch.'
      },
      {
        status: 'delivered',
        label: 'Delivered to Customer Doorstep',
        location: 'Customer Address',
        timestamp: 'Expected Sep 7, 01:30 PM',
        completed: false
      }
    ],
    invoiceGenerated: true
  };

  const statusList: { key: TrackingStatus; title: string; desc: string }[] = [
    { key: 'confirmed', title: 'Confirmed', desc: 'Payment verified' },
    { key: 'formulating', title: 'Lab Formulated', desc: 'Fresh botanicals' },
    { key: 'quality_checked', title: 'QC Passed', desc: '99.8% purity test' },
    { key: 'dispatched', title: 'Dispatched', desc: 'Handed to eco carrier' },
    { key: 'in_transit', title: 'In Transit', desc: 'Route tracking live' },
    { key: 'out_for_delivery', title: 'Out for Delivery', desc: 'On local van' },
    { key: 'delivered', title: 'Delivered', desc: 'Arrived at door' }
  ];

  const currentStatusIndex = statusList.findIndex((s) => s.key === activeOrder.currentStatus);

  const handleAdvanceSimulation = () => {
    if (!onSimulateStatusAdvance) return;
    const nextIndex = (currentStatusIndex + 1) % statusList.length;
    onSimulateStatusAdvance(statusList[nextIndex].key);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#FAF9F5] p-5 sm:p-6 border-b border-[#E8DCC0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2E6B4E] text-white flex items-center justify-center shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-xl text-[#1A3324]">
                  FreshGlow Eco Shipment Dashboard
                </h3>
                <span className="bg-emerald-100 text-[#2E6B4E] text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Telemetry
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Real-time cold-chain telemetry & carbon-neutral transport updates
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Top Shipment Identity Card */}
          <div className="bg-gradient-to-br from-[#FAF9F5] to-[#F3EFE6] p-5 rounded-2xl border border-[#E8DCC0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-gray-500">Tracking Code:</div>
              <div className="font-mono font-bold text-base sm:text-lg text-[#2E6B4E] flex items-center gap-2">
                <span>{activeOrder.trackingNumber}</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-[#E8DCC0] text-gray-600 font-sans">
                  {activeOrder.carrier}
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Destination: <span className="font-semibold text-gray-800">{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.country}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[11px] text-gray-500">Estimated Delivery:</div>
                <div className="text-sm font-bold text-[#1A3324] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D9896A]" />
                  <span>{activeOrder.estimatedDelivery}</span>
                </div>
              </div>

              {/* Simulation button */}
              {onSimulateStatusAdvance && (
                <button
                  onClick={handleAdvanceSimulation}
                  className="bg-[#2E6B4E] hover:bg-[#1E4B35] text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                  title="Advance shipment milestone for demonstration"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Simulate Next Step</span>
                </button>
              )}
            </div>
          </div>

          {/* Shipment Stepper Progress Bar */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Current Shipment Trajectory
            </h4>

            {/* Desktop Stepper */}
            <div className="relative flex items-center justify-between hidden sm:flex">
              {/* Progress track line */}
              <div className="absolute top-4 left-6 right-6 h-1 bg-gray-200 -z-0">
                <div
                  className="h-full bg-[#2E6B4E] transition-all duration-500"
                  style={{
                    width: `${(Math.max(0, currentStatusIndex) / (statusList.length - 1)) * 100}%`
                  }}
                />
              </div>

              {statusList.map((step, idx) => {
                const isCompleted = idx <= currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center z-10 w-24">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-[#D9896A] text-white ring-4 ring-[#D9896A]/20 shadow-md scale-110'
                          : isCompleted
                          ? 'bg-[#2E6B4E] text-white'
                          : 'bg-white border-2 border-gray-300 text-gray-400'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs">{idx + 1}</span>}
                    </div>
                    <span className={`text-[11px] font-semibold mt-2 leading-tight ${isCurrent ? 'text-[#D9896A]' : isCompleted ? 'text-[#1A3324]' : 'text-gray-400'}`}>
                      {step.title}
                    </span>
                    <span className="text-[9px] text-gray-400 mt-0.5">{step.desc}</span>
                  </div>
                );
              })}
            </div>

            {/* Mobile simplified progress */}
            <div className="sm:hidden space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#2E6B4E]">
                <span>Status: {statusList[currentStatusIndex]?.title}</span>
                <span>Step {currentStatusIndex + 1} of {statusList.length}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2E6B4E]"
                  style={{ width: `${((currentStatusIndex + 1) / statusList.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Route Map & Checkpoints Split */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Route Map Simulation (5 cols) */}
            <div className="md:col-span-5 bg-[#FAF9F5] p-5 rounded-2xl border border-[#E8DCC0] flex flex-col justify-between">
              <div>
                <h4 className="font-serif font-bold text-base text-[#1A3324] mb-1 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#2E6B4E]" />
                  Live Route Telemetry
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                  Autonomous eco fleet route coordinates
                </p>

                {/* Visual Map Graphic */}
                <div className="relative h-44 bg-emerald-950/90 rounded-xl overflow-hidden p-3 flex flex-col justify-between text-emerald-300 border border-emerald-800">
                  {/* Map Grid Pattern */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#A7C4A1_1px,transparent_1px)] bg-[size:12px_12px]"></div>

                  {/* Route path line */}
                  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M 40 120 Q 140 40 280 80"
                      fill="none"
                      stroke="#A7C4A1"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                    />
                    <circle cx="40" cy="120" r="5" fill="#2E6B4E" />
                    <circle cx="280" cy="80" r="5" fill="#D9896A" />
                  </svg>

                  <div className="relative z-10 flex justify-between text-[11px]">
                    <span className="bg-black/50 px-2 py-0.5 rounded text-emerald-200">
                      Portland Lab (Orig)
                    </span>
                    <span className="bg-black/50 px-2 py-0.5 rounded text-amber-200">
                      Destination Hub
                    </span>
                  </div>

                  <div className="relative z-10 bg-black/60 backdrop-blur-xs p-2 rounded-lg text-[10px] space-y-0.5 text-gray-300">
                    <div className="flex justify-between">
                      <span>Vehicle:</span>
                      <span className="text-white font-mono">Rivian Eco-Electric #84</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cargo Temp:</span>
                      <span className="text-emerald-300 font-mono">19.2°C (Optimal)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carbon Saved:</span>
                      <span className="text-emerald-300 font-mono">4.2 kg CO₂e</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8DCC0] mt-3 flex items-center justify-between text-[11px] text-gray-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Tamper-Proof Smart Seal
                </span>
                <span className="font-semibold text-[#2E6B4E]">Active</span>
              </div>
            </div>

            {/* Checkpoint Timeline History (7 cols) */}
            <div className="md:col-span-7 bg-white p-5 rounded-2xl border border-gray-200 space-y-3">
              <h4 className="font-serif font-bold text-base text-[#1A3324] mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#2E6B4E]" />
                Detailed Waypoint Milestones
              </h4>

              <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                {activeOrder.statusHistory.map((milestone, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <div className="flex flex-col items-center mt-0.5">
                      <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                          milestone.completed ? 'bg-[#2E6B4E]' : 'bg-gray-300'
                        }`}
                      >
                        {milestone.completed && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      {i < activeOrder.statusHistory.length - 1 && (
                        <div className="w-0.5 h-10 bg-gray-200 mt-1" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <span className="font-bold text-[#1A3324]">{milestone.label}</span>
                        <span className="text-[10px] text-gray-400">{milestone.timestamp}</span>
                      </div>
                      <div className="text-[11px] text-[#2E6B4E] font-medium">{milestone.location}</div>
                      {milestone.notes && (
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed bg-[#FAF9F5] p-2 rounded-lg border border-[#E8DCC0]/50">
                          {milestone.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF9F5] border-t border-[#E8DCC0] flex items-center justify-between text-xs">
          <span className="text-gray-500">Need courier delivery assistance? Call FreshGlow Concierge</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#2E6B4E] hover:bg-[#1E4B35] text-white rounded-xl font-semibold"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
