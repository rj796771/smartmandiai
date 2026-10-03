import React, { useState } from 'react';
import { Calculator, Scale, Coins, Truck, Percent, TrendingUp, RefreshCw } from 'lucide-react';
import { Language } from '../types';

interface ProfitCalculatorProps {
  initialMandiName?: string;
  language: Language;
}

export const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({ initialMandiName, language }) => {
  const [quantityQuintals, setQuantityQuintals] = useState<number>(50);
  const [marketPricePerQuintal, setMarketPricePerQuintal] = useState<number>(3200);
  const [distanceKm, setDistanceKm] = useState<number>(45);
  const [transportRatePerKmTon, setTransportRatePerKmTon] = useState<number>(20);
  const [commissionPercent, setCommissionPercent] = useState<number>(1.8);
  const [otherLoadingCharges, setOtherLoadingCharges] = useState<number>(300);

  // Calculations with safe input fallbacks
  const safeQuantity = Math.max(0, isNaN(quantityQuintals) ? 0 : quantityQuintals);
  const safePrice = Math.max(0, isNaN(marketPricePerQuintal) ? 0 : marketPricePerQuintal);
  const safeDistance = Math.max(0, isNaN(distanceKm) ? 0 : distanceKm);
  const safeRate = Math.max(0, isNaN(transportRatePerKmTon) ? 0 : transportRatePerKmTon);
  const safeCommission = Math.max(0, isNaN(commissionPercent) ? 0 : commissionPercent);
  const safeCharges = Math.max(0, isNaN(otherLoadingCharges) ? 0 : otherLoadingCharges);

  const quantityTonnes = safeQuantity / 10;
  const grossRevenue = safeQuantity * safePrice;
  const transportCost = Math.round(quantityTonnes * safeDistance * safeRate);
  const mandiCommission = Math.round(grossRevenue * (safeCommission / 100));
  const totalExpenses = transportCost + mandiCommission + safeCharges;
  const netProfit = Math.max(0, grossRevenue - totalExpenses);
  const profitMarginPercent = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : '0';

  const resetDefaults = () => {
    setQuantityQuintals(50);
    setMarketPricePerQuintal(3200);
    setDistanceKm(45);
    setTransportRatePerKmTon(20);
    setCommissionPercent(1.8);
    setOtherLoadingCharges(300);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] border border-[#DDD9CF] dark:border-[#28513A]/80 p-6 sm:p-8 card-shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-[#183A2B] dark:text-[#D99A2B] text-xs font-bold uppercase tracking-wider mb-1">
              <Calculator className="w-4 h-4 text-[#D99A2B]" />
              <span>Smart Net Profit Ledger</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
              {language === 'mr' ? 'नफा आणि खर्च कॅल्क्युलेटर' : language === 'hi' ? 'लाभ एवं खर्च कैलकुलेटर' : 'Interactive Profit Calculator'}
            </h2>
            <p className="text-sm text-[#667067] dark:text-[#B9C3BA] mt-1">
              Adjust variables to simulate exact net earnings before shipping produce to Mandi.
            </p>
          </div>

          <button
            onClick={resetDefaults}
            className="p-2.5 rounded-xl bg-[#F8F5ED] dark:bg-[#101814] text-[#183A2B] dark:text-[#F5F2E9] hover:bg-[#F0EBE0] text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-[#DDD9CF] dark:border-[#28513A]"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#D99A2B]" />
            <span>Reset</span>
          </button>
        </div>

        {initialMandiName && (
          <div className="mt-4 p-3 rounded-2xl bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A] text-xs text-[#183A2B] dark:text-[#D99A2B] font-semibold">
            Loaded preset prices for market: <strong>{initialMandiName}</strong>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sliders & Inputs */}
        <div className="lg:col-span-7 bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] border border-[#DDD9CF] dark:border-[#28513A]/80 p-6 sm:p-8 space-y-6 card-shadow">
          
          {/* Quantity */}
          <div>
            <div className="flex justify-between text-sm font-bold text-[#183A2B] dark:text-[#F5F2E9] mb-2">
              <span className="flex items-center space-x-1.5">
                <Scale className="w-4 h-4 text-[#D99A2B]" />
                <span>Quantity (Quintals)</span>
              </span>
              <span className="text-[#183A2B] dark:text-[#D99A2B] font-extrabold">{quantityQuintals} Quintals ({quantityTonnes.toFixed(1)} Tonnes)</span>
            </div>
            <input
              type="range"
              min="5"
              max="500"
              step="5"
              value={quantityQuintals}
              onChange={(e) => setQuantityQuintals(Number(e.target.value))}
              className="w-full accent-[#183A2B] dark:accent-[#D99A2B] cursor-pointer"
            />
          </div>

          {/* Market Price per Quintal */}
          <div>
            <div className="flex justify-between text-sm font-bold text-[#183A2B] dark:text-[#F5F2E9] mb-2">
              <span className="flex items-center space-x-1.5">
                <Coins className="w-4 h-4 text-[#D99A2B]" />
                <span>Market Price per Quintal (₹/100kg)</span>
              </span>
              <span className="text-[#183A2B] dark:text-[#D99A2B] font-extrabold">₹{marketPricePerQuintal.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="500"
              max="15000"
              step="50"
              value={marketPricePerQuintal}
              onChange={(e) => setMarketPricePerQuintal(Number(e.target.value))}
              className="w-full accent-[#183A2B] dark:accent-[#D99A2B] cursor-pointer"
            />
          </div>

          {/* Distance */}
          <div>
            <div className="flex justify-between text-sm font-bold text-[#183A2B] dark:text-[#F5F2E9] mb-2">
              <span className="flex items-center space-x-1.5">
                <Truck className="w-4 h-4 text-[#D99A2B]" />
                <span>Mandi Distance (km)</span>
              </span>
              <span className="text-[#C8663D] font-extrabold">{distanceKm} km</span>
            </div>
            <input
              type="range"
              min="5"
              max="600"
              step="5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full accent-[#C8663D] cursor-pointer"
            />
          </div>

          {/* Freight Rate & Commission Row */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#183A2B] dark:text-[#F5F2E9] mb-1">
                Freight Rate (₹/km/tonne)
              </label>
              <input
                type="number"
                value={transportRatePerKmTon}
                onChange={(e) => setTransportRatePerKmTon(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] bg-[#F8F5ED] dark:bg-[#101814] text-[#202522] dark:text-[#F5F2E9] text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#183A2B] dark:text-[#F5F2E9] mb-1">
                Mandi Fee / Commission (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={commissionPercent}
                onChange={(e) => setCommissionPercent(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] bg-[#F8F5ED] dark:bg-[#101814] text-[#202522] dark:text-[#F5F2E9] text-sm font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#183A2B] dark:text-[#F5F2E9] mb-1">
              Loading / Weighment Charges (₹)
            </label>
            <input
              type="number"
              value={otherLoadingCharges}
              onChange={(e) => setOtherLoadingCharges(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] bg-[#F8F5ED] dark:bg-[#101814] text-[#202522] dark:text-[#F5F2E9] text-sm font-bold"
            />
          </div>

        </div>

        {/* Right Column: Dynamic Net Earnings Display */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-[#183A2B] text-[#FFFDF8] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-[#28513A]">
            <span className="text-xs font-bold text-[#D99A2B] uppercase tracking-wider block">
              FINAL NET CASH PROFIT
            </span>
            <div className="text-4xl font-black font-['Manrope',sans-serif] mt-1 text-[#FFFDF8]">
              ₹{netProfit.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-[#B9C3BA] font-semibold mt-1">
              Profit Margin: {profitMarginPercent}% of gross revenue
            </p>

            <div className="mt-6 pt-6 border-t border-[#28513A] space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#B9C3BA]">Gross Sales Revenue:</span>
                <span className="font-bold text-[#FFFDF8]">₹{grossRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#C8663D]">
                <span>Total Expenses Deductions:</span>
                <span className="font-bold">− ₹{totalExpenses.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-3xl border border-[#DDD9CF] dark:border-[#28513A]/80 p-6 text-xs space-y-3 shadow-sm">
            <h4 className="font-bold text-sm text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif] mb-2">
              Expense Deductions Ledger
            </h4>
            
            <div className="flex justify-between py-1 border-b border-[#DDD9CF] dark:border-[#28513A]/60">
              <span className="text-[#667067] dark:text-[#B9C3BA]">Transport Freight Charge</span>
              <span className="font-bold text-[#C8663D]">₹{transportCost.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#DDD9CF] dark:border-[#28513A]/60">
              <span className="text-[#667067] dark:text-[#B9C3BA]">Mandi Fee ({commissionPercent}%)</span>
              <span className="font-bold text-[#183A2B] dark:text-[#F5F2E9]">₹{mandiCommission.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-[#667067] dark:text-[#B9C3BA]">Loading & Labor Fees</span>
              <span className="font-bold text-[#183A2B] dark:text-[#F5F2E9]">₹{otherLoadingCharges.toLocaleString('en-IN')}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
