import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CartItem, 
  CurrencyCode, 
  PaymentMethod, 
  CustomerOrder,
  LoyaltyProfile
} from '../../types';
import { CURRENCIES } from '../../data/products';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  QrCode, 
  Truck, 
  Tag, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: CurrencyCode;
  onChangeCurrency: (code: CurrencyCode) => void;
  formatPrice: (priceUSD: number) => string;
  loyalty: LoyaltyProfile;
  onOrderCompleted: (order: CustomerOrder) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  currency,
  onChangeCurrency,
  formatPrice,
  loyalty,
  onOrderCompleted
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(currency === 'INR' ? 'upi' : 'stripe');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [discountCode, setDiscountCode] = useState<string>('');
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState<number>(0);
  const [redeemLoyaltyPoints, setRedeemLoyaltyPoints] = useState<boolean>(false);

  // Form Fields
  const [name, setName] = useState<string>('Mishyy Organic Skincare');
  const [email, setEmail] = useState<string>('mishyypvt@gmail.com');
  const [street, setStreet] = useState<string>('742 Evergreen Botanical Way');
  const [city, setCity] = useState<string>('Portland');
  const [state, setState] = useState<string>('OR');
  const [postalCode, setPostalCode] = useState<string>('97201');
  const [country, setCountry] = useState<string>(currency === 'INR' ? 'India' : 'United States');
  const [phone, setPhone] = useState<string>('+1 (503) 555-0192');

  // Stripe Card state
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('10/28');
  const [cardCvc, setCardCvc] = useState<string>('842');

  // UPI state (for INR)
  const [upiId, setUpiId] = useState<string>('mishyy@okhdfcbank');
  const [upiMethod, setUpiMethod] = useState<'qr' | 'id'>('qr');

  if (!isOpen) return null;

  // Pricing math
  const subtotalUSD = cartItems.reduce((sum, item) => {
    const price = item.variant ? item.variant.priceUSD : item.product.basePriceUSD;
    const packagingCost = item.includeEcoTube ? 8 : 0;
    return sum + (price + packagingCost) * item.quantity;
  }, 0);

  const discountAmountUSD = (subtotalUSD * appliedDiscountPercent) / 100;
  const loyaltyDiscountUSD = redeemLoyaltyPoints ? Math.min(15, subtotalUSD * 0.2) : 0;
  const taxUSD = (subtotalUSD - discountAmountUSD - loyaltyDiscountUSD) * 0.08;
  const shippingUSD = subtotalUSD > 50 ? 0 : 7.5;
  const totalUSD = Math.max(0, subtotalUSD - discountAmountUSD - loyaltyDiscountUSD + taxUSD + shippingUSD);

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (discountCode.trim().toUpperCase() === 'ORGANIC20' || discountCode.trim().toUpperCase() === 'FRESHGLOW') {
      setAppliedDiscountPercent(20);
    } else {
      alert('Use code ORGANIC20 for 20% off your order!');
    }
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      // Launch celebratory confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2E6B4E', '#D9896A', '#F2C7C1', '#D4AF37']
      });

      const orderNumber = `FG-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const trackingNumber = `TRK-FG-${Math.floor(10000000 + Math.random() * 90000000)}-${currency === 'INR' ? 'IN' : 'US'}`;

      const newOrder: CustomerOrder = {
        id: `ord-${Date.now()}`,
        orderNumber,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        items: [...cartItems],
        subtotal: subtotalUSD,
        discount: discountAmountUSD + loyaltyDiscountUSD,
        tax: taxUSD,
        shipping: shippingUSD,
        total: totalUSD,
        currency,
        paymentMethod,
        paymentStatus: 'completed',
        transactionId: `tx_${Math.random().toString(36).substring(2, 14)}`,
        shippingAddress: {
          fullName: name,
          email,
          street,
          city,
          state,
          postalCode,
          country,
          phone
        },
        trackingNumber,
        carrier: currency === 'INR' ? 'BlueDart Eco Air' : 'DHL Express Green',
        estimatedDelivery: 'In 2-3 Business Days',
        currentStatus: 'confirmed',
        statusHistory: [
          {
            status: 'confirmed',
            label: 'Order Confirmed & Securely Paid',
            location: 'FreshGlow Organic Labs (Portland, OR)',
            timestamp: 'Just now',
            completed: true,
            notes: 'Payment verified via 256-bit SSL gateway. Batch allocation initiated.'
          },
          {
            status: 'formulating',
            label: 'Cold-Formulation & Botanical Lab QC',
            location: 'Cleanroom Sterile Suite A',
            timestamp: 'Expected in 4 hours',
            completed: false
          },
          {
            status: 'quality_checked',
            label: 'Triple Purity & Microbial Inspection',
            location: 'Quality Assurance Lab',
            timestamp: 'Expected tomorrow',
            completed: false
          },
          {
            status: 'dispatched',
            label: 'Packed in Soy-Ink Paper Tube & Dispatched',
            location: 'Eco Fulfillment Hub',
            timestamp: 'Expected tomorrow afternoon',
            completed: false
          },
          {
            status: 'in_transit',
            label: 'In Transit with Carbon-Neutral Logistics',
            location: 'Regional Sorting Facility',
            timestamp: 'Expected in 2 days',
            completed: false
          },
          {
            status: 'out_for_delivery',
            label: 'Out for Delivery to Your Doorstep',
            location: 'Local Eco Courier van',
            timestamp: 'Expected in 3 days',
            completed: false
          },
          {
            status: 'delivered',
            label: 'Delivered',
            location: name,
            timestamp: 'Pending',
            completed: false
          }
        ],
        invoiceGenerated: true
      };

      onOrderCompleted(newOrder);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#FAF9F5] p-5 sm:p-6 border-b border-[#E8DCC0] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-xl text-[#1A3324]">
                FreshGlow Frictionless Checkout
              </span>
              <span className="bg-emerald-100 text-[#2E6B4E] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" /> 256-Bit SSL
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Multi-Currency Gateway • Automated Tax Invoice • Carbon-Neutral Dispatch
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Payment & Details (7 cols) */}
          <div className="md:col-span-7 space-y-5">
            {/* Multi-Currency Selector */}
            <div className="bg-[#FAF9F5] p-3.5 rounded-2xl border border-[#E8DCC0]">
              <div className="flex items-center justify-between text-xs mb-2 font-medium text-gray-700">
                <span>Select Currency:</span>
                <span className="text-[#2E6B4E] font-bold">Auto-converted at checkout</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {CURRENCIES.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => onChangeCurrency(curr.code)}
                    className={`py-1.5 px-1 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                      currency === curr.code
                        ? 'bg-[#2E6B4E] text-white shadow-xs scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <span>{curr.flag}</span>
                    <span className="text-[10px] mt-0.5">{curr.code}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selector (Stripe, PayPal, INR/UPI) */}
            <div>
              <label className="text-xs font-bold text-[#333333] uppercase tracking-wider block mb-2">
                Secure Payment Method
              </label>

              <div className="grid grid-cols-3 gap-2">
                {/* Stripe */}
                <button
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'stripe'
                      ? 'border-[#2E6B4E] bg-[#F7FAF6] ring-2 ring-[#2E6B4E]/20'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-[#1A3324]">Stripe</span>
                    <CreditCard className="w-4 h-4 text-[#2E6B4E]" />
                  </div>
                  <span className="text-[10px] text-gray-500">Cards & 3D Secure</span>
                </button>

                {/* PayPal */}
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-[#0079C1] bg-[#F0F8FF] ring-2 ring-[#0079C1]/20'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-[#0079C1]">PayPal</span>
                    <span className="text-xs font-bold text-[#0079C1]">PP</span>
                  </div>
                  <span className="text-[10px] text-gray-500">Buyer Protected</span>
                </button>

                {/* INR / UPI */}
                <button
                  onClick={() => {
                    setPaymentMethod('upi');
                    if (currency !== 'INR') onChangeCurrency('INR');
                  }}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-[#D9896A] bg-[#FDF9F6] ring-2 ring-[#D9896A]/20'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-[#D9896A]">INR / UPI</span>
                    <QrCode className="w-4 h-4 text-[#D9896A]" />
                  </div>
                  <span className="text-[10px] text-gray-500">GPay, PhonePe, BHIM</span>
                </button>
              </div>
            </div>

            {/* Provider Form Specifics */}
            {paymentMethod === 'stripe' && (
              <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#E8DCC0] space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#2E6B4E]" /> Card Information
                  </span>
                  <span className="text-[10px] text-gray-400">Encrypted by Stripe Element</span>
                </div>
                <div>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Card Number"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2E6B4E]/30 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM / YY"
                    className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2E6B4E]/30 font-mono text-center"
                  />
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="CVC / CVV"
                    className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2E6B4E]/30 font-mono text-center"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="bg-[#F0F8FF] p-4 rounded-2xl border border-[#0079C1]/30 space-y-3 animate-in fade-in text-center">
                <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center text-[#0079C1] font-bold text-lg shadow-xs">
                  PP
                </div>
                <p className="text-xs text-gray-700">
                  You will complete your payment safely via PayPal. All purchases are covered by PayPal Buyer Protection for 180 days.
                </p>
                <div className="bg-white p-2 rounded-xl text-xs font-semibold text-[#0079C1] border border-blue-200">
                  Ready to connect to PayPal sandbox
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="bg-[#FDF9F6] p-4 rounded-2xl border border-[#D9896A]/30 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs text-gray-700 font-medium">
                  <span className="font-semibold text-[#D9896A]">Instant INR UPI Transfer</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setUpiMethod('qr')}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        upiMethod === 'qr' ? 'bg-[#D9896A] text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      Scan QR
                    </button>
                    <button
                      onClick={() => setUpiMethod('id')}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        upiMethod === 'id' ? 'bg-[#D9896A] text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      UPI ID / VPA
                    </button>
                  </div>
                </div>

                {upiMethod === 'qr' ? (
                  <div className="bg-white p-4 rounded-xl border border-gray-200 text-center space-y-2 flex flex-col items-center">
                    {/* Visual QR simulation */}
                    <div className="w-36 h-36 border-2 border-gray-900 rounded-lg p-2 flex flex-col justify-between bg-white shadow-xs">
                      <div className="flex justify-between">
                        <div className="w-8 h-8 border-4 border-black"></div>
                        <div className="w-8 h-8 border-4 border-black"></div>
                      </div>
                      <div className="text-[9px] font-bold tracking-widest text-[#2E6B4E]">
                        FRESHGLOW UPI
                      </div>
                      <div className="flex justify-between">
                        <div className="w-8 h-8 border-4 border-black"></div>
                        <div className="w-4 h-4 bg-black"></div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      Scan with Google Pay, PhonePe, Paytm or BHIM
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Amount: {formatPrice(totalUSD)}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] text-gray-600 block mb-1">Enter Virtual Payment Address (VPA):</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#D9896A]/30"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Shipping Address Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#333333] uppercase tracking-wider block">
                Shipping Destination
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="bg-[#FAF9F5] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#333333]"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email for Invoice"
                  className="bg-[#FAF9F5] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#333333]"
                />
              </div>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Street Address"
                className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#333333]"
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="bg-[#FAF9F5] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#333333]"
                />
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State / Province"
                  className="bg-[#FAF9F5] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#333333]"
                />
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Postal Code"
                  className="bg-[#FAF9F5] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#333333]"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Invoice Preview (5 cols) */}
          <div className="md:col-span-5 bg-[#FAF9F5] p-5 rounded-2xl border border-[#E8DCC0] flex flex-col justify-between space-y-4">
            <div>
              <h4 className="font-serif font-bold text-base text-[#1A3324] mb-3">
                Order Summary ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)
              </h4>

              {/* Cart Items List */}
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#1A3324]">
                        {item.variant ? item.variant.name : item.product.name}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        Qty: {item.quantity} {item.includeEcoTube ? '• With Eco Tube' : ''}
                      </div>
                      {item.customEngraving && (
                        <div className="text-[10px] text-[#D9896A] italic">
                          Lid: “{item.customEngraving}”
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-gray-800">
                      {formatPrice((item.variant ? item.variant.priceUSD : item.product.basePriceUSD) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyDiscount} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Promo (try ORGANIC20)"
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs uppercase"
                />
                <button
                  type="submit"
                  className="bg-[#2E6B4E] hover:bg-[#1E4B35] text-white px-3 py-1.5 rounded-xl text-xs font-semibold"
                >
                  Apply
                </button>
              </form>

              {appliedDiscountPercent > 0 && (
                <div className="mt-1.5 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <Tag className="w-3 h-3" /> 20% discount applied!
                </div>
              )}

              {/* Loyalty points toggle */}
              <div
                onClick={() => setRedeemLoyaltyPoints(!redeemLoyaltyPoints)}
                className="mt-2 p-2 bg-white rounded-xl border border-[#E8DCC0] cursor-pointer flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D9896A]" />
                  <span>Redeem 100 FreshGlow Points</span>
                </div>
                <input
                  type="checkbox"
                  checked={redeemLoyaltyPoints}
                  readOnly
                  className="accent-[#2E6B4E]"
                />
              </div>

              {/* Price Breakdown */}
              <div className="mt-4 pt-3 border-t border-gray-200 space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotalUSD)}</span>
                </div>
                {(appliedDiscountPercent > 0 || loyaltyDiscountUSD > 0) && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Total Discounts</span>
                    <span>-{formatPrice(discountAmountUSD + loyaltyDiscountUSD)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Standard Eco Shipping</span>
                  <span>{shippingUSD === 0 ? 'FREE' : formatPrice(shippingUSD)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (GST/VAT)</span>
                  <span>{formatPrice(taxUSD)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#1A3324] pt-2 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span className="text-base text-[#2E6B4E]">{formatPrice(totalUSD)}</span>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <div className="space-y-2 pt-2">
              <button
                id="confirm-pay-btn"
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="w-full bg-[#2E6B4E] hover:bg-[#1E4B35] disabled:opacity-75 text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    <span>Authorizing {paymentMethod.toUpperCase()} Gateway...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>Pay {formatPrice(totalUSD)} • Confirm Order</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> Automatic invoice generated & emailed instantly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
